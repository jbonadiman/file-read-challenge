const fs = require('fs');
const readline = require('readline');

const filename = process.argv[2];

const startTime = Date.now();
const instream = fs.createReadStream(filename);

const firstNamePattern = /^[\w\-\'\,]+(?:\s[\w\-\'\.]+)?\,\s+(?:\w\.?\s)?(?<firstName>[\w\-\']{2,})/;
const datePattern = /^(?<year>[1-2][890]\d{2})(?<month>(?:0[1-9])|(?:1[0-2]))/;
const extractionPattern = /(?<date>\d{18})\|(?:\w+)?\|(?:\w+)?\|(?<name>[A-Z\,\'\.\s]+)?/;

const readInterface = readline.createInterface({
  input: instream,
  console: false
});

let linecount = 0;
let sortedNames = [];
let sortedDates = [];

const firstNameCounter = {};
const dateCounter = {};
const notableNames = [];


// Count lines, ocurrences of names and save the requested names
readInterface.on('line', function(line) {
  linecount += 1

  const { name = '' } = line.match(extractionPattern).groups;

  if (linecount == 432 || linecount == 43243) {
    notableNames.push(name);
  }

  countOcurrenceSubs(name, firstNamePattern, firstNameCounter);
});

// Count ocurrences of date
readInterface.on('line', function(line) {
  const { date } = line.match(extractionPattern).groups;
  countOcurrenceSubs(date, datePattern, dateCounter);
});

// Sort the dates
readInterface.on('close', function() {
  sortedDates = sortObjEntries(dateCounter);
});

// Sort the names and print all the results at the end
readInterface.on('close', function() {
  sortedNames = sortObjEntries(firstNameCounter);
  printResults();
});

process.on('SIGINT', function () {
  console.log('Interrupting execution... Partial results:');
  printResults();
  process.exit(130);
});

function countOcurrenceSubs(input, pattern, counter) {
  const match = input.match(pattern);
  if (match) {
    const parsedMatch = match.slice(1).join('');
    counter[parsedMatch] = counter[parsedMatch] + 1 || 1;
  }
}

function sortObjEntries(instance) {
  const entries = Object.entries(instance);
  entries.sort((a, b) => b[1] - a[1]);

  return entries;
}

function parseDate(date) {
  return `${date.slice(0, 4)}/${date.slice(4)}`;
}

function printResults() {
  const endTime = Date.now();
  console.log(`Execution took ${(endTime - startTime) / 1000} ms.`);
  console.log(`Total number of lines: ${linecount}`);
  console.log(`432nd name: ${notableNames[0] || 'Not obtained yet'}`);
  console.log(`43243rd name: ${notableNames[1] || 'Not obtained yet'}`);
  console.log(`Most common name: ${sortedNames[0][0]}, with ${sortedNames[0][1]} ocurrences.`);
  console.log('Donations by month:');
  for (let [date, count] of sortedDates) {
    console.log(`${parseDate(date)}: ${count}`);
  }
}