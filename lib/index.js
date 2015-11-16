import { RDBVal, RDBTerm } from './classes'

let instantFuncs = 'limit orderBy add eqJoin run toArray filter get getAll reduce coerceTo table db default changes'.split(' ')
let instantCurriers = 'table db'.split(' ')

export default function start(r) {
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

  let funcs = instantFuncs.reduce((obj, fName) => {
    obj[fName] = instantFunc(fName)
    return obj
  }, {})

  let curriers = instantCurriers.reduce((obj, fName) => {
    obj[fName] = currier(fName)
    return obj
  }, {})

  return {
    asc: r.asc,
    args: r.args,
    compose,
    object: r.object,
    desc: r.desc,
    execute,
    isReQL,
    map,
    take,
    ...funcs,
    ...curriers,
  }

  function execute(conn) {
    return reql => {
      if (isReQL(reql)) return reql.run(conn)
      return reql().run(conn)
    }
  }

  function compose(...args) {
    return newArg => args.reduceRight((a,b) => {
      if (a && a.then && !(a instanceof RDBTerm)) return a.then(b)
      return b(a)
    }, newArg)
  }

  function isReQL(reql) {
    return reql instanceof RDBVal || reql instanceof RDBTerm
  }

  function map(f) {
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


  function take(field) {
    return reql => reql(field)
  }
}

