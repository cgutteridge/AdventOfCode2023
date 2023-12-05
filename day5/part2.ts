import { XMAS } from './xmas'
import { it } from 'node:test'

const lines = XMAS.getData()

const PART2 = part2(lines)
console.log({ PART2 })

type MapRange = {
  start: number
  end: number
  inc: number
}
type Range = {
  start: number
  end: number
}
type Map = {
  dst: string
  ranges: Array<MapRange>
}
type Almanac = {
  seeds: Array<Range>,
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
      const rangeNumbers = line.replace(/^seeds: /, '').split(/ /).map((s: string) => parseInt(s))
      for (let i = 0; i < rangeNumbers.length; i += 2) {
        a.seeds.push({ start: rangeNumbers[i], end: rangeNumbers[i]+rangeNumbers[i + 1]-1 })
      }
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
    currentMap.ranges.push({ start:srcStart, end: srcStart+length-1, inc: dstStart-srcStart })
  })
  return a
}

function part2 (lines: string[]) {
  const almanac = parse(lines)
  console.log(almanac)
  let thing = 'seed'
  let itemRanges = almanac.seeds
  while (thing !== 'location') {
    const map = almanac.maps[thing]
    thing = map.dst
    // attempt to intersect each range with each map range until it's entirely mapped or not

    const newItemRanges: Range[] = []
    // work through each mapRange, altering newItemRanges & item Ranges

    map.ranges.forEach((mapRange) => {
      // try each current itemRange against this mapRange
      const unmatchedItemRanges: Range[] = []
      itemRanges.forEach((itemRange) => {

        if (mapRange.start <= itemRange.start) {
          if (mapRange.end < itemRange.start) {
            // map is before item, don't map
            unmatchedItemRanges.push(itemRange)
          } else if (mapRange.end >= itemRange.end) {
            // matches the whole range
            newItemRanges.push({
              start: itemRange.start + mapRange.inc,
              end: itemRange.end + mapRange.inc
            })
          } else {
            // matches some of the start
            newItemRanges.push({
              start: itemRange.start + mapRange.inc,
              end: mapRange.end + mapRange.inc
            })
            // keep the tail
            unmatchedItemRanges.push({
              start: mapRange.end + 1,
              end: itemRange.end
            })
          }
        } else {
          // mapping range starts AFTER the item range starts
          if (mapRange.start > itemRange.end) {
            // map is after the item, don't map
            unmatchedItemRanges.push(itemRange)
          } else if (mapRange.end >= itemRange.end) {
            // matches the rump of the item range
            unmatchedItemRanges.push({
              start: itemRange.start,
              end: mapRange.start - 1
            })
            newItemRanges.push({
              start: mapRange.start + mapRange.inc,
              end: itemRange.end + mapRange.inc
            })
          } else {
            // exciting, the range is INSIDE the item so splits it in 3
            unmatchedItemRanges.push({
              start: itemRange.start,
              end: mapRange.start - 1
            })
            newItemRanges.push({
              start: mapRange.start + mapRange.inc,
              end: mapRange.end + mapRange.inc
            })
            unmatchedItemRanges.push({
              start: mapRange.end + 1,
              end: itemRange.end
            })
          }
        }

      })
      itemRanges = unmatchedItemRanges
    })

    itemRanges = newItemRanges.concat(itemRanges)
    console.log(itemRanges)
  }

    return itemRanges.reduce( (acc,item) => {
      if( acc==-1 || item.start<acc) { return item.start }
      return acc
    },-1)


}
