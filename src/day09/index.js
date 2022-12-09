import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>{
  e = e.split(' ');
  return { dir: e[0], steps: e[1] * 1 };
});

const dirs = {
  'U': { x: 0, y: 1 },
  'D': { x: 0, y: -1 },
  'L': { x: -1,y:  0 },
  'R': { x: 1, y: 0 },
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const visited = new Set();
  const rope = {
    head: { x: 0, y: 0 },
    tail: { x: 0, y: 0 },
  };
  
  for (let move of input) {
    const dir = dirs[move.dir];
    const steps = move.steps;
    for (let i = 0; i < steps; i++) {
      rope.head.x += dir.x;
      rope.head.y += dir.y;
      moveTail(rope);
      visited.add(`${rope.tail.x}:${rope.tail.y}`);
    }
  };

  return visited.size;
};

function moveTail(rope) {
  let x = rope.head.x - rope.tail.x;
  let y = rope.head.y - rope.tail.y;
  const deltaX = Math.abs(x)
  const vectX = x > 0 ? 1 : -1;
  const deltaY = Math.abs(y);
  const vectY = y > 0 ? 1 : -1;

  if (deltaY > 1 && deltaX > 0 || deltaY > 0 && deltaX > 1) {
    rope.tail.x += vectX;
    rope.tail.y += vectY;
  } else if (deltaX > 1) {
    rope.tail.x += vectX;
  } else if (deltaY > 1) {
    rope.tail.y += vectY;
  }
}

function printMap(rope) {
  const print = new Array(10).fill().map(()=>new Array(10).fill().map(()=>'.'));
  print[0][0] = 's';
  print[rope.tail.y][rope.tail.x] = 'T';
  print[rope.head.y][rope.head.x] = 'H';
  console.log(print.map(e=>e.join('')).join('\n') + '\n');
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const visited = new Set();
  const knots = 10;
  const rope = new Array(knots).fill().map(()=>({ x: 0, y: 0 }));
  
  for (let move of input) {
    const dir = dirs[move.dir];
    const steps = move.steps;
    for (let i = 0; i < steps; i++) {
      rope[0].x += dir.x;
      rope[0].y += dir.y;
      moveTail2(rope);
      visited.add(`${rope[knots - 1].x}:${rope[knots - 1].y}`);
    }
  };

  // printMap2(visited);

  return visited.size;
};

function moveTail2(rope, index = 0) {
  let x = rope[index].x - rope[index+1].x;
  let y = rope[index].y - rope[index+1].y;
  const deltaX = Math.abs(x)
  const vectX = x > 0 ? 1 : -1;
  const deltaY = Math.abs(y);
  const vectY = y > 0 ? 1 : -1;

  if (deltaY > 1 && deltaX > 0 || deltaY > 0 && deltaX > 1) {
    rope[index+1].x += vectX;
    rope[index+1].y += vectY;
  } else if (deltaX > 1) {
    rope[index+1].x += vectX;
  } else if (deltaY > 1) {
    rope[index+1].y += vectY;
  }
  if (index < rope.length - 2) {
    moveTail2(rope, index + 1);
  }
}

function printMap2(visited) {
  const vis = Array.from(visited).map(e=>{
    e = e.split(':');
    return { x: e[0]  * 1, y: e[1] * 1 };
  });
  const print = new Array(30).fill().map(()=>new Array(30).fill().map(()=>'.'));
  print[0][0] = 's';
  vis.forEach((e,i)=>{
    print[e.y + 6][e.x + 12] = '#';
  });
  console.log(print.map(e=>e.join('')).join('\n') + '\n');
}

run({
  part1: {
    tests: [
      {
        input: `
          R 4
          U 4
          L 3
          D 1
          R 4
          D 1
          L 5
          R 2
        `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          R 5
          U 8
          L 8
          D 3
          R 17
          D 10
          L 25
          U 20
        `,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
