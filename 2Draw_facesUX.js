// ----=  Faces  =----
/* load images here */
function prepareInteraction() {
  border = loadImage('images/runeborder.png');
}

// global variables
let isMouthOpen = false;
let glowpulse = 0
let glowdirection = 1;
let beamGrowth = 0;
let beamSpeed = 0.05;
let cheekGrowth = 0;

function drawInteraction(faces, hands) {

  // for loop to capture if there is more than one face on the screen. This applies the same process to all faces. 
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i]; // face holds all the keypoints of the face\
    //  console.log(face);
    if (showKeypoints) {
      drawPoints(face)
    }

    /*
    Once this program has a face, it knows some things about it.
    This includes how to draw a box around the face, and an oval. 
    It also knows where the key points of the following parts are:
     face.leftEye
     face.leftEyebrow
     face.lips
     face.rightEye
     face.rightEyebrow
    */
    // Face basics
    let faceCenterX = face.faceOval.centerX;
    let faceCenterY = face.faceOval.centerY;
    let faceWidth = face.faceOval.width;
    let faceheight = face.faceOval.height;
    // Left eye
    let leftEyeCenterX = face.leftEye.centerX;
    let leftEyeCenterY = face.leftEye.centerY;
    let leftEyeWidth = face.leftEye.width;
    let leftEyeHeight = face.leftEye.height;
    // Left eyebrow
    let leftEyebrowCenterX = face.leftEyebrow.centerX;
    let leftEyebrowCenterY = face.leftEyebrow.centerY;
    let leftEyebrowWidth = face.leftEyebrow.width;
    let leftEyebrowHeight = face.leftEyebrow.height;

    // Lips
    let lipsCenterX = face.lips.centerX;
    let lipsCenterY = face.lips.centerY;
    let lipsWidth = face.lips.width;
    let lipsHeight = face.lips.height;

    // Right eye
    let rightEyeCenterX = face.rightEye.centerX;
    let rightEyeCenterY = face.rightEye.centerY;
    let rightEyeWidth = face.rightEye.width;
    let rightEyeHeight = face.rightEye.height;

    // Right eyebrow
    let rightEyebrowCenterX = face.rightEyebrow.centerX;
    let rightEyebrowCenterY = face.rightEyebrow.centerY;
    let rightEyebrowWidth = face.rightEyebrow.width;
    let rightEyebrowHeight = face.rightEyebrow.height;

    let noseTipX = face.keypoints[4].x;
    let noseTipY = face.keypoints[4].y;

    /*
    Start drawing on the face here
    */

//border image
if (border) {
  push();
  imageMode(CENTER);
  drawingContext.shadowBlur = 40;
  drawingContext.shadowColor = color(255,255,255,180);
  tint(255,180);
  image(border,width/2,height/2,width*1.4,height*1.4);
  pop();
}

//beam animation
    checkIfMouthOpen(face);

    if (isMouthOpen) {
      beamGrowth += beamSpeed
      if (beamGrowth > 1) beamGrowth = 1;
    } else {
      beamGrowth -= beamSpeed;
      if (beamGrowth <0) beamGrowth = 0;
    }

//left eye
    drawGlowEye
      (leftEyeCenterX,leftEyeCenterY,
        leftEyeWidth*1,leftEyeHeight*1,
        color(200,0,255,255),glowpulse);

  //right eye
    drawGlowEye
    (rightEyeCenterX,rightEyeCenterY,
      rightEyeWidth*1,rightEyeHeight*1,
      color(200,0,255,255),glowpulse);


//eye glow and pulse
function drawGlowEye(x,y,w,h,col,pulse){
  let outerpulse = sin(frameCount * 0.1) * 0.5 + 0.5;
  let innerglowcol = lerpColor(color(255,100,255),color(0,200,255),outerpulse);
  let outerglowcol = lerpColor(color(200,0,255),color(0,100,255),1-outerpulse);

  drawingContext.shadowBlur = 80 + pulse*4;
  drawingContext.shadowColor = outerglowcol;
  fill(red(outerglowcol),green(outerglowcol),blue(outerglowcol),60);
  ellipse(x,y,w,h);

  drawingContext.shadowBlur = 50 + pulse*3;
  drawingContext.shadowColor = col;
  fill(red(col),green(col),blue(col),120);
  ellipse(x,y,w,h);

  drawingContext.shadowBlur = 30 + pulse*2;
  drawingContext.shadowColor = innerglowcol;
  fill(red(innerglowcol),green(innerglowcol),blue(innerglowcol),200);
  ellipse(x,y,w,h);

  drawingContext.shadowBlur = 15 + pulse;
  drawingContext.shadowColor = color(255,255,255);
  fill(255,255,255,255);
  ellipse(x,y,w,h);

  blurryellipse(x,y,w,h,color(255,255,255),12);

  pop();
  }

//blurry eye ellipse
function blurryellipse(x,y,w,h,baseCol,layers = 10){
  noFill();
  for (let i = 0; i < layers; i++){
    let alpha = map(i,0,layers,120,0);
    let weight = map(i,0,layers,1,7);
    let scale = map(i,0,layers - 1,0.95,1.1);
    stroke(red(baseCol),green(baseCol),blue(baseCol),alpha);
    strokeWeight(weight);
    ellipse(x,y,w*scale,h*scale);
  }
}

//eye beams
drawEyeBeams(leftEyeCenterX,leftEyeCenterY,60,color(255,200,255,180));
drawEyeBeams(rightEyeCenterX,rightEyeCenterY,60,color(255,200,255,180));

function drawEyeBeams(x,y,length = 50,baseCol = color(255,255,255),layers = 10){
  let pulse = sin(frameCount * 0.1) * 0.5+ 0.5;

  for (let i = 0; i < layers; i++){
    let alpha = map(i,0,layers - 1,180,0)
    let weight = map(i,0,layers-1,6,1);
    let beamScale = map(i,0,layers - 1,0.8,1.2);
    let beamLength = length * beamScale * beamGrowth;
    let beamAlpha = map(i,0,layers-1,150,0)* pulse * beamGrowth
    let beamGlow = map(i,0,layers - 1, 40,0)* pulse * beamGrowth

    stroke(255,255,255,alpha);
    strokeWeight(weight);
      line(x-beamLength,y,x+beamLength,y);
      line(x,y-beamLength,x,y+beamLength);

    drawingContext.shadowBlur = map(i,0,layers-1,50,0);
    drawingContext.shadowColor = color(255,255,255,alpha);

    stroke(255,255,255,alpha);
    strokeWeight(weight+2);
    drawingContext.shadowBlur = beamGlow;
    drawingContext.shadowColor = color (255,255,255,beamAlpha);

  }
}


// cheek highlight 1
drawHighlight(face);

function drawHighlight (face){

  if (isMouthOpen){
    cheekGrowth += 0.02;
    if (cheekGrowth > 1) cheekGrowth = 1;
  } else {
    cheekGrowth -= 0.02;
    if (cheekGrowth <0) cheekGrowth = 0;
  }
  
  if (cheekGrowth < 0.01) return;

  let pulse = sin(frameCount * 0.1) * 0.5 + 0.5
  let highlightPoints = [143,111,117,118];
  let xPoints = [];
  let yPoints = [];

  for (let i = 0; i < highlightPoints.length; i++){
    let pt = face.keypoints[highlightPoints[i]];
    xPoints.push(pt.x);
    yPoints.push(pt.y);
  }
  
  let layers = 6;
  for (let j = 0; j < layers; j++){
    let baseAlpha = map(j,0,layers-1,60,255);
    let alpha = baseAlpha * cheekGrowth;
    let blur = map(j,0,layers-1,40,10)*pulse;
    let scaleFactor = map(j,0,layers-1,1.05,1.0);
  

  drawingContext.shadowBlur = blur;
  drawingContext.shadowColor = color(255,255,255,alpha);
  noStroke();
  fill(255,255,255,alpha);

  
  beginShape();
  for(let i = 0; i < xPoints.length; i++){
    let cx = xPoints[i];
    let cy = yPoints[i];

    let centerX = (xPoints.reduce((a,b) => a + b) / xPoints.length);
    let centerY = (yPoints.reduce((a,b) => a + b) / yPoints.length);
    let scaledX = centerX + (cx - centerX) * scaleFactor;
    let scaledY = centerY + (cy - centerY) * scaleFactor;

    vertex(scaledX,scaledY);
  }

endShape();
}
}
  
//cheek highlight 2
drawHightlight2(face);

function drawHightlight2(face){

  if (isMouthOpen){
    cheekGrowth += 0.02;
    if (cheekGrowth > 1) cheekGrowth = 1;
  } else {
    cheekGrowth -= 0.02;
    if (cheekGrowth <0) cheekGrowth = 0;
  }
  
  if (cheekGrowth < 0.01) return;

  let pulse = sin(frameCount * 0.2) * 0.05 + 0.9
  let highlightPoints = [372,340,346,347];
  let xPoints = [];
  let yPoints = [];

  for (let i = 0; i < highlightPoints.length; i++){
    let pt = face.keypoints[highlightPoints[i]];
    xPoints.push(pt.x);
    yPoints.push(pt.y);
  }
  
  let layers = 6;
  for (let j = 0; j < layers; j++){
    let baseAlpha = map(j,0,layers-1,60,255);
    let alpha = baseAlpha * cheekGrowth;
    let blur = map(j,0,layers-1,40,10)*pulse;
    let scaleFactor = map(j,0,layers-1,1.05,1.0);
  

  drawingContext.shadowBlur = blur;
  drawingContext.shadowColor = color(255,255,255,alpha);
  noStroke();
  fill(255,255,255,alpha);

  
  beginShape();
  for(let i = 0; i < xPoints.length; i++){
    let cx = xPoints[i];
    let cy = yPoints[i];

    let centerX = (xPoints.reduce((a,b) => a + b) / xPoints.length);
    let centerY = (yPoints.reduce((a,b) => a + b) / yPoints.length);
    let scaledX = centerX + (cx - centerX) * scaleFactor;
    let scaledY = centerY + (cy - centerY) * scaleFactor;

    vertex(scaledX,scaledY);
  }

endShape();
}
}



    /*
    Stop drawing on the face here
    */

  }
  //------------------------------------------------------
  // You can make addtional elements here, but keep the face drawing inside the for loop. 
}


function checkIfMouthOpen(face) {

  let upperLip = face.keypoints[13]
  let lowerLip = face.keypoints[14]
  // ellipse(lowerLip.x,lowerLip.y,20)
  // ellipse(upperLip.x,upperLip.y,20)

  let d = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
  //console.log(d)
  if (d < 10) {
    isMouthOpen = false;
  } else {
    isMouthOpen = true;
  }

}

function drawX(X, Y) {
  push()

  strokeWeight(15)
  line(X - 20, Y - 20, X + 20, Y + 20)
  line(X - 20, Y + 20, X + 20, Y - 20)

  pop()
}


// This function draw's a dot on all the keypoints. It can be passed a whole face, or part of one. 
function drawPoints(feature) {

  push()
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 5);
  }
  pop()
  
}