import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(e=>e*1);


class LinkedList{
  
  constructor(input){
    this.length = input.length;
    this.head = null;
    this.zero = null;
    this.ordered = [];
    
    let lastNode = null;
    for (const line of input) {

      let index = 0;
      const node = new Node(index, line);
      this.ordered.push(node);

      if (this.head === null) {
        node.isHead = true;
        this.head = node;
      }

      if (lastNode) {
        lastNode.next = node;
        node.prev = lastNode;
      }

      if (line === 0) {
        this.zero = node;
      }

      lastNode = node;

    }

    lastNode.next = this.head;
    this.head.prev = lastNode;
  }

  decrypt() {
    for (const node of this.ordered) {
      if (node.value === 0) continue;
      const modValue = node.value % (this.length - 1);
      if (modValue === 0) continue;
      const { next, prev } = node;
      if (node.isHead) {
        this.head = next;
        node.isHead = false;
        next.isHead = true;
      }
      prev.next = next;
      next.prev = prev;
      let insertAfter = node;
      for (let i = 0; i < modValue; i++) {
        insertAfter = insertAfter.next;
      }
      for (let i = 0; i >= modValue; i--) {
        insertAfter = insertAfter.prev;
      }
      const insertBefore = insertAfter.next;
      insertAfter.next = node;
      insertBefore.prev = node;
      node.next = insertBefore;
      node.prev = insertAfter;
      // print(this);
    }  
  }

  getNthItem(nth) {
    const offset = nth % this.length;
    let node = this.zero;
    for (let i = 0; i < offset; i++) {
      node = node.next;
    }
    return node.value;
  }
}

class Node{
  constructor(inputIndex, value){
    this.inputIndex = inputIndex;
    this.value = value;
  }
  next = null;
  prev = null;
  isHead = false;
}

function print(linkedList) {
  let node;
  let result = [];
  for (let i = 0; i < linkedList.length; i++) {
    if (!node) {
      node = linkedList.head;
    } else {
      node = node.next;
    }
    result.push(node.value);
  }
  console.log(result.slice(0, 10))
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  
  const linkedList = new LinkedList(input);
  linkedList.decrypt();
  
  // print(linkedList);
  
  let total = 0;
  for (let i = 1; i <= 3; i++) {
    total += linkedList.getNthItem(1000 * i);
  }

  return total;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  
  const decryptionKey = 811589153;
  const input2 = input.map(e=>e*decryptionKey);
  const linkedList = new LinkedList(input2);
  
  for (let i = 0; i < 10; i++) {
    linkedList.decrypt();
  }
  
  let total = 0;
  for (let i = 1; i <= 3; i++) {
    total += linkedList.getNthItem(1000 * i);
  }

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `
          1
          2
          -3
          3
          -2
          0
          4
        `,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          1
          2
          -3
          3
          -2
          0
          4
        `,
        expected: 1623178306,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
