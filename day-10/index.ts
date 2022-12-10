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
async function puzzleTwo() {
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

	const screenHeight: number = 6;
	const screenWidth: number = 40;

	const pixelMatrix: ('.' | '#')[][] = [];

	//init pixel matrix with all pixels off
	for (let y = 0; y < screenHeight; y++) {
		pixelMatrix.push([]);
		for (let x = 0; x < screenWidth; x++) {
			pixelMatrix[y].push('.');
		}
	}

	console.log(pixelMatrix);

	//loop trough register X and fill pixel matrix with some content.
	for (
		let cycleIndex = 0;
		cycleIndex < registerXCycleHistory.length;
		cycleIndex++
	) {
		//descirbes where the sprite is localted
		const cycleRegisterXValue = registerXCycleHistory[cycleIndex];

		const currentXPosition: number = cycleIndex % screenWidth;
		const currentYPosition: number = Math.floor(cycleIndex / screenWidth);

		// -1 since the sprite takes up three pixels, one on each side of the sprite position
		const distanceToSprite: number =
			Math.abs(currentXPosition - cycleRegisterXValue) - 1;

		if (distanceToSprite < 1) {
			pixelMatrix[currentYPosition][currentXPosition] = '#';
		}
	}

	for (let x = 0; x < screenHeight; x++) {
		console.log(pixelMatrix[x].join(''));
	}
}

// puzzleOne();
puzzleTwo();
