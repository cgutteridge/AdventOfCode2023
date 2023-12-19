import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

type Instruction = {
  dir: string
  dist: number
}

type Grid = Record<string, Record<string, string>>

function scoreRow (row: Record<string, string>, tran: Record<string, Record<string, string>>) {
  let rowScore = 0
  const xs = Object.keys(row).map(x => parseInt(x)).sort((a, b) => a - b)
  let state = 'O'
  let entered = 0
  while (xs.length) {
    const x = xs.shift() ?? 0
    const c = row[x]
    const newState = tran[state][c]
    if (state === 'O' && newState !== 'O') {
      entered = x
    }
    if (state !== 'O' && newState === 'O') {
      // exit
      const runLength = x - entered + 1
      rowScore += runLength
    }
    state = newState
  }
  return rowScore
}

function part1 (lines: string[]) {
  const ins: Instruction[] = lines.map((line) => {
    const [dir, distStr,] = line.split(' ')
    const dist = parseInt(distStr)
    return { dir, dist}
  })
  return scoreInstructions(ins)
}

function part2 (lines: string[]) {
  const ins: Instruction[] = lines.map((line) => {
    const parts = line.split(' ')
    const distStr = parts[2].substring(2, 7)
    const dirStr = parts[2].substring(7, 8)
    const dist = parseInt('0x' + distStr)
    const DMap: Record<string, string> = { '0': 'R', 1: 'D', 2: 'L', 3: 'U' }
    const dir = DMap[dirStr]
    return { dir, dist }
  })
  return scoreInstructions(ins)
}

function scoreInstructions (ins: Instruction[]) {

  let [x, y] = [0, 0]
  const g: Grid = {}

  const dirMap: Record<string, [number, number]> = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }
  const turnMap: Record<string, string> = {
    UL: '7',
    UR: 'F',
    DL: 'J',
    DR: 'L',
    LU: 'L',
    LD: 'F',
    RU: 'J',
    RD: '7',
  }
  let prevInstruction = ins[ins.length - 1]
  let minY = 0
  let maxY = 0
  ins.forEach((instruction) => {
    if (g[y] === undefined) {g[y] = {} }
    g[y][x] = turnMap[prevInstruction.dir + instruction.dir]
    x += dirMap[instruction.dir][0] * instruction.dist
    y += dirMap[instruction.dir][1] * instruction.dist
    if (y < minY) { minY = y }
    if (y > maxY) { maxY = y }
    prevInstruction = instruction
  })

  const ys = Object.keys(g).map(x => parseInt(x)).sort((a, b) => a - b)

  type Between = {
    height: number,
    edges: Record<string, string>
  }

  const tran: Record<string, Record<string, string>> = {
    'O': {
      '|': 'I',
      'L': 'U',
      'F': 'L'
    },
    'I': {
      '|': 'O',
      'L': 'L',
      'F': 'U'
    },
    'U': {
      '-': 'U',
      '7': 'I',
      'J': 'O'
    },
    'L': {
      '-': 'L',
      '7': 'O',
      'J': 'I'
    }
  }

  const betweens: Between[] = []
  for (let yi = 0; yi < ys.length - 1; yi++) {
    betweens.push({
      height: ys[yi + 1] - ys[yi] - 1,
      edges: {}
    })
  }

  //propagate F and 7 downwards
  for (let yi = 0; yi < ys.length - 1; yi++) {
    const xs = Object.keys(g[ys[yi]]).map(x => parseInt(x)).sort((a, b) => a - b)
    xs.forEach((x) => {
      const c = g[ys[yi]][x]
      if (c === 'F' || c === '7') {
        let yi2 = yi + 1
        betweens[yi].edges[x] = '|'
        while (g[ys[yi2]][x] === undefined) {
          g[ys[yi2]][x] = '|'
          betweens[yi2].edges[x] = '|'
          yi2++
        }
      }
    })

  }

  // work out area on interesting lines
  let score = 0

  ys.forEach((y) => {
    const row = g[y]
    const rowScore = scoreRow(row, tran)
    score += rowScore
  })
  betweens.forEach((b) => {
    const rowScore = scoreRow(b.edges, tran)
    score += rowScore * b.height
  })

  return score
}