import { RDBVal } from './classes'
import r from 'rethinkdb'

let instantFunc = fName => (
  (...args) => reql => reql[fName](...args)
)

export function compose(...args) {
  return newArg => args.reduceRight((a,b) => {
    if (a && a.then) return a.then(b)
    return b(a)
  }, newArg)
}

export function isReQL(reql) {
  return reql instanceof RDBVal
}

export function map(f) {
  return reql => (
    !isReQL(reql) ? reql.map(f) : (
      r.branch(
        reql.typeOf().match('SEQUENCE|ARRAY|TABLE|STREAM'),
        reql.map(f),
        reql.do(f)
      )
    )
  )
}

export const add = instantFunc('add')
export const run = instantFunc('run')
export const toArray = instantFunc('toArray')()
export const filter = instantFunc('filter')
export const get = instantFunc('get')
export const coerceTo = instantFunc('coerceTo')
export function take(field) {
  return reql => reql(field)
}

