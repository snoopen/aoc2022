import run from "aocrunner";
import { onlyUnique } from "../utils/index.js";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>[e.substring(0,e.length/2).split(''),e.substring(e.length/2).split('')]);

function getCharCode(char) {
  let code = char.charCodeAt(0);
  if (code >= 'a'.charCodeAt(0)) {
    code = code - 'a'.charCodeAt(0) + 1;
  } else {
    code = code - 'A'.charCodeAt(0) + 27;
  }
  return code;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  for (const sack of input) {
    sack[3] = sack[0].filter(v=>sack[1].includes(v)).filter(onlyUnique);
  }
  let r = input.flatMap(e=>e[3]).map(e=>getCharCode(e),0).reduce((p,c)=>p+=c);

  return r;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const badges = [];
  const groupSize = 3;
  for (let i = 0; i < input.length; i += groupSize) {
      const group = input.slice(i, i + groupSize).map(e=>e.flatMap(e=>e));
      const badge = group[0].filter(e=>group[1].includes(e) && group[2].includes(e)).filter(onlyUnique)[0];
      badges.push(badge);
  }

  const result = badges.reduce((p,c)=>p+=getCharCode(c),0);

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
          vJrwpWtwJgWrhcsFMMfFFhFp
          jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
          PmmdzqPrVvPwwTWBwg
          wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
          ttgJtRGJQctTZtZT
          CrZsJsPPZsGzwwsLwLmpwMDw
        `,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          vJrwpWtwJgWrhcsFMMfFFhFp
          jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
          PmmdzqPrVvPwwTWBwg
          wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
          ttgJtRGJQctTZtZT
          CrZsJsPPZsGzwwsLwLmpwMDw
      `,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
