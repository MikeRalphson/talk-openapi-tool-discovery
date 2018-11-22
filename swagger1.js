'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const cheerio = require('cheerio');

const str = fs.readFileSync('./swagger1.html','utf8');
const $ = cheerio.load(str);
$('tr').each(function(){
  //console.log($(this).find('td').text());
  $(this).children('td').each(function(){
    console.log($(this).text());
    const link = $(this).children('a').first();
    if (link) {
	console.log($(link).text(),$(link).attr('href'));
    }
  });
});
