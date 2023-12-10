import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
//const PART2 = part2(lines)
//console.log({ PART2 })

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

function part2 (lines: string[]) {
  const { moves, nodes } = parse(lines)
  console.log(nodes)
  return 23
}
