var express = require('express');
var app = express();
var url = require('url');
var request = require('request');
var bodyParser = require('body-parser');

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

function sendTextMessage(sender, text) {
    var messageData = { text:text };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:facebookToken},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function roll(diceChoices, set) {
  var response = diceChoices.map(function(selection) {
      var rolls = [];
      for (var x = 0; x < selection.number; x++) {
        rolls.push("https://dicemaster.herokuapp.com/" + set + "/" + selection.die + rollRandom(6) + ".png")
      }
      return rolls;
    }).reduce(function(acc, current) {
      return acc.concat(current);
    }, []);
    
    return response;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 9001));

app.get('/', function(req, res) {
  res.send('It works!');
});

app.use(express.static('resources'));

app.post('/post', function (req, res) {
  var set = 'ia';
  var dice = [{die: 'red', number: 6}, {die: 'green', number: 6}];
  
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

// 2red2yellow1black
app.get('/roll/:dice', function (req, res) {
  var dice = req.params.dice;
  
  var match = dice.match(/[a-zA-Z]+|[0-9]+/g).reduce(function(acc, current, index, array) {
    if (index % 2 == 0) {
      acc.push({
        die: array[index + 1],
        number: parseInt(current) 
      });
    }
    
    return acc;
  }, []);

  var rolls = roll(match, 'ia').map(function (src) {
    return '<img src = "' + src + '" />';
  });

  res.send((rolls + '').replace(',', ''));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});