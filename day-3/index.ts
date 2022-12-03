import * as fs from 'fs';
import * as readline from 'readline';

type ItemMap = {
	[key: string]: number;
};

async function puzzleOne() {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let sum: number = 0;

	for await (const line of rl) {
		const numItems: number = line.length;
		const firstCompartmentItems: string[] = line
			.slice(0, numItems / 2)
			.split('');
		const secondCompartmentItems: string[] = line
			.slice(-numItems / 2)
			.split('');

		const sharedItems: string[] = getSharedItems(
			firstCompartmentItems,
			secondCompartmentItems
		);

		for (const sharedItem of sharedItems) {
			sum += getItemPriority(sharedItem);
		}
	}

	console.log(sum);
}

async function puzzleTwo() {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let groupSize: number = 3;
	let currentRugsackGroup: string[] = [];
	let groupedRugsacks: string[][] = [];

	for await (const line of rl) {
		currentRugsackGroup.push(line);

		if (currentRugsackGroup.length >= groupSize) {
			groupedRugsacks.push(currentRugsackGroup);
			currentRugsackGroup = [];
		}
	}

	let sum: number = 0;
	for (const rugsackGroup of groupedRugsacks) {
		const sharedItems: string[] = getSharedItems(
			...rugsackGroup.map((rugsack: string) => rugsack.split(''))
		);

		for (const sharedItem of sharedItems) {
			sum += getItemPriority(sharedItem);
		}
	}

	console.log(sum);
}

function getSharedItems(...itemArrays: string[][]): string[] {
	const [firstItemArrayMap, ...restItemArrayMaps]: ItemMap[] =
		itemArrays.map(getItemMap);

	return Object.keys(firstItemArrayMap).filter((item: string) => {
		const itemMapsContainingItem: ItemMap[] = restItemArrayMaps.filter(
			(itemMap: ItemMap) => !!itemMap[item]
		);
		return restItemArrayMaps.length === itemMapsContainingItem.length;
	});
}

function getItemMap(items: string[]): ItemMap {
	return items.reduce((acc: ItemMap, curr: string) => {
		return {...acc, [curr]: acc[curr] ? acc[curr] + 1 : 1};
	}, {});
}

function getItemPriority(item: string): number {
	if (item === item.toLowerCase()) {
		return item.charCodeAt(0) - 96;
	}
	return item.charCodeAt(0) - 38;
}

puzzleOne();
puzzleTwo();
