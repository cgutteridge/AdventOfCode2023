import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = doThing(lines, 1, 3)
console.log({ PART1 })

const PART2 = doThing(lines, 4, 10)
console.log({ PART2 })

function parse (lines: string[]): number[][] {
  return lines.map((line) => line.split('').map(x => parseInt(x)))
}

function doThing (lines: string[], min: number, max: number) {
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
  const CompassAxisMap: Record<Compass, Axis> = { N: 'V', S: 'V', E: 'H', W: 'H' }
  const AxisCompassMap: Record<Axis, Compass[]> = { 'H': ['W', 'E'], 'V': ['N', 'S'] }
  const AxisFlip: Record<Axis, Axis> = { H: 'V', V: 'H' }
  const AxisList: Axis[] = ['H', 'V']

  const bestScore: Record<string, number> = {}
  const cacheDependOnBy: Record<string, string[]> = {}

  function propagateSavings (cacheCode: string, savings: number) {
    console.log({ cacheCode, savings })
    bestScore[cacheCode] -= savings
    cacheDependOnBy[cacheCode].forEach((codeOfDependent) => propagateSavings(codeOfDependent, savings))
  }

  function costMove (x: number, y: number, dist: number, dir: Compass): number | undefined {
    const [xd, yd] = DirMap[dir]
    let cost = 0
    for (let j = 0; j < dist; j++) {
      cost += g[y][x]
      x = x + xd
      y = y + yd
      if (x < 0 || x >= W) {return}
      if (y < 0 || y >= H) {return}
    }
    return cost
  }

  // possible moves into a square
  type PosMove = {
    x: number,
    y: number,
    dist: number,
    dir: Compass,
    cost: number
  }

  const moves: Record<string, PosMove[]> = {}
  // calculate all the moves into a square and their costs
  for (let yi = 0; yi < H; ++yi) {
    for (let xi = 0; xi < W; ++xi) {
      const posMoves = []
      AxisList.forEach((axis) => {
        const dirs = AxisCompassMap[axis]
        moves[`${xi},${yi},${axis}`] = []
        dirs.forEach((dir: Compass) => {
          for (let dist = min; dist <= max; dist++) {
            const cost = costMove(xi, yi, dist, dir)
            if (cost !== undefined) {
              const [xd, yd] = DirMap[dir]
              moves[`${xi},${yi},${axis}`].push({ x: xi + xd * dist, y: yi + yd * dist, dist, dir, cost })
            }
          }
        })
      })
    }
  }
  //console.log(moves['12,12,H'])
  //console.log(moves['12,12,V'])

  const scoresToSet: Array<[string, number]> = [
    [`${W - 1},${H - 1},H`, 0],
    [`${W - 1},${H - 1},V`, 0]
  ]
  let i = 0
  while (true) {

    const k = Object.keys(scoresToSet)
    if (k.length === 0) { break }

    const currentBest = Math.min(bestScore['0,0,H'], bestScore['0,0,V'])

    i++
    if (i % 10000 == 0) {
      //console.log({ i, left: k.length, currentBest })
    }

    const todo: [string, number] = scoresToSet.pop() ?? ['', -1]
    const [code, newScore] = todo
    if (newScore >= currentBest) {
      continue
    }

    if (bestScore[code] !== undefined && bestScore[code] <= newScore) {
      // not interesting
      continue
    }
    bestScore[code] = newScore
    const [xStr, yStr, axis] = code.split(',')
    const x = parseInt(xStr)
    const y = parseInt(yStr)

    // don't propagate past the start
    if (x == 0 && y == 0) {
      continue
    }

    // consider the routes out
    const posMoves = moves[code]

    posMoves.forEach((posMove) => {
      const newCode = `${posMove.x},${posMove.y},${AxisFlip[<Axis>axis]}`
      const moveScore = newScore + posMove.cost
      // if we've already got a better score for that spot and heading, skip this
      if (bestScore[newCode] !== undefined && bestScore[newCode] < moveScore) {return}

      scoresToSet.push([newCode, moveScore])
      if (i % 10000 == 0) {
        //console.log({ newCode, moveScore })
      }
    })
  }

  /*
  const x = W - 1
  const y = H - 1
  bestScore[`${x},${y}:V`] = 0
  cacheDependOnBy[`${x},${y}:V`] = []
  bestScore[`${x},${y}:H`] = 0
  cacheDependOnBy[`${x},${y}:H`] = []
  consider[`${x},${y},E,1`] = true
  consider[`${x},${y},E,2`] = true
  consider[`${x},${y},E,3`] = true
  consider[`${x},${y},S,1`] = true
  consider[`${x},${y},S,2`] = true
  consider[`${x},${y},S,3`] = true
  let i = 0
  while (true) {

    // @ts-ignore
    const r: Route = { x, y, dir, dist }
    costRoute(r)

  }

   */
  return Math.min(bestScore['0,0,H'], bestScore['0,0,V'])
}

/*

   xxx
   xx
   xxx


 */