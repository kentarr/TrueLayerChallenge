const fs = require('fs');
const request = require('request');
const $ = require('cheerio');

// Process command line input arguments
const args = process.argv.slice(2);
let n = 0;

while(args[0]) {
  switch(args[0]){
    case "--posts":
    case "-p":
      args.shift();
      n = parseFloat(args[0]);
      if(Number.isInteger(n) && n > 0  && n <= 100) {
        switch(true) {
          case args[0] > 100:
            n = 100;
            args.shift();
            break;
          case args[0] < 0:
            n = 0;
            args.shift();
            break;
          default:
            n = args[0];
            args.shift();
        }
      } else {
        console.log("Posts must be a positive integer below 100")
      }
      break;
    default:
      console.log(args[0], "is an invalid argument");
      args.shift();
  }  
}


// Request data from Hacker News Page "j"
async function getHackerNews(j) {
  return new Promise( function(resolve, reject) {
    request("https://news.ycombinator.com/news?p="+j, (err, res, body) => {
      if (err) { return console.log(err); }
      let articles = [];
      let subtexts = [];
      let pageOutput = [];
      

      $('.athing', body).each((i,elem) => {
        articles[i] = elem;
        subtexts[i] = $(elem, body).next();
      })

      for(let i = 0; i<30; i++){
        const $A = $.load(articles[i]);
        const subtext = subtexts[i];
        const author = $('.hnuser', subtext).text() || 'hidden' ;
        pageOutput.push(
          {
            "title":$A('.storylink').text(),
            "uri":$A('.storylink').attr('href'),
            "author": author,
            "points": $('.score', subtext).text(),
            "rank":$A('.rank').text()
          }
        );
      }
      resolve(pageOutput);
    })
  })
};

// Grab 120 posts to edit down.
// Future logic needed to only grab pages based on how many posts requested
async function getHackerNewsAsync(i) {
  return await Promise.all([getHackerNews(1), getHackerNews(2), getHackerNews(3), getHackerNews(4)]);
}

getHackerNewsAsync(n).then( function(output) {
  let finalOutput = [...output[0], ...output[1], ...output[2], ...output[3]];
  finalOutput = finalOutput.slice(0, n);
  fs.writeFile("output.json", JSON.stringify(finalOutput), (err) => {
  if (err) throw err;
  console.log('Created file output.json');
  });
});