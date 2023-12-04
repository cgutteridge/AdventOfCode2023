import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

function lineWins (line: string): number {
  const [, dataStr] = line.split(/: /)
  const [winStr, myStr] = dataStr.split(/ \| /)
  const winNums = winStr.trim().split(/\s+/).map(nStr => parseInt(nStr.trim()))
  const myNums = myStr.trim().split(/\s+/).map(nStr => parseInt(nStr.trim()))
  return myNums.reduce((acc, num) => {
    return acc + (winNums.includes(num) ? 1 : 0)
  }, 0)
}

function part1 (lines: string[]) {
  // Card 164: 60 40 94 62 18 71 92 25 21 64 | 64 18 58 76 38 55 40 45 71 92 73 75 25 62 12 94 68 79 23 91 21 60 72 39  7
  return lines.reduce((acc, line) => {
    const wins = lineWins(line)
    if (wins === 0) {
      return acc
    }
    return acc + Math.pow(2, wins - 1)
  }, 0)
}

function part2 (lines: string[]) {
  // Card 164: 60 40 94 62 18 71 92 25 21 64 | 64 18 58 76 38 55 40 45 71 92 73 75 25 62 12 94 68 79 23 91 21 60 72 39  7

  const wins = lines.map((line) => lineWins(line))
  const cards = wins.map((x) => 1)

  for (let i = 0; i < wins.length; ++i) {
    if (wins[i] > 0) {
      for (let j = i + 1; j <= i + wins[i] && j < cards.length; j++) {
        cards[j] += cards[i]
      }
    }
  }
  return cards.reduce((acc, cardCount) => acc + cardCount, 0)
}
