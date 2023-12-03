import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

// col numbers are the min known to be in the bag that game
type Game = {
  id: number,
  cols: Record<string, number>
}

function part2 (lines: string[]): number {
  return lines.reduce((acc: number, line: string) => {
    const game: Game = processLine(line)
    return acc + game.cols.blue * game.cols.red * game.cols.green
  }, 0)
}

function part1 (lines: string[]): number {
  //Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  const games: Array<Game> = lines.map(processLine)
  const inScope = games.filter((game) => {
    if (game.cols.red > 12) { return false }
    if (game.cols.green > 13) { return false }
    if (game.cols.blue > 14) { return false }
    return true
  })
  return inScope.reduce((acc: number, game) => {
      return acc + game.id
    }, 0
  )
}

function processLine (line: string): Game {
  const [gameStr, roundsStr] = line.split(/: /)
  const [, gameNum] = gameStr.split(/ /)
  const id = parseInt(gameNum)
  const game: Game = { id: id, cols: { green: 0, red: 0, blue: 0 } }
  const roundStrs = roundsStr.split(/; /)
  roundStrs.forEach((roundStr) => {
    roundStr.split(/, /).forEach((colNStr) => {
      const [nStr, col] = colNStr.split(/ /)
      const n = parseInt(nStr)
      if (game.cols[col] < n) {
        game.cols[col] = n
      }
    })
  })
  return game
}