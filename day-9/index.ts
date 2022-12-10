import * as fs from 'fs';
import * as readline from 'readline';

enum Direction {
	Left = 'L',
	Right = 'R',
	Up = 'U',
	Down = 'D',
}

type Move = {
	direction: Direction;
};

class Knot {
	x: number;
	y: number;

	/*
    e.g. {
        "1.2": true
    }
    represents having visited x:1 y:2
    */
	visitedPositions: {[position: string]: boolean};

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
		this.visitedPositions = {[`${this.x}.${this.y}`]: true};
	}

	add(move: Move) {
		switch (move.direction) {
			case Direction.Left: {
				this.x--;
				break;
			}
			case Direction.Right: {
				this.x++;
				break;
			}
			case Direction.Up: {
				this.y++;
				break;
			}
			case Direction.Down: {
				this.y--;
				break;
			}
		}
	}

	moveByPosition(x: number, y: number): void {
		this.x = x;
		this.y = y;
		this.visitedPositions[`${this.x}.${this.y}`] = true;
	}

	isSeparatedFrom(otherKnot: Knot): boolean {
		return (
			Math.abs(this.x - otherKnot.x) > 1 || Math.abs(this.y - otherKnot.y) > 1
		);
	}
}

async function parseMoves(): Promise<Move[]> {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const moves: Move[] = [];

	for await (const line of rl) {
		const [direction, steps]: string[] = line.split(' ');
		for (const _ in [...Array(+steps).keys()]) {
			moves.push({direction: <Direction>direction});
		}
	}

	return moves;
}

async function puzzleOne() {
	const moves: Move[] = await parseMoves();
	// console.log(moves);
	const headKnot: Knot = new Knot();
	const tailKnot: Knot = new Knot();

	for (const move of moves) {
		const headKnotOldx: number = headKnot.x;
		const headKnotOldy: number = headKnot.y;
		headKnot.add(move);
		if (tailKnot.isSeparatedFrom(headKnot)) {
			tailKnot.moveByPosition(headKnotOldx, headKnotOldy);
		}
	}
	console.log(Object.keys(tailKnot.visitedPositions));
	console.log(Object.keys(tailKnot.visitedPositions).length);
}
async function puzzleTwo() {}

puzzleOne();
// puzzleTwo();
