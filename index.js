var express = require('express');
var app = express();
var url = require('url');
var request = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 9001));

app.get('/', function(req, res) {
  res.send('It works!');
});

app.use(express.static('resources'));

app.post('/post', function(req, res) {
      var body = {
        response_type: "in_channel",
        text: req.body.text + "https://dicemaster.herokuapp.com/ia/blue3.png"
      };
      
      var body2 = {
        response_type: "in_channel",
        text: req.body.text + "https://dicemaster.herokuapp.com/ia/red1.png"
      };

      res.send(body);
      res.send(bod2y);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
