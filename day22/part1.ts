import { getData } from './xmas'
import { mod } from './mod'

const lines = getData()

const PART1 = part1(lines)
console.log({ PART1 })

type Loc = [number, number, number]
type Brick = {
  id: number
  from: Loc
  to: Loc
}
type Space = Record<string, number>

// 1,1,8~1,1,9
function parse (lines: string[]): Brick[] {
  return lines.map((line, id): Brick => {
    const [fromStr, toStr] = line.split('~')
    const from = <Loc>fromStr.split(',').map(x => parseInt(x))
    const to = <Loc>toStr.split(',').map(x => parseInt(x))
    return { from, to, id }
  })
}

function part1 (lines: string[]) {
  const bricks: Brick[] = parse(lines)
  const bricksFinal: Brick[] = []
  const space: Space = {}

  // check assumptions
  bricks.forEach((brick) => {
    if( brick.from[0]>brick.to[0]
      || brick.from[1]>brick.to[1]
      || brick.from[2]>brick.to[2] ) {
      console.log(brick)
      process.exit()
    }
  })

      // move bricks down
  // to pos always greater than from
  // drop bricks starting with the ones with a lowest from.z
  bricks.sort((brickA, brickB) => brickA.from[2] - brickB.from[2]).forEach((brick, i) => {
    // footprint is the x,y range
//    console.log(brick)
   // console.log(brick)

    while (isClearBelow(space, brick)) {
      brick.from[2]--
      brick.to[2]--
    }
    //console.log({ brick })
    drawBrick(space, brick)
    console.log(brick)
    renderSpace(space, 9, 9, 10)
    //console.log(space)
  })

  type StackInfo = {
    supportedBy: number[]
    supports: number[]
  }
  const stack: StackInfo[] = []
  // count supports per brick
  bricks.forEach((brick) => {
    const supportedBy: number[] = []
    const supports: number[] = []
    for (let y = brick.from[1]; y <= brick.to[1]; y++) {
      for (let x = brick.from[0]; x <= brick.to[0]; x++) {

        const v = space[`${x},${y},${brick.to[2] + 1}`]
        if (v !== undefined && !supports.includes(v)) {
          supports.push(v)
        }

        const v2 = space[`${x},${y},${brick.from[2] - 1}`]
        if (v2 !== undefined && !supportedBy.includes(v2)) {
          supportedBy.push(v2)
        }
      }
    }
    stack[brick.id]={ supports, supportedBy, }

  })

  const part1 = bricks.filter((brick: Brick): boolean => {
    let ok = true
    stack[brick.id].supports.forEach((brickOnTopId) => {
      if (stack[brickOnTopId].supportedBy.length === 1) {
        ok = false
      }
    })
    return ok
  }).length
  console.log( bricks.length)
  console.log('-')
  console.log(score)
  // dissolve unless any of the bricks we support only have a single support
console.log({ part1 })


}

function renderSpace (space: Space, xm: number, ym: number, zm: number) {
  for (let z = zm; z > 0; z--) {
    for (let y = 0; y <= ym; y++) {
      for (let x = 0; x <= xm; x++) {

        const id = space[`${x},${y},${z}`]
        if (id === undefined) {
          process.stdout.write('.')
        } else {
          process.stdout.write(String.fromCharCode(65 + mod(id, 60)))
        }
      }
      process.stdout.write(' ')
    }
    process.stdout.write('\n')
  }
}

function drawBrick (space: Space, brick: Brick): void {
  for (let z = brick.from[2]; z <= brick.to[2]; z++) {
    for (let y = brick.from[1]; y <= brick.to[1]; y++) {
      for (let x = brick.from[0]; x <= brick.to[0]; x++) {
        space[`${x},${y},${z}`] = brick.id
      }
    }
  }
}

function isClearBelow (space: Space, brick: Brick): boolean {
  if (brick.from[2] === 1) { return false }
  for (let y = brick.from[1]; y <= brick.to[1]; y++) {
    for (let x = brick.from[0]; x <= brick.to[0]; x++) {
      if (space[`${x},${y},${brick.from[2] - 1}`] !== undefined) {
        return false
      }
    }
  }
  return true
}

// 464 too low
// not 465 or 466