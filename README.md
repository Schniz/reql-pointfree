# reql-pointfree
Functional RethinkDB functions for point free programming

## Usage
```js
import { db, compose, filter, take, table, add, execute } from 'reql-pointfree'

// create a `reql` function to call your ReQLs
let reql = execute(r.connection)

// some functions
let exclaim = add('!') // r.something().add('!')
let head = take(0) // r.something()(0)
let getName = map(take('name')) // r.something().map(e => e('name'))
let filterSuperheroes = filter({ isSuperhero: true }) // r.something().filter({ isSuperhero: true })
let users = table('users') // r.table('users')
let earth = db('earth') // r.db('earth')

let getSuperheroesFromUsers = compose(filterSuperheroes, users, db)
let getNameOfFirstSuperheroFromUsers = compose(getName, head, getSuperheroesFromUsers)

// then, in your app..
reql(getNameOfFirstSuperheroFromUsers).then(....)
// and even
reql(getSuperheroesFromUsers).then(...)
```

this is the concept. you don't have to compose everything, but you CAN compose things. which is great IMO.

## Functions
### `db`
### `table`
### `limit`
### `orderBy`
### `add`
### `eqJoin`
### `run`
### `toArray`
### `filter`
### `get`
### `coerceTo`
### `desc`
### `asc`
### `execute`
### `compose`
### `isReQL`
### `map`
### `take`

## Note about mapping
the `map` method calls `map` on `SEQUENCE|ARRAY|TABLE|STREAM` and `do` on other cases.
