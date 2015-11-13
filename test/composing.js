import { compose, add, toArray, take, filter, run, map } from '../lib'
import r from 'rethinkdb'
let upper = t => t.toUpperCase()
let exclaim = t => t + '!'
let getLastName = take('lastName')
let head = t => t[0]
let exclaimRethink = add('!')
let getFullName = map(t => t('firstName').add(' ').add(t('lastName')))
let getFirst = take(0)
let filterGal = filter({ firstName: 'Gal' })
let exec = t => run(r.conn)(t)

describe('compose', () => {
  before((done) => {
    r.connect().then((conn) => {
      r.conn = conn
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
    let c = compose(head, toArray, exec, map(exclaimRethink), getFullName, filterGal)
    let usersTable = r.db('shiftlift').table('users')
    c(usersTable).should.eventually.equal('Gal Schlezinger!').and.notify(done)
  })

  it('should work with objects in rethink', (done) => {
    let c = compose(exec, getLastName, getFirst, filterGal)
    let usersTable = r.db('shiftlift').table('users')
    c(usersTable).should.eventually.equal('Schlezinger').and.notify(done)
  })

  after((done) => {
    r.conn.close().then(() => done())
  })
})
