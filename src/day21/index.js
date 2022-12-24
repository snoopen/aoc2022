import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>{
  const line = e.split(/: /);
  const match = line[1].match(/^\d+$/);
  const monkey = line[0];
  const number = match ? line[1] * 1 : null; 
  const equation = !match ? line[1].split(' ') : null; 
  return { monkey, number, equation };
});

const operators = {
  '+': (op1, op2) => op1 + op2,
  '-': (op1, op2) => op1 - op2,
  '/': (op1, op2) => op1 / op2,
  '*': (op1, op2) => op1 * op2,
};

const reverseOperatorsLeft = {
  '+': (op1, ans) => ans - op1,
  '-': (op1, ans) => op1 - ans,
  '/': (op1, ans) => op1 / ans,
  '*': (op1, ans) => ans / op1,
};

const reverseOperatorsRight = {
  '+': (ans, op2) => ans - op2,
  '-': (ans, op2) => ans + op2,
  '/': (ans, op2) => ans * op2,
  '*': (ans, op2) => ans / op2,
};

class Monkey {
  constructor(name, number, equation) {
    this.name = name;
    this.number = number;
    this.equation = equation;
  }

  resolved = false;

  resolveLinks(monkeys) {
    if (this.equation) {
      const left = this.equation[0];
      const right = this.equation[2];
      this.equation[0] = monkeys.get(left);
      this.equation[2] = monkeys.get(right);
    }
    this.resolved = true;
  }

  getAnswer() {
    if (this.resolved === false) throw new Error('Oh snap!');
    if (this.number) return this.number;
    const left = this.equation[0].getAnswer();
    const right = this.equation[2].getAnswer();
    return operators[this.equation[1]](left, right);
  }

  getAnswer2() {
    if (this.resolved === false) throw new Error('Oh snap!');
    if (this.number) return this.number;
    this.left = this.equation?.[0].getAnswer2();
    this.right = this.equation?.[2].getAnswer2();
    if (this.left && this.right) {
      return operators[this.equation[1]](this.left, this.right);
    }
    return null;
  }

  getSolution(answer) {
    if (this.name === 'humn') return answer;
    if (this.number) return this.number;
    const operator = this.equation[1];
    if (answer && (!this.left || !this.right)) {
      if (!this.left) {
        let left = reverseOperatorsRight[operator](answer, this.right);
        return this.equation[0].getSolution(left);
      }
      if (!this.right) {
        let right = reverseOperatorsLeft[operator](this.left, answer);
        return this.equation[2].getSolution(right);
      }
    }
    if (!this.left || !this.right) {
      return null;
    }
    return operators[operator](this.left, this.right);
  }

  
}

function getMonkeys(input) {
  const monkeys = new Map();

  for (const line of input) {
    const monkey = new Monkey(line.monkey, line.number, line.equation);
    monkeys.set(line.monkey, monkey);
  }

  for (const key of monkeys.keys()) {
    monkeys.get(key).resolveLinks(monkeys);
  }
  return monkeys;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const monkeys = getMonkeys(input);

  return monkeys.get('root').getAnswer();
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const monkeys = getMonkeys(input);
  monkeys.get('humn').number = null;
  const root = monkeys.get('root');
  const left = root.equation[0].getAnswer2();
  const right = root.equation[2].getAnswer2();
  let number;
  if (left) {
    number = root.equation[2].getSolution(left);
  }
  if (right) {
    number = root.equation[0].getSolution(right);
  }

  return number;
};

run({
  part1: {
    tests: [
      {
        input: `
          root: pppw + sjmn
          dbpl: 5
          cczh: sllz + lgvd
          zczc: 2
          ptdq: humn - dvpt
          dvpt: 3
          lfqf: 4
          humn: 5
          ljgn: 2
          sjmn: drzm * dbpl
          sllz: 4
          pppw: cczh / lfqf
          lgvd: ljgn * ptdq
          drzm: hmdt - zczc
          hmdt: 32
        `,
        expected: 152,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          root: pppw + sjmn
          dbpl: 5
          cczh: sllz + lgvd
          zczc: 2
          ptdq: humn - dvpt
          dvpt: 3
          lfqf: 4
          humn: 5
          ljgn: 2
          sjmn: drzm * dbpl
          sllz: 4
          pppw: cczh / lfqf
          lgvd: ljgn * ptdq
          drzm: hmdt - zczc
          hmdt: 32
        `,
        expected: 301,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
