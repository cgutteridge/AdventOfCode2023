import {XMAS} from "./xmas";

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({PART1})

const PART2 = part2(lines)
console.log({PART2})

function part1(lines:string[]):number {
    return lines.reduce(
        (accumulator: number, line: string, currentIndex, array) => {
            const numbersOnly = line.replace(/[^0-9]/g, '')
            const l = numbersOnly.length
            const numText = numbersOnly.substring(0, 1) + numbersOnly.substring(l - 1, l)
            const n = parseInt(numText)
            return accumulator + n
        },
        0
    )
}

function part2(lines: string[]): number {

    const numMap: Array<Array<string>> = [
        [],
        ['one', '1'],
        ['two', '2'],
        ['three', '3'],
        ['four', '4'],
        ['five', '5'],
        ['six', '6'],
        ['seven', '7'],
        ['eight', '8'],
        ['nine', '9'],
    ]

    // returns the number at the start of the string or undefined
    function startsWithNumber(text: string): number | undefined {
        let v
        numMap.forEach((values, i) => {
            values.forEach((value) => {
                if (text.startsWith(value)) {
                    v = i
                }
            })
        })
        return v
    }

    return lines.reduce(
        (accumulator: number, line: string, currentIndex, array) => {
            // first number
            let firstNumber: number | undefined
            for (let index = 0; firstNumber === undefined; index++) {
                firstNumber = startsWithNumber(line.substring(index))
            }
            let lastNumber: number | undefined
            for (let index = line.length-1; lastNumber === undefined; index--) {
                lastNumber = startsWithNumber(line.substring(index))
            }
            return accumulator + firstNumber * 10 + lastNumber
        },
        0
    )
}


