const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\nagon\\.claude\\projects\\C--Users-nagon-OneDrive-Documents-Coding-BFB-Website-Re-Design\\470c20c7-91c1-43fa-a0e5-6b91e76c2a0b\\tool-results\\bv1d8fqbt.txt', 'utf8');

// This is a very crude parser because the HTML is minified
// We look for patterns like <img> and then the nearest text that looks like a name.
// Or we look for the team section specifically.

const teamMembers = [];
const imgRegex = /<img[^>]*src="([^"]*)"/g;
const nameRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g;

let imgMatch;
const images = [];
while ((imgMatch = imgRegex.exec(html)) !== null) {
    images.push(imgMatch[1]);
}

let nameMatch;
const names = [];
while ((nameMatch = nameRegex.exec(html)) !== null) {
    names.push(nameMatch[1]);
}

console.log('Found images:', images.length);
console.log('Found names:', names.length);

// Let's try to find the team section specifically
const teamSectionMatch = html.match(/Our Team[\s\S]*?<\/section>/);
if (teamSectionMatch) {
    const teamHtml = teamSectionMatch[0];
    const teamImgs = [];
    let m;
    while ((m = imgRegex.exec(teamHtml)) !== null) {
        teamImgs.push(m[1]);
    }
    const teamNames = [];
    while ((m = nameRegex.exec(teamHtml)) !== null) {
        teamNames.push(m[1]);
    }
    console.log('Team images:', teamImgs);
    console.log('Team names:', teamNames);
}
