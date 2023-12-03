import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

type NumInfo = { offset: number, value: number, length: number }

function part1 (lines: string[]) {
  return lines.reduce((acc, line, lineIndex) => {
    let score = 0
    const nums: NumInfo[] = []
    let i = 0
    while (i < line.length) {
      const c = line.substring(i, i + 1)
      if (!c.match(/^[0-9]$/)) {
        i++
        continue
      }
      // ok it's a number, let's see how long
      let numString = c
      let numInfo: NumInfo = { offset: i, value: 0, length: 1 }
      i++
      while (i < line.length && line.substring(i, i + 1).match(/^[0-9]$/)) {
        numString += line.substring(i, i + 1)
        numInfo.length++
        i++
      }
      numInfo.value = parseInt(numString)
      nums.push(numInfo)
    }

    // filter out ones without a symbol
    const filteredNums = nums.filter((numInfo) => {
      // return true if it's next to a symbol. So all lines above and below and left and right
      const from = Math.max(0, numInfo.offset - 1)
      const to = Math.min(numInfo.offset + numInfo.length + 1, line.length)
      // above
      if (lineIndex - 1 > 0) {
        for (let i = from; i < to; i++) {
          const c = lines[lineIndex - 1].substring(i, i + 1)
          if (c.match(/^[^0-9\.]$/)) {
            return true
          }
        }
      }
      // below
      if (lineIndex + 1 < lines.length - 1) {
        for (let i = from; i < to; i++) {
          const c = lines[lineIndex + 1].substring(i, i + 1)
          if (c.match(/^[^0-9\.]$/)) {
            return true
          }

        }
      }
      // left

      if (numInfo.offset > 0) {
        const leftC = line.substring(numInfo.offset - 1, numInfo.offset)
        if (leftC.match(/^[^0-9\.]$/)) {
          return true
        }
      }
      // right
      if (numInfo.offset < line.length - 1) {
        const rightC = line.substring(numInfo.offset + numInfo.length, numInfo.offset + numInfo.length + 1)
        if (rightC.match(/^[^0-9\.]$/)) {
          return true
        }
      }
      return false
    })

    filteredNums.forEach((numInfo) => {
      acc += numInfo.value
    })
    return acc
  }, 0)
}

function part2 (lines: string[]) {
  const cogs: Record<string, number[]> = {}
  lines.forEach((line, lineIndex) => {
    const nums: NumInfo[] = []
    let i = 0
    while (i < line.length) {
      const c = line.substring(i, i + 1)
      if (!c.match(/^[0-9]$/)) {
        i++
        continue
      }
      // ok it's a number, let's see how long
      let numString = c
      let numInfo: NumInfo = { offset: i, value: 0, length: 1 }
      i++
      while (i < line.length && line.substring(i, i + 1).match(/^[0-9]$/)) {
        numString += line.substring(i, i + 1)
        numInfo.length++
        i++
      }
      numInfo.value = parseInt(numString)

      const cog = findCog(numInfo, line, lineIndex, lines)
      if (cog !== undefined) {
        const cogId = `${cog[0]},${cog[1]}`
        if (!cogs[cogId]) { cogs[cogId] = []}
        cogs[cogId].push(numInfo.value)
      }
    }
  })
  let n = 0
  Object.keys(cogs).forEach((cogId) => {
    if (cogs[cogId].length == 2) {
      n += cogs[cogId][0] * cogs[cogId][1]
    }
  })
  return n
}

function findCog (numInfo: NumInfo, line: string, lineIndex: number, lines: string[]): number[] | undefined {
// find the symbol, if any
// return true if it's next to a symbol. So all lines above and below and left and right
  const from = Math.max(0, numInfo.offset - 1)
  const to = Math.min(numInfo.offset + numInfo.length + 1, line.length)
// above
  if (lineIndex - 1 > 0) {
    for (let i = from; i < to; i++) {
      const c = lines[lineIndex - 1].substring(i, i + 1)
      if (c === '*') { return [lineIndex - 1, i] }
    }
  }
// below
  if (lineIndex + 1 < lines.length - 1) {
    for (let i = from; i < to; i++) {
      const c = lines[lineIndex + 1].substring(i, i + 1)
      if (c === '*') { return [lineIndex + 1, i] }
    }
  }
// left

  if (numInfo.offset > 0) {
    const leftC = line.substring(numInfo.offset - 1, numInfo.offset)
    if (leftC === '*') { return [lineIndex, numInfo.offset - 1] }
  }
// right
  if (numInfo.offset < line.length - 1) {
    const rightC = line.substring(numInfo.offset + numInfo.length, numInfo.offset + numInfo.length + 1)
    if (rightC === '*') { return [lineIndex, numInfo.offset + numInfo.length] }
  }
  return undefined
}
