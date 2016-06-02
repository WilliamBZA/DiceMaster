var express = require('express');
var app = express();
var url = require('url');
var request = require('request');

function rollRandom(maxValue) {
  return Math.floor(Math.random() * maxValue) + 1;
}

var ia = {
  diesides : 6,
  validDie : ['red', 'green', 'blue', 'yellow', 'black', 'white']
}

var sets = {
  ia : ia
};

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 9001));

app.get('/', function(req, res) {
  res.send('It works!');
});

app.use(express.static('resources'));

app.post('/post', function (req, res) {
  var set = 'ia';
  var dice = [{die: 'red', number: 1}, {die: 'green', number: 2}];
  
  if (sets[set]) {
    var selectedSet = sets[set];
    
    var response = dice.map(function(selection) {
      var rolls = [];
      for (var x = 0; x < selection.number; x++) {
        rolls.push("https://dicemaster.herokuapp.com/" + set + "/" + selection.die + rollRandom(selectedSet.diesides) + ".png")
      }
      return rolls;
    }).reduce(function(acc, current) {
      return acc.concat(current);
    }, []).map(function(img) {
      return {
        "pretext": "rolled a",
        "image_url": img
      };
    });
    
    var body = {
      response_type: "in_channel",
      attachments: response
    };
  
    res.send(body);
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});