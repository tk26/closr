
const express = require("express"),
    { urlencoded, json } = require("body-parser"),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    crypto = require("crypto"),
    path = require("path"),
    Receive = require("./services/receive"),
    GraphAPi = require("./services/graph-api"),
    User = require("./services/user"),
    config = require("./services/config"),
    i18n = require("./i18n.config"),
    app = express();

const indexRouter = require('./routes/index'),
      usersRouter = require('./routes/users'),
      webhookRouter = require('./routes/webhooks');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(json({ verify: verifyRequestSignature }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/webhook', webhookRouter);


function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];
  
    if (!signature) {
      console.log("Couldn't validate the signature.");
    } else {
      var elements = signature.split("=");
      var signatureHash = elements[1];
      var expectedHash = crypto
        .createHmac("sha1", config.appSecret)
        .update(buf)
        .digest("hex");
      if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  }

module.exports = app;
