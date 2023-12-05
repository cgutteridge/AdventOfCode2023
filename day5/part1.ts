import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
//const PART2 = part2(lines)
//console.log({ PART2 })

type Range = {
  srcStart: number
  dstStart: number
  length: number
}
type Map = {
  dst: string
  ranges: Array<Range>
}
type Almanac = {
  seeds: Array<number>,
  maps: Record<string, Map>
}

/*
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

 */
function parse (lines: string[]): Almanac {
  const a: Almanac = {
    seeds: [],
    maps: {}
  }
  let currentMap: undefined | Map
  let currentSrc: undefined | string
  lines.forEach((line) => {
    if (line.match(/^seeds: /)) {
      a.seeds = line.replace(/^seeds: /, '').split(/ /).map((s: string) => parseInt(s))
      return
    }
    if (line.trim() === '') {
      return
    }
    if (line.match(/ map:/)) {
      const [src, dst] = line.replace(/ map:/, '').split(/-to-/)
      currentMap = { dst: dst, ranges: [] }
      a.maps[src] = currentMap
      return
    }
    const [dstStart, srcStart, length] = line.split(/ /).map((s: string) => parseInt(s))
    if (!currentMap) {
      throw new Error('numbers without map init')
    }
    currentMap.ranges.push({ srcStart, dstStart, length })
  })
  return a
}

function part1 (lines: string[]) {
  const almanac = parse(lines)
  let thing = 'seed'
  let items = almanac.seeds
  while (thing !== 'location') {
    const map = almanac.maps[thing]
    const newItems: number[] = items.map((item) => {
      // see if the item is in any of the ranges
      let newItem: number | undefined
      map.ranges.forEach((range) => {
        if (item >= range.srcStart && item < range.srcStart + range.length) {
          newItem = item - range.srcStart + range.dstStart
        }
      })
      if (newItem === undefined) {
        newItem = item
      }
      return newItem
    })
    items = newItems
    thing = map.dst
  }

  return items.reduce( (acc,item) => {
    if( acc==-1 || item<acc) { return item }
    return acc
  },-1)

}

function part2 (lines: string[]) {

  return 242
}
