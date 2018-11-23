'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const str = fs.readFileSync(process.argv[2],'utf8');
const $ = cheerio.load(str);

const username = 'mikeralphson';
const password = process.env.github;
const entries = [];

async function main() {

$('tr').each(function(){
    $(this).children('td').each(async function(){
        const entry = {};
        const link = $(this).children('a').first();
        console.log(link && $(link).text() ? 'Name:' : 'Desc:',$(this).text());
        if (link && $(link).text()) {
  	        console.log('Link:',$(link).text(),$(link).attr('href'));
            entry.name = $(link).text();
            entry.description = $(this).text();
            entry.github = $(link).attr('href');
            entry.v1 = true;
            entry.language = '?';
            entry.category = '?';

            if (entry.github.indexOf('github.com')>=0) {
                let url = entry.github.replace('://','');
                let components = url.split('/');
                const user = components[1];
                const repo = components[2];
                const apicall = 'https://api.github.com/repos/'+user+'/'+repo;
                const digest = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                const options = {};
                options.headers = { authorization: digest };
                console.log(apicall);
                const res = await fetch(apicall,options);
                const json = await res.text();
                console.log(json);
                const obj = JSON.parse(json);
                if (obj.id) {
                entry.language = obj.language;
                entry.archived = !!obj.archived;
                entry.stars = obj.stargazers_count||0;
                entry.watch = obj.subscribers_count||0;
                entry.updated = obj.updated_at;
                entry.issues = obj.open_issues_count||0;
                }
            }

            entries.push(entry);
        }
    });
});
}

main();

process.on('exit',function(){
    fs.writeFileSync(process.argv[2].replace('.html','.yaml'),yaml.dump(entries),'utf8');
});

