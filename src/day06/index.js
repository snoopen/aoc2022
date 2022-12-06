import run from "aocrunner";
import { onlyUnique } from "../utils/index.js";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lengthOfMarker = 4;
  let markerIndex = -1;

  for (let i = lengthOfMarker - 1; i < input.length; i++) {
    const marker = input.slice(i - lengthOfMarker, i).split('');
    const makrerOkay = marker.filter(onlyUnique).length === lengthOfMarker;
    if (!makrerOkay) continue;
    // console.log(i, marker.join(''));
    markerIndex = i;
    break;
  }

  return markerIndex;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lengthOfMarker = 14;
  let markerIndex = -1;

  for (let i = lengthOfMarker - 1; i < input.length; i++) {
    const marker = input.slice(i - lengthOfMarker, i).split('');
    const makrerOkay = marker.filter(onlyUnique).length === lengthOfMarker;
    if (!makrerOkay) continue;
    // console.log(i, marker.join(''));
    markerIndex = i;
    break;
  }

  return markerIndex;
};

run({
  part1: {
    tests: [
      {
        input: `
          mjqjpqmgbljsphdztnvjfqwrcgsmlb
        `,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          mjqjpqmgbljsphdztnvjfqwrcgsmlb
        `,
        expected: 19,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
