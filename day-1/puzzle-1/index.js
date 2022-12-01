const fs = require('fs');
const readline = require('readline');



async function findMaxCalories() {
  const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let maxCalories = 0
  let currentCalories = 0

  for await (const line of rl) {
    if(line !== '') {
        const calorieEntry = parseInt(line)
        currentCalories += calorieEntry
        continue;
    }
    
    if(currentCalories > maxCalories) {
        maxCalories = currentCalories
    }
    currentCalories = 0
  }

  console.log(maxCalories)
}

findMaxCalories()