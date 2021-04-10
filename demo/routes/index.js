var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/tranfer', function (req, res, next) {
  var body = req.body;
  if (!body.account || !body.amount) res.redirect('/');

  fs.readFile('./data.json', 'utf-8', function(err, data) {
    if (err) throw err
  
    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.transactions.push({
      account: body.account,
      amount: body.amount
    })
    fs.writeFile('data.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
      if (err) throw err
      console.log('Done!')
    })
  })
  res.redirect('/');
});

router.get('/send-money', function (req, res, next) {
  if (!req.query.account || !req.query.amount) res.redirect('/');
  const account = req.query.account;
  const amount = req.query.amount;
  
  fs.readFile('./data.json', 'utf-8', function(err, data) {
    if (err) throw err
  
    var arrayOfObjects = JSON.parse(data)
    arrayOfObjects.transactions.push({
      account,
      amount
    })
    fs.writeFile('data.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
      if (err) throw err
      console.log('Done!')
    })
  })
  res.redirect('/');
});

module.exports = router;
