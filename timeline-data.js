/**
 * SVGPathElement.getPointAtLength() and SVGGeometryElement.getPointAtLength() are deprecated
 * In order to animate svg points, we split timeline in "n" step points which are used as anchor
 * Run node ./timeline-date.js
 */

var process = "M7.2,320.6C7.2,144.6,155.7,2,338.9,2,485.4,2,604.2,116.1,604.2,256.9c0,112.6-95,203.9-212.3,203.9-93.8,0-169.8-73-169.8-163.1,0-72.1,60.8-130.5,135.8-130.5,60,0,108.7,46.7,108.7,104.4a81.306,81.306,0,0,1-1.462,15.328c-7.366,38.68-42.814,68.172-85.438,68.172-38.4,0-69.6-29.9-69.6-66.8,0-29.5,24.9-53.4,55.6-53.4,24.6,0,44.5,19.1,44.5,42.8,0,18.9-15.9,34.2-35.6,34.2-15.7,0-28.5-12.3-28.5-27.4";

var point = require('point-at-length');
var pts = point(process.argv.slice(2).join(' '));

var len = pts.length();

for (var i = 0; i <= 10; i++) {
  console.log(i / 10, pts.at(i / 10 * len));
}
