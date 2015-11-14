# reql-pointfree
Functional RethinkDB functions for point free programming

works on the RethinkDB official driver and rethinkdbdash

## Installation
just
```
npm install --save reql-pointfree
``` 
and you're set

## Usage
```js
import createReQL from 'reql-pointfree'
const { db, compose, filter, take, table, add, execute } = createReQL(r) // the rethink driver

// create a `reql` function to call your ReQLs
let reql = execute(r.connection) // rethinkdbdash is just execute()

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
### `add`
Just like the official driver says.

### `asc`
Just like the official driver says.

### `coerceTo`
Just like the official driver says.

### `compose`
composes functions from right to left.
supports Promises (thenables), ReQL and normal functions

### `db`
Just like the official driver says.

### `desc`
Just like the official driver says.

### `eqJoin`
Just like the official driver says.

### `execute`
creates a `reql` function, which can be `compose`d too.

### `filter`
Just like the official driver says.

### `get`
Just like the official driver says.

### `isReQL`
tells if the argument is a ReQL query

### `limit`
Just like the official driver says.

### `map`
calls `map` on `SEQUENCE|ARRAY|TABLE|STREAM` and `do` on other cases.

### `orderBy`
Just like the official driver says.

### `run`
Just like the official driver says.

### `table`
Just like the official driver says.

### `take`
for taking stuff out of an object. just like

```js
r.table('users').find({ isSuperhero: true })('name')
//                       take('name')(reql)-^^^^^^^^
```
### `toArray`
Just like the official driver says.
