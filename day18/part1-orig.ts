import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
/*
const PART2 = doThing(lines, 4, 10)
console.log({ PART2 })
*/

type Instruction = {
  dir: string
  dist: number
  col: string
}

function parse (lines: string[]): Instruction[] {
  return lines.map((line) => {
    const [dir, distStr, colStr] = line.split(' ')
    const dist = parseInt(distStr)
    const col = colStr.replace(/[\(\)\#]/g, '')
    return { dir, dist, col }
  })
}

type Grid = Record<string, string>

function part1 (lines: string[]) {

  const ins = parse(lines)
  let [x, y] = [0, 0]
  const g: Grid = {}

  let minX = 0
  let maxX = 0
  let minY = 0
  let maxY = 0

  const dirMap: Record<string, [number, number]> = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }
  const lineMap: Record<string, string> = {
    U: '|', D: '|', L: '-', R: '-'
  }
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
  ins.forEach((instruction) => {
    g[`${x},${y}`] = turnMap[prevInstruction.dir + instruction.dir]
    for (let i = 0; i < instruction.dist; ++i) {
      x += dirMap[instruction.dir][0]
      y += dirMap[instruction.dir][1]
      g[`${x},${y}`] = lineMap[instruction.dir]
    }
    if (x < minX) { minX = x }
    if (y < minY) { minY = y }
    if (x > maxX) { maxX = x }
    if (y > maxY) { maxY = y }
    console.log(instruction)
    prevInstruction = instruction
  })
  g[`${x},${y}`] = turnMap[prevInstruction.dir + ins[0].dir]
  drawMap(g, minX, maxX, minY, maxY)

  const tran:Record<string,Record<string,string>> = {
    "O":{
      ".":"O",
      "|":"I",
      "L":"U",
      "F":"L"
    },
    "I":{
      ".":"I",
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
  for (let y = minY; y <= maxY; y++) {
    let state:string ='O'
    let rowScore = 0
    for (let x = minX; x <= maxX; x++) {
      const c = g[`${x},${y}`] ?? '.'

      if (c !== '.' || state !=='O' ) {
        process.stdout.write(c)
        rowScore++
      } else {
        process.stdout.write("_")
      }
      state = tran[state][c]
    }
    process.stdout.write(' ' + rowScore + ' \n')
    score+=rowScore
  }

  return score
}

function drawMap (g: Grid, minX: number, maxX: number, minY: number, maxY: number): void {
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      process.stdout.write(g[`${x},${y}`] ?? '.')
    }
    process.stdout.write('\n')
  }
}

