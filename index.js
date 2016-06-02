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
    let messageData = { text:text }
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
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
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

// for Facebook verification
app.get('/webhooklink/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
});

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging;
    
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i];
        let sender = event.sender.id;
        
        if (event.message && event.message.text) {
            let text = event.message.text;
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
        }
    }
    
    res.sendStatus(200);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var facebookToken = "EAADprYRJPA8BAFNqrZB1MzBYcjjdcKEXU5inZCvBEg3uyczY933vNUVIXBYFv4E0bXOZAaZBtgZCgpG6pjcalGk21jIVlsh8A3yEBCZB91ZCtcbx6OZBVg3xolCZCzBbpwkvOuK731ZCmeWoweYZC6hWR6w9JK9fZAFMB8cXJwiZClZC6GZ";