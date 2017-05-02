var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())

var DATA = {}
DATA[makeid()] = { task: 'finish this api', done: false }
DATA[makeid()] = { task: 'test id randomness', done: false }

// homepage
app.get('/', function (req, res, next) {
  res.send('Welcome! Go to /todos for the api')
})

// get all todos
app.get('/todos', function (req, res, next) {
  res.json(DATA)
})

// get one todo
app.get('/todos/:id', function (req, res, next) {
  let found = DATA[req.params.id]
  if (!found) { res.status(404).end(req.params.id + ' not found'); return }
  res.json(found)
})

// add new todo
app.post('/todos', function (req, res, next) {
  if (!req.body.task) { res.status(400).end('must enter task!'); return }
  let id = makeid()
  DATA[id] = {
    'task': req.body.task,
    'done': req.body.done || false
  }
  res.redirect('/todos/' + id)
})

// update todo
app.put('/todos/:id', function (req, res, next) {
  let found = DATA[req.params.id]
  if (!found) { res.status(404).end(req.params.id + ' not found'); return }
  if (req.body.task) { found.task = req.body.task }
  if (undefined !== req.body.done) { found.done = req.body.done }
  res.redirect('/todos/' + req.params.id)
})

// delete todo
app.delete('/todos/:id', function (req, res, next) {
  let found = DATA[req.params.id]
  if (!found) { res.status(404).end(req.params.id + ' not found'); return }
  delete DATA[req.params.id]
  res.redirect('/todos')
})

// Handle 404
app.use(function (req, res, next) {
  res.status(404).end(req.url + ' not found')
})

// Start the server
app.listen(process.env.PORT || 8080)

// Make random IDs for entries
function makeid () {
  var id = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 5; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return DATA[id] ? makeid() : id
}
