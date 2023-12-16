import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

function scoreForStart (g: string[][],xd:number,yd:number,dir: 'E' | 'W' | 'N' | 'S') {
  const e: string[][] = []
  for (let y = 0; y < g.length; ++y) {
    e[y] = []
    for (let x = 0; x < g[0].length; ++x) {
      e[y][x] = '.'
    }
  }
  let seen: Record<string, true> = {}
  energise(seen, e, g, xd,yd,dir,'X')
  //logGrid(e)
  return countHash(e)
}

function part1 (lines: string[]) {

  const g = lines.map(x => x.split(''))
  return scoreForStart(g,-1,0,'E')
}

function energise (seen: Record<string, true>, e: string[][], g: string[][], x: number, y: number, dir: 'E' | 'W' | 'N' | 'S', path: string) {
  const dirMap: Record<string, [number, number]> = {
    'N': [0, -1],
    'S': [0, 1],
    'W': [-1, 0],
    'E': [1, 0]
  }
  const code = `${x},${y},${dir}`
  if (seen[code]) {
    return
  }
  seen[code] = true
  const [nx, ny] = [x + dirMap[dir][0], y + dirMap[dir][1]]

  if (nx < 0 || nx >= g[0].length || ny < 0 || ny >= g.length) { return }
  e[ny][nx] = '#'
//  console.log(e)

  //console.log({nx,ny})
  const route = dir + g[ny][nx]
  //console.log(route)
  switch (route) {
    case 'E.':
      energise(seen, e, g, nx, ny, 'E', path + 'E')
      break
    case 'W.':
      energise(seen, e, g, nx, ny, 'W', path + 'W')
      break
    case 'S.':
      energise(seen, e, g, nx, ny, 'S', path + 'S')
      break
    case 'N.':
      energise(seen, e, g, nx, ny, 'N', path + 'N')
      break
    case 'E/':
      energise(seen, e, g, nx, ny, 'N', path + 'E')
      break
    case 'W/':
      energise(seen, e, g, nx, ny, 'S', path + 'W')
      break
    case 'S/':
      energise(seen, e, g, nx, ny, 'W', path + 'S')
      break
    case 'N/':
      energise(seen, e, g, nx, ny, 'E', path + 'N')
      break
    case 'E\\':
      energise(seen, e, g, nx, ny, 'S', path + 'E')
      break
    case 'W\\':
      energise(seen, e, g, nx, ny, 'N', path + 'W')
      break
    case 'S\\':
      energise(seen, e, g, nx, ny, 'E', path + 'S')
      break
    case 'N\\':
      energise(seen, e, g, nx, ny, 'W', path + 'N')
      break
    case 'E-':
      energise(seen, e, g, nx, ny, 'E', path + 'E')
      break
    case 'W-':
      energise(seen, e, g, nx, ny, 'W', path + 'W')
      break
    case 'S-':
      energise(seen, e, g, nx, ny, 'W', path + 'S')
      energise(seen, e, g, nx, ny, 'E', path + 'S')
      break
    case 'N-':
      energise(seen, e, g, nx, ny, 'W', path + 'N')
      energise(seen, e, g, nx, ny, 'E', path + 'S')
      break
    case 'E|':
      energise(seen, e, g, nx, ny, 'N', path + 'E')
      energise(seen, e, g, nx, ny, 'S', path + 'E')
      break
    case 'W|':
      energise(seen, e, g, nx, ny, 'N', path + 'W')
      energise(seen, e, g, nx, ny, 'S', path + 'W')
      break
    case 'S|':
      energise(seen, e, g, nx, ny, 'S', path + 'S')
      break
    case 'N|':
      energise(seen, e, g, nx, ny, 'N', path + 'N')
      break
  }
  // logGrid(e)
}

function logGrid (g: string[][]): void {
  g.forEach((r) => console.log(r.join('')))
}

function countHash (g: string[][]): number {
  return g.reduce(
    (acc1, row: string[]) => acc1 + row.reduce((acc2, char) => acc2 + (char === '#' ? 1 : 0), 0), 0)
}

function part2 (lines: string[]) {
  const g = lines.map(x => x.split(''))

  let best = 0
  for(let x=0;x<g[0].length;x++) {
    const s1 = scoreForStart(g,x,-1,'S')
    const s2 = scoreForStart(g,x,g.length,'N')
    best = Math.max(best,s1)
    best = Math.max(best,s2)
  }
  for(let x=0;x<g[0].length;x++) {
    const s1 = scoreForStart(g,x,-1,'S')
    const s2 = scoreForStart(g,x,g.length,'N')
    best = Math.max(best,s1)
    best = Math.max(best,s2)
  }
  return best
}