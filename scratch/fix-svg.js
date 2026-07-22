const fs = require('fs');
const path = require('path');

function cleanArcsAndNodes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove <g class="data-arcs-layer"> ... </g>
  content = content.replace(/<g class="data-arcs-layer">[\s\S]*?<\/g>/g, '');
  
  // Remove <g class="telemetry-nodes-layer"> ... </g>
  content = content.replace(/<g class="telemetry-nodes-layer">[\s\S]*?<\/g>/g, '');

  // Remove any remaining ambientArcs or ambientNodes references
  content = content.replace(/<path \*ngFor="let arc of ambientArcs"[\s\S]*?\/>/g, '');
  content = content.replace(/<g \*ngFor="let node of ambientNodes"[\s\S]*?<\/g>/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned ${path.basename(filePath)}`);
}

const quizPath = path.join(__dirname, '..', 'src', 'app', 'quiz', 'quiz.html');
const locatePath = path.join(__dirname, '..', 'src', 'app', 'locate', 'locate.html');

cleanArcsAndNodes(quizPath);
cleanArcsAndNodes(locatePath);
