import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
/*
const PART2 = part2(lines)
console.log({ PART2 })
 */
// 7322 too high
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

function part1 (lines: string[]) {
  const rows = parse(lines)
  return rows.reduce((acc, row): number => {
    return acc + scoreRow(row)
  }, 0)
}

function scoreRow (row: Row): number {
  const rowScore = rowOpts(row.a + '.', row.v,0)
  console.log({rowScore})
  console.log()
  return rowScore
}

function rowOpts (map: string, blocks: number[],depth:number): number {
  // make sure to copy arrays so we can mess with them

  const [head, ...tail] = blocks


  // find all the locations that match the head AND have no # to the left of the start of the head
  const blockRE = new RegExp('[#\?]'.repeat(head) + '[.\?]')
  const possibleHeadLocations:number[] = []
  const c  = []
  for (let i = 0; i <= map.length - head - 1; i++) {
    c.push(i)
    const ss = map.substring(i, i + head+1)
    if (ss.match(blockRE)) {
      possibleHeadLocations.push(i)
    }
    if( map[i]=='#') { break }
  }

  //process.stdout.write( '  '.repeat(depth)) console.log({ map, head, tail,p:possibleHeadLocations})

  // if we have no tail then the possible head locations are our score // unless the tail has # in
  if (tail.length === 0 ) {
    let score = 0
    possibleHeadLocations.map( (possibleLocation)=>{
      const remainder = map.substring(possibleLocation+head+1)
      if( !remainder.match(/#/ )){
        score++
      }
    })
    return score
  }

  return possibleHeadLocations.reduce((acc,possibleLocation):number=>{
    return acc+rowOpts( map.substring(possibleLocation+head+1), tail,depth+1)
  },0)
}
