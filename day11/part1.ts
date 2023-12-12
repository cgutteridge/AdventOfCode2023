import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

/*
 */
type Map = {
  galaxies: number[][]
  cols: number[]
  rows: number[]
}

function parse (lines: string[]): Map {
  // find galaxy positions and col size and width size
  const chars = lines.map((line: string): string[] => line.split(''))
  const height = chars.length
  const width = chars[0].length
  const galaxies: number[][] = []
  const rows: number[] = []
  const cols: number[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < height; x++) {
      if (chars[y][x] === '#') {
        galaxies.push([x, y])
      }
    }
  }
  for (let y = 0; y < height; y++) {
    let width = 2
    for (let x = 0; x < height; x++) {
      if (chars[y][x] === '#') {
        width = 1
      }
    }
    rows.push(width)
  }
  for (let x = 0; x < height; x++) {
    let width = 2
    for (let y = 0; y < height; y++) {
      if (chars[y][x] === '#') {
        width = 1
      }
    }
    cols.push(width)
  }
  return { galaxies, cols, rows }
}

// not 3625104
function part1 (lines: string[]) {
  const m = parse(lines)
  let score = 0

  for (let i1 = 0; i1 < m.galaxies.length - 1; i1++) {
    for (let i2 = i1 + 1; i2 < m.galaxies.length; i2++) {
      const [x1, x2] = [m.galaxies[i1][0], m.galaxies[i2][0]].sort((a, b) => a - b)
      const [y1, y2] = [m.galaxies[i1][1], m.galaxies[i2][1]].sort((a, b) => a - b)
      let dist = 0
      for (let x = x1; x < x2; x++) { dist += m.cols[x]}
      for (let y = y1; y < y2; y++) { dist += m.rows[y]}
      //console.log({ x1, x2, y1, y2, i1, i2, dist })
      score += dist
    }
  }
  return score
}

function parse2 (lines: string[]): Map {
  // find galaxy positions and col size and width size
  const chars = lines.map((line: string): string[] => line.split(''))
  const height = chars.length
  const width = chars[0].length
  const galaxies: number[][] = []
  const rows: number[] = []
  const cols: number[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < height; x++) {
      if (chars[y][x] === '#') {
        galaxies.push([x, y])
      }
    }
  }
  for (let y = 0; y < height; y++) {
    let width = 1000000
    for (let x = 0; x < height; x++) {
      if (chars[y][x] === '#') {
        width = 1
      }
    }
    rows.push(width)
  }
  for (let x = 0; x < height; x++) {
    let width = 1000000
    for (let y = 0; y < height; y++) {
      if (chars[y][x] === '#') {
        width = 1
      }
    }
    cols.push(width)
  }
  return { galaxies, cols, rows }
}
// 82000210
function part2 (lines: string[]) {
  const m = parse2(lines)
  let score= 0

  for (let i1 = 0; i1 < m.galaxies.length - 1; i1++) {
    for (let i2 = i1 + 1; i2 < m.galaxies.length; i2++) {
      const [x1, x2] = [m.galaxies[i1][0], m.galaxies[i2][0]].sort((a, b) => a - b)
      const [y1, y2] = [m.galaxies[i1][1], m.galaxies[i2][1]].sort((a, b) => a - b)
      let dist = 0
      for (let x = x1; x < x2; x++) { dist += m.cols[x]}
      for (let y = y1; y < y2; y++) { dist += m.rows[y]}
      //console.log({ x1, x2, y1, y2, i1, i2, dist })
      score += dist
    }
  }
  return score
}
