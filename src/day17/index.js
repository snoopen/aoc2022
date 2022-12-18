import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('').map(e=>e==='>'?1:-1);

const rockPrimitives = [
  // ####
  {
    pixels: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
    height: 1,
    width: 4,
  },
  //  # 
  // ###
  //  # 
  {
    pixels: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    height: 3,
    width: 3,
  },
  //   #
  //   #
  // ###
  {
    pixels: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    height: 3,
    width: 3,
  },
  // #
  // #
  // #
  // #
  {
    pixels: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ],
    height: 4,
    width: 1,
  },
  // ##
  // ##
  {
    pixels: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    height: 2,
    width: 2,
  },
];

class Rock {

  constructor(rockIndex, x, y) {
    this.rockIndex = rockIndex;
    this.x = x;
    this.y = y;
  }

  offset = {
    x: 0,
    y: 0,
  }

  reset() {
    this.offset.x = 0;
    this.offset.y = 0;
  }

  get primitive() { return rockPrimitives[this.rockIndex] }
  get top() { return this.y + this.offset.y + this.primitive.height - 1 }
  get left() { return this.x + this.offset.x }
  get bottom() { return this.y + this.offset.y }
  get right() { return this.x + this.offset.x + this.primitive.width - 1 }
  get pixels() {
    return this.primitive.pixels.map(p => {
      return {
        x: p.x + this.x + this.offset.x,
        y: p.y + this.y + this.offset.y,
      };
    })
  }

  collision(otherRock) {
    let otherPixels = otherRock.pixels;
    return this.pixels.some(pixel1=>otherPixels.some(pixel2=>pixelCollide(pixel1, pixel2)));
  }

}

function rockCollide(rock, walls, floor, rest, maxHeight) {
  if (rock.bottom <= floor) return true;
  if (rock.left <= walls[0] || rock.right >= walls[1]) return true;
  if (rest.length === 0) return false;
  for (let i = rest.length - 1; i >= 0; i--) {
    let next = rest[i];
    if (rock.bottom > maxHeight) return false;
    if (rock.top < next.bottom) continue;
    if (rock.collision(next)) return true;
  }
  return false;
}

function pixelCollide(pixel1, pixel2) {
  return pixel1.x === pixel2.x && pixel1.y === pixel2.y;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const walls = [0, 8];
  const floor = 0;
  const rest = [];
  const spawn = { x: 3, y: 4 };
  let nextRock = 0;
  let nextMove = 0;
  let rock = new Rock(nextRock, spawn.x, spawn.y);
  let maxHeight = 0;

  for (let round = 0; round < 2022; round++) {
    nextRock++;
    if (nextRock >= rockPrimitives.length) nextRock = 0;

    while (true) {

      rock.offset.x = input[nextMove];
      nextMove++;
      if (nextMove >= input.length) nextMove = 0;
      if (rockCollide(rock, walls, floor, rest, maxHeight)) {
        rock.offset.x = 0;
      }

      rock.offset.y = -1;
      if (rockCollide(rock, walls, floor, rest, maxHeight)) {
        rock.x += rock.offset.x;
        rock.reset();
        if (rock.top > maxHeight) maxHeight = rock.top;
        spawn.y = maxHeight + 4;
        rest.push(rock);
        rock = new Rock(nextRock, spawn.x, spawn.y);
        break;
      }
      
      rock.x += rock.offset.x;
      rock.y += rock.offset.y;
      rock.reset();
    }
  }
  // drawGame(rock, walls, floor, rest);

  return maxHeight;
};

function drawGame(rock, walls, floor, rest) {
  const top = rock.top + 1;
  const grid = new Array(top+1).fill().map(()=>new Array(walls[1]).fill('.'));
  for (let y = floor; y <= top; y++) {
    grid[y][walls[0]] = '|';
    grid[y][walls[1]] = '|';
  }
  for (let x = walls[0]; x <= walls[1]; x++) {
    grid[top][x] = '-';
  }
  for (const px of rock.pixels) {
    grid[top-px.y][px.x] = '@';
  }
  let index = 0;
  for (const next of rest) {
    for (const px of next.pixels) {
      grid[top-px.y][px.x] = index;
    }
    index++;
    index = index % 10;
  }
  console.log(grid.map(e=>e.join('')).join('\n')+'\n');
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const walls = [0, 8];
  const floor = 0;
  let rest = [];
  const spawn = { x: 3, y: 4 };
  let nextRock = 0;
  let nextMove = 0;
  let thisMove = nextMove;
  let thisRock = nextRock;
  let rock = new Rock(nextRock, spawn.x, spawn.y);
  let maxHeight = 0;
  const freq = new Map();
  let foundRepeat = false;
  let heightBefore = 0;
  let repeat;
  let roundHeights = [];
  let rounds = 1000000000000;

  roundHeights.push({index: roundHeights.length, heightBefore, maxHeight});

  for (let round = 0; round < 5000; round++) {
    thisRock = nextRock;
    nextRock++;
    if (nextRock >= rockPrimitives.length) nextRock = 0;
    heightBefore = maxHeight;

    while (true) {

      thisMove = nextMove;
      rock.offset.x = input[nextMove];
      nextMove++;
      if (nextMove >= input.length) nextMove = 0;
      if (rockCollide(rock, walls, floor, rest, maxHeight)) {
        rock.offset.x = 0;
      }

      rock.offset.y = -1;
      if (rockCollide(rock, walls, floor, rest, maxHeight)) {
        rock.x += rock.offset.x;
        rock.reset();
        if (rock.top > maxHeight) maxHeight = rock.top;
        spawn.y = maxHeight + 4;
        rest.push(rock);
        const key = [thisMove, thisRock].join();
        let f = freq.get(key)
        if (!f) {
          f = [];
          freq.set(key, f);
        } else {
          repeat = f;
          if (f.length >= 2) {
            f.push(round);
            foundRepeat = true;
            break;
          }
          // console.log({key, f, round, maxHeight});
        }
        f.push(round);
        roundHeights.push({index: roundHeights.length, heightBefore, maxHeight, diff: maxHeight - heightBefore});
        rock = new Rock(nextRock, spawn.x, spawn.y);
        break;
      }
      
      rock.x += rock.offset.x;
      rock.y += rock.offset.y;
      rock.reset();
    }
    if (foundRepeat) break;
  }

  let beforeRound = repeat[1] - 1;
  let beforeHeight = roundHeights[beforeRound].maxHeight;
  let repeatHeight = roundHeights[repeat[2]-1].maxHeight - roundHeights[repeat[1]].maxHeight;
  let repeatRounds = repeat[2] - repeat[1];
  let remainingRounds = rounds - beforeRound;
  let finalRounds = remainingRounds % repeatRounds;
  let middleRounds = (remainingRounds - finalRounds) / repeatRounds;
  let finalDiff = roundHeights.slice(repeat[1], repeat[1] + finalRounds).reduce((p,c)=>p+c.diff,0);
  let finalHeight = beforeHeight + middleRounds * repeatHeight + finalDiff;

  // drawGame(rock, walls, floor, rest);

  return finalHeight;
};

run({
  part1: {
    tests: [
      {
        input: `
          >>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
        `,
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        >>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
        `,
        expected: 1514285714288,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
