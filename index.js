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

app.post('/post', function(req, res) {
      var body = {
        response_type: "in_channel",
        text: req.body.text,
        attachments: [{
          text: "You rolled a http://vignette4.wikia.nocookie.net/imperial-assault/images/d/d7/Imperial_Assault_Die_Face.png/revision/latest?cb=20150825022932"
        }]
      };

      res.send(body);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
