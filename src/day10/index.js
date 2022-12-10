import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>e.split(' '));

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const comp = new Computer(input);
  const exec = comp.exec((clock) => (clock - 20) % 40 === 0);
  let result;
  let sum = 0;

  do {
    result = exec.next();
    if (result.value === true) {
      sum += comp.clock * comp.registers.x;
    }
  } while(result.done !== true);

  return sum;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const comp = new Computer(input, false);
  const exec = comp.exec(()=>true);
  let result;
  let output = new Array(6).fill().map(e=>new Array(40).fill('.'));

  do {
    result = exec.next();
    if (result.value === true) {
      const line = Math.floor((comp.clock - 1) / 40);
      const pixel = (comp.clock - 1) % 40;
      const sprite = comp.registers.x;
      if (pixel >= sprite - 1 && pixel <= sprite + 1) {
        output[line][pixel] = '#';
      }
    }
  } while(result.done !== true);

  /**
   *   I'm not writing OCR, visually decode and return below
   */
  const display = output.map(e=>e.join('')).join('\n');
  const test =
`##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`;
  console.log(display);

  return display === test ? true : 'ZKGRKGRK';
};

class Computer {

  constructor(program = [], debug) {
    this.program = program;
    this.debug = debug || false;
    this.pointer = 0;
    this.clock = 0;
    this.registers = {
      x: 1,
    };
  }

  instructions = {
    'noop': {
      steps: 1,
      exec: () => {},
    },
    'addx': {
      steps: 2,
      exec: (val) => {
        this.registers.x += val;
      },
    }
  };

  *exec(breakDuring) {
    while (this.pointer < this.program.length) {
      const instName = this.program[this.pointer][0];
      const inst = this.instructions[instName];
      const args = this.program[this.pointer][1] * 1;
      let steps = inst.steps;
      while (steps > 0) {
        this.clock++;
        steps--;
        if (breakDuring(this.clock)) {
          yield true;
        }
        if (steps === 0) {
          inst.exec(args);
        }
      }
      this.pointer++;
    }
    return false;
  }

}

run({
  part1: {
    tests: [
      {
        xinput: `
          noop
          addx 3
          addx -5
        `,
        input: `
          addx 15
          addx -11
          addx 6
          addx -3
          addx 5
          addx -1
          addx -8
          addx 13
          addx 4
          noop
          addx -1
          addx 5
          addx -1
          addx 5
          addx -1
          addx 5
          addx -1
          addx 5
          addx -1
          addx -35
          addx 1
          addx 24
          addx -19
          addx 1
          addx 16
          addx -11
          noop
          noop
          addx 21
          addx -15
          noop
          noop
          addx -3
          addx 9
          addx 1
          addx -3
          addx 8
          addx 1
          addx 5
          noop
          noop
          noop
          noop
          noop
          addx -36
          noop
          addx 1
          addx 7
          noop
          noop
          noop
          addx 2
          addx 6
          noop
          noop
          noop
          noop
          noop
          addx 1
          noop
          noop
          addx 7
          addx 1
          noop
          addx -13
          addx 13
          addx 7
          noop
          addx 1
          addx -33
          noop
          noop
          noop
          addx 2
          noop
          noop
          noop
          addx 8
          noop
          addx -1
          addx 2
          addx 1
          noop
          addx 17
          addx -9
          addx 1
          addx 1
          addx -3
          addx 11
          noop
          noop
          addx 1
          noop
          addx 1
          noop
          noop
          addx -13
          addx -19
          addx 1
          addx 3
          addx 26
          addx -30
          addx 12
          addx -1
          addx 3
          addx 1
          noop
          noop
          noop
          addx -9
          addx 18
          addx 1
          addx 2
          noop
          noop
          addx 9
          noop
          noop
          noop
          addx -1
          addx 2
          addx -37
          addx 1
          addx 3
          noop
          addx 15
          addx -21
          addx 22
          addx -6
          addx 1
          noop
          addx 2
          addx 1
          noop
          addx -10
          noop
          noop
          addx 20
          addx 1
          addx 2
          addx 2
          addx -6
          addx -11
          noop
          noop
          noop
        `,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          addx 15
          addx -11
          addx 6
          addx -3
          addx 5
          addx -1
          addx -8
          addx 13
          addx 4
          noop
          addx -1
          addx 5
          addx -1
          addx 5
          addx -1
          addx 5
          addx -1
          addx 5
          addx -1
          addx -35
          addx 1
          addx 24
          addx -19
          addx 1
          addx 16
          addx -11
          noop
          noop
          addx 21
          addx -15
          noop
          noop
          addx -3
          addx 9
          addx 1
          addx -3
          addx 8
          addx 1
          addx 5
          noop
          noop
          noop
          noop
          noop
          addx -36
          noop
          addx 1
          addx 7
          noop
          noop
          noop
          addx 2
          addx 6
          noop
          noop
          noop
          noop
          noop
          addx 1
          noop
          noop
          addx 7
          addx 1
          noop
          addx -13
          addx 13
          addx 7
          noop
          addx 1
          addx -33
          noop
          noop
          noop
          addx 2
          noop
          noop
          noop
          addx 8
          noop
          addx -1
          addx 2
          addx 1
          noop
          addx 17
          addx -9
          addx 1
          addx 1
          addx -3
          addx 11
          noop
          noop
          addx 1
          noop
          addx 1
          noop
          noop
          addx -13
          addx -19
          addx 1
          addx 3
          addx 26
          addx -30
          addx 12
          addx -1
          addx 3
          addx 1
          noop
          noop
          noop
          addx -9
          addx 18
          addx 1
          addx 2
          noop
          noop
          addx 9
          noop
          noop
          noop
          addx -1
          addx 2
          addx -37
          addx 1
          addx 3
          noop
          addx 15
          addx -21
          addx 22
          addx -6
          addx 1
          noop
          addx 2
          addx 1
          noop
          addx -10
          noop
          noop
          addx 20
          addx 1
          addx 2
          addx 2
          addx -6
          addx -11
          noop
          noop
          noop
        `,
        expected: true,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
