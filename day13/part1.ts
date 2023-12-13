import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

type Grid = string[]

function parse (lines: string[]): Grid[] {
  // literally just split this up on blank lines
  let inGrid = false
  const grid: Grid[] = [[]]
  lines.forEach((line) => {
    if (line === '') {
      grid.push([])
    } else {
      grid[grid.length - 1].push(line)
    }
  })
  return grid
}

function findMirror (g: Grid): number[] {
  // test each gap between rows
  // y is the first row of the pair to be tested
  const reflects: number[] = []
  for (let y = 0; y < g.length - 1; y++) {
    // numbers of rows before & after fold
    let height = y + 1
    if ((y + 1) > g.length / 2) { // past half way?
      height = g.length - y - 1
    }
    const above = g.slice(y - height + 1, y + 1).join('|')
    const below = g.slice(y + 1, y + height + 1).reverse().join('|')
    if (above == below) { reflects.push(y + 1) }
  }
  return reflects
}

// swap x & y
function flipGrid (g: Grid): Grid {
  const g2: Grid = []
  //cords are in NEW grid
  for (let y = 0; y < g[0].length; y++) {
    g2[y] = ''
    for (let x = 0; x < g.length; x++) {
      g2[y] += g[x][y]
    }
  }
  return g2
}

function flipGridTile(g:Grid, x:number,y:number ) : Grid {
  const g2 = [...g]
  const newChar = g[y][x]=='#' ? "." : "#"
  g2[y]=g[y].substring(0,x)+newChar+g[y].substring(x+1)
  return g2
}

function part1 (lines: string[]) {
  const grids = parse(lines)
  return grids.reduce((acc, grid) => {
    const reflects: number[] = getReflects(grid)
    if (reflects.length === 0) { throw new Error('no reflections')}
    return acc + reflects[0]
  }, 0)
}

function getReflects (g: Grid): number[] {
  return findMirror(g).map(x => x * 100).concat(findMirror(flipGrid(g)))
}

function part2 (lines: string[]) {
  const grids = parse(lines)
  return grids.reduce((acc, grid) => {
    const r1: number[] = getReflects(grid)
    if (r1.length === 0) { throw new Error('no reflections')}
    console.log(grid)
    for( let y=0;y<grid.length;y++) {
      for(let x=0;x<grid[0].length; x++ ) {
        const g2 = flipGridTile(grid,x,y)
        const r2 = getReflects(g2)
        const r3 = r2.filter( (x)=>x!=r1[0])
        if( r3.length ) { return acc+r3[0]}
      }
    }
     throw new Error( "no reflected score")
  }, 0)
}