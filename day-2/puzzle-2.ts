import * as fs from 'fs';
import * as readline from 'readline';

enum ElfGesture {
	Rock = 'A',
	Paper = 'B',
	Scissors = 'C',
}

enum MyGesture {
	Rock = 'Rock',
	Paper = 'Paper',
	Scissors = 'Siccors',
}

const elfGestureToMyGestureDrawMap: {[gesture in ElfGesture]: MyGesture} = {
	[ElfGesture.Rock]: MyGesture.Rock,
	[ElfGesture.Paper]: MyGesture.Paper,
	[ElfGesture.Scissors]: MyGesture.Scissors,
};

const elfGestureToMyGestureLoseMap: {[gesture in ElfGesture]: MyGesture} = {
	[ElfGesture.Rock]: MyGesture.Scissors,
	[ElfGesture.Paper]: MyGesture.Rock,
	[ElfGesture.Scissors]: MyGesture.Paper,
};

const elfGestureToMyGestureWinMap: {[gesture in ElfGesture]: MyGesture} = {
	[ElfGesture.Rock]: MyGesture.Paper,
	[ElfGesture.Paper]: MyGesture.Scissors,
	[ElfGesture.Scissors]: MyGesture.Rock,
};

type Gesture = ElfGesture | MyGesture;

const gestureScoreMap: {[gesture in Gesture]: number} = {
	[ElfGesture.Rock]: 1,
	[MyGesture.Rock]: 1,
	[ElfGesture.Paper]: 2,
	[MyGesture.Paper]: 2,
	[ElfGesture.Scissors]: 3,
	[MyGesture.Scissors]: 3,
};

enum Outcome {
	Lose = 'X',
	Draw = 'Y',
	Win = 'Z',
}

const outcomeScoreMap: {[outcome in Outcome]: number} = {
	[Outcome.Lose]: 0,
	[Outcome.Draw]: 3,
	[Outcome.Win]: 6,
};

async function puzzleTwo() {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let totalScore: number = 0;

	for await (const line of rl) {
		const [firstLetter, secondLetter]: string[] = line.split(' ');
		const elfGesture: ElfGesture = <ElfGesture>firstLetter;
		const outcome: Outcome = <Outcome>secondLetter;

		const myGesture: MyGesture = determineMyGesture(elfGesture, outcome);

		totalScore += gestureScoreMap[myGesture];
		totalScore += outcomeScoreMap[outcome];
	}

	console.log(totalScore);
}

function determineMyGesture(
	elfGesture: ElfGesture,
	outcome: Outcome
): MyGesture {
	switch (outcome) {
		case Outcome.Draw:
			return elfGestureToMyGestureDrawMap[elfGesture];
		case Outcome.Lose:
			return elfGestureToMyGestureLoseMap[elfGesture];
		default:
			return elfGestureToMyGestureWinMap[elfGesture];
	}
}

puzzleTwo();
