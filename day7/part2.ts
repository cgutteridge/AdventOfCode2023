import { XMAS } from './xmas'

const lines = XMAS.getData()
const PART2 = part2(lines)
console.log({ PART2 })

type Hand = Array<number>
type HandBid = {
  hand: Hand
  type: string
  bid: number
  line: string
}

//32T3K 765
function part2 (lines: string[]) {
  const cardMap: Record<string, number> = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'J': 1,
    'Q': 12,
    'K': 13,
    'A': 14,
  }

  const handScore: Record<string, number> = {
    '11111': 1,
    '2111': 2,
    '221': 3,
    '311': 4,
    '32': 5,
    '41': 6,
    '5': 7
  }

  const handBids: HandBid[] = lines.map((line): HandBid => {
    const [handStr, bidStr] = line.split(/ /)
    const bid = parseInt(bidStr)
    const cardStrs = handStr.split('')
    const hand = cardStrs.map(c => cardMap[c])
    const cardCounts: Record<number, number> = {}
    Object.keys(cardMap).forEach((n) => cardCounts[cardMap[n]] = 0)
    hand.forEach((card) => {
      cardCounts[card]++
    })
    const jokers = cardCounts[1]
    cardCounts[1] = 0
    const type1 = Object.values(cardCounts).sort((a, b) => b - a)
    type1[0] += jokers
    const type = type1.map(x => x ? `${x}` : '').join('')
    return { bid, type, hand,line }
  })

  // not 253423744
  // not 247576756 (reversed, oops)
  // not 249930061
  const sortedHandBids: HandBid[] = handBids.sort((a, b) => {
    if (handScore[a.type] !== handScore[b.type]) {return handScore[a.type] - handScore[b.type]}
    if (a.hand[0] != b.hand[0]) {return a.hand[0] - b.hand[0]}
    if (a.hand[1] != b.hand[1]) {return a.hand[1] - b.hand[1]}
    if (a.hand[2] != b.hand[2]) {return a.hand[2] - b.hand[2]}
    if (a.hand[3] != b.hand[3]) {return a.hand[3] - b.hand[3]}
    if (a.hand[4] != b.hand[4]) {return a.hand[4] - b.hand[4]}
    return 0
  })
  //console.log(sortedHandBids.reverse())

  let score = 0
  for (let i = 0; i < sortedHandBids.length; i++) {
    console.log(`${sortedHandBids[i].type} .. ${sortedHandBids[i].line}`)
    score += (i + 1) * sortedHandBids[i].bid
  }
  return score
}
