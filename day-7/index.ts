import * as fs from 'fs';
import * as readline from 'readline';

type File = {
	name: string;
	size: number;
};

type Directory = {
	subDirectories: DirectoryMap;
	files: File[];
};

type DirectoryMap = {[directory: string]: Directory};

async function parseDirectories(): Promise<DirectoryMap> {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let directoryMap: DirectoryMap = {
		'/': {
			subDirectories: {},
			files: [],
		},
	};

	const currentDirectoryPath: string[] = [];

	for await (const line of rl) {
		switch (true) {
			case line.startsWith('$ cd'): {
				const [_, __, directory]: string[] = line.split(' ');
				directory === '..'
					? currentDirectoryPath.pop()
					: currentDirectoryPath.push(directory);
				break;
			}
			case line.startsWith('$ ls'): {
				break;
			}
			case line.startsWith('dir'): {
				const [_, directoryName]: string[] = line.split(' ');
				const currentDirectory: Directory = getDirectory(
					directoryMap,
					currentDirectoryPath
				);
				currentDirectory.subDirectories[directoryName] = {
					subDirectories: {},
					files: [],
				};
				break;
			}
			default: {
				const [size, name]: string[] = line.split(' ');
				const currentDirectory: Directory = getDirectory(
					directoryMap,
					currentDirectoryPath
				);
				currentDirectory.files.push({name, size: +size});
			}
		}
	}
	return directoryMap;
}

function getDirectory(
	directoryMap: DirectoryMap,
	directoryPath: string[]
): Directory {
	let directory: Directory | undefined;
	for (const directoryName of directoryPath) {
		directory =
			directory?.subDirectories[directoryName] || directoryMap[directoryName];
	}
	if (!directory) {
		throw Error('Could not find directory');
	}

	return directory;
}

function calculateDirectorySize(directory: Directory): number {
	const sizeInFiles: number = directory.files.reduce(
		(sum: number, file: File) => sum + file.size,
		0
	);

	const sizeInSubDirectories: number = Object.keys(
		directory.subDirectories
	).reduce(
		(sum: number, subDirectoryKey: string) =>
			sum + calculateDirectorySize(directory.subDirectories[subDirectoryKey]),
		0
	);

	return sizeInFiles + sizeInSubDirectories;
}

async function puzzleOne() {
	const directoryMap: DirectoryMap = await parseDirectories();

	function sumDirectorySizes(
		directoryMap: DirectoryMap,
		atMost: number
	): number {
		return Object.values(directoryMap)
			.map((directory: Directory) => {
				const directorySize: number = calculateDirectorySize(directory);
				return (
					(directorySize > atMost ? 0 : directorySize) +
					sumDirectorySizes(directory.subDirectories, atMost)
				);
			})
			.reduce((sum: number, curr: number) => sum + curr, 0);
	}

	console.log('Puzzle 1:', sumDirectorySizes(directoryMap, 100000));
}
async function puzzleTwo() {
	const directoryMap: DirectoryMap = await parseDirectories();

	const totalMemory: number = 70000000;
	const requiredUnusedMemory: number = 30000000;
	const usedMemory: number = calculateDirectorySize(directoryMap['/']);
	const freeMemory: number = totalMemory - usedMemory;
	const memoryToFree: number = requiredUnusedMemory - freeMemory;

	function getAllDirectorySizes(directory: Directory): number[] {
		const currentDirectorySize: number = calculateDirectorySize(directory);

		const subDirectorySizes: number[] = Object.values(
			directory.subDirectories
		).reduce(
			(acc: number[], directory: Directory) => [
				...acc,
				...getAllDirectorySizes(directory),
			],
			[]
		);

		return [currentDirectorySize, ...subDirectorySizes];
	}

	const directorySizes: number[] = getAllDirectorySizes(directoryMap['/']);

	const size = directorySizes
		.sort((a: number, b: number) => (a < b ? -1 : 1))
		.find((size: number) => size > memoryToFree);

	console.log('Puzzle 2:', size);
}

puzzleOne();
puzzleTwo();
