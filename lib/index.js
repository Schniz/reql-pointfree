import { RDBVal, RDBTerm } from './classes'
import r from 'rethinkdb'

let instantFunc = fName => (
  (...args) => reql => reql[fName](...args)
)

let currier = (name) => (...args) => {
  let t = r[name](...args)
  let f = reql => !reql ? t : reql[name](...args)
  f.__proto__ = t.__proto__
  Object.keys(t).forEach(key => f[key] = t[key])
  return f
}

export function execute(conn) {
  return reql => (isReQL(reql) ? reql : reql()).run(conn)
}

export function compose(...args) {
  return newArg => args.reduceRight((a,b) => {
    if (a && a.then) return a.then(b)
    return b(a)
  }, newArg)
}

export function isReQL(reql) {
  return reql instanceof RDBVal || reql instanceof RDBTerm
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

export const limit = instantFunc('limit')
export const orderBy = instantFunc('orderBy')
export const add = instantFunc('add')
export const eqJoin = instantFunc('eqJoin')
export const run = instantFunc('run')
export const toArray = instantFunc('toArray')()
export const filter = instantFunc('filter')
export const get = instantFunc('get')
export const getAll = instantFunc('getAll')
export const reduce = instantFunc('reduce')
export const coerceTo = instantFunc('coerceTo')
export const table = currier('table')
export const db = currier('db')
export const desc = r.desc
export const asc = r.asc

export function take(field) {
  return reql => reql(field)
}

