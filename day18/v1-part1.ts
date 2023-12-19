import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })

/*
const PART2 = part2(lines)
console.log({ PART2 })
 */

function parse (lines: string[]): number[][] {
  return lines.map((line) => line.split('').map(x => parseInt(x)))
}

function part1 (lines: string[]) {
  const g: number[][] = parse(lines)

  // gives best known score to get to the end from here when ENTERING on axis A: 'x,y:A'
  const W = g[0].length
  const H = g.length

  type Route = {
    x: number
    y: number
    dir: 'N' | 'S' | 'E' | 'W',
    dist: 1 | 2 | 3
  }
// dirs are the move to ENTER from that direction
  type Axis = 'H' | 'V'
  type Compass = 'N' | 'S' | 'E' | 'W'

  const DirMap: Record<Compass, [number, number]> = {
    'E': [-1, 0],
    'W': [1, 0],
    'N': [0, 1],
    'S': [0, -1],
  }
  const TurnMap: Record<Compass, [Compass, Compass]> = {
    'E': ['N', 'S'],
    'W': ['N', 'S'],
    'S': ['E', 'W'],
    'N': ['E', 'W'],
  }
  const AxisMap: Record<Compass, Axis> = { N: 'V', S: 'V', E: 'H', W: 'H' }
  const AxisFlip: Record<Axis, Axis> = { H: 'V', V: 'H' }

  const cache: Record<string, number> = {}
  const cacheDependOnBy: Record<string, string[]>={}
  const consider: Record<string, true> = {}

  function costRoute (route: Route) {
    let { x, y } = route

    const move = DirMap[route.dir]
    const cacheCode = `${x},${y}:${AxisMap[route.dir]}` // target square cost
    let cost = cache[cacheCode]
    for (let i = 0; i < route.dist; i++) {
      cost += g[y][x]
      x = x + move[0]
      y = y + move[1]
      if (x < 0 || x >= W) {return}
      if (y < 0 || y >= H) {return}
    }
    // new location
    const newPosCacheCode = `${x},${y}:${AxisFlip[AxisMap[route.dir]]}` // target square cost
    if (cache[newPosCacheCode] === undefined) {
      cache[newPosCacheCode] = cost
      cacheDependOnBy[newPosCacheCode]=[]
      cacheDependOnBy[cacheCode].push(newPosCacheCode)
      // only proceed if we've not done this route before or we've just lowered it
      // work out routes that can get to this spot
      const enterDirs = TurnMap[route.dir]
      consider[`${x},${y},${enterDirs[0]},1`] = true
      consider[`${x},${y},${enterDirs[0]},2`] = true
      consider[`${x},${y},${enterDirs[0]},3`] = true
      consider[`${x},${y},${enterDirs[1]},1`] = true
      consider[`${x},${y},${enterDirs[1]},2`] = true
      consider[`${x},${y},${enterDirs[1]},3`] = true
    } else if (cache[newPosCacheCode] > cost) {
      const savings = cache[newPosCacheCode]-cost
      propagateSavings( newPosCacheCode, savings)
    }
  }

  function propagateSavings(cacheCode:string, savings:number ) {
    console.log({cacheCode,savings})
    cache[cacheCode]-=savings
    cacheDependOnBy[cacheCode].forEach( (codeOfDependent)=>propagateSavings(codeOfDependent,savings) )
  }

  // possible moves

  const x = W - 1
  const y = H - 1
  cache[`${x},${y}:V`] = 0
  cacheDependOnBy[`${x},${y}:V`]=[]
  cache[`${x},${y}:H`] = 0
  cacheDependOnBy[`${x},${y}:H`]=[]
  consider[`${x},${y},E,1`] = true
  consider[`${x},${y},E,2`] = true
  consider[`${x},${y},E,3`] = true
  consider[`${x},${y},S,1`] = true
  consider[`${x},${y},S,2`] = true
  consider[`${x},${y},S,3`] = true
  let i = 0
  while (true) {
    const k = Object.keys(consider)
    if (k.length === 0) { break }
    const c = k[0]
    delete consider[c]
    const [xStr, yStr, dir, distStr] = c.split(',')
    const x = parseInt(xStr)
    const y = parseInt(yStr)
    const dist = parseInt(distStr)
    // @ts-ignore
    const r: Route = { x, y, dir, dist }
    costRoute(r)
    i++
    if (i % 10000 == 0) {
      console.log({ i, left: k.length })
    }
  }
  return Math.min(cache['0,0:H'], cache['0,0:V'])
}

/*

   xxx
   xx
   xxx


 */