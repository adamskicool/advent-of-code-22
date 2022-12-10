import * as fs from 'fs';
import * as readline from 'readline';

enum CpuOperation {
	addx = 'addx',
	noop = 'noop',
}

type CpuInstruction =
	| {
			operation: CpuOperation.addx;
			value: number;
	  }
	| {
			operation: CpuOperation.noop;
	  };

async function parseCpuInstructions(): Promise<CpuInstruction[]> {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const instructions: CpuInstruction[] = [];

	for await (const line of rl) {
		const [operation, value]: string[] = line.split(' ');
		if (operation === 'addx') {
			instructions.push({
				operation: CpuOperation.addx,
				value: +value,
			});
		}
		if (operation === 'noop') {
			instructions.push({
				operation: CpuOperation.noop,
			});
		}
	}

	return instructions;
}

async function puzzleOne() {
	const cpuInstructions: CpuInstruction[] = await parseCpuInstructions();

	const registerXCycleHistory: number[] = [];
	let registerX: number = 1;
	let cycle: number = 0;

	for (const cpuInstruction of cpuInstructions) {
		if (cpuInstruction.operation === CpuOperation.noop) {
			cycle++;
			registerXCycleHistory.push(registerX);
		}
		if (cpuInstruction.operation === CpuOperation.addx) {
			cycle++;
			registerXCycleHistory.push(registerX);
			cycle++;
			registerXCycleHistory.push(registerX);
			registerX += cpuInstruction.value;
		}
	}

	const startingCycle: number = 20;
	const cycleInterval: number = 40;
	let currentCycleIndex = startingCycle - 1;

	let sum: number = 0;

	while (currentCycleIndex < registerXCycleHistory.length) {
		const cycleValue: number = registerXCycleHistory[currentCycleIndex];
		sum += (currentCycleIndex + 1) * cycleValue;
		currentCycleIndex += cycleInterval;
	}

	console.log(sum);
}
async function puzzleTwo() {}

puzzleOne();
// puzzleTwo();
