import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map((e,i,a)=>({ value: e*1, self: i }));

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const index = new Array(input.length).fill().map(( (e,index) => index ));
  const next = new Array(input.length).fill().map(( (e,index,a) => (index + 1) % a.length ));

  for (let i = 0; i < input.length; i++) {
    const { value, self } = input[i];
  }

  // for (let i = 0; i < input.length; i++) {
  //   const { value, self } = input[i];
  //   const swapIndex = (self + value) % input.length;
  //   const { value: swapValue, self: swapSelf } = input[swapIndex];
  //   console.log({ i });
  //   console.log({ value, self });
  //   console.log({ swapValue });
  //   console.log({ swapIndex, swapSelf });

  //   input[i].self = swapSelf;
  //   // input[i].next = swapNext;
    
  //   input[swapIndex].self = self;
  //   // input[swapIndex].next = next;

  //   console.log(input);

  //   if (i >= 1) break;
  // }

  // const list = new Array(input.length).fill().map(((e,index,a)=>({ inputIndex: index, next: (index + 1) % a.length })));

  // for (let i = 0; i < input.length; i++) {
  //   const { value, listIndex } = input[i];
    
  //   const swapIndex = (listIndex + value) % input.length;

  //   // const { value: swapValue, listIndex: swapListIndex } = input[swapIndex];
  //   const { inputIndex: swapInputIndex, next: swapNext } = list[swapListIndex];

  //   console.log({ value, listIndex });
  //   console.log({ swapIndex });
  //   console.log({ swapValue, swapListIndex });
  //   console.log({ swapInputIndex, swapNext });

  //   list[listIndex].inputIndex = 
  //   list[listIndex].next

  //   list[swapIndex].inputIndex
  //   list[swapIndex].next
    
  //   if (i >= 0) break;
  // }

  return 0;
};

// function print(input) {
//   const result = new Array(input.length).fill();
//   for (const line of input) {
//     result[line.self] = line.value;
//   }
//   console.log(JSON.stringify(result).replace(/,/g,', ').replace(/[\[\]]/g,''));
// }

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
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
        
        `,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
