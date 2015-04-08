require! express
require! path

app = express!

app.get '/', (req, res) !->
  res.send 'Hello Worddldss dd'
  console.log 'hahdda'

module.exports = app
