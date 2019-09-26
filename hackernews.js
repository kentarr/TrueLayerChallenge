const request = require('request');
const $ = require('cheerio');

request("https://news.ycombinator.com/", (err, res, body) => {
  if (err) { return console.log(err); }
  let articles = [];
  let subtexts = [];
  $('.athing', body).each((i,elem) => {
    articles[i] = elem;
    subtexts[i] = $(elem, body).next();
    // console.log($('.hnuser', subtexts[i]).text());
  })

  // console.log(articles);
  // console.log(subtext);
  // console.log('first:', $('.hnuser', subtext[1]).text());
  let output = [];

  for(let i = 0; i<30; i++){
    const $A = $.load(articles[i]);
    const subtext = subtexts[i];
    const author = $('.hnuser', subtext).text() || 'hidden' ;
    output.push(
      {
        "title":$A('.storylink').text(),
        "uri":$A('.storylink').attr('href'),
        "author": author,
        "points": $('.score', subtext).text(),
        "rank":$A('.rank').text()
      }
    );

    // console.log($B('.hnuser').text());
  }

  console.log(output);
});
