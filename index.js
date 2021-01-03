require('dotenv').load();
require('method-override');

const http = require('http');
var fs = require('fs');
const path = require('path');
const methods = require('./src/server.js');

const express = require('express');
const bodyParser = require('body-parser')
var session = require('express-session');
const fileupload = require('express-fileupload');
const renderLottie = require('puppeteer-lottie')

const welcome = methods.welcome;
// const makeMP4 = methods.makeMP4;

const app = express();
app.set('view engine', 'ejs');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json());
// app.use(fileUpload({
//   limits: { fileSize: 50 * 1024 * 1024 },
// }));
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileupload(
  {
    limits: { fileSize: 50 * 1024 * 1024 },
  }
));
app.use(express.static('public'));


app.get('/', function (request, response) {
  welcome(request, response);
});
app.post('/', function (request, response) {
  welcome(request, response);
});
app.post('/upload', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname + "/lottie/" + sampleFile.name, function (err) {
    if (err)
      return res.status(500).send(err);
    let promise = new Promise(function (resolve, reject) {
      try {
        resolve(renderLottie({
          path: __dirname + '/lottie/' + sampleFile.name,
          output: __dirname + '/mp4/' + sampleFile.name + '.mp4'
        }));
      } catch (err) {
        console.error(err);
        reject(new Error("Whoops!"))
      }
    });

    // resolve runs the first function in .then
    promise.then(
      result => res.download(__dirname + '/mp4/' + sampleFile.name + '.mp4'), // shows "done!" after 1 second
      error => res.send("Error") // doesn't run
    );
  });
});

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Express server running on *:' + port);
});

