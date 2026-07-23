const fs = require('fs');
const path = require('path');

const locateHtmlPath = path.join(__dirname, '..', 'src', 'app', 'locate', 'locate.html');
let content = fs.readFileSync(locateHtmlPath, 'utf8');

const targetStr = '<div class="map-viewport">';
const replaceStr = `<div class="map-viewport" (wheel)="onWheelZoom($event)">
        <div class="locate-cam-controls">
          <button (click)="zoomIn()" class="cam-btn" title="Zoom In">➕</button>
          <button (click)="zoomOut()" class="cam-btn" title="Zoom Out">➖</button>
          <button (click)="resetCamera()" class="cam-btn reset" title="Reset View">🎯 Reset View</button>
        </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(locateHtmlPath, content, 'utf8');
  console.log('Successfully updated locate.html with camera controls!');
} else {
  console.log('Target string not found in locate.html');
}
