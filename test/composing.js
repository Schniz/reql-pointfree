import rethinkdbDriver from 'rethinkdb'
import pfReql from '../lib'
const rethinkdbdashDriver = require('rethinkdbdash')()
let upper = t => t.toUpperCase()
let exclaim = t => t + '!'

function test({ text, r, pre }) {
  describe(text, () => {
    let reql, db, compose, execute, add, take, table, filter, map, getLastName, exclaimRethink, getFullName, getFirst, filterGal, users, rdb
    before((done) => pre(r).then((conn) => {
      let pf = pfReql(r)
      db = pf.db
      compose = pf.compose
      execute = pf.execute
      add = pf.add
      take = pf.take
      table = pf.table
      filter = pf.filter
      map = pf.map
      getLastName = take('lastName')
      exclaimRethink = add('!')
      getFullName = map(t => t('firstName').add(' ').add(t('lastName')))
      getFirst = take(0)
      filterGal = filter({ firstName: 'Gal' })
      users = table('users')
      rdb = db('shiftlift')
      reql = execute(conn)
      done()
    }))

    it('should work with regular functions', () => {
      let c = compose(exclaim, upper)
      c('text').should.equal('TEXT!')
    })

    it('should work with regular functions and promises', (done) => {
      let asyncText = t => Promise.resolve(t + ' World')
      let exclaimPromise = t => Promise.resolve(exclaim(t))
      let c = compose(exclaimPromise, upper, asyncText)
      c('hello').should.eventually.equal('HELLO WORLD!').and.notify(done)
    })

    it('should work with sequences in rethink', (done) => {
      let c = compose(reql, take(0), map(exclaimRethink), getFullName, filterGal, users)
      c(rdb).should.eventually.equal('Gal Schlezinger!').and.notify(done)
    })

    it('should work with objects in rethink', (done) => {
      let c = compose(getLastName, take(0), filterGal, users, rdb)
      reql(c).should.eventually.equal('Schlezinger').and.notify(done)
    })

    it('should work with twice composing', (done) => {
      let allGals = compose(filterGal, users, rdb)
      let lastName = compose(getLastName, getFirst, allGals)
      reql(lastName).should.eventually.equal('Schlezinger').and.notify(done)
    })
  })
}

describe('compose', () => {
  test({
    text: 'using rethinkdb',
    pre: (r) => r.connect().then(e => r.conn = e),
    r: rethinkdbDriver
  })

  test({
    text: 'using rethinkdbdash',
    pre: (r) => Promise.resolve(r),
    r: rethinkdbdashDriver
  })
})
