import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>e.split(',').map(e=>e*1));
// const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>{
//   const c = e.split(',');
//   return {
//     x: c[0] * 1,
//     y: c[0] * 1,
//     z: c[0] * 1,
//   }
// });

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
      // if (droplet[0] < this.limits.x.min) this.limits.x.min = droplet[0];
      // if (droplet[0] > this.limits.x.max) this.limits.x.max = droplet[0];
      // if (droplet[1] < this.limits.y.min) this.limits.y.min = droplet[1];
      // if (droplet[1] > this.limits.y.max) this.limits.y.max = droplet[1];
      // if (droplet[2] < this.limits.z.min) this.limits.z.min = droplet[2];
      // if (droplet[2] > this.limits.z.max) this.limits.z.max = droplet[2];
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
  // edgeAirGrid = new Map();
  // limits = {
  //   x: {
  //     min: Infinity,
  //     max: 0,
  //   },
  //   y: {
  //     min: Infinity,
  //     max: 0,
  //   },
  //   z: {
  //     min: Infinity,
  //     max: 0,
  //   },
  // };

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

  // getAirPockets() {
  //   // let count = 0;
  //   for (let [x, xSet] of this.edgeGrid) {
  //     for (let [y, ySet] of xSet) {
  //       for (let [z, zVal] of ySet) {
  //         let airFaces = 0;
  //         for (const dir of dirs) {
  //           if (
  //             !(this.getFromGrid(this.dropGrid, addCoords([x,y,z], dir)) ||
  //               this.getFromGrid(this.edgeGrid, addCoords([x,y,z], dir)))
  //           ) {
  //             airFaces++;
  //           }
  //         }
  //         this.addToGrid(this.edgeAirGrid, [x,y,z], airFaces);
  //       }
  //     }
  //   }
  //   // console.log(this.edgeAirGrid)
  //   // return count;   
  // }

  // airParticles = new Set();

  // findAirParticles() {
  //   this.airGrid = new Map();
  //   for (let [x, xSet] of this.edgeGrid) {
  //     for (let [y, ySet] of xSet) {
  //       for (let [z, zVal] of ySet) {
  //         const coord = [x,y,z];
  //         const key = coord.join(';');
  //         if (
  //           zVal >= 6 &&
  //           !this.getFromGrid(this.dropGrid, coord) &&
  //           !this.airParticles.has(key)
  //         ) {
  //           this.airParticles.add(key);
  //           this.addToGrid(this.airGrid, coord);
  //         }
  //         if (zVal >= 6 && !this.getFromGrid(this.dropGrid, coord)) {
  //           console.log(coord);
  //         }
  //       }
  //     }
  //   }
  // }

  checkedCoord = new Set();

  getAirPockets() {
    let count = 0;
    this.checkedCoord = new Set();
    for (let [x, xSet] of this.edgeGrid) {
      for (let [y, ySet] of xSet) {
        for (let [z, zVal] of ySet) {
          const coord = [x,y,z];
          const key = coord.join(';');
          if (this.checkedCoord.has(key)) continue;
          const dropped = this.isEnclosed(coord, 0);
          if (dropped !== false) count += dropped;
          // return;
        }
      }
    }
    return count;
  }

  isEnclosed(coord) {
    const key = coord.join(';');
    this.checkedCoord.add(key);
    let xp = Array.from(this.dropGrid.keys())
      .filter(x=>x>coord[0])
      .filter(x=>this.dropGrid.get(x)?.get(coord[1])?.get(coord[2]));
    if (xp.length===0) return false;
    let xn = Array.from(this.dropGrid.keys())
      .filter(x=>x<coord[0])
      .filter(x=>this.dropGrid.get(x)?.get(coord[1])?.get(coord[2]));
    if (xn.length===0) return false;
    let yp = Array.from(this.dropGrid.get(coord[0])?.keys())
      .filter(y=>y>coord[0])
      .filter(y=>this.dropGrid.get(coord[0])?.get(y)?.get(coord[2]));
    if (yp.length===0) return false;
    let yn = Array.from(this.dropGrid.get(coord[0])?.keys())
      .filter(y=>y<coord[0])
      .filter(y=>this.dropGrid.get(coord[0])?.get(y)?.get(coord[2]));
    if (yn.length===0) return false;
    let zp = Array.from(this.dropGrid.get(coord[0])?.get(coord[1])?.keys())
      .filter(z=>z>coord[0])
      .filter(z=>this.dropGrid.get(coord[0])?.get(coord[1])?.get(z));
    if (zp.length===0) return false;
    let zn = Array.from(this.dropGrid.get(coord[0])?.get(coord[1])?.keys())
      .filter(z=>z<coord[0])
      .filter(z=>this.dropGrid.get(coord[0])?.get(coord[1])?.get(z));
    if (zn.length===0) return false;
    let dropped = this.getFromGrid(this.edgeGrid, coord);
    for (const dir of dirs) {
        const newCoord = addCoords(coord, dir);
        const newKey = newCoord.join(';');
        if (this.checkedCoord.has(newKey)) continue;
        if (this.getFromGrid(this.dropGrid, newCoord)) continue;
        const edge = this.getFromGrid(this.edgeGrid, newCoord);
        if (edge) {
          const enclosed = this.isEnclosed(newCoord);
          if (!enclosed) return false;
          dropped += enclosed;
        }
    }
    return dropped;
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
  console.log(system.edges - invalid);
  return system.edges - invalid;
};

// TODO: too high 4058
// TODO: too high 3452
// TODO: too low 836
// TODO: too low 659
const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const system = new GridSystem(input);
  const invalid = system.getInvalids();
  const air = system.getAirPockets();
  // return air;
  return system.edges - invalid - air;
  // return system.facesDropped.size;
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
