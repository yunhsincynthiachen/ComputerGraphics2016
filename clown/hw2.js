// ====================================================================
//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

//Set different colors for different parts of the clown
var materials = {
  bodyMaterial: new THREE.MeshBasicMaterial({color: 0x457650}),
  legMaterial: new THREE.MeshBasicMaterial({color: 0xFF0000}),
  hatMaterial: new THREE.MeshBasicMaterial({color: 0x00E5EE}),
  feetMaterial: new THREE.MeshBasicMaterial( { color: "blue" }),
  faceMaterial: new THREE.MeshBasicMaterial({color: 0x6543d2}),
  headMaterial: new THREE.MeshBasicMaterial({color: 0xe5fcfd}),
  mouthMaterial: new THREE.MeshBasicMaterial({color: 0xd24399}),
};

//List of sides
var leftRight = [1,-1];

//The different params for the length, radius, angles, etc. for the clown dimensions
var clownParams = {
  armLength: 12,
  armRadius: 1.25,
  armRotation: Math.PI/12,
  basicMaterials: materials,
  bodyRadius: 10,
  bodyScaleY: 1.1,
  cylinderDetail: 50,
  earRadius: 2.5,
  eyeRadius: 0.75,
  feetPhiLength: Math.PI,
  feetPhiStartAngle: Math.PI,
  feetRadius: 3,
  feetThetaStartAngle: 3*Math.PI/2,
  handRadius: 2,
  hatLength: 10,
  hatRadiusBottom: 5,
  hatRadiusTop: 8,
  headRadius: 7,
  hipWidthPercent: 0.25,
  hipHeightPercent: -0.9,
  legLength: 10,
  legRadius: 1.25,
  mouthRadius: 0.85,
  mouthTube: 0.35,
  noseRadius: 0.5,
  rimRadius: 10,
  rimThickness: 1,
  shoulderHeightPercent: 0.5,
  shoulderRadius: 3,
  shoulderWidthPercent: 0.95,
  sphereDetail: 50,
  torusDetail: 50
};

function createFeet(params) {
  var feet = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var feetGeom = new THREE.SphereGeometry( params.feetRadius, sd, sd, params.feetPhiStartAngle, params.feetPhiLength, params.feetThetaStartAngle);
  var feetMesh = new THREE.Mesh(feetGeom, params.basicMaterials.feetMaterial);
  feetMesh.material.side = THREE.DoubleSide;
  feetMesh.position.y = -(params.feetRadius/2 + params.legLength);
  feet.add(feetMesh);
  return feet;
}

function addFeet(leg, params, side) {
  var feet = createFeet(params);
  feet.name = (side == 1 ? "right feet" : "left feet");
  leg.add(feet);
}

function createLimb(params, limbType) {
  var limb = new THREE.Object3D();
  var radius = (limbType == "arm" ? params.armRadius : params.legRadius);
  var length = (limbType == "arm" ? params.armLength : params.legLength);
  var cd = params.cylinderDetail || 20;
  var limbGeom = new THREE.CylinderGeometry(radius, radius, length, cd);
  var limbMesh = new THREE.Mesh(limbGeom,  params.basicMaterials.legMaterial);
  limbMesh.position.y = -length/2;
  limb.add(limbMesh);
  return limb;
}

function addLeg(clown, params, side) {
  var leg = createLimb(params, 'leg');
  leg.name = (side == 1 ? "right leg" : "left leg");
  var radius = params.bodyRadius || 10;
  var scale = params.bodyScaleY || 1.2;
  var hx = params.hipWidthPercent * radius * side || side * radius * 0.25;
  var hy = params.hipHeightPercent * scale * radius  || scale * radius * -0.9;
  leg.position.set(hx, hy, 0);
  clown.add(leg);
  addFeet(leg, params, side);
}

function createHand(params) {
  var hand = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var handGeom = new THREE.SphereGeometry(params.handRadius, sd, sd);
  var handMesh = new THREE.Mesh(handGeom,  params.basicMaterials.feetMaterial);
  handMesh.position.y = -5;
  handMesh.position.y = -(params.armLength + params.handRadius/2);
  hand.add(handMesh);
  return hand;
}

function addHand(arm, params, side) {
  var hand = createHand(params);
  hand.name = (side == 1 ? "right hand" : "left hand");
  arm.add(hand);
}

function addArm(shoulder, params, side) {
  var arm = createLimb(params, 'arm');
  arm.name = (side == 1 ? "right arm" : "left arm");
  shoulder.add(arm);
  arm.rotation.z = side * params.armRotation;
  addHand(arm, params, side);
}

function createShoulder(params) {
  var shoulder = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var shoulderGeom = new THREE.SphereGeometry(params.shoulderRadius, sd, sd);
  var shoulderMesh = new THREE.Mesh(shoulderGeom,  params.basicMaterials.feetMaterial);
  shoulder.add(shoulderMesh);
  return shoulder;
}

function addShoulder(clown, params, side) {
  var shoulder = createShoulder(params);
  shoulder.name = (side == 1 ? "right shoulder" : "left shoulder");
  var radius = params.bodyRadius || 10;
  var scale = params.bodyScaleY || 2;
  var hx = side * radius * params.shoulderWidthPercent || side * radius * 0.95;
  var hy = scale * radius * params.shoulderHeightPercent || scale * radius * 0.5;
  shoulder.position.set(hx, hy, 0);
  clown.add(shoulder);
  addArm(shoulder, params, side);
}


function createFaceParts(params, componentType) {
  var faceObject = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var radius;
  if (componentType == 'eye') {
    radius = params.eyeRadius;
  } else if (componentType == 'nose') {
    radius = params.noseRadius;
  } else {
    radius = params.earRadius;
  }
  var facePartGeom = new THREE.SphereGeometry(radius, sd, sd);
  var facePartMesh = new THREE.Mesh(facePartGeom,  params.basicMaterials.faceMaterial);
  faceObject.add(facePartMesh);
  return faceObject;
}

function addEars(head, params, side) {
  var ear = createFaceParts(params, 'ear');
  ear.name = (side == 1 ? "right ear" : "left ear");
  var radius = params.headRadius || 7;
  var hx = side * radius * 0.95;
  ear.position.set(hx, 0, 0);
  head.add(ear);
}

function addEyes(head, params, side) {
  //Adds eyes on the head on the right and left side
  var eye = createFaceParts(params, 'eye');
  eye.name = (side == 1 ? "right eye" : "left eye");
  var radius = params.headRadius || 7;
  var hx = side * radius * 0.35;
  eye.position.set(hx, 0, radius);
  head.add(eye);
}

function addNose(head, params) {
  //Adds a nose to the head that is below the level of the eyes
  var nose = createFaceParts(params, 'nose');
  var radius = params.headRadius || 7;
  var hy = radius * -0.15;
  nose.position.set(0, hy, radius);
  head.add(nose);
}

function createMouth(params) {
  //Returns an object with the mouth as a torus that is only half a donut
  var mouth = new THREE.Object3D();
  var td = params.torusDetail || 20;
  var mouthGeom = new THREE.TorusGeometry(params.mouthRadius, params.mouthTube, td, td, Math.PI);
  var mouthMesh = new THREE.Mesh(mouthGeom,  params.basicMaterials.mouthMaterial);
  mouth.add(mouthMesh);
  mouth.rotation.x = Math.PI;
  return mouth;
}

function addMouth(head, params) {
  //Adds mouth to head
  var mouth = createMouth(params);
  var radius = params.headRadius || 7;
  var hy = radius * -0.45;
  var hz = radius * 0.85;
  mouth.position.set(0, hy, hz);
  head.add(mouth);
}

function createHat(params) {
  //Returns an object with the hat with a larger top radius than the bottom
  var hat = new THREE.Object3D();
  var cd = params.cylinderDetail || 20;
  var hatGeom = new THREE.CylinderGeometry(params.hatRadiusTop, params.hatRadiusBottom, params.hatLength, cd);
  var hatMesh = new THREE.Mesh(hatGeom,  params.basicMaterials.hatMaterial);
  hat.add(hatMesh);
  return hat;
}

function createRim(params) {
  //Returns an object with the rim as a very thin cylinder
  var rim = new THREE.Object3D();
  var cd = params.cylinderDetail || 20;
  var rimGeometry = new THREE.CylinderGeometry(params.rimRadius, params.rimRadius, params.rimThickness, cd, cd);
  var rimMesh = new THREE.Mesh(rimGeometry,  params.basicMaterials.hatMaterial);
  rim.add(rimMesh);
  return rim;
}

function addHat(head, params) {
  //Adds a hat with rim and hat body components
  var rim = createRim(params);
  var hat = createHat(params);
  var radius = params.headRadius || 7;
  var hx = radius * 0.25;
  var hy = radius * 0.6;
  rim.position.set(0, hy, 0); //positions rim to be on top and covers a little of the head
  hat.position.set(hx, radius, 0); //positions hat to be on top of the head
  head.add(rim);
  //Rotates rim to be slanted
  rim.rotation.z = -Math.PI/16;
  rim.rotation.y = -Math.PI/8;
  head.add(hat);
  //Rotates hat to be slanted and match the rim
  hat.rotation.z = -Math.PI/16;
  hat.rotation.y = Math.PI/8;
}

function createBody(params) {
  //Creates the body and adds legs, shoulders
  var body = new THREE.Object3D();
  var radius = params.bodyRadius || 3;
  var sd = params.sphereDetail || 20;
  var scale = params.bodyScaleY || 2;
  var bodyGeom = new THREE.SphereGeometry(radius, sd, sd);
  var bodyMesh = new THREE.Mesh(bodyGeom,  params.basicMaterials.bodyMaterial);
  bodyMesh.scale.y = scale;
  body.add(bodyMesh);

  //Adds body components:
  for (var i = 0; i < leftRight.length; i++) {
    addLeg(body, params, leftRight[i]);
    addShoulder(body, params, leftRight[i]);
  }
  return body;
}

function createHead(params) {
  //Creates the head and adds ears, eyes, nose, mouth and hat to the head
  var head = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var headGeom = new THREE.SphereGeometry(params.headRadius, sd, sd);
  var headMesh = new THREE.Mesh(headGeom,  params.basicMaterials.headMaterial);
  head.add(headMesh);

  //Adds head components (left and right for ears and eyes):
  for (var i = 0; i < leftRight.length; i++) {
    addEars(head, params, leftRight[i]);
    addEyes(head, params, leftRight[i]);
  }
  addNose(head, params);
  addMouth(head, params);
  addHat(head, params);
  return head;
}

function clown() {

  //Creates the clown object
  var clown = new THREE.Object3D();

  //Calls createBody to make the clown body and adds it to clown object
  var body = createBody(clownParams);
  clown.add(body);

  //Calls createHead to make clown head and then positions it on top of the clown body
  var head = createHead(clownParams);
  var bs = clownParams.bodyScaleY || 1.1;
  var br = clownParams.bodyRadius || 10;
  var hr = clownParams.headRadius || 7;
  head.position.y = bs*br + hr;
  clown.add(head);

  //Positions clown to have feet on origin
  clown.position.y = clownParams.legLength - (br*bs*clownParams.hipHeightPercent) + clownParams.feetRadius/2;

  //Sets bounding box location
  var boundingBox = {
    minx: -5, maxx: 5,
    miny: -10, maxy: 50,
    minz: -20, maxz: 20
  };

  //Yelow sphere that marks the origin
  var geometry = new THREE.SphereGeometry( 1, 20, 20 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  var sphere = new THREE.Mesh( geometry, material );

  scene.add(sphere); //add sphere to origin
  scene.add(clown); // add clown to scene

  //initializes and sets up camera, scene, renderer, boundingBox
  TW.mainInit(renderer, scene);
  document.getElementById('clown').appendChild(renderer.domElement);
  TW.cameraSetup(renderer, scene, boundingBox);
}
