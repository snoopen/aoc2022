import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n\n/);

class Monkey {
  constructor(items, operation, divisible, trueTo, falseTo) {
    this.items = items;
    this.operation = operation;
    this.test = {
      divisible: divisible,
      trueTo: trueTo,
      falseTo: falseTo,
    }
  }
}

const operations = {
  'byVal': {
    '/': (value) => ((old) => old / value),
    '*': (value) => ((old) => old * value),
    '+': (value) => ((old) => old + value),
    '-': (value) => ((old) => old - value),
  },
  'byOld': {
    '/': (old) => old / old,
    '*': (old) => old * old,
    '+': (old) => old + old,
    '-': (old) => old - old,
  }
}

function parseMonkeys(input) {
  const monkeys = [];
  let lcm = 1;

  for (const block of input) {

    const index = block.match(/Monkey (\d+)/i)[1]*1;
    const items = block.match(/items: ([\d, ]+)/i)[1].split(', ').map(e=>e*1);
    const match = block.match(/old (.) (\d+|old)/i);
    
    const operation = match[2] === 'old' ? operations.byOld[match[1]] : operations.byVal[match[1]](match[2]*1);
    const divisible = block.match(/Test:.*?(\d+)/i)[1]*1;
    lcm = leastCommonMultiple(lcm, divisible);
    const trueTo = block.match(/true:.*?(\d+)/i)[1]*1;
    const falseTo = block.match(/false:.*?(\d+)/i)[1]*1;

    const monkey = new Monkey(items, operation, divisible, trueTo, falseTo);

    monkeys[index] = (monkey);
  }

  return { monkeys, lcm };
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const monkeys = parseMonkeys(input).monkeys;
  
  let inspections = [];

  for (let round = 0; round < 20; round++) {

    monkeys.forEach((monkey, index) => {
      const items = [... monkey.items];
      monkey.items = [];
      items.forEach(item => {
        if (typeof inspections[index] === 'undefined') inspections[index] = 0;
        inspections[index]++;
        item = monkey.operation(item);
        item = Math.floor(item / 3);
        const test = item % monkey.test.divisible === 0;
        if (test) {
          monkeys[monkey.test.trueTo].items.push(item);
        } else {
          monkeys[monkey.test.falseTo].items.push(item);
        }
      });
    });

  }

  return inspections.sort((a,b)=>b-a).slice(0,2).reduce((p,c)=>p=p*c,1);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const { monkeys, lcm } = parseMonkeys(input);
  
  let inspections = [];

  for (let round = 0; round < 10000; round++) {

    monkeys.forEach((monkey, index) => {
      const items = [... monkey.items];
      monkey.items = [];
      items.forEach(item => {
        if (typeof inspections[index] === 'undefined') inspections[index] = 0;
        inspections[index]++;
        item = monkey.operation(item);
        if (item > lcm) item = item % lcm;
        const test = item % monkey.test.divisible === 0;
        if (test) {
          // item = 1;
          monkeys[monkey.test.trueTo].items.push(item);
        } else {
          monkeys[monkey.test.falseTo].items.push(item);
        }
      });
    });

  }

  return inspections.sort((a,b)=>b-a).slice(0,2).reduce((p,c)=>p=p*c,1);
};

function leastCommonMultiple(a, b) {
  return ((a === 0) || (b === 0)) ? 0 : Math.abs(a * b) / euclideanAlgorithm(a, b);
}

function euclideanAlgorithm(originalA, originalB) {
  // Make input numbers positive.
  const a = Math.abs(originalA);
  const b = Math.abs(originalB);

  // To make algorithm work faster instead of subtracting one number from the other
  // we may use modulo operation.
  return (b === 0) ? a : euclideanAlgorithm(b, a % b);
}

run({
  part1: {
    tests: [
      {
        input: `
          Monkey 0:
            Starting items: 79, 98
            Operation: new = old * 19
            Test: divisible by 23
              If true: throw to monkey 2
              If false: throw to monkey 3
          
          Monkey 1:
            Starting items: 54, 65, 75, 74
            Operation: new = old + 6
            Test: divisible by 19
              If true: throw to monkey 2
              If false: throw to monkey 0
          
          Monkey 2:
            Starting items: 79, 60, 97
            Operation: new = old * old
            Test: divisible by 13
              If true: throw to monkey 1
              If false: throw to monkey 3
          
          Monkey 3:
            Starting items: 74
            Operation: new = old + 3
            Test: divisible by 17
              If true: throw to monkey 0
              If false: throw to monkey 1
        `,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Monkey 0:
            Starting items: 79, 98
            Operation: new = old * 19
            Test: divisible by 23
              If true: throw to monkey 2
              If false: throw to monkey 3
          
          Monkey 1:
            Starting items: 54, 65, 75, 74
            Operation: new = old + 6
            Test: divisible by 19
              If true: throw to monkey 2
              If false: throw to monkey 0
          
          Monkey 2:
            Starting items: 79, 60, 97
            Operation: new = old * old
            Test: divisible by 13
              If true: throw to monkey 1
              If false: throw to monkey 3
          
          Monkey 3:
            Starting items: 74
            Operation: new = old + 3
            Test: divisible by 17
              If true: throw to monkey 0
              If false: throw to monkey 1
        `,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
