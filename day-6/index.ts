import * as fs from 'fs';
import * as readline from 'readline';

function containsUniqueCharacters(characters: string[]): boolean {
	const seenCharactersMap: {[key: string]: boolean} = {};

	for (const character of characters) {
		if (seenCharactersMap[character]) {
			return false;
		}
		seenCharactersMap[character] = true;
	}
	return true;
}

function findFirstOccurringUniqueCharacterCollection(collectionLength: number) {
	const readable = fs.createReadStream('input.txt', {
		encoding: 'utf8',
		fd: null,
	});

	const seenCharacters: string[] = [];

	let foundMarker: boolean = false;
	readable.on('readable', function () {
		let character: string;
		while (!foundMarker && null !== (character = readable.read(1))) {
			seenCharacters.push(character);
			if (
				seenCharacters.length >= collectionLength &&
				containsUniqueCharacters(seenCharacters.slice(-collectionLength))
			) {
				console.log(seenCharacters.length);
				foundMarker = true;
			}
		}
	});
}

function puzzleOne() {
	findFirstOccurringUniqueCharacterCollection(4);
}
function puzzleTwo() {
	findFirstOccurringUniqueCharacterCollection(14);
}

puzzleOne();
puzzleTwo();
