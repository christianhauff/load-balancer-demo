var animationCanvas = document.getElementById('animationCanvas');
var animationContext = animationCanvas.getContext('2d');

var fixCanvas = document.getElementById('fixCanvas');
var fixContext = fixCanvas.getContext('2d');

particleSpeed = 10;
fps = 60;
particleRadius = 5;
fadeRate = 8;
runtimeFactor = 300;
useFade = false;
normalizeAll = false;
particleList = [];
gwTop = [];
gwBottom = [];
serviceCoord = [];

numServices = 0;

textColor = "#878B90";
lineColor = textColor;
connectionColor = "#444";
// lineColor = "#fff";
connectionLineWidth = 3;

services = [
  {
    title: "Service red 1",
    textColor: "red",
    lineColor: lineColor
  },
  {
    title: "Service red 2",
    textColor: "red",
    lineColor: lineColor
  },
  {
    title: "Service blue 1",
    textColor: "blue",
    lineColor: lineColor
  },
  {
    title: "Service blue 2",
    textColor: "blue",
    lineColor: lineColor
  },
];

numServices = services.length;

// react on window resize
window.addEventListener("resize", resize, false);

document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById("togglefade").checked = false;
  document.getElementById("toggleruntime").checked = false;
  document.getElementById("togglenormalize").checked = false;
});

window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which;

  if (key == 49) {
    //createParticle(gwTop[0], gwTop[1], serviceCoord[0][0], serviceCoord[0][1]);
    createPathParticle([[w / 2, h], gwBottom, gwTop, serviceCoord[0], gwTop, gwBottom, [w / 2, h]], [1, 2, 5, 6], "red");
  }
  else if (key == 50) {
    //createParticle(gwTop[0], gwTop[1], serviceCoord[1][0], serviceCoord[1][1]);
    createPathParticle([[w / 2, h], gwBottom, gwTop, serviceCoord[1], gwTop, gwBottom, [w / 2, h]], [1, 2, 5, 6], "red");
  }
  else if (key == 51) {
    //createParticle(gwTop[0], gwTop[1], serviceCoord[2][0], serviceCoord[2][1]);
    createPathParticle([[w / 2, h], gwBottom, gwTop, serviceCoord[2], gwTop, gwBottom, [w / 2, h]], [1, 2, 5, 6], "blue");
  }
  else if (key == 52) {
    //createParticle(gwTop[0], gwTop[1], serviceCoord[3][0], serviceCoord[3][1]);
    createPathParticle([[w / 2, h], gwBottom, gwTop, serviceCoord[3], gwTop, gwBottom, [w / 2, h]], [1, 2, 5, 6], "blue");
  }
  else if (key == 81) {
    //q
    createPathParticle([[w / 2, h], gwBottom, gwTop, serviceCoord[0], gwTop, gwBottom, [w / 2, h]], [1, 2, 5, 6]);
  }
  else if (key == 87) {
    //w
    createPathParticle([[w / 2, h], gwBottom, gwTop, serviceCoord[1], gwTop, gwBottom, [w / 2, h]], [1, 2, 5, 6]);
  }
  else if (key == 69) {
    //e
    createPathParticle([[w / 2, h], gwBottom, gwTop, serviceCoord[2], gwTop, gwBottom, [w / 2, h]], [1, 2, 5, 6]);
  }
  else if (key == 82) {
    //r
    createPathParticle([[w / 2, h], gwBottom, gwTop, serviceCoord[3], gwTop, gwBottom, [w / 2, h]], [1, 2, 5, 6]);
  }
}

resize();

draw();



timer = setInterval(draw, 1000 / fps);
//draw();

function resize() {
  animationCanvas.width = document.body.clientWidth;
  animationCanvas.height = document.body.clientHeight;

  fixCanvas.width = document.body.clientWidth;
  fixCanvas.height = document.body.clientHeight;

  w = animationCanvas.width;
  h = animationCanvas.height;
  console.log(w);
  console.log(h);

  drawRectangles();
  drawConnections();
}

function draw() {
  // clear animation canvas
  if (!useFade) {
    animationContext.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
  }

  if (useFade) {
    fadeTraces();
  }

  followPath();
  moveParticles();
  drawParticles();
}

function drawRectangles() {
  var lwidth = 200;
  var lheight = 100;
  var swidth = 150;
  var sheight = 80;

  drawRoundedRectangle(fixContext, w / 2 - lwidth / 2, 0.6 * h, lwidth, lheight, 10);

  gwTop = [w / 2, 0.6 * h];
  gwBottom = [w / 2, 0.6 * h + lheight];

  fixContext.font = "20px Arial";
  fixContext.textAlign = "center";
  fixContext.fillStyle = textColor;

  fixContext.fillText("Gateway", w / 2, 0.6 * h + 0.5 * lheight + 10);

  var space = (w - numServices * swidth) / (numServices + 1);
  var xleft = space;

  serviceCoord = [];

  numServices = services.length;

  for (i = 0; i < numServices; i++) {
    //calculate points for numServices services

    drawRoundedRectangle(fixContext, xleft, 0.2 * h, swidth, sheight, 10, services[i].lineColor);

    serviceCoord.push([xleft + 0.5 * swidth, 0.2 * h + sheight]);

    fixContext.fillStyle = services[i].textColor;
    fixContext.fillText(services[i].title, xleft + 0.5 * swidth, 0.2 * h + sheight / 2 + 10);
    xleft += swidth + space;
  }
}

function drawConnections() {
  // fixContext.setLineDash([5, 3]);
  fixContext.setLineDash([3, 3]);
  fixContext.strokeStyle = connectionColor;
  fixContext.lineWidth = connectionLineWidth;

  for (i = 0; i < numServices; i++) {
    fixContext.beginPath();
    fixContext.moveTo(gwTop[0], gwTop[1]);
    fixContext.lineTo(serviceCoord[i][0], serviceCoord[i][1]);
    fixContext.stroke();
  }

}

function drawRoundedRectangle(Context, x, y, width, height, radius, color = lineColor) {
  Context.setLineDash([]);
  fixContext.strokeStyle = color;
  Context.beginPath();
  Context.moveTo(x + radius, y);
  Context.lineTo(x + width - radius, y);
  Context.arcTo(x + width, y, x + width, y + radius, radius);
  Context.lineTo(x + width, y + height - radius);
  Context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  Context.lineTo(x + radius, y + height);
  Context.arcTo(x, y + height, x, y + height - radius, radius);
  Context.lineTo(x, y + radius);
  Context.arcTo(x, y, x + radius, y, radius);

  Context.lineWidth = 5;
  Context.stroke();
}

function drawParticles() {
  for (i = 0; i < particleList.length; i++) {
    animationContext.beginPath();
    animationContext.arc(particleList[i]["x"], particleList[i]["y"], particleRadius, 0, 2 * Math.PI, false);
    if (typeof particleList[i].color !== 'undefined') {
      animationContext.fillStyle = particleList[i].color;
    }
    else {
      animationContext.fillStyle = '#fff';
    }
    animationContext.fill();
  }
}

function fadeTraces() {
  // from http://rectangleworld.com/blog/archives/402
  lastImage = animationContext.getImageData(0, 0, animationCanvas.width, animationCanvas.height);
  pixel = lastImage.data;
  for (i = 0; i < pixel.length; i += 4) {
    //check alpha value
    if (pixel[i + 3] != 0) {
      a = pixel[i + 3] - fadeRate;
      pixel[i + 3] = (a < 0) ? 0 : a;
    }
  }
  animationContext.putImageData(lastImage, 0, 0);
}

function createPathParticle(path, normalize = [], color = "#fff") {
  // [[w/2, h], gwBottom, gwTop, serviceCoord[0], gwTop, gwBottom, [w/2, h]]

  velx = 0;
  vely = 0;

  if (normalize.indexOf(1) >= 0 || normalizeAll === true) {
    var vectorlength = Math.sqrt(Math.pow((path[1][0] - path[0][0]), 2) + Math.pow((path[1][1] - path[0][1]), 2));
    velx = (path[1][0] - path[0][0]) / vectorlength * particleSpeed;
    vely = (path[1][1] - path[0][1]) / vectorlength * particleSpeed;
  }
  else {
    velx = (path[1][0] - path[0][0]) / runtimeFactor * particleSpeed;
    vely = (path[1][1] - path[0][1]) / runtimeFactor * particleSpeed;
  }

  particleList.push({
    "x": path[0][0],
    "y": path[0][1],
    "velx": velx,
    "vely": vely,
    "nextDst": 1,
    "path": path,
    "normalize": normalize,
    "followPath": true,
    "color": color
  });

}

function moveParticles() {
  for (i = 0; i < particleList.length; i++) {
    moveParticle(particleList[i]);
  }
}

function moveParticle(particle) {
  particle["x"] += particle["velx"];
  particle["y"] += particle["vely"];
}

function destinationArrived(x, y, dstx, dsty, velx, vely, proactive = false) {

  // Already check the next iteration step to avoid "overshooting"
  if (proactive) {
    x += velx;
    y += vely;
  }

  if (velx > 0) {
    if (x > dstx) {
      return true;
    }
  }
  else {
    if (x < dstx) {
      return true;
    }
  }
  if (vely > 0) {
    if (y > dsty) {
      return true;
    }
  }
  else {
    if (y < dsty) {
      return true;
    }
  }
  return false;
}

function followPath() {
  for (i = 0; i < particleList.length; i++) {
    var p = particleList[i];
    if (p['followPath'] === true) {
      if (destinationArrived(p.x, p.y, p.path[p.nextDst][0], p.path[p.nextDst][1], p.velx, p.vely, true)) {
        if (p.nextDst == p.path.length - 1) {
          //end of path reached
          particleList.splice(i, 1);
          continue;
        }
        p.x = p.path[p.nextDst][0];
        p.y = p.path[p.nextDst][1];
        p.nextDst += 1;

        if (p.normalize.indexOf(p.nextDst) >= 0 || normalizeAll === true) {
          var vectorlength = Math.sqrt(Math.pow((p.path[p.nextDst][0] - p.x), 2) + Math.pow((p.path[p.nextDst][1] - p.y), 2));
          p.velx = (p.path[p.nextDst][0] - p.x) / vectorlength * particleSpeed;
          p.vely = (p.path[p.nextDst][1] - p.y) / vectorlength * particleSpeed;
        }
        else {
          p.velx = (p.path[p.nextDst][0] - p.x) / runtimeFactor * particleSpeed;
          p.vely = (p.path[p.nextDst][1] - p.y) / runtimeFactor * particleSpeed;
        }
      }
    }
  }
  return;
}

function toggleFade() {
  checkbox = document.getElementById("togglefade");
  if (checkbox.checked) {
    useFade = true;
  }
  else {
    useFade = false;
  }
}

function toggleRuntime() {
  checkbox = document.getElementById("toggleruntime");
  if (checkbox.checked) {
    //runtimeFactor = 500;
    particleSpeed = 3;
  }
  else {
    //runtimeFactor = 200;
    particleSpeed = 10;
  }
}

function toggleNormalize() {
  checkbox = document.getElementById("togglenormalize");
  if (checkbox.checked) {
    normalizeAll = true;
  }
  else {
    normalizeAll = false;
  }
}
