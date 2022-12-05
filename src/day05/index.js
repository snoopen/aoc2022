import run from "aocrunner";

const parseInput = (rawInput) => rawInput
  .replace(/]\n 1/,']\n\n 1')
  .split(/\n\n/g)
  .map(e=>e
    .split(/\n/)
  )
  .map((e,i)=>{
    if (i === 0) {
      return e.map(e=>e.split('').filter((e,i)=>(i - 1) % 4 === 0));
    } else if (i === 1) {
        return e[0].trim().replace(/\s{2,}/g,' ').split(' ').map(e=>e*1);
    } else {
      return e.map(e=>e.match(/(\d+)\D+(\d+)\D+(\d+)/).splice(1,3).map(e=>e));
    }
  });

function getCratesFromInput(input) {
  const numCrates = Math.max(...input[1]);
  const crates = Array(numCrates).fill().map(e=>[]);
  
  for (let i = input[0].length - 1; i >= 0; i--) {
    input[0][i].forEach((e,j) => {
      if (e !== ' ') crates[j].push(e);
    });
  }

  return crates;
}

function printVis(crates) {
  const xVis = crates.length;
  const yVis = crates.reduce((p,c)=>p=Math.max(p,c.length),0);

  const vis = Array(yVis).fill().map(e=>Array(xVis).fill('[ ] '));
  for (let x = 0; x < crates.length; x++) {
    for (let y = 0; y < crates[x].length; y++) {
      vis[yVis - y -1][x] = `[${crates[x][y]}] `
    } 
  }

  let fmt = vis.map(e=>e.join('')).join('\n').concat(`\n${Array(xVis).fill().map((e,i)=>` ${i+1}  `).join('')}`);

  console.log(fmt);
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const crates = getCratesFromInput(input);

  for (const move of input[2]) {
    for (let i = 1; i <= move[0]; i++) {
      const off = crates[move[1]-1].pop();
      crates[move[2]-1].push(off);
    }
  }

  // printVis(crates);

  const result = crates.map(e=>e[e.length-1]).join('');

  return result;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const crates = getCratesFromInput(input);

  for (const move of input[2]) {
      const from = move[1]-1;
      const to = move[2]-1;
      const off = crates[from].slice(-move[0]);
      crates[from] = crates[from].slice(0,-move[0]);
      crates[to].push(...off);
  }

  // printVis(crates);

  const result = crates.map(e=>e[e.length-1]).join('');

  return result;
};

run({
  part1: {
    tests: [
      {
        input: 
`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input:
`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  // onlyTests: true,
});
