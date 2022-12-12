import run from "aocrunner";

const parseInput = (rawInput) => {
  let startNode;
  let endNode;
  const nodes = rawInput.split(/\n/).map((a, y) =>
    a.split("").map((b, x) => {
      const start = b === "S";
      const end = b === "E";
      b = start ? "a" : end ? "z" : b;
      const height = b.charCodeAt(0) - 97;
      const char = b;
      const visited = start;
      const distance = start ? 0 : Infinity;
      if (start) startNode = { x, y };
      if (end) endNode = { x, y };
      return { start, end, height, char, visited, distance };
    }),
  );
  return { nodes, startNode, endNode };
};

const dirs = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

function isVisited(nodes, pos) {
  return nodes[pos.y][pos.x].visited;
}

function heightCheck(nodes, oldPos, newPos) {
  return (
    nodes[newPos.y][newPos.x].height - nodes[oldPos.y][oldPos.x].height <= 1
  );
}

function getNeighbours(pos) {
  return dirs.map((dir) => ({
    x: pos.x + dir.x,
    y: pos.y + dir.y,
  }));
}

function boundsCheck(nodes, pos) {
  return (
    pos.x >= 0 && pos.y >= 0 && pos.y < nodes.length && pos.x < nodes[0].length
  );
}

function nodeToText(f) {
  return f.distance < Infinity ? f.distance % 10 : ".";
}

function printMap(input) {
  console.log(
    input.map((e) => e.map((f) => nodeToText(f)).join("")).join("\n"),
  );
}

const part1 = (rawInput) => {
  const { nodes, startNode, endNode } = parseInput(rawInput);

  let options = [];
  for (let y = nodes.length - 1; y >= 0; y--) {
    for (let x = nodes[0].length - 1; x >= 0; x--) {
      if (x === startNode.x && y === startNode.y) {
      } else {
        options.push({ x, y });
      }
    }
  }
  options.push(startNode);

  while (options.length > 0) {
    const pos = options.pop();
    const { distance } = nodes[pos.y][pos.x];
    nodes[pos.y][pos.x].visited = true;

    let tentative = getNeighbours(pos);
    tentative = tentative.filter((newPos) => boundsCheck(nodes, newPos));
    tentative = tentative.filter((newPos) => !isVisited(nodes, newPos));
    tentative = tentative.filter((newPos) => heightCheck(nodes, pos, newPos));

    for (const nextPos of tentative) {
      const nextDist = nodes[nextPos.y][nextPos.x].distance;
      const minDist = Math.min(
        nextDist,
        distance < Infinity ? distance + 1 : Infinity,
      );
      nodes[nextPos.y][nextPos.x].distance = minDist;
    }

    options = options.sort(
      (posA, posB) =>
        nodes[posB.y][posB.x].distance - nodes[posA.y][posA.x].distance,
    );
  }

  // printMap(nodes);
  return nodes[endNode.y][endNode.x].distance;
};

const part2 = (rawInput) => {
  const { nodes, startNode, endNode } = parseInput(rawInput);

  nodes[startNode.y][startNode.x].visited = false;
  nodes[startNode.y][startNode.x].distance = Infinity;
  nodes[endNode.y][endNode.x].distance = 0;
  nodes[endNode.y][endNode.x].visited = true;

  let options = [];
  for (let y = nodes.length - 1; y >= 0; y--) {
    for (let x = nodes[0].length - 1; x >= 0; x--) {
      if (x === endNode.x && y === endNode.y) {
      } else {
        options.push({ x, y });
      }
    }
  }
  
  options.push(endNode);

  while (options.length > 0) {
    const pos = options.pop();
    const { distance } = nodes[pos.y][pos.x];
    nodes[pos.y][pos.x].visited = true;

    let tentative = getNeighbours(pos);
    tentative = tentative.filter((newPos) => boundsCheck(nodes, newPos));
    tentative = tentative.filter((newPos) => !isVisited(nodes, newPos));
    tentative = tentative.filter((newPos) => heightCheck(nodes, newPos, pos));

    for (const nextPos of tentative) {
      const nextDist = nodes[nextPos.y][nextPos.x].distance;
      const minDist = Math.min(
        nextDist,
        distance < Infinity ? distance + 1 : Infinity,
      );
      nodes[nextPos.y][nextPos.x].distance = minDist;
    }

    options = options.sort(
      (posA, posB) =>
        nodes[posB.y][posB.x].distance - nodes[posA.y][posA.x].distance,
    );
  }

  options = [];
  for (let y = nodes.length - 1; y >= 0; y--) {
    for (let x = nodes[0].length - 1; x >= 0; x--) {
      options.push({ x, y });
    }
  }

  options = options.filter(posA => nodes[posA.y][posA.x].char === 'a');
  options = options.sort(
    (posA, posB) =>
      nodes[posA.y][posA.x].distance - nodes[posB.y][posB.x].distance,
  );

  // printMap(nodes);
  const shortPos = options[0];
  return nodes[shortPos.y][shortPos.x].distance;
};

run({
  part1: {
    tests: [
      {
        input: `
          Sabqponm
          abcryxxl
          accszExk
          acctuvwj
          abdefghi
        `,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Sabqponm
          abcryxxl
          accszExk
          acctuvwj
          abdefghi
        `,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
