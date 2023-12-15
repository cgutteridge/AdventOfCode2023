import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })
const PART2 = part2(lines)
console.log({ PART2 })

function hash (str: string): number {
  return str.split('').map(x => x.charCodeAt(0)).reduce(
    (acc, code) => ((acc + code) * 17) % 256, 0
  )
}

function part1 (lines: string[]) {
  return lines[0].split(',').reduce((acc, str) => acc + hash(str), 0)
}

type Lens = {
  label: string,
  fl: number
}

function part2 (lines: string[]) {
  const steps = lines[0].split(',')
  const boxes: Lens[][] = []
  for (let i = 0; i < 256; i++) { boxes[i] = [] }

  steps.forEach((step: string) => {
    const [label, flStr] = step.split(/[=-]/)
    const n: number = hash(label)
    const op: string = step[label.length]
    if (op === '-') {
      boxes[n] = boxes[n].filter((l) => l.label !== label)
    } else {
      // op==='='
      const fl = parseInt(flStr)
      let found = false
      for (let i = 0; i < boxes[n].length; i++) {
        if (boxes[n][i].label === label) {
          boxes[n][i].fl = fl
          found = true
          break
        }
      }
      if (!found) {
        boxes[n].push({ label, fl })
      }
    }
  })
  return boxes.reduce((boxAcc, box, boxN) =>
      boxAcc + box.reduce(
        (lensAcc, lens, lensN) => lensAcc + (boxN + 1) * (lensN + 1) * lens.fl
        , 0)
    , 0)
}
