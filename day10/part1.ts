import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

/*
 */
function parse (lines: string[]): string[][] {
  return lines.map((line: string): string[] => line.split(''))
}

function part1 (lines: string[]) {
  const m: Record<string, number[][]> = {
    '|': [[0, -1], [0, 1]],
    '-': [[-1, 0], [1, 0]],
    'F': [[1, 0], [0, 1]],
    '7': [[-1, 0], [0, 1]],
    'J': [[-1, 0], [0, -1]],
    'L': [[1, 0], [0, -1]],
    '.':[]
  }

  const g = parse(lines)
  const w = g[0].length
  const h = g.length
  // find start
  let pos = [0, 0]
  for (let yi = 0; yi < h; yi++) {
    for (let xi = 0; xi < w; xi++) {
      if (g[yi][xi] === 'S') {
        pos[0] = xi
        pos[1] = yi
      }
    }
  }
  const newPos = [
    [pos[0] - 1, pos[1]],
    [pos[0] + 1, pos[1]],
    [pos[0], pos[1] - 1],
    [pos[0], pos[1] + 1]
  ].filter((p2) => {
    // do any of the routes out of newp get us back to start?
    if (p2[0] < 0 || p2[0] >= w || p2[1] < 0 || p2[1] >= h) { return false }
    const c = g[p2[1]][p2[0]]
    for (let i = 0; i < m[c].length; i++) {
      const p3 = [p2[0] + m[c][i][0], p2[1] + m[c][i][1]]
      if (p3[0] === pos[0] && p3[1] === pos[1]) {
        return true
      }
    }

    return false
  })
  let dist = 1
  let oldPos = pos
  pos = newPos[1]

  while (g[pos[1]][pos[0]] !== 'S') {
    // find next pos which is one of the dirs from pos but not oldPos
    const c = g[pos[1]][pos[0]]
    const newPos = m[c].map(
      (move: number[]): number[] => [pos[0] + move[0], pos[1] + move[1]]
    ).filter((newPos: number[]): boolean => newPos[0] != oldPos[0] || newPos[1] != oldPos[1])
    dist++
    oldPos = pos
    pos = newPos[0]
  }
  let score = dist / 2
  return score
}

function part2 (lines: string[]) {
  const m: Record<string, number[][]> = {
    '|': [[0, -1], [0, 1]],
    '-': [[-1, 0], [1, 0]],
    'F': [[1, 0], [0, 1]],
    '7': [[-1, 0], [0, 1]],
    'J': [[-1, 0], [0, -1]],
    'L': [[1, 0], [0, -1]],
    '.':[]

  }

  const g = parse(lines)
  const w = g[0].length
  const h = g.length

  // find start
  let pos = [0, 0]
  for (let yi = 0; yi < h; yi++) {
    for (let xi = 0; xi < w; xi++) {
      if (g[yi][xi] === 'S') {
        pos[0] = xi
        pos[1] = yi
      }
    }
  }
  const newPos = [
    [pos[0] - 1, pos[1]],
    [pos[0] + 1, pos[1]],
    [pos[0], pos[1] - 1],
    [pos[0], pos[1] + 1]
  ].filter((p2) => {
    // do any of the routes out of newp get us back to start?
    if (p2[0] < 0 || p2[0] >= w || p2[1] < 0 || p2[1] >= h) { return false }
    const c = g[p2[1]][p2[0]]
    for (let i = 0; i < m[c].length; i++) {
      const p3 = [p2[0] + m[c][i][0], p2[1] + m[c][i][1]]
      if (p3[0] === pos[0] && p3[1] === pos[1]) {
        return true
      }
    }
    return false
  })
  // work out if S is a change to y in the loop or not
  const startMoves = newPos.map( (p)=>[p[0]-pos[0],p[1]-pos[1]])
  // work out S
  const startChars : string[] = Object.keys(m).filter( (c:string):boolean=>{
    // if all our moves are in this char it matches
    return startMoves.every( (move:number[]) : boolean=>{
      // true if our move is in the list of char moves
      for(let i=0;i<m[c].length;i++) {
         if(move[0]===m[c][i][0] && move[1]===m[c][i][1]) {
           return true
         }
      }
      return false
    })
  })

  let inLoop: Record<string, true> = {}
  let oldPos = pos
  pos = newPos[1]
  inLoop[`${pos[0]},${pos[1]}`] = true
  while (g[pos[1]][pos[0]] !== 'S') {
    // find next pos which is one of the dirs from pos but not oldPos
    const c = g[pos[1]][pos[0]]
    const newPos = m[c].map(
      (move: number[]): number[] => [pos[0] + move[0], pos[1] + move[1]]
    ).filter((newPos: number[]): boolean => newPos[0] != oldPos[0] || newPos[1] != oldPos[1])
    oldPos = pos
    pos = newPos[0]
    inLoop[`${pos[0]},${pos[1]}`] = true
  }
  g[pos[1]][pos[0]] = startChars[0]

  const tran:Record<string,Record<string,string>> = {
    "O":{
      "|":"I",
      "L":"U",
      "F":"L"
    },
    "I":{
      "|":"O",
      "L":"L",
      "F":"U"
    },
    "U":{
      "-":"U",
      "7":"I",
      "J":"O"
    },
    "L":{
      "-":"L",
      "7":"O",
      "J":"I"
    }
  }
  let score = 0
  for (let y = 0; y < h; y++) {
    let mode = 'O'
    for (let x = 0; x < w; x++) {
      if (inLoop[`${x},${y}`]) {
        const c = g[y][x]
        mode = tran[mode][c]
      } else {
        if (mode==='I') {
          score++
        } else {
        }
      }
    }
  }
  return score
}