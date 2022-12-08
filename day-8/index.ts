import * as fs from 'fs';
import * as readline from 'readline';

type TreeHeightGrid = number[][];

async function parseTreeHeightGrid(): Promise<TreeHeightGrid> {
	const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const treeHeightGrid: TreeHeightGrid = [];

	for await (const line of rl) {
		const treeHeights: number[] = line
			.split('')
			.map((treeHeight: string) => +treeHeight);
		treeHeightGrid.push(treeHeights);
	}

	return treeHeightGrid;
}

function checkVisibilityGridSubset(
	treeHeightGrid: TreeHeightGrid,
	currentRow: number,
	currentColumn: number,
	[minRow, maxRow]: number[],
	[minColumn, maxColumn]: number[]
): boolean {
	const currentTreeHeight: number = treeHeightGrid[currentRow][currentColumn];
	for (let row = minRow; row < maxRow; row++) {
		if (treeHeightGrid[row][currentColumn] >= currentTreeHeight) {
			return false;
		}
	}

	for (let column = minColumn; column < maxColumn; column++) {
		if (treeHeightGrid[currentRow][column] >= currentTreeHeight) {
			return false;
		}
	}

	return true;
}

function isVisible(
	treeHeightGrid: TreeHeightGrid,
	currentRow: number,
	currentColumn: number
): boolean {
	const numRows: number = treeHeightGrid.length;
	const numColumns: number = treeHeightGrid[0].length;

	if (currentRow === 0 || currentRow === numRows - 1) {
		return true;
	}
	if (currentColumn === 0 || currentColumn === numColumns - 1) {
		return true;
	}

	let visibleFromLeft: boolean = checkVisibilityGridSubset(
		treeHeightGrid,
		currentRow,
		currentColumn,
		[currentRow, currentRow],
		[0, currentColumn]
	);

	let visibleFromRight: boolean = checkVisibilityGridSubset(
		treeHeightGrid,
		currentRow,
		currentColumn,
		[currentRow, currentRow],
		[currentColumn + 1, numColumns]
	);

	let visibleFromUp: boolean = checkVisibilityGridSubset(
		treeHeightGrid,
		currentRow,
		currentColumn,
		[0, currentRow],
		[currentColumn, currentColumn]
	);

	let visibleFromDown: boolean = checkVisibilityGridSubset(
		treeHeightGrid,
		currentRow,
		currentColumn,
		[currentRow + 1, numRows],
		[currentColumn, currentColumn]
	);

	if (visibleFromRight || visibleFromLeft || visibleFromUp || visibleFromDown) {
		return true;
	}

	return false;
}

function toString(grid: TreeHeightGrid) {
	grid.forEach((row: number[]) => {
		console.log(row.join(''));
	});
}

async function puzzleOne() {
	const grid: TreeHeightGrid = await parseTreeHeightGrid();
	let countVisibleTrees: number = 0;

	for (let row = 0; row < grid.length; row++) {
		for (let column = 0; column < grid[row].length; column++) {
			countVisibleTrees += isVisible(grid, row, column) ? 1 : 0;
		}
	}

	console.log(countVisibleTrees);
}
async function puzzleTwo() {
	const grid: TreeHeightGrid = await parseTreeHeightGrid();
}

puzzleOne();
puzzleTwo();
