var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');
var config = require('./config');

var app = express();
app.use(cors());

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Database connected successfully!");
});

// var user = {person_name: 'Punith', age: 29, sex: 'Male'};

// con.query('INSERT INTO Person.user SET ?', user, (err, res) => {
//   if (err) throw err;

//   console.log('1 Row inserted: ' + res.insertId);
// });

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/users', function (req, res) {
  con.query('SELECT DISTINCT u.person_name, u.age FROM user u ORDER BY u.person_name DESC', (err, rows) => {
    if (err) throw err;

    console.log('List of users: ' + JSON.stringify(rows));
    res.json(rows);
  });
});
app.post('/users', function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var age = req.body.age;
  var sex = req.body.sex;

  con.query('UPDATE user SET person_name=?, age=?, sex=? WHERE id=?', [name, age, sex, id], (err, result) => {
    if (err) throw err;
    console.log(`Changed ${result.changedRows} row(s)`);
  });
});

app.listen(port, function () {
  console.log('Running on PORT: ' + port);
});