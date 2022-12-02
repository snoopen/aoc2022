import run from "aocrunner";

const parseInput = (rawInput) => rawInput
  .replace(/A|X/gi,0)
  .replace(/B|Y/gi,1)
  .replace(/C|Z/gi,2)
  .split(/\n/)
  .map(e=>e.split(/ /).map(e=>e*1));

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  let score = 0;

  for (const round of input) {
    score += round[1] + 1;
    if (
      // win
      round[0] === 0 && round[1] === 1 ||
      round[0] === 1 && round[1] === 2 ||
      round[0] === 2 && round[1] === 0
    ) {
      score += 6;
    } else if (
      // lose
      round[0] === 1 && round[1] === 0 ||
      round[0] === 2 && round[1] === 1 ||
      round[0] === 0 && round[1] === 2
    ) {
    } else {
      // draw
      score += 3;
    }
  }

  return score;
};

const part2Rules = {
  0: { // lose
    1: 0,
    2: 1,
    0: 2,
  },
  1: { // draw
    0: 0,
    1: 1,
    2: 2,
  },
  2: { // win
    0: 1,
    1: 2,
    2: 0,
  },
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  let score = 0;

  let outcome;
  let play;

  for (const round of input) {
    outcome = round[1];
    play = part2Rules[outcome][round[0]];
    score += play + 1;
    if (outcome === 2) {
      // win
      score += 6;
    } else if (outcome === 0) {
      // lose
    } else {
      // draw
      score += 3;
    }
    
  }

  return score;
};

run({
  part1: {
    tests: [
      {
        input: `
          A Y
          B X
          C Z
        `,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          A Y
          B X
          C Z
        `,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
