'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const cheerio = require('cheerio');

const str = fs.readFileSync('./swagger1.html','utf8');
const $ = cheerio.load(str);
$('tr').each(function(){
  console.log($(this).find('td').text());
});
