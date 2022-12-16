import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>{
  const match = e.match(/=(-?\d+).*=(-?\d+).*=(-?\d+).*=(-?\d+)/i);
  const sensor = {
    x: match[1] * 1,
    y: match[2] * 1,
  };
  const beacon = {
    x: match[3] * 1,
    y: match[4] * 1,
  }
  return {
      sensor,
      beacon,
      mhd: calcManhattanDist(sensor, beacon),
    };
});

function calcManhattanDist(start = { x: 0, y: 0 }, end = { x: 0, y: 0 }) {
  return Math.abs(start.x - end.x) +
    Math.abs(start.y - end.y);
}

function checkOverlap1D(line1, line2) {
  return line1.start >= line2.start && line1.start <= line2.end ||
  line1.end >= line2.start && line1.end <= line2.end;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let lines = [];
  const isTest = (input[0].sensor.x === 2 && input[0].sensor.y === 18);
  const y = isTest ? 10 : 2000000;
  let beacons = new Set();
  for (const reading of input) {
    const yStart = reading.sensor.y - reading.mhd;
    const yEnd = reading.sensor.y + reading.mhd;
    if (yStart <= y && y <= yEnd) {
      const ay = Math.abs(y - reading.sensor.y);
      const start = reading.sensor.x - reading.mhd + ay;
      const end = reading.sensor.x + reading.mhd - ay;
      lines.push({start, end});
    }
  }

  const len = lines.length;
  for (let i = 0; i < len; i++) {
    let line = lines.pop();
    let overlap = false;
    for (let j = 0; j < lines.length; j++) {
      if (checkOverlap1D(line, lines[j])) {
        lines[j].start = Math.min(line.start, lines[j].start);
        lines[j].end = Math.max(line.end, lines[j].end);
        overlap = true;
      }
    }
    if (!overlap) lines.unshift(line);
  }

  for (const reading of input) {
    if (reading.beacon.y === y) {
      for (const line of lines) {
        if (!beacons.has(reading.beacon.x) && checkOverlap1D({ start: reading.beacon.x, end: reading.beacon.x }, line)) {
          beacons.add(reading.beacon.x);
        } 
      }
    }
  }

  return lines.reduce((p,c) => p + c.end - c.start + 1, 0 - beacons.size);
};

function findIntersection(line1, line2) {
  // This assumes 45deg lines
  const va = getVector(line1);
  const vb = getVector(line2);
  const x = Math.abs(va.i - vb.i) / 2;
  const y = Math.abs(vb.i - x);
  const overlap = (
    x >= line1.start.x && x <= line1.end.x ||
    x >= line1.end.x && x <= line1.start.x
  ) && (
    y >= line1.start.y && y <= line1.end.y ||
    y >= line1.end.y && y <= line1.start.y
  ) && (
    x >= line2.start.x && x <= line2.end.x ||
    x >= line2.end.x && x <= line2.start.x
  ) && (
    y >= line2.start.y && y <= line2.end.y ||
    y >= line2.end.y && y <= line2.start.y
  )
  return overlap ? {x, y} : null;
}

function getVector(line) {
  // based at x = 0
  const vx = line.start.x > line.end.x ? -1 : 1;
  const vy = line.start.y > line.end.y ? -1 : 1;
  const iy = line.start.y - (vy * vx) * line.start.x;
  return { i: iy, v: vy * vx };
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const perimeters = [];
  let intersections = [];
  const isTest = (input[0].sensor.x === 2 && input[0].sensor.y === 18);
  const limit = isTest ? 20 : 4000000;

  for (const reading of input) {
    const yStart = reading.sensor.y - reading.mhd - 1;
    const yEnd = reading.sensor.y + reading.mhd + 1;
    const xStart = reading.sensor.x - reading.mhd - 1;
    const xEnd = reading.sensor.x + reading.mhd + 1;
    perimeters.push({
      start: { x: reading.sensor.x, y: yStart },
      end: {x: xEnd-1, y: reading.sensor.y-1 },
    });
    perimeters.push({
      start: {x: xEnd, y: reading.sensor.y },
      end: { x: reading.sensor.x+1, y: yEnd-1 },
    });
    perimeters.push({
      start: { x: reading.sensor.x, y: yEnd },
      end: {x: xStart+1, y: reading.sensor.y+1 },
    });
    perimeters.push({
      start: {x: xStart, y: reading.sensor.y },
      end: { x: reading.sensor.x-1, y: yStart+1 },
    });
  }

  const len = perimeters.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (i === j) continue;
      const intersect = findIntersection(perimeters[i], perimeters[j]);
      if (intersect && intersect.x === Math.floor(intersect.x)) {
        intersections.push(intersect);
      }
    }
  }

  intersections = intersections.filter(intersect => {
    return input.every(reading => {
      const mhd = calcManhattanDist(reading.sensor, intersect);
      return mhd > reading.mhd && intersect.x <= limit && intersect.y <= limit;
    });
  });

  return intersections[0].x * 4000000 + intersections[0].y;
};

const part1print = (rawInput) => {
  const input = parseInput(rawInput);
  const mapYX = new Map();
  const bounds = {
    xMin: -1,
    xMax: -1,
    yMin: -1,
    yMax: -1,
  };
  let isTest = false;
  if (input[0].sensor.x === 2 && input[0].sensor.y === 18) isTest = true;
  if (!isTest) return ' bad idea to parse the full input here';
  const checkLine = isTest ? 10 : 2000000;
  const limit = 20;
  let count = 0;
  
  for (const line of input) {
    setPosition(mapYX, line.sensor, 'S', bounds);
    setPosition(mapYX, line.beacon, 'B', bounds);
  }
  
  let index = 0;
  let i = 0;
  for (const reading of input) {
    index++;
    // if (![4,6,7,10,12].includes(index)) continue;
    // i++;
    const offset = 1;
    const yStart = reading.sensor.y - reading.mhd - offset;
    const yEnd = reading.sensor.y + reading.mhd + offset;
    for (let y = yStart; y <= yEnd; y++) {
      const ay = Math.abs(y - reading.sensor.y);
      let x;
      // let char = i;
      let char = '◌';
      x = reading.sensor.x - reading.mhd + ay - offset;
      setPosition(mapYX, { x, y }, char, bounds, true);
      if (!(y === yStart || y === yEnd)) {
        x = reading.sensor.x + reading.mhd - ay + offset;
        setPosition(mapYX, { x, y }, char, bounds, true);
      }
      for (let x = reading.sensor.x - reading.mhd + ay; x <= reading.sensor.x + reading.mhd - ay; x++) {
        const isNew = setPosition(mapYX, { x, y }, '░', bounds);
        if (y === checkLine && isNew) count ++;
      }
    }
  }

  const perimeters = [];
  let intersections = [];
  for (const reading of input) {
    const yStart = reading.sensor.y - reading.mhd - 1;
    const yEnd = reading.sensor.y + reading.mhd + 1;
    const xStart = reading.sensor.x - reading.mhd - 1;
    const xEnd = reading.sensor.x + reading.mhd + 1;
    perimeters.push({
      start: { x: reading.sensor.x, y: yStart },
      end: {x: xEnd-1, y: reading.sensor.y-1 },
    });
    perimeters.push({
      start: {x: xEnd, y: reading.sensor.y },
      end: { x: reading.sensor.x+1, y: yEnd-1 },
    });
    perimeters.push({
      start: { x: reading.sensor.x, y: yEnd },
      end: {x: xStart+1, y: reading.sensor.y+1 },
    });
    perimeters.push({
      start: {x: xStart, y: reading.sensor.y },
      end: { x: reading.sensor.x-1, y: yStart+1 },
    });
  }

  const len = perimeters.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (i === j) continue;
      const intersect = findIntersection(perimeters[i], perimeters[j]);
      if (intersect && intersect.x === Math.floor(intersect.x)) {
        intersections.push(intersect);
      }
    }
  }

  intersections = intersections.filter(intersect => {
    return input.every(reading => {
      const mhd = calcManhattanDist(reading.sensor, intersect);
      const inBounds = 
        intersect.x <= limit && intersect.y <= limit &&
        intersect.x >= 0 && intersect.y >= 0;
      return mhd > reading.mhd && inBounds;
    });
  });

  for (const intersect of intersections) {
    setPosition(mapYX, intersect, '█', bounds, true);
  }

  printMap(mapYX, bounds);

  return;
};

function setPosition(mapYX, pos, char, bounds, overwrite) {
  updateBounds(bounds, pos);
  let my = mapYX.get(pos.y);
  if (!my) {
    my = new Map();
    mapYX.set(pos.y, my);
  }
  let mx = my.get(pos.x);
  if (!mx || overwrite) {
    my.set(pos.x, char);
    return true;
  }
  return false;
}

function updateBounds(bounds, pos) {
  if (bounds.xMin === -1 || bounds.xMin > pos.x) bounds.xMin = pos.x;
  if (bounds.xMax === -1 || bounds.xMax < pos.x) bounds.xMax = pos.x;
  if (bounds.yMin === -1 || bounds.yMin > pos.y) bounds.yMin = pos.y;
  if (bounds.yMax === -1 || bounds.yMax < pos.y) bounds.yMax = pos.y;
  return bounds;
}

function printMap(mapYX, bounds) {
  const border = 2;
  bounds.xMin -= border;
  bounds.xMax += border;
  bounds.yMin -= border;
  bounds.yMax += border;
  const xOffset = bounds.xMin;
  const yOffset = bounds.yMin;
  const xMax = bounds.xMax - xOffset + 1;
  const yMax = bounds.yMax - yOffset + 1;
  const printMap = new Array(yMax).fill().map(()=>new Array(xMax).fill('◦'));
  for (const [y, ym] of mapYX) {
    for (const [x, char] of ym) {
      printMap[y - yOffset][x - xOffset] = char;
    }
  }
  console.log(printMap.map(e=>e.join(' ')).join('\n'));
}

run({
  part1: {
    tests: [
      {
        input: `
          Sensor at x=2, y=18: closest beacon is at x=-2, y=15
          Sensor at x=9, y=16: closest beacon is at x=10, y=16
          Sensor at x=13, y=2: closest beacon is at x=15, y=3
          Sensor at x=12, y=14: closest beacon is at x=10, y=16
          Sensor at x=10, y=20: closest beacon is at x=10, y=16
          Sensor at x=14, y=17: closest beacon is at x=10, y=16
          Sensor at x=8, y=7: closest beacon is at x=2, y=10
          Sensor at x=2, y=0: closest beacon is at x=2, y=10
          Sensor at x=0, y=11: closest beacon is at x=2, y=10
          Sensor at x=20, y=14: closest beacon is at x=25, y=17
          Sensor at x=17, y=20: closest beacon is at x=21, y=22
          Sensor at x=16, y=7: closest beacon is at x=15, y=3
          Sensor at x=14, y=3: closest beacon is at x=15, y=3
          Sensor at x=20, y=1: closest beacon is at x=15, y=3
        `,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Sensor at x=2, y=18: closest beacon is at x=-2, y=15
          Sensor at x=9, y=16: closest beacon is at x=10, y=16
          Sensor at x=13, y=2: closest beacon is at x=15, y=3
          Sensor at x=12, y=14: closest beacon is at x=10, y=16
          Sensor at x=10, y=20: closest beacon is at x=10, y=16
          Sensor at x=14, y=17: closest beacon is at x=10, y=16
          Sensor at x=8, y=7: closest beacon is at x=2, y=10
          Sensor at x=2, y=0: closest beacon is at x=2, y=10
          Sensor at x=0, y=11: closest beacon is at x=2, y=10
          Sensor at x=20, y=14: closest beacon is at x=25, y=17
          Sensor at x=17, y=20: closest beacon is at x=21, y=22
          Sensor at x=16, y=7: closest beacon is at x=15, y=3
          Sensor at x=14, y=3: closest beacon is at x=15, y=3
          Sensor at x=20, y=1: closest beacon is at x=15, y=3
        `,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
