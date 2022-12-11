import * as fs from 'fs';
import * as readline from 'readline';

type OperationFn = (old: number) => number;

type Test = {
	divisibleBy: number;
	trueMonkey: number;
	falseMonkey: number;
};

type Monkey = {
	id: number;
	items: number[];
	operation: OperationFn;
	test: Test;
	itemInspectionCount: number;
};

async function parseMonkeys(): Promise<Monkey[]> {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const monkeyInputLines: number = 7;
	let currentLineIndex: number = 0;

	const monkeys: Monkey[] = [];

	let currentMonkeyNumber: number | undefined;
	let currentItems: number[] = [];
	let currentOperation: OperationFn | undefined;
	let currentDivisibleBy: number | undefined;
	let currentTestTrueMonkey: number | undefined;
	let currentTestFalseMonkey: number | undefined;

	for await (const line of rl) {
		switch (currentLineIndex % monkeyInputLines) {
			case 0: {
				const [monkeyNumber]: string[] = line.split(' ')[1].split('');
				currentMonkeyNumber = +monkeyNumber;
				// console.log(line);
				break;
			}
			case 1: {
				const items: number[] = line
					.split(':')[1]
					.split(',')
					.map((numAsString: string) => +numAsString);
				currentItems = items;
				// console.log(items);
				break;
			}
			case 2: {
				const [_, __, ___, ____, _____, ______, operator, operand]: string[] =
					line.split(' ');
				console.log(operator, operand);
				currentOperation = (old: number) => {
					const x: number = operand === 'old' ? old : +operand;
					switch (operator) {
						case '+': {
							return old + x;
						}
						case '*': {
							return old * x;
						}

						default:
							throw Error(`Unkown operator ${operator}`);
					}
				};
				break;
			}
			case 3: {
				currentDivisibleBy = +line.split(' ').pop();
				break;
			}
			case 4: {
				console.log(line.split(' ').pop());
				currentTestTrueMonkey = +line.split(' ').pop();
				break;
			}
			case 5: {
				console.log(line.split(' ').pop(), +line.split(' ').pop());
				currentTestFalseMonkey = +line.split(' ').pop();
				break;
			}
		}

		currentLineIndex++;

		//monkeyInputLines -1 to accomodate last monkey that is missing he empty row
		if (currentLineIndex % monkeyInputLines === 0) {
			if (currentLineIndex !== 0) {
				monkeys.push({
					id: <number>currentMonkeyNumber,
					items: currentItems,
					operation: <OperationFn>currentOperation,
					test: <Test>{
						divisibleBy: currentDivisibleBy,
						trueMonkey: currentTestTrueMonkey,
						falseMonkey: currentTestFalseMonkey,
					},
					itemInspectionCount: 0,
				});
			}

			currentItems = [];
			currentOperation = undefined;
			currentDivisibleBy = undefined;
			currentTestTrueMonkey = undefined;
			currentTestFalseMonkey = undefined;
		}
	}

	//fulhack!!!
	monkeys.push({
		id: <number>currentMonkeyNumber,
		items: currentItems,
		operation: <OperationFn>currentOperation,
		test: <Test>{
			divisibleBy: currentDivisibleBy,
			trueMonkey: currentTestTrueMonkey,
			falseMonkey: currentTestFalseMonkey,
		},
		itemInspectionCount: 0,
	});

	return monkeys;
}

async function puzzleOne() {
	const monkeys: Monkey[] = await parseMonkeys();

	const numRounds: number = 20;

	for (let round = 0; round < numRounds; round++) {
		for (const monkey of monkeys) {
			// const monkey: Monkey = monkeys[0];
			for (const item of monkey.items) {
				monkey.itemInspectionCount++;
				//1. increase the worry level of the item by using monkey.operation
				let newWorryLevel: number = monkey.operation(item);
				// 2. divide worry level by 3 and round DOWN to the nearest integer
				newWorryLevel = Math.floor(newWorryLevel / 3);
				//3. determine what monkey to throw the item to by checking if worry level is divisible by divisibleBy
				const divisibleBy: boolean =
					newWorryLevel % monkey.test.divisibleBy === 0;
				//4. throw to falseMonkey or trueMonkey depending on result of 3.
				if (divisibleBy) {
					monkeys[monkey.test.trueMonkey].items.push(newWorryLevel);
				} else {
					monkeys[monkey.test.falseMonkey].items.push(newWorryLevel);
				}
			}
			monkey.items = [];
		}
	}

	console.log(monkeys);
	const [largestInspectionCount, secondLargestInspectionCount]: number[] =
		monkeys
			.map((monkey: Monkey) => monkey.itemInspectionCount)
			.sort((a: number, b: number) => (a < b ? 1 : -1));

	console.log(largestInspectionCount * secondLargestInspectionCount);
}

async function puzzleTwo() {
	const monkeys: Monkey[] = await parseMonkeys();

	const reduceBy: number = monkeys
		.map((monkey: Monkey) => monkey.test.divisibleBy)
		.reduce((acc, curr) => acc * curr, 1);

	console.log(reduceBy);

	const numRounds: number = 10000;

	for (let round = 0; round < numRounds; round++) {
		for (const monkey of monkeys) {
			// const monkey: Monkey = monkeys[0];
			for (const item of monkey.items) {
				monkey.itemInspectionCount++;
				//1. increase the worry level of the item by using monkey.operation
				let newWorryLevel: number = monkey.operation(item);
				//2. reduce worry level whilst keeping the test function result intact
				newWorryLevel = newWorryLevel % reduceBy;
				//3. determine what monkey to throw the item to by checking if worry level is divisible by divisibleBy
				const divisibleBy: boolean =
					newWorryLevel % monkey.test.divisibleBy === 0;
				//4. throw to falseMonkey or trueMonkey depending on result of 3.
				if (divisibleBy) {
					monkeys[monkey.test.trueMonkey].items.push(newWorryLevel);
				} else {
					monkeys[monkey.test.falseMonkey].items.push(newWorryLevel);
				}
			}
			monkey.items = [];
		}
	}

	console.log(monkeys);
	const [largestInspectionCount, secondLargestInspectionCount]: number[] =
		monkeys
			.map((monkey: Monkey) => monkey.itemInspectionCount)
			.sort((a: number, b: number) => (a < b ? 1 : -1));

	console.log(largestInspectionCount * secondLargestInspectionCount);
}

// puzzleOne();
puzzleTwo();
