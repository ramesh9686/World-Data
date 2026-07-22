const fs = require('fs');
const path = require('path');

const quizHtmlPath = path.join(__dirname, '..', 'src', 'app', 'quiz', 'quiz.html');
const locateHtmlPath = path.join(__dirname, '..', 'src', 'app', 'locate', 'locate.html');

function cleanSvgInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove onSvgMouseMove and onSvgMouseLeave bindings
  content = content.replace(/\(mousemove\)="onSvgMouseMove\(\$event\)"/g, '');
  content = content.replace(/\(mouseleave\)="onSvgMouseLeave\(\)"/g, '');

  // Remove ambientArcs paths
  content = content.replace(/<path \*ngFor="let arc of ambientArcs"[\s\S]*?<\/path>/g, '');

  // Remove ambientNodes group
  content = content.replace(/<g \*ngFor="let node of ambientNodes"[\s\S]*?<\/g>/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned ${path.basename(filePath)}`);
}

cleanSvgInFile(quizHtmlPath);
cleanSvgInFile(locateHtmlPath);
