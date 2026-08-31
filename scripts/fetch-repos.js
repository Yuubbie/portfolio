const fs = require('fs');
const https = require('https');

const username = 'Yuubbie';

https.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
  headers: { 'User-Agent': 'node.js' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const repos = JSON.parse(data)
      .filter(r => !r.fork && !r.archived)
      .map(r => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        updated: r.updated_at
      }));

    fs.writeFileSync('projects.json', JSON.stringify(repos, null, 2));
    console.log(`Saved ${repos.length} repos to projects.json`);
  });
});