import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
console.log()
const PART2 = part2(lines)
console.log({ PART2 })


type Grid = string[][]

function parse (lines: string[]): Grid {
  return lines.map((line) => line.split(''))
}

function rollBall (g: Grid, x: number, y: number, xd: number, yd: number) {
  // roll a ball on the grid returning the same grid
  let [xi, yi] = [x, y]
  while (xi + xd >= 0 && xi + xd < g[0].length && yi + yd >= 0 && yi + yd < g.length && g[yi + yd][xi + xd] === '.') {
    xi += xd
    yi += yd
  }
  g[y][x] = '.'
  g[yi][xi] = 'O'
}

function cloneGrid (g: Grid): Grid {
  return g.map((row: string[]) => [...row])
}

function rollGrid (g: Grid, dir: 'N' | 'S' | 'E' | 'W') {
  // roll each ball in order, returning a new grid
  const rg: Grid = cloneGrid(g)
  switch (dir) {
    case 'N':
      for (let y = 0; y < rg.length; y++) {
        for (let x = 0; x < rg[0].length; x++) {
          if (rg[y][x] === 'O') {
            rollBall(rg, x, y, 0, -1)
          }
        }
      }
      break
    case 'S':
      for (let y = rg.length - 1; y >= 0; y--) {
        for (let x = 0; x < rg[0].length; x++) {
          if (rg[y][x] === 'O') {
            rollBall(rg, x, y, 0, 1)
          }
        }
      }
      break
    case 'E':
        for (let x = rg[0].length - 1; x >= 0; x--) {
          for (let y = 0; y < rg.length; y++) {
          if (rg[y][x] === 'O') {
            rollBall(rg, x, y, 1, 0)
          }
        }
      }
      break
    case 'W':
      for (let x = 0; x < rg[0].length; x++) {
        for (let y = 0; y < rg.length; y++) {
          if (rg[y][x] === 'O') {
            rollBall(rg, x, y, -1, 0)
          }
        }
      }
      break
  }
  return rg
}

function weighLoad (g: Grid): number {
  let score = 0
  for (let y = 0; y < g.length; y++) {
    for (let x = 0; x < g[0].length; x++) {
      if (g[y][x] === 'O') {
        score += g.length - y
      }
    }
  }
  return score
}

function printGrid (g: Grid) {
  g.forEach((row) => console.log(row.join('')))
  console.log()
}

function cycle (g: Grid): Grid {
  const g1 = rollGrid(g, 'N')
  const g2 = rollGrid(g1, 'W')
  const g3 = rollGrid(g2, 'S')
  return rollGrid(g3, 'E')
}

function part1 (lines: string[]) {
  const grid = parse(lines)
  const g2 = rollGrid(grid, 'N')
  return weighLoad(g2)
}

function gridCode(g:Grid) {
  return g.map( row=>row.join('')).join(':')
}

function part2 (lines: string[]) {

  const target = 1000000000

  const grid = parse(lines)
  const mem :Record<string,number>={}
  const loadAtI:number[]=[]
  let g = grid
  // find loop
  let loop_from=-1
  let loop_size = -1
  for(let i=0;i<target;i++) {
    g = cycle(g)
    let first = -1
    const code = gridCode(g)
    if( mem[code] ) {
      loop_from = mem[code]
      loop_size = i-loop_from
      console.log('yay')
      break
    } else {
      mem[code]=i
      loadAtI[i]=weighLoad(g)
    }
  }

  // work out which loop item "target is"
  const effectively = ((target-loop_from) % loop_size)+loop_from
console.log(effectively)
  //printGrid(grid)
  //printGrid(g2)
  return loadAtI[effectively-1]
}
