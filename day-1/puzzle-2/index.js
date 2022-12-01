const fs = require('fs');
const readline = require('readline');

async function sumTopThreeMaxCalories() {
  const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  
  let calorieEntries = []
  let currentCalories = 0

  for await (const line of rl) {
    if(line !== '') {
        const calorieEntry = parseInt(line)
        currentCalories += calorieEntry
        continue;
    }
    
    calorieEntries.push(currentCalories)
    currentCalories = 0
  }

  const topThreeCalorieEntires = calorieEntries.sort((calorieSumA, calorieSumB) => calorieSumA < calorieSumB ? -1 : 1).slice(-3)
  const sum = topThreeCalorieEntires.reduce((acc, curr) => acc + curr, 0)
  console.log(sum)

}

sumTopThreeMaxCalories()