require('dotenv').load();

var fs = require('fs');
const path = __dirname;

function welcome(request, response) {
  // test();
  return response.render('login');
}

function makeMP4(request, response) {
  test();
}


exports.welcome = welcome;
exports.makeMP4 = makeMP4;

async function test() {
  await renderLottie({
    path: path + '/lottie/Line.json',
    output: path + '/mp4/Line.mp4'
  })

  // await renderLottie({
  //     path: 'test.json',
  //     output: 'example.gif',
  //     width: 640
  //   })

  // await renderLottie({
  //   path: 'test.json',
  //   output: 'frame-%d.png', // sprintf format
  //   height: 128
  // })
}
const renderLottie = require('puppeteer-lottie')
