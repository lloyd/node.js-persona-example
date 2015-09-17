var express = require('express'),
    request = require('request');

var app = express();

app.use(require('cookie-parser')())
   .use(require('body-parser').urlencoded({ extended: true }))
   .use(require('cookie-session')({
     secret: "meh"
   }))
   .use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
  res.render('index.ejs', { email: req.session.email || null });
});

app.get('/logout', function(req, res) {
  req.session = null;
  res.redirect('/');
});

app.post('/auth', function(req, res) {
  request.post({
    url: 'https://verifier.login.persona.org/verify',
    json: {
      assertion: req.body.assertion,
      audience: "http://127.0.0.1:3000"
    }
  }, function(e, r, body) {
    if(body && body.email) {
      req.session.email = body.email;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

app.listen(3000);
