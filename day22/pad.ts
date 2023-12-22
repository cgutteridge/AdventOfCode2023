
export function pad(n:number,size:number) {
  return ' '.repeat( size-`${n}`.length)+n
}

