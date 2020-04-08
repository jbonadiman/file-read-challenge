const fs = require('fs');
const readline = require('readline');

const instream = fs.createReadStream('./itcont_2018_20181231_52010302.txt');//'C:/Users/Joao/Downloads/indiv18/itcont.txt');

const firstNamePattern = new RegExp(String.raw`^[\w\-\'\,]+(?:\s[\w\-\'\.]+)?\,\s+(?:\w\.?\s)?(?<firstName>[\w\-\']{2,})`);
const datePattern = new RegExp(String.raw`^(?<year>[1-2][890]\d{2})(?<month>(?:0[1-9])|(?:1[0-2]))`);

const readInterface = readline.createInterface({
  input: instream,
  console: false
});

let linecount = 0;
let name = '';
let date = '';

const firstNameCounts = {};
const dateCounts = {};
const notableNames = [];

readInterface.on('line', function(line) {
  linecount += 1
  const rowArray = line.split('|');

  const fullName = rowArray[7];
  const fullDate = rowArray[4];
 
  if (linecount == 432 || linecount == 43243) {
    notableNames.push(fullName);
  }

  const firstNameMatch = firstNamePattern.exec(fullName);
  if (firstNameMatch) {
    name = firstNameMatch.groups.firstName;
    firstNameCounts[name] = firstNameCounts[name] + 1 || 1;
  }

  const dateMatch = datePattern.exec(fullDate);
  if (dateMatch) {
    date = `${dateMatch.groups.year}-${dateMatch.groups.month}`;
    dateCounts[date] = dateCounts[date] + 1 || 1;
  }
});

readInterface.on('close', printResults);
process.on('SIGINT', interruption);

function interruption() {
  console.log('Interrupting execution... Partial results:');
  printResults();
  process.exit(130);
}

function printResults() {
  function sortByValue(a, b) {
    return b[1] - a[1];
  }

  const sortedNames = Object.entries(firstNameCounts);
  sortedNames.sort(sortByValue);

  const sortedDates = Object.entries(dateCounts);
  sortedDates.sort(sortByValue);

  console.log(`Total number of lines: ${linecount}`);
  console.log(`432nd name: ${notableNames[0] || 'Not obtained yet'}`);
  console.log(`43243rd name: ${notableNames[1] || 'Not obtained yet'}`);
  console.log(`Most common name: ${sortedNames[0][0]}, with ${sortedNames[0][1]} ocurrences.`);
  console.log('Donations by month:');
  for (let date of sortedDates) {
    console.log(`${date[0]}: ${date[1]}`);
  }
}