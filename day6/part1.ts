import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

type Race = {
  time: number
  dist: number
}

function parse (lines: string[]): Race[] {
  const rv: Race[] = []
  const times: number[] = lines[0].split(/ +/).map(x => parseInt(x))
  const dists: number[] = lines[1].split(/ +/).map(x => parseInt(x))
  for (let i = 1; i < times.length; ++i) {
    rv.push({ time: times[i], dist: dists[i] })
  }
  return rv
}

function raceN (race: Race) {
  let n = 0
  // number of ms we beat the race distance in the time
  // (raceTime-buttonTime)*buttonTime>highScore
  // raceTime*buttonTime  - buttonTime² > highScore
  // -buttonTime² + raceTime*buttonTime - highScore > 0
  // find intersects where buttonTime makes the score > 0
  // a = -1, b=raceTime, c=-highScore
  // (-b+-√(b²-4ac)) / 2a
  // (-raceTime+-√(raceTime²-4*-1*-highScore))/2*-1
  // (-raceTime+-√(raceTime²-4*highScore))/-2)
  const i1 = (race.time + Math.sqrt(race.time * race.time - 4 * race.dist)) / 2
  const i2 = (race.time - Math.sqrt(race.time * race.time - 4 * race.dist)) / 2
  const ordered = [i1, i2].sort((a, b) => a - b)
  // actually winning values are a quanta more than the start and before the end
  const start = Math.ceil(ordered[0] + 0.000000001)
  const end = Math.floor(ordered[1] - 0.000000001)
  return end - start + 1
}

function part1 (lines: string[]) {
  const races = parse(lines)
  return races.reduce((acc: number, race: Race) => {
    return acc * raceN(race)
  }, 1)
}

function parse2 (lines: string[]): Race {
  const time: number = parseInt(lines[0].replace(/.*:/, '').replace(/ /g, ''))
  const dist: number = parseInt(lines[1].replace(/.*:/, '').replace(/ /g, ''))
  return { time, dist }
}

function part2 (lines: string[]) {
  const race = parse2(lines)
  return raceN(race)
}
