import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART2 = part2(lines)
console.log({ PART2 })

//RL
//
//AAA = (BBB, CCC)
function parse (lines: string[]) {
  const moves: string[] = lines[0].split('')
  const nodes: Record<string, [string, string]> = {}
  lines.shift()
  lines.shift()
  lines.forEach((line) => {
    const [id, left, right] = line.replace(/[^0-9A-Z ]/g, '').split(/ +/)
    nodes[id] = [left, right]
  })
  return { moves, nodes }
}

/*
function part1 (lines: string[]) {

  const { moves, nodes } = parse(lines)

  let pos: string = 'AAA'
  let move_i: number = 0
  let score: number = 0
  while (pos != 'ZZZ') {
    if (moves[move_i % moves.length] == 'L') {
      pos = nodes[pos][0]
    } else {
      pos = nodes[pos][1]
    }
    move_i++
    score++
  }
  return score
}

 */

function part2 (lines: string[]) {
  const { moves, nodes } = parse(lines)
  // find all the start points
  let pos: string[] = []
  let move_i: number = 0
  pos = Object.keys(nodes).filter((node) => node[2] == 'A')
  let done: boolean = false
  let loops: Record<string, number> = {}
  while (Object.keys(loops).length < pos.length) {
    done = true
    for (let j = 0; j < pos.length; j++) {
      if (moves[move_i % moves.length] == 'L') {
        pos[j] = nodes[pos[j]][0]
      } else {
        pos[j] = nodes[pos[j]][1]
      }
      if (pos[j][2] == 'Z' && loops[j] === undefined) {
        loops[j] = move_i + 1
        //console.log( j,' on move',move_i+1)
      }
    }
    move_i++
  }

  // find prime parts
  const factors: Record<string, number>[] = Object.values(loops).map((loop: number): Record<string, number> => {
    // find factors
    const rv: Record<string, number> = {}
    let n = loop
    console.log( 'factorising ',loop)
    for (let factor = 2; factor <= Math.sqrt(loop) ; factor++) {
      let factorCount = 0
      while (n % factor == 0) {
        factorCount++
        n = n / factor
        console.log(n,factor)
      }
      if (factorCount > 0) {
        rv[factor] = factorCount
      }
    }
    console.log(n)
    return rv
  })
  console.log(loops, factors)
  return Object.values(loops).reduce((acc, v) => {return acc * v}, 1)
}
