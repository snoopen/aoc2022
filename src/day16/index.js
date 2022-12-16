import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(/\n/).map(e=>{
  const match = e.match(/Valve ([A-Z]{2}).*=(\d+);.*valves? (.*)/);
  return {
    valve: match[1],
    flow: match[2] * 1,
    to: match[3].split(', '),
  };
});

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const valves = new Map();
  input.forEach(e=>valves.set(e.valve, e));

  let locations = [
    {
      roomName: 'AA',
      opened: [],
      score: 0,
      time: 30,
      flow: 0,
      visited: ['AA'],
    } 
  ];

  for (let i = 0; i < 30; i++) {
    locations = nextOptions(valves, locations).sort((a, b)=> b.score - a.score).slice(0,1000);
  }

  return locations[0].score;
};

function nextOptions(valves, locations) {
  const newLocations = [];
  for (const location of locations) {
    const { roomName, time } = location;
    const room = valves.get(roomName);
    const nextRooms = room.to;
    if (time <= 0) {
      newLocations.push(location);
      continue;
    }
    for (const nextRoom of nextRooms) {
      const newLocation1 = visitRoom(valves, location, nextRoom, true);
      const newLocation2 = visitRoom(valves, location, nextRoom, false);
      if (newLocation1) newLocations.push(newLocation1);
      if (newLocation2) newLocations.push(newLocation2);
    }
  }
  return newLocations;
}

function visitRoom(valves, location, nextRoom, openValve) {
  const newRoom = valves.get(nextRoom);
  const { roomName, opened, score, time, flow, visited } = location;
  if (openValve && (newRoom.flow <= 0 || opened.includes(nextRoom))) return;
  let newOpened = [];
  let newScore = score;
  let newTime = time - 1;
  let newFlow = flow;
  if (openValve && newRoom.flow > 0) {
    newOpened.push(nextRoom);
    newScore += newRoom.flow * (time - 2);
    newTime--;
    newFlow += newRoom.flow;
  }
  newOpened.push(...opened);
  return {
    roomName: nextRoom,
    opened: newOpened,
    score: newScore,
    time: newTime,
    flow: newFlow,
    visited: [nextRoom, ...visited],
  };
}

function evalStates(valves, states, flowValves) {
  const newStates = [];
  for (const state of states) {
    const result = evalState(valves, state, flowValves);
    if (result) newStates.push(... result);
  }
  return newStates;
}

function evalState(valves, state, flowValves) {
  const valveOptions = [true, false];
  const newStates = [];
  const meRoomName = state.me.roomName;
  const elephantRoomName = state.elephant.roomName;
  let meNextRooms = valves.get(meRoomName).to;
  let elephantNextRooms = valves.get(elephantRoomName).to;
  if (state.opened.length === flowValves.length) return [state];
  if (state.me.time <= 0) meNextRooms = [meRoomName];
  if (state.elephant.time <= 0) elephantNextRooms = [elephantRoomName];
  for (const meNext of meNextRooms) {
    const meRoom = valves.get(meNext);
    for (const elephantNext of elephantNextRooms) {
      const elephantRoom = valves.get(elephantNext);
      for (const meValve of valveOptions) {
        if (meValve && (meRoom.flow <= 0 || state.opened.includes(meNext))) continue;
        for (const elephantValve of valveOptions) {
          if (elephantValve && (elephantRoom.flow <= 0 || state.opened.includes(elephantNext))) continue;
          const newState = JSON.parse(JSON.stringify(state));
          newState.me.roomName = meNext;
          newState.elephant.roomName = elephantNext;
          newState.me.visited.push(meNext);
          newState.elephant.visited.push(elephantNext);
          newState.me.time--;
          newState.elephant.time--;
          if (meValve && !newState.opened.includes(meNext)) {
            newState.me.time--;
            newState.flow += meRoom.flow;
            newState.opened.push(meNext);
            if (!newState.opened2) newState.opened2 = [];
            newState.opened2.push([meNext, newState.me.time].join(';'));
            newState.score += meRoom.flow * newState.me.time;
          }
          if (elephantValve && !newState.opened.includes(elephantNext)) {
            newState.elephant.time--;
            newState.flow += elephantRoom.flow;
            newState.opened.push(elephantNext);
            if (!newState.opened2) newState.opened2 = [];
            newState.opened2.push([elephantNext, newState.elephant.time].join(';'));
            newState.score += elephantRoom.flow * newState.elephant.time;
          }
          newStates.push(newState);
        }
      }
    }
  }
  return newStates;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const valves = new Map();
  const flowValves = [];
  input.forEach(e=>{
    valves.set(e.valve, e);
    if (e.flow > 0) flowValves.push(e.valve);
  });

  let states = [
    {
      me: {
        roomName: 'AA',
        visited: ['AA'],
        time: 26,
      },
      elephant: {
        roomName: 'AA',
        visited: ['AA'],
        time: 26,
      },
      opened: [],
      score: 0,
      flow: 0,
    } 
  ];

  for (let i = 0; i < 26; i++) {
    states = evalStates(valves, states, flowValves).sort((a, b)=> b.score - a.score).slice(0,20000);
  }

  return states[0].score;
};

run({
  part1: {
    tests: [
      {
        input: `
          Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
          Valve BB has flow rate=13; tunnels lead to valves CC, AA
          Valve CC has flow rate=2; tunnels lead to valves DD, BB
          Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
          Valve EE has flow rate=3; tunnels lead to valves FF, DD
          Valve FF has flow rate=0; tunnels lead to valves EE, GG
          Valve GG has flow rate=0; tunnels lead to valves FF, HH
          Valve HH has flow rate=22; tunnel leads to valve GG
          Valve II has flow rate=0; tunnels lead to valves AA, JJ
          Valve JJ has flow rate=21; tunnel leads to valve II
        `,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
          Valve BB has flow rate=13; tunnels lead to valves CC, AA
          Valve CC has flow rate=2; tunnels lead to valves DD, BB
          Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
          Valve EE has flow rate=3; tunnels lead to valves FF, DD
          Valve FF has flow rate=0; tunnels lead to valves EE, GG
          Valve GG has flow rate=0; tunnels lead to valves FF, HH
          Valve HH has flow rate=22; tunnel leads to valve GG
          Valve II has flow rate=0; tunnels lead to valves AA, JJ
          Valve JJ has flow rate=21; tunnel leads to valve II
        `,
        expected: 1707,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
