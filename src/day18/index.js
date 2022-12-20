import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>e.split(',').map(e=>e*1));

const dirs = [
  [ 1, 0, 0],
  [-1, 0, 0],
  [ 0, 1, 0],
  [ 0,-1, 0],
  [ 0, 0, 1],
  [ 0, 0,-1],
];

class GridSystem {
  
  constructor(input) {
    for (const droplet of input) {
      this.addDroplet(droplet);
      if (droplet[0] < this.limits.x.min) this.limits.x.min = droplet[0];
      if (droplet[0] > this.limits.x.max) this.limits.x.max = droplet[0];
      if (droplet[1] < this.limits.y.min) this.limits.y.min = droplet[1];
      if (droplet[1] > this.limits.y.max) this.limits.y.max = droplet[1];
      if (droplet[2] < this.limits.z.min) this.limits.z.min = droplet[2];
      if (droplet[2] > this.limits.z.max) this.limits.z.max = droplet[2];
    }
    for (const droplet of input) {
      for (const dir of dirs) {
        const coord = addCoords(droplet, dir);
        if (!this.getFromGrid(this.dropGrid, coord)) {
          this.addEdge(coord);
        }
      }
    }
  }

  dropGrid = new Map();
  edgeGrid = new Map();
  
  limits = {
    x: {
      min: Infinity,
      max: 0,
    },
    y: {
      min: Infinity,
      max: 0,
    },
    z: {
      min: Infinity,
      max: 0,
    },
  };

  drops = 0;
  edges = 0;

  addDroplet(coord) {
    this.addToGrid(this.dropGrid, coord);
    this.drops++;
  }

  addEdge(coord) {
    this.addToGrid(this.edgeGrid, coord);
    this.edges++;
  }

  addToGrid(grid, coord, val) {
    const cx = coord[0];
    const cy = coord[1];
    const cz = coord[2];
    
    let x = grid.get(cx);
    if (!x) {
      x = new Map();
      grid.set(cx, x);
    }

    let y = x.get(cy);
    if (!y) {
      y = new Map();
      x.set(cy, y);
    }

    let z = y.get(cz);
    if (!z || val) {
      y.set(cz, val || 1);
    } else {
      y.set(cz, z + 1);
    }
  }

  getFromGrid(grid, coord) {
    const cx = coord[0];
    const cy = coord[1];
    const cz = coord[2];
    
    const x = grid.get(cx);
    if (!x) return false;

    const y = x.get(cy);
    if (!y) return false;

    return y.get(cz);
  }

  getInvalids() {
    let count = 0;
    for (let [x, xSet] of this.dropGrid) {
      for (let [y, ySet] of xSet) {
        for (let [z, zVal] of ySet) {
          count += this.getFromGrid(this.edgeGrid, [x,y,z]) || 0;
        }
      }
    }
    return count;   
  }

  findAllExternalFaces() {
    let faces = 0;
    const done = new Set();
    const queue = [
      [
        this.limits.x.min - 1,
        this.limits.y.min - 1,
        this.limits.z.min - 1,
      ],
    ];
    while (queue.length > 0) {
      const coord = queue.pop();
      const key = coord.join(';');
      done.add(key);
      for (const dir of dirs) {
        const nextCoord = addCoords(coord, dir);
        const nextKey = nextCoord.join(';');
        if (done.has(nextKey)) continue;
        if (
          nextCoord[0] < this.limits.x.min - 1 ||
          nextCoord[1] < this.limits.y.min - 1 ||
          nextCoord[2] < this.limits.z.min - 1 ||
          nextCoord[0] > this.limits.x.max + 1 ||
          nextCoord[1] > this.limits.y.max + 1 ||
          nextCoord[2] > this.limits.z.max + 1
          ) continue;
          const isDrop  = this.getFromGrid(this.dropGrid, nextCoord);
          if (isDrop) {
            faces++;
          } else {
            done.add(nextKey);
            queue.push(nextCoord);
          }
      }
    }
    return faces;
  }
}

function addCoords(coord1, coord2) {
  return [
    coord1[0] + coord2[0],
    coord1[1] + coord2[1],
    coord1[2] + coord2[2],
  ];
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const system = new GridSystem(input);
  const invalid = system.getInvalids();
  return system.edges - invalid;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const system = new GridSystem(input);
  return system.findAllExternalFaces();
};

run({
  part1: {
    tests: [
      {
        input: `
          2,2,2
          1,2,2
          3,2,2
          2,1,2
          2,3,2
          2,2,1
          2,2,3
          2,2,4
          2,2,6
          1,2,5
          3,2,5
          2,1,5
          2,3,5
        `,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          2,2,2
          1,2,2
          3,2,2
          2,1,2
          2,3,2
          2,2,1
          2,2,3
          2,2,4
          2,2,6
          1,2,5
          3,2,5
          2,1,5
          2,3,5
        `,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
