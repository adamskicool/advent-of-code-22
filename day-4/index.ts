import * as fs from 'fs';
import * as readline from 'readline';

interface Range {
	from: number;
	to: number;
}

interface Pair {
	firstElfRange: Range;
	secondElfRange: Range;
}

async function parseInputData(): Promise<Pair[]> {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const pairs: Pair[] = [];

	for await (const line of rl) {
		const [firstRange, secondRange]: string[] = line.split(',');
		const firstElfRange: Range = {
			from: parseInt(firstRange.split('-')[0]),
			to: parseInt(firstRange.split('-')[1]),
		};

		const secondElfRange: Range = {
			from: parseInt(secondRange.split('-')[0]),
			to: parseInt(secondRange.split('-')[1]),
		};
		pairs.push({
			firstElfRange,
			secondElfRange,
		});
	}
	return pairs;
}

async function puzzleOne() {
	const data: Pair[] = await parseInputData();

	const fullyOverlappingPairs: Pair[] = data.filter(
		({firstElfRange, secondElfRange}: Pair) =>
			fullyOverlap(firstElfRange, secondElfRange)
	);

	console.log(fullyOverlappingPairs.length);
}

async function puzzleTwo() {
	const data: Pair[] = await parseInputData();

	const overlappingPairs: Pair[] = data.filter(
		({firstElfRange, secondElfRange}: Pair) =>
			overlap(firstElfRange, secondElfRange)
	);

	console.log(overlappingPairs.length);
}

function fullyOverlap(firstRange: Range, secondRange: Range): boolean {
	if (firstRange.from >= secondRange.from && firstRange.to <= secondRange.to) {
		return true;
	}

	if (secondRange.from >= firstRange.from && secondRange.to <= firstRange.to) {
		return true;
	}

	return false;
}

function overlap(firstRange: Range, secondRange: Range): boolean {
	if (firstRange.from > secondRange.to) {
		return false;
	}

	if (firstRange.to < secondRange.from) {
		return false;
	}

	return true;
}

puzzleOne();
puzzleTwo();
