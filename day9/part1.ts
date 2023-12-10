import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

/*
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
 */
function parse (lines: string[]): number[][] {
  return lines.map((line: string): number[] => line.split(/ /).map((x: string): number => parseInt(x)))
}

function part1 (lines: string[]) {
  const g = parse(lines)
  return g.reduce( (acc:number, row:number[]):number=>{
    const gaps :number [][] = [row]
    let done = false
    while( !done ) {
      const nextRow: number[] = []
      for (let i = 0; i < gaps[gaps.length-1].length - 1; i++) {
        nextRow.push(gaps[gaps.length-1][i+1] - gaps[gaps.length-1][i])
      }
      gaps.push(nextRow)
      done = ! nextRow.some( (x:number):boolean=>x!=0)
    }

    // add up the last item in each row
    const v = gaps.reduce( (acc:number,gapRow:number[]):number=>{return acc+gapRow[gapRow.length-1]},0)
    return acc+v
  },0)
}


function part2 (lines: string[]) {
  const g = parse(lines)
  return g.reduce( (acc:number, row:number[]):number=>{
    const gaps :number [][] = [row]
    let done = false
    while( !done ) {
      const nextRow: number[] = []
      for (let i = 0; i < gaps[gaps.length-1].length - 1; i++) {
        nextRow.push(gaps[gaps.length-1][i+1] - gaps[gaps.length-1][i])
      }
      gaps.push(nextRow)
      done = ! nextRow.some( (x:number):boolean=>x!=0)
    }

    // add up the last item in each row
    gaps.reverse()
    const v = gaps.reduce( (acc:number,gapRow:number[]):number=>{return -acc+gapRow[0]},0)
    return acc+v
  },0)
}
