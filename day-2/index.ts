import * as fs from 'fs';
import * as readline from 'readline';

enum ElfGesture {
	Rock = 'A',
	Paper = 'B',
	Scissors = 'C',
}

enum MyGesture {
	Rock = 'X',
	Paper = 'Y',
	Scissors = 'Z',
}

const gestureBeatsGestureMap: {[gesture in MyGesture]: ElfGesture} = {
	[MyGesture.Rock]: ElfGesture.Scissors,
	[MyGesture.Paper]: ElfGesture.Rock,
	[MyGesture.Scissors]: ElfGesture.Paper,
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
	Lose = 'lose',
	Draw = 'draw',
	Win = 'win',
}

const outcomeScoreMap: {[outcome in Outcome]: number} = {
	[Outcome.Lose]: 0,
	[Outcome.Draw]: 3,
	[Outcome.Win]: 6,
};

async function puzzleOne() {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let totalScore: number = 0;

	for await (const line of rl) {
		const [firstLetter, secondLetter]: string[] = line.split(' ');
		const elfGesture: ElfGesture = <ElfGesture>firstLetter;
		const myGesture: MyGesture = <MyGesture>secondLetter;

		const outcome: Outcome = determineOutcome(elfGesture, myGesture);

		totalScore += gestureScoreMap[myGesture];
		totalScore += outcomeScoreMap[outcome];
	}

	console.log(totalScore);
}

function determineOutcome(
	elfGesture: ElfGesture,
	myGesture: MyGesture
): Outcome {
	const elfGestureScore: number = gestureScoreMap[elfGesture];
	const myGestureScore: number = gestureScoreMap[myGesture];

	if (elfGestureScore === myGestureScore) {
		return Outcome.Draw;
	}

	if (gestureBeatsGestureMap[myGesture] === elfGesture) {
		return Outcome.Win;
	}

	return Outcome.Lose;
}

puzzleOne();
