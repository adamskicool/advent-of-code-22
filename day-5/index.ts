import * as fs from 'fs';
import * as readline from 'readline';

enum CrateActionType {
	Move = 'move',
}

type CrateAction = {
	type: CrateActionType;
	from: number;
	to: number;
	quantity: number;
};

type CrateStackMap = {[stackNumber: number]: string[]};

async function parseInputData(): Promise<{
	crateStackMap: CrateStackMap;
	crateActions: CrateAction[];
}> {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const crateStackMap: CrateStackMap = {};
	const crateActions: CrateAction[] = [];

	for await (const line of rl) {
		if (line.includes('[')) {
			const crates: string[] = line.match(/.{1,4}/g);
			crates.forEach((crate: string, index: number) => {
				const stackNumber: number = index + 1;
				if (crate.startsWith('[')) {
					const [_, crateId]: string = crate;
					crateStackMap[stackNumber] = crateStackMap[stackNumber]
						? [crateId, ...crateStackMap[stackNumber]]
						: [crateId];
				} else {
					crateStackMap[stackNumber] = crateStackMap[stackNumber] || [];
				}
			});
		}

		if (line.startsWith('move')) {
			const [action, quantity, _, from, __, to]: string[] = line.split(' ');
			crateActions.push({
				type: <CrateActionType>action,
				from: +from,
				to: +to,
				quantity: +quantity,
			});
		}
	}

	return {
		crateStackMap,
		crateActions,
	};
}

async function puzzleOne() {
	const {crateStackMap, crateActions} = await parseInputData();

	for (const action of crateActions) {
		const {from, to, quantity} = action;
		for (const _ of [...Array(quantity).keys()]) {
			const crateToMove: string | undefined = crateStackMap[from].pop();
			if (!crateToMove) {
				continue;
			}
			crateStackMap[to].push(crateToMove);
		}
	}

	const result: string = Object.keys(crateStackMap).reduce(
		(acc: string, key: string) => {
			return `${acc}${crateStackMap[<any>key].slice(-1)}`;
		},
		''
	);

	console.log(result);
}

async function puzzleTwo() {
	const {crateStackMap, crateActions} = await parseInputData();

	for (const action of crateActions) {
		const {from, to, quantity} = action;

		const cratesToMove: string[] = crateStackMap[from].splice(-quantity);
		if (!cratesToMove) {
			continue;
		}
		crateStackMap[to] = [...crateStackMap[to], ...cratesToMove];
	}

	const result: string = Object.keys(crateStackMap).reduce(
		(acc: string, key: string) => {
			return `${acc}${crateStackMap[<any>key].slice(-1) || ''}`;
		},
		''
	);

	console.log(result);
}

puzzleOne();
puzzleTwo();
