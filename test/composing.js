import { db, compose, execute, add, toArray, take, table, filter, map } from '../lib'
import r from 'rethinkdb'
let upper = t => t.toUpperCase()
let exclaim = t => t + '!'
let getLastName = take('lastName')
let head = t => t[0]
let exclaimRethink = add('!')
let getFullName = map(t => t('firstName').add(' ').add(t('lastName')))
let getFirst = take(0)
let filterGal = filter({ firstName: 'Gal' })
let users = table('users')
let rdb = db('shiftlift')

describe('compose', () => {
  let reql
  before((done) => {
    r.connect().then((conn) => {
      r.conn = conn
      reql = execute(conn)
      done()
    })
  })

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
    let c = compose(head, toArray, reql, map(exclaimRethink), getFullName, filterGal, users)
    c(rdb).should.eventually.equal('Gal Schlezinger!').and.notify(done)
  })

  it('should work with objects in rethink', (done) => {
    let c = compose(reql, getLastName, getFirst, filterGal, users, rdb)
    c().should.eventually.equal('Schlezinger').and.notify(done)
  })

  it('should work with twice composing', (done) => {
    let allGals = compose(filterGal, users, rdb)
    let lastName = compose(getLastName, getFirst, allGals)
    //let executor = compose(exec, lastName)
    //executor().should.eventually.equal('Schlezinger').and.notify(done)
    reql(lastName).should.eventually.equal('Schlezinger').and.notify(done)
  })

  after((done) => {
    r.conn.close().then(() => done())
  })
})
