import { XMAS } from './xmas'

const lines = XMAS.getData()

const PART1 = part1(lines)
console.log({ PART1 })

const PART2 = part2(lines)
console.log({ PART2 })

type Thing = Record<string, number>
type Workflow = Rule[]
type Rule = {
  factor: string
  test: string
  value: number
  target: string
}
// rlp{s<657:R,a<2605:A,a>2875:A,A}
// {x=512,m=42,a=300,s=1166}
function parse (lines: string[]) {
  const workflows: Record<string, Workflow> = {}
  const things: Thing[] = []
  let i = 0
  while (lines[i] != '') {
    const [workflowId, rulesStr,] = lines[i].split(/[{}]/)
    workflows[workflowId] = rulesStr.split(/,/).map((ruleStr): Rule => {
      if (ruleStr.match(/:/)) {
        const [factor, valueStr, target] = ruleStr.split(/[<>:]/)
        const value = parseInt(valueStr)
        const test = ruleStr[1]
        return { factor, test, value, target }
      }
      return { factor: '', test: '.', value: 0, target: ruleStr }
    })
    i++
  }
  i++
  while (i < lines.length) {
    const thing: Thing = {}
    lines[i].replace(/[}{]/, '').split(/,/).forEach((kv) => {
      const [k, v] = kv.split(/=/)
      thing[k] = parseInt(v)
    })
    things.push(thing)
    i++
  }
  return { workflows, things }
}

function part1 (lines: string[]) {
  const { workflows, things } = parse(lines)
  optimise(workflows)
  const score = things.reduce((acc, thing) => {
    const result = process(workflows, thing)
    // apply the thing to the workflows
    if (result === 'A') {
      return acc + thing['x'] + thing['m'] + thing['a'] + thing['s']
    }
    return acc
  }, 0)
  return score
}

// 5199 low
function process (workflows: Record<string, Workflow>, thing: Thing) {
  let id = 'in'
  while (id != 'R' && id != 'A') {
    // apply workflow
    const workflow = workflows[id]
    for (let i = 0; i < workflow.length; i++) {
      const rule: Rule = workflow[i]
      if (rule.test === '.'
        || rule.test === '<' && thing[rule.factor] < rule.value
        || rule.test === '>' && thing[rule.factor] > rule.value) {
        id = rule.target
        break
      }
    }
  }
  return id
}

type ThingRange = Record<string, { min: number, max: number }>

function part2 (lines: string[]) {
  const { workflows, } = parse(lines)
  optimise(workflows)
  //console.log(workflows)
  const max = 4000
  const starterThing: ThingRange = {
    x: { min: 1, max: max },
    m: { min: 1, max: max },
    a: { min: 1, max: max },
    s: { min: 1, max: max }
  }
  return combinations(workflows, 'in', starterThing)
}

function optimise (workflows: Record<string, Workflow>) {
  let changed = true
  while (changed) {
    //  console.log('squish:',workflows)

    changed = false
    // first squish anything that ends ? <> X , X   as the test is pointless
    Object.keys(workflows).forEach((loc: string) => {
      const workflow = workflows[loc]
      if (workflow.length >= 2 && workflow[workflow.length - 2].target === workflow[workflow.length - 1].target) {
        workflow.splice(workflow.length - 2, 1)
        changed = true
      }
    })
    // console.log('collapse:',workflows)

    // now find any single item workflows and collapse them
    Object.keys(workflows).forEach((loc: string) => {
      const workflow = workflows[loc]
      if (workflow.length === 1) {
        // loop over all the other workflows substitution this with it's own target
        Object.keys(workflows).forEach((loc2) => {
          workflows[loc2].forEach((rule) => {
            if (rule.target === loc) {
              rule.target = workflow[0].target
            }
          })
        })
        delete workflows[loc]
        changed = true
      }
    })

    // now sub rules used at the end of a sequence...
    // and if that's their only use, remove them after
    //  console.log('sub ends:',workflows)

    Object.keys(workflows).forEach((loc: string) => {
      const workflow = workflows[loc]
      // see if this is ONLY used at the end
      let onlyEnds = true
      Object.keys(workflows).forEach((loc2: string) => {
        const workflow2 = workflows[loc2]
        for (let i = 0; i < workflow2.length - 2; i++) { // nb one off end
          if (workflow2[i].target === loc) {
            onlyEnds = false
          }
        }
      })
      let subbedAtLeastOnce = false
      Object.keys(workflows).forEach((loc2: string) => {
        const workflow2 = workflows[loc2]
        if (workflow2[workflow2.length - 1].target === loc) {
          workflow2.pop()
          workflows[loc2] = workflow2.concat(workflow)
          changed = true
          subbedAtLeastOnce = true
        }
      })
      if (onlyEnds && subbedAtLeastOnce) {
        // console.log('delete',loc)
        delete workflows[loc]
        changed = true
      }
    })
  }
  //console.log('exit',workflows)
}

function cloneThingRange (thing: ThingRange): ThingRange {
  return {
    x: { min: thing['x'].min, max: thing['x'].max },
    m: { min: thing['m'].min, max: thing['m'].max },
    a: { min: thing['a'].min, max: thing['a'].max },
    s: { min: thing['s'].min, max: thing['s'].max },
  }
}

function pad(n:number) {
  return ' '.repeat( 4-`${n}`.length)+n
}

function combinations (workflows: Record<string, Workflow>, loc: string, thing: ThingRange) {

  const inScore =
    (thing['x'].max - thing['x'].min + 1) *
    (thing['m'].max - thing['m'].min + 1) *
    (thing['a'].max - thing['a'].min + 1) *
    (thing['s'].max - thing['s'].min + 1)

  // console.log( loc, thing)
  if (loc === 'R') { return 0 }
  if (thing['x'].min > thing['x'].max) { return 0 }
  if (thing['m'].min > thing['m'].max) { return 0 }
  if (thing['a'].min > thing['a'].max) { return 0 }
  if (thing['s'].min > thing['s'].max) { return 0 }
  if (loc === 'A' || loc === 'R') {
    const score =
      (thing['x'].max - thing['x'].min + 1) *
      (thing['m'].max - thing['m'].min + 1) *
      (thing['a'].max - thing['a'].min + 1) *
      (thing['s'].max - thing['s'].min + 1)
    //console.log(`${loc} x=${pad(thing['x'].min)}..${pad(thing['x'].max)} m=${pad(thing['m'].min)}..${pad(thing['m'].max)} a=${pad(thing['a'].min)}..${pad(thing['a'].max)} s=${pad(thing['s'].min)}..${pad(thing['s'].max)} => ${score}`)
    //  console.log(score)
    return score
  }
  const workingThing = cloneThingRange(thing)

  let score = 0
  const workflow = workflows[loc]
  for (let i = 0; i < workflow.length; ++i) {
    const rule = workflow[i]
    if (rule.test === '.') {
      score += combinations(workflows, rule.target, workingThing)
    }
    if (rule.test === '<') {
      const sideThing = cloneThingRange(workingThing)
      sideThing[rule.factor].max = Math.min(rule.value - 1, sideThing[rule.factor].max)
      workingThing[rule.factor].min = Math.max(rule.value, workingThing[rule.factor].min)
      score += combinations(workflows, rule.target, sideThing)
    }
    if (rule.test === '>') {
      const sideThing = cloneThingRange(workingThing)
      sideThing[rule.factor].min = Math.max(rule.value + 1, sideThing[rule.factor].min)
      workingThing [rule.factor].max = Math.min(rule.value, workingThing[rule.factor].max)
      score += combinations(workflows, rule.target, sideThing)
    }
    //console.log( {workingThing})
  }

  //if (score !== inScore) {console.log('failed', { inScore, score, loc })}

  return score
}