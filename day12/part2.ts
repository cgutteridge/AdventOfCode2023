import { XMAS } from './xmas'

const lines = XMAS.getData()
let z = 0
let cache: Record<string, number> = {}
const CACHE_LEN = 1000

const PART2 = part2(lines)
console.log({ PART2 })

type Row = {
  a: string
  v: number[]
}

function parse (lines: string[]): Row[] {
  return lines.map((line): Row => {
    const [a, vStr] = line.split(' ')
    const v = vStr.split(',').map(x => parseInt(x))
    return { a, v }
  })
}

function part2 (lines: string[]) {
  const rows = parse(lines)
  return rows.reduce((acc, row, currentIndex): number => {
    console.log({ currentIndex })
    return acc + scoreRow(row)
  }, 0)
}

function scoreRow (row: Row): number {
  const newV = row.v.concat(row.v).concat(row.v).concat(row.v).concat(row.v)
  const newMap = `${row.a}?${row.a}?${row.a}?${row.a}?${row.a}`
  z = 0
  const rowScore = rowOpts(newMap + '.', newV, 0, '')
  console.log({ newMap, newV, rowScore })
  console.log()
  return rowScore
}

function rowOpts (map: string, blocks: number[], depth: number, path: string): number {
  // make sure to copy arrays so we can mess with them

  let cacheCode: string = ''
  if (map.length <= CACHE_LEN) {
    cacheCode = map + ':' + blocks.join(',')
    if (cache[cacheCode] !== undefined) {
      return cache[cacheCode]
    }
  }

  const [head, ...tail] = blocks

  z++
  if (z % 1000000 === 0) { console.log(path)}

  // find all the locations that match the head AND have no # to the left of the start of the head
  const blockRE = new RegExp('[#\?]'.repeat(head) + '[.\?]')
  const possibleHeadLocations: number[] = []
  const c = []
  for (let i = 0; i <= map.length - head - 1; i++) {
    c.push(i)
    const ss = map.substring(i, i + head + 1)
    if (ss.match(blockRE)) {
      possibleHeadLocations.push(i)
    }
    if (map[i] == '#') { break }
  }

  //process.stdout.write( '  '.repeat(depth)) console.log({ map, head, tail,p:possibleHeadLocations})

  // if we have no tail then the possible head locations are our score // unless the tail has # in
  if (tail.length === 0) {
    let score = 0
    possibleHeadLocations.map((possibleLocation) => {
      const remainder = map.substring(possibleLocation + head + 1)
      if (!remainder.match(/#/)) {
        score++
      }
    })
    return score
  }

  // needed space
  const neededHashes = tail.reduce((acc, n) => acc + n, 0)
  const neededSpace = neededHashes + tail.length

  const score = possibleHeadLocations.reduce((acc, possibleLocation, currentIndex): number => {
    // trim some impossible paths
    const newMap = map.substring(possibleLocation + head + 1)
    if (newMap.length < neededSpace) {
      //console.log( "SPACE!! "+tail.length)
      return acc
    }
    // hashCount
    const possibleHashCount = newMap.split('').reduce((a, c) => c === '.' ? a : a + 1, 0)
    if (possibleHashCount < neededHashes) {
      //console.log( "HASHCOUNT!! "+tail.length)
      return acc
    }

    return acc + rowOpts(newMap, tail, depth + 1, path + ` ${currentIndex}/${possibleHeadLocations.length}`)
  }, 0)

  if (map.length <= CACHE_LEN) {
    cache[cacheCode] = score
  }

  return score
}
