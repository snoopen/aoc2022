import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n\n/).map(e=>e.split(/\n/).map(e=>e*1));

function countCaloriesPerElf(input) {
  const calPerElf = input.map(e => {
    return {
      total: e.reduce((p,c)=>p+c,0),
      items: e,
    }
  });
  calPerElf.sort((a,b) => b.total - a.total);
  return calPerElf;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const calPerElf = countCaloriesPerElf(input);

  return calPerElf[0].total;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const calPerElf = countCaloriesPerElf(input);

  return calPerElf.slice(0,3).reduce((p,c)=>p+c.total,0);
};

run({
  part1: {
    tests: [
      {
        input: `
          1000
          2000
          3000
          
          4000
          
          5000
          6000
          
          7000
          8000
          9000
          
          10000
        `,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          1000
          2000
          3000
          
          4000
          
          5000
          6000
          
          7000
          8000
          9000
          
          10000
        `,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
