import run from "aocrunner";

const parseInput = (rawInput) => rawInput
  .split(/\n\n/)
  .map(block=>block
    .split(/\n/)
    .map(line=>{
      const badBoy = JSON.parse(line);
      return badBoy;
    })
  );

const valid = {
  right: -1,
  wrong: 1,
  continue: 0,
};

function compare(left, right) {
  let tl = typeof left;
  let tr = typeof right;

  if (tl === 'undefined' && tr === 'undefined') {
    return valid.continue;
  }

  if (tl === 'undefined') {
    return valid.right;
  }
  
  if (tr === 'undefined') {
    return valid.wrong;
  }
  
  if (tl === 'number' && tr === 'number') {
    if (left < right) return valid.right;
    if (left > right) return valid.wrong;
    return valid.continue;
  }
  
  if (tl === 'object' && tr === 'object') {
    let i = 0;
    const len = Math.max(left.length, right.length);
    do {
      let result = compare(left[i], right[i]);
      if (result !== valid.continue) return result;
      i++;
    } while (i <= len);
    return valid.continue;
  }
  
  if (tl === 'object') {
    return compare(left, [right], true);
  }

  if (tr === 'object') {
    return compare([left], right);
  }

  throw new Error('unhandled condition', { left, right, tl, tr });
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const result = input.map(block => {
    const left = block[0];
    const right = block[1];
    return compare(left, right) !== valid.wrong ? 1 : 0;
  });

  return result.reduce((p, c, i) => p + c * (i + 1), 0);
};

const part2 = (rawInput) => {
  const input = [
    [[2]],
    [[6]],
    ...parseInput(rawInput).flatMap(e=>e),
  ].sort(compare).map(e=>JSON.stringify(e));

  return (input.indexOf('[[2]]') + 1) * (input.indexOf('[[6]]') + 1);
};

run({
  part1: {
    tests: [
      {
        input: `
          [1,1,3,1,1]
          [1,1,5,1,1]
          
          [[1],[2,3,4]]
          [[1],4]
          
          [9]
          [[8,7,6]]
          
          [[4,4],4,4]
          [[4,4],4,4,4]
          
          [7,7,7,7]
          [7,7,7]
          
          []
          [3]
          
          [[[]]]
          [[]]
          
          [1,[2,[3,[4,[5,6,7]]]],8,9]
          [1,[2,[3,[4,[5,6,0]]]],8,9]
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
          [1,1,3,1,1]
          [1,1,5,1,1]
          
          [[1],[2,3,4]]
          [[1],4]
          
          [9]
          [[8,7,6]]
          
          [[4,4],4,4]
          [[4,4],4,4,4]
          
          [7,7,7,7]
          [7,7,7]
          
          []
          [3]
          
          [[[]]]
          [[]]
          
          [1,[2,[3,[4,[5,6,7]]]],8,9]
          [1,[2,[3,[4,[5,6,0]]]],8,9]
        `,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
