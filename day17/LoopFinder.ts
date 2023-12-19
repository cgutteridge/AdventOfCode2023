


export class LoopFinder {
  private target: number
  private cache: Record<string, number> = {}
  private values: any[] = []
  private index: number = 0
  private done: boolean =false
  private loopFrom = 0
  private loopSize = 0

  constructor (target: number) {
    this.target = target
  }

  isDone () {
    return this.done
  }

  log (code: string, value: any) {
    if( this.done ) {
      console.log("Already solved loop")
      return
    }
    if( this.cache[code] ) {
      this.done = true
      this.loopFrom = this.cache[code]
      this.loopSize = this.index - this.loopFrom
    }
    this.values[this.index] = value
    this.cache[code] = this.index++
  }

  result (): any {
    if( !this.done ) { return undefined }

    const effectiveIndex =  ((this.target-this.loopFrom)%this.loopSize)+this.loopFrom
    return this.values[effectiveIndex]
  }
}