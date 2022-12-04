import run from "aocrunner";

const parseInput = (rawInput) => rawInput
  .split(/\n/)
  .map(e=>e
    .split(',')
    .map(e=>e
      .split('-')
      .map(e=>e*1)
    )
  );

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const overlap = input.filter(e=>{
    return (
      e[0][0] >= e[1][0] && e[0][1] <= e[1][1] ||
      e[1][0] >= e[0][0] && e[1][1] <= e[0][1]
    );
  });

  return overlap.length;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const overlap = input.filter(e=>{
    return (
      e[0][0] >= e[1][0] && e[0][0] <= e[1][1] ||
      e[0][1] >= e[1][0] && e[0][1] <= e[1][1] ||
      e[1][0] >= e[0][0] && e[1][0] <= e[0][1] ||
      e[1][1] >= e[0][0] && e[1][1] <= e[0][1]
    );
  });

  return overlap.length;
};

run({
  part1: {
    tests: [
      {
        input: `
          2-4,6-8
          2-3,4-5
          5-7,7-9
          2-8,3-7
          6-6,4-6
          2-6,4-8
        `,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          2-4,6-8
          2-3,4-5
          5-7,7-9
          2-8,3-7
          6-6,4-6
          2-6,4-8
        `,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
