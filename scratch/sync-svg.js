const fs = require('fs');
const path = require('path');

const mapHtmlPath = path.join(__dirname, '..', 'src', 'app', 'map', 'map.html');
const quizHtmlPath = path.join(__dirname, '..', 'src', 'app', 'quiz', 'quiz.html');
const locateHtmlPath = path.join(__dirname, '..', 'src', 'app', 'locate', 'locate.html');

const mapContent = fs.readFileSync(mapHtmlPath, 'utf8');

// Extract SVG content from map.html
const svgMatch = mapContent.match(/<svg[\s\S]*?<\/svg>/);
if (!svgMatch) {
  console.error("Could not find <svg> in map.html");
  process.exit(1);
}

let fullSvg = svgMatch[0];

// In map.html, svg has attributes like:
// (click)="onCountrySelected($event)" (mousemove)="onSvgMouseMove($event)" ...
// Clean up extra event bindings if needed, but keeping (click)="onCountrySelected($event)"

// 1. Update quiz.html
let quizContent = fs.readFileSync(quizHtmlPath, 'utf8');
const quizSvgMatch = quizContent.match(/<svg[\s\S]*?<\/svg>/);
if (quizSvgMatch) {
  quizContent = quizContent.replace(quizSvgMatch[0], fullSvg);
  fs.writeFileSync(quizHtmlPath, quizContent, 'utf8');
  console.log("Updated quiz.html with full SVG map!");
} else {
  console.error("Could not find <svg> in quiz.html");
}

// 2. Update locate.html
let locateContent = fs.readFileSync(locateHtmlPath, 'utf8');
const locateSvgMatch = locateContent.match(/<svg[\s\S]*?<\/svg>/);
if (locateSvgMatch) {
  locateContent = locateContent.replace(locateSvgMatch[0], fullSvg);
  fs.writeFileSync(locateHtmlPath, locateContent, 'utf8');
  console.log("Updated locate.html with full SVG map!");
} else {
  console.error("Could not find <svg> in locate.html");
}
