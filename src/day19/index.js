import run from "aocrunner";

const parseInput = (rawInput) => rawInput
.replace(/([:.])\n +/g,'$1 ')
.replace(/\n\n/,'\n')
.split('\n')
.map(e=>{
  if (!e) return;
  const bp = e.split(/[:.]\s+/);
  const index = bp[0].match(/(\d+)/)[1] * 1;
  const recipes = {};
  for (let index = 1; index < bp.length; index++) {
    const match = bp[index].match(/Each (\w+) robot costs (\d+) (\w+)?(?: and (\d+) (\w+))?/);
    const name = match[1];
    const resources = [];
    resources.push({ name: match[3], quantity: match[2] * 1 });
    if (match[4]) resources.push({ name: match[5], quantity: match[4] * 1 });
    recipes[name] = resources;
  }
  return { index, recipes };
});

const resourceTypes = [
  'ore',
  'clay',
  'obsidian',
  'geode',
];

class Session {
  constructor(recipes, index) {
    this.index = index;
    this.recipes = recipes;
  }

  minute = 0;

  resources = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  robots = {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  queue = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  clone() {
    const copy = new Session(this.recipes, this.index);
    copy.minute = this.minute;
    for (const name of resourceTypes) {
      copy.resources[name] = this.resources[name];
      copy.robots[name] = this.robots[name];
      copy.queue[name] = this.queue[name];
    }
    return copy;
  }

  collect() {
    for (const name of resourceTypes) {
      this.resources[name] += this.robots[name];
    }
  }

  canBuild() {
    const robots = [];
    for (const name of resourceTypes) {
      const haveResources = this.recipes[name].every(resource => {
        const { name: resourceName, quantity } = resource;
        return this.resources[resourceName] >= quantity;
      });
      if (haveResources) {
        robots.push(name);
      }
    }
    return robots;
  }

  build(robotName) {
    const canBuild = this.recipes[robotName].every(resource => {
      const { name: resourceName, quantity } = resource;
      return this.resources[resourceName] >= quantity;
    });
    if (canBuild) {
      for (const resource of this.recipes[robotName]) {
        const { name: resourceName, quantity } = resource;
        this.resources[resourceName] -= quantity;
      }
      this.queue[robotName]++;
    } else {
      throw new Error('no ' + robotName);
    }
  }

  processQueue() {
    for (const name of resourceTypes) {
      this.robots[name] += this.queue[name];
      this.queue[name] = 0;
    }
  }

  getScore() {
    let i = 0;
    let score = 0;
    for (const name of resourceTypes) {
      i++;
      score += this.robots[name] * (100 ** i);
      score += this.resources[name] * (100 ** i);
    }
    return score;
  }

  robotScore() {
    let i = 0;
    let score = 0;
    for (const name of resourceTypes) {
      i++;
      score += this.robots[name] * (100 ** i);
    }
    return score;
  }

  resourceScore() {
    let i = 0;
    let score = 0;
    for (const name of resourceTypes) {
      i++;
      score += this.resources[name] * (100 ** i);
    }
    return score;
  }

}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const best = [];

  const timeLimit = 24;
  
  for (const blueprint of input) {
    let sessions = [new Session(blueprint.recipes, blueprint.index)];
    for (let time = 0; time < timeLimit; time++) {
      let newSessions = [];
      for (const session of sessions) {
        const canBuild = session.canBuild();
        for (const build of canBuild) {
          const newSession = session.clone()
          newSession.minute++;
          newSession.build(build);
          newSession.collect();
          newSession.processQueue();
          newSessions.push(newSession);
        }
        session.minute++;
        session.collect();
        session.processQueue();
      }
      sessions.push(...newSessions);
      sessions = sessions
        .sort((a,b) => b.getScore() - a.getScore())
        .sort((a,b) => b.resources.geode - a.resources.geode)
        .slice(0,100);
    }
    delete sessions[0].log;
    best.push(sessions[0]);
  }

  return best.reduce((p,c) => p + c.resources.geode * c.index ,0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const best = [];

  const timeLimit = 32;
  
  for (const blueprint of input.slice(0, 3)) {
    let sessions = [new Session(blueprint.recipes, blueprint.index)];
    for (let time = 0; time < timeLimit; time++) {
      let newSessions = [];
      for (const session of sessions) {
        const canBuild = session.canBuild();
        for (const build of canBuild) {
          const newSession = session.clone()
          newSession.minute++;
          newSession.build(build);
          newSession.collect();
          newSession.processQueue();
          newSessions.push(newSession);
        }
        session.minute++;
        session.collect();
        session.processQueue();
      }
      sessions.push(...newSessions);
      sessions = sessions
        .sort((a,b) => b.resourceScore() - a.resourceScore())
        .sort((a,b) => b.robotScore() - a.robotScore())
        .sort((a,b) => b.resources.geode - a.resources.geode)
        .slice(0,200);
    }
    delete sessions[0].log;
    best.push(sessions[0]);
  }

  return best.reduce((p,c) => p * c.resources.geode, 1);
};


run({
  part1: {
    tests: [
      {
        input: `
          Blueprint 1:
            Each ore robot costs 4 ore.
            Each clay robot costs 2 ore.
            Each obsidian robot costs 3 ore and 14 clay.
            Each geode robot costs 2 ore and 7 obsidian.
          
          Blueprint 2:
            Each ore robot costs 2 ore.
            Each clay robot costs 3 ore.
            Each obsidian robot costs 3 ore and 8 clay.
            Each geode robot costs 3 ore and 12 obsidian.
        `,
        expected: 33,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Blueprint 1:
            Each ore robot costs 4 ore.
            Each clay robot costs 2 ore.
            Each obsidian robot costs 3 ore and 14 clay.
            Each geode robot costs 2 ore and 7 obsidian.
          
          Blueprint 2:
            Each ore robot costs 2 ore.
            Each clay robot costs 3 ore.
            Each obsidian robot costs 3 ore and 8 clay.
            Each geode robot costs 3 ore and 12 obsidian.
        `,
        expected: 62 * 56,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
