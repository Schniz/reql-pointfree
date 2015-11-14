let Val
let Term
let rethinkdbdash
let placeholder = () => {}

try {
  let r = require('rethinkdb')
  // wat
  Val = r.table('yay').constructor.__super__.constructor.__super__.constructor
} catch(e) {
  Val = null
}

try {
  Term = require('rethinkdbdash/lib/term')
} catch(e) {
  Term = null
}

try {
  rethinkdbdash = require('rethinkdbdash')({ pool: false }).constructor
} catch(e) {
  Term = null
}

if (!Val && !Term && !rethinkdbdash) {
  console.log("WARNING: you don't have `rethinkdb' nor `rethinkdbdash'. Things can get weird.") // eslint-disable-line
}

export const RDBTerm = Term || placeholder
export const Rethinkdbdash = rethinkdbdash || placeholder
export const RDBVal = Val || placeholder
