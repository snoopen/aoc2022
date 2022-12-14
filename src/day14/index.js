import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>e.split(' -> ').map(e=>e.split(',').map(e=>e*1)));

function buildBoundsAndMap(input, bounds, mapYX) {
  for (const line of input) {
    let last;
    for (const path of line) {
      updateBoundsByPos(bounds, [path[0],path[1]]);
      if (last) {
        let minMax = getMinMax(last, path);
        for (let x = minMax.xMin; x <= minMax.xMax; x++) {
          for (let y = minMax.yMin; y <= minMax.yMax; y++) {
            setPosition(mapYX, [x, y], '#');
          }
        }
      }
      last = path;
    }
  }
}

function setPosition(mapYX, pos, char) {
  let x = pos[0];
  let y = pos[1];
  let my = mapYX.get(y);
  if (!my) {
    my = new Map();
    mapYX.set(y, my);
  }
  my.set(x, char);
}

function getMinMax(last, next) {
  let result = {}
  if (last[0] < next[0]) {
    result.xMin = last[0];
    result.xMax = next[0];
  } else {
    result.xMin = next[0];
    result.xMax = last[0];
  }
  if (last[1] < next[1]) {
    result.yMin = last[1];
    result.yMax = next[1];
  } else {
    result.yMin = next[1];
    result.yMax = last[1];
  }
  return result;
}

function updateBoundsMyMinMax(bounds, minMax) {
  if (bounds.xMin === -1 || bounds.xMin > minMax.xMin) bounds.xMin = minMax.xMin;
  if (bounds.xMax === -1 || bounds.xMax < minMax.xMax) bounds.xMax = minMax.xMax;
  if (bounds.yMin === -1 || bounds.yMin > minMax.yMin) bounds.yMin = minMax.yMin;
  if (bounds.yMax === -1 || bounds.yMax < minMax.yMax) bounds.yMax = minMax.yMax;
  return bounds;
}

function updateBoundsByPos(bounds, pos) {
  if (bounds.xMin === -1 || bounds.xMin > pos[0]) bounds.xMin = pos[0];
  if (bounds.xMax === -1 || bounds.xMax < pos[0]) bounds.xMax = pos[0];
  if (bounds.yMin === -1 || bounds.yMin > pos[1]) bounds.yMin = pos[1];
  if (bounds.yMax === -1 || bounds.yMax < pos[1]) bounds.yMax = pos[1];
  return bounds;
}

function mAdd(a, b) {
  return [ a[0] + b[0], a[1] + b[1] ];
}

function outOfBounds(pos, bounds) {
  return (pos[0] < bounds.xMin || pos[0] > bounds.xMax || pos[1] > bounds.yMax);
}

function isVacant(sand, mapYX) {
  let x = sand[0];
  let y = sand[1];
  let my = mapYX.get(y);
  if (my) {
    if (my.has(x)) {
      return false;
    }
  }
  return true;
}

function getNextSand(sand, mapYX, bounds, floor, origin) {
  const dirs = [
    [ 0, 1],
    [-1, 1],
    [ 1, 1],
  ];
  for (let dir of dirs) {
    // Try each direction
    let nextSand = mAdd(sand, dir);
    if (nextSand[1] >= floor) return { blocked: true };
    if (!floor && outOfBounds(nextSand, bounds)) return { outOfBounds: true };
    if (isVacant(nextSand, mapYX)) return { outOfBounds: false, blocked: false, nextSand };
  }
  return { blocked: true };
}

function printMap(mapYX, bounds) {
  const xOffset = bounds.xMin;
  const yOffset = bounds.yMin;
  const xMax = bounds.xMax - xOffset + 1;
  const yMax = bounds.yMax - yOffset + 1;
  const printMap = new Array(yMax).fill().map(()=>new Array(xMax).fill('.'));
  for (const [y, ym] of mapYX) {
    for (const [x, char] of ym) {
      printMap[y - yOffset][x - xOffset] = char;
    }
  }
  console.log(printMap.map(e=>e.join('')).join('\n'));
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const sandOrigin = () => ([500, 0]);
  let sandOut = false;
  let failSafe = 0;
  const failSafeLimit = 1000;

  const bounds = {
    xMin: -1,
    xMax: -1,
    yMin: -1,
    yMax: -1,
  };

  const mapYX = new Map();
  const sands = [];

  buildBoundsAndMap(input, bounds, mapYX);

  while (!sandOut) {
    // New grain of sand
    if (failSafe > failSafeLimit) throw new Error('un oh');
    failSafe++;

    let sand = sandOrigin();

    while (true) {
      // Move sand
      let { outOfBounds, blocked, nextSand } = getNextSand(sand, mapYX, bounds);
      if (outOfBounds) {
        sandOut = true;
        break;
      }
      if (blocked) {
        sands.push(sand);
        updateBoundsByPos(bounds, sand);
        setPosition(mapYX, sand, 'o');
        break;
      }
      sand = nextSand;
      // End move sand
    }
    // End new grain of sand
  }

  // printMap(mapYX, bounds);
  return sands.length;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const sandOrigin = () => ([500, 0]);
  let sandOut = false;
  let failSafe = 0;
  const failSafeLimit = 100000;

  const bounds = {
    xMin: -1,
    xMax: -1,
    yMin: -1,
    yMax: -1,
  };

  const origin = sandOrigin();

  const mapYX = new Map();
  const sands = [];

  buildBoundsAndMap(input, bounds, mapYX);

  const floor = bounds.yMax + 2;

  while (!sandOut) {
    // New grain of sand
    if (failSafe > failSafeLimit) throw new Error('un oh');
    failSafe++;

    let sand = sandOrigin();

    while (true) {
      // Move sand
      let { outOfBounds, blocked, nextSand } = getNextSand(sand, mapYX, bounds, floor, origin);
      if (outOfBounds) {
        sandOut = true;
        break;
      }
      if (blocked) {
        sands.push(sand);
        updateBoundsByPos(bounds, sand);
        setPosition(mapYX, sand, 'o');
        if (sand[1] === origin[1]) sandOut = true;
        break;
      }
      sand = nextSand;
      // End move sand
    }
    // End new grain of sand
  }

  // printMap(mapYX, bounds);
  return sands.length;
};

run({
  part1: {
    tests: [
      {
        input: `
          498,4 -> 498,6 -> 496,6
          503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          498,4 -> 498,6 -> 496,6
          503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
