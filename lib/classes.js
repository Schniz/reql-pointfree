let Val
let Term
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

if (!Val && !Term) {
  console.log("WARNING: you don't have `rethinkdb' nor `rethinkdbdash'. Things can get weird.") // eslint-disable-line
}

export const RDBTerm = Term || placeholder
export const RDBVal = Val || placeholder
