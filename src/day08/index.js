import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>e.split('').map(e=>e*1));

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let count = 0;
  const xMax = input[0].length - 1;
  const yMax = input.length - 1;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  
  for (let y in input) {
    y = y  * 1;
    for (let x in input[y]) {
      x = x * 1;
      if (x === 0 || y === 0 || x === xMax || y === yMax) {
        count++;
      } else {
        let check = dirs.some(dir=>checkDirection(input, x, y, dir[0], dir[1], xMax, yMax));
        if (check) {
          count++;
        }
      }
    }
  }

  return count;
};

function checkDirection(input, x, y, dx, dy, xMax, yMax) {
  let step = 1;
  let x2;
  let y2;
  let h = input[y][x];
  let result = true;
  
  while (true) {
    x2 = x + (dx * step);
    y2 = y + (dy * step);
    if (x2 < 0 || y2 < 0 || x2 > xMax || y2 > yMax) {
      break;
    } else {
      if (input[y2][x2] >= h) {
        result = false;
        break;
      }
    }
    step++;
  }
  return result;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const xMax = input[0].length - 1;
  const yMax = input.length - 1;
  let map = Array(yMax + 1).fill().map(e=>Array(xMax + 1).fill(0));
  
  for (let y in input) {
    y = y  * 1;
    for (let x in input[y]) {
      x = x * 1;
      if (x === 0 || y === 0 || x === xMax || y === yMax) {
      } else {
        map[y][x] = getScore(input, x, y, xMax, yMax);
      }
    }
  }

  return Math.max(... map.flatMap(e=>e));
};

function getScore(input, x, y, xMax, yMax) {
  let h = input[y][x];
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let score = 1;

  for (const dir of dirs) {
    let trees = 0;
    let step = 0;
    let x2;
    let y2;
    
    while (true) {
      step++;
      x2 = x + (dir[0] * step);
      y2 = y + (dir[1] * step);
      if (x2 < 0 || y2 < 0 || x2 > xMax || y2 > yMax) break;
      trees++;
      if (input[y2][x2] >= h) break;
    }
    score *= trees;
  }
  return score;
}

run({
  part1: {
    tests: [
      {
        input: `
          30373
          25512
          65332
          33549
          35390
        `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          30373
          25512
          65332
          33549
          35390
        `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
