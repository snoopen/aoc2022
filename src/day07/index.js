import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/);

function Directory(parent, name) {
  const d = {
    name: name,
    parent: parent,
    files: [],
    dirs: new Map(),
  };
  d.getSize = () => {
    let total = d.files.reduce((p,c)=>p+c.size,0);
    d.dirs.forEach(d => total += d.getSize());
    return total;
  }
  return d;
}

function File(name, size) {
  return {
    name: name,
    size: size,
  };
}

function parseFs(input) {
  const fs = new Map();
  let pwd = new Directory(null,  '/');
  fs.set('/', pwd);


  for (const line of input) {
    if (line.match(/^\$ cd/)) {
      let path = line.match(/cd (.+)\s*/)[1];
      if (path === '/') {
        pwd = fs.get('/');
      } else if (path === '..') {
        pwd = pwd.parent;
      } else {
        let newDir = pwd.dirs.get(path);
        if (!newDir) {
          newDir = new Directory(pwd, path);
          pwd.dirs.set(path, newDir);
        }
        pwd = newDir;
      }
    } else if (line.match(/^\$ ls/)) {
    } else if (line.match(/^dir/)) {
      let path = line.match(/dir (.+)\s*/)[1];
      if (!pwd.dirs.has(path)) {
        let newDir = new Directory(pwd, path);
        pwd.dirs.set(path, newDir);
      }
    } else {
      let size = line.match(/^(\d+)/)[1] * 1;
      let name = line.match(/^\d+\s(.+)/)[1];
      let file = new File(name, size);
      pwd.files.push(file);
    }
  }
  return fs;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const fs = parseFs(input);

  function sumUnder(dir, max) {
    let total = 0;
    const size = dir.getSize();
    if (size <= max) {
      total += size;
    }
    dir.dirs.forEach(d => total += sumUnder(d, max));
    return total;
  }

  return sumUnder(fs.get('/'), 100000);
};

function printFs(fs, depth = 0, path) {
  path = fs.name;
  console.log('  '.repeat(depth) + '- ' + path + ' (dir)');
  fs.dirs.forEach(d => printFs(d, depth + 1, path));
  fs.files.forEach(e => console.log('  '.repeat(depth + 1) + '- ' + e.name + ` (file, size: ${e.size})`));
}

function getSizes(pwd) {
  const all = [];
  all.push({ dir: pwd.name, size: pwd.getSize() });
  pwd.dirs.forEach(d => all.push(...getSizes(d)));
  return all;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const fs = parseFs(input);
  let pwd = fs.get('/');
  const capacity = 70000000;
  const req = 30000000;
  const size = pwd.getSize();
  const free = capacity - size;
  const find = req - free;

  const all = getSizes(pwd);

  const result = all.sort((a, b) => a.size - b.size).filter((e) => e.size >= find)[0];

  return result.size;
};

run({
  part1: {
    tests: [
      {
        input: `
          $ cd /
          $ ls
          dir a
          14848514 b.txt
          8504156 c.dat
          dir d
          $ cd a
          $ ls
          dir e
          29116 f
          2557 g
          62596 h.lst
          $ cd e
          $ ls
          584 i
          $ cd ..
          $ cd ..
          $ cd d
          $ ls
          4060174 j
          8033020 d.log
          5626152 d.ext
          7214296 k
        `,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          $ cd /
          $ ls
          dir a
          14848514 b.txt
          8504156 c.dat
          dir d
          $ cd a
          $ ls
          dir e
          29116 f
          2557 g
          62596 h.lst
          $ cd e
          $ ls
          584 i
          $ cd ..
          $ cd ..
          $ cd d
          $ ls
          4060174 j
          8033020 d.log
          5626152 d.ext
          7214296 k
        `,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
