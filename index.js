var express = require('express')
var app = express()
var mysql = require('mysql')


//Connecting to the DB
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database:'accelerate'
})


//Test API
app.get('/test', function (req, res) {
	connection.query('SELECT * from users', function (err, rows, fields) {
    if (!err)
      res.status(200).send('Result'+rows[0].name)
    else
      res.status(500).send('Error ')     
	})
})

 

app.listen(3001, function () {
  console.log('App Listening on Port 3001')
})