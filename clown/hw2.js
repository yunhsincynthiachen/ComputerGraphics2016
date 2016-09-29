// ====================================================================
//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

var materials = {
  bodyMaterial: new THREE.MeshBasicMaterial({color: 0x457650}),
  legMaterial: new THREE.MeshBasicMaterial({color: 0xFF0000}),
  hatMaterial: new THREE.MeshBasicMaterial({color: 0x00E5EE}),
  feetMaterial: new THREE.MeshBasicMaterial( { color: "blue" }),
  faceMaterial: new THREE.MeshBasicMaterial({color: 0x6543d2}),
  headMaterial: new THREE.MeshBasicMaterial({color: 0xe5fcfd}),
  mouthMaterial: new THREE.MeshBasicMaterial({color: 0xd24399}),
};

var clownParams = {
  headRadius: 7,
  earRadius: 2.5,
  eyeRadius: 0.75,
  noseRadius: 0.5,
  mouthRadius: 0.85,
  mouthTube: 0.35,
  hatRadiusTop: 8,
  hatRadiusBottom: 5,
  hatLength: 10,
  rimRadius: 10,
  rimThickness: 1,
  bodyRadius: 10,
  bodyScaleY: 1.1,
  sphereDetail: 50,
  cylinderDetail: 50,
  torusDetail: 50,
  legRadius: 1.25,
  legLength: 10,
  feetRadius: 3,
  feetPhiStartAngle: Math.PI,
  feetPhiLength: Math.PI,
  feetThetaStartAngle: 3*Math.PI/2,
  shoulderRadius: 3,
  handRadius: 2,
  armRadius: 1.25,
  armLength: 12,
  basicMaterials: materials
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

function createLeg(params) {
  var leg = new THREE.Object3D();
  var cd = params.cylinderDetail || 20;
  var legGeom = new THREE.CylinderGeometry(params.legRadius, params.legRadius, params.legLength, cd);
  var legMesh = new THREE.Mesh(legGeom,  params.basicMaterials.legMaterial);
  legMesh.position.y = -params.legLength/2;
  leg.add(legMesh);
  return leg;
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

function createArm(params) {
  var arm = new THREE.Object3D();
  var cd = params.cylinderDetail || 20;
  var armGeom = new THREE.CylinderGeometry(params.armRadius, params.armRadius, params.armLength, cd);
  var armMesh = new THREE.Mesh(armGeom,  params.basicMaterials.legMaterial);
  armMesh.position.y = -params.armLength/2;
  arm.add(armMesh);
  return arm;
}

function createShoulder(params) {
  var shoulder = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var shoulderGeom = new THREE.SphereGeometry(params.shoulderRadius, sd, sd);
  var shoulderMesh = new THREE.Mesh(shoulderGeom,  params.basicMaterials.feetMaterial);
  shoulder.add(shoulderMesh);
  return shoulder;
}

function createEar(params) {
  var ear = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var earGeom = new THREE.SphereGeometry(params.earRadius, sd, sd);
  var earMesh = new THREE.Mesh(earGeom,  params.basicMaterials.faceMaterial);
  ear.add(earMesh);
  return ear;
}

function createEye(params) {
  var eye = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var eyeGeom = new THREE.SphereGeometry(params.eyeRadius, sd, sd);
  var eyeMesh = new THREE.Mesh(eyeGeom,  params.basicMaterials.faceMaterial);
  eye.add(eyeMesh);
  return eye;
}

function createNose(params) {
  var nose = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var noseGeom = new THREE.SphereGeometry(params.noseRadius, sd, sd);
  var noseMesh = new THREE.Mesh(noseGeom,  params.basicMaterials.faceMaterial);
  nose.add(noseMesh);
  return nose;
}

function createMouth(params) {
  var mouth = new THREE.Object3D();
  var td = params.torusDetail || 20;
  var mouthGeom = new THREE.TorusGeometry(params.mouthRadius, params.mouthTube, td, td, Math.PI);
  var mouthMesh = new THREE.Mesh(mouthGeom,  params.basicMaterials.mouthMaterial);
  mouth.add(mouthMesh);
  mouth.rotation.x = Math.PI;
  return mouth;
}

function createHat(params) {
  var hat = new THREE.Object3D();
  var cd = params.cylinderDetail || 20;
  var hatGeom = new THREE.CylinderGeometry(params.hatRadiusTop, params.hatRadiusBottom, params.hatLength, cd);
  var hatMesh = new THREE.Mesh(hatGeom,  params.basicMaterials.hatMaterial);
  hat.add(hatMesh);
  return hat;
}

function createRim(params) {
  var rim = new THREE.Object3D();
  var cd = params.cylinderDetail || 20;
  var rimGeometry = new THREE.CylinderGeometry(params.rimRadius, params.rimRadius, params.rimThickness, cd, cd);
  var rimMesh = new THREE.Mesh(rimGeometry,  params.basicMaterials.hatMaterial);
  rim.add(rimMesh);
  return rim;
}

function addFeet(leg, params, side) {
  var feet = createFeet(params);
  feet.name = (side == 1 ? "right feet" : "left feet");
  leg.add(feet);
}

function addLeg(clown, params, side) {
  var leg = createLeg(params);
  leg.name = (side == 1 ? "right leg" : "left leg");
  var radius = params.bodyRadius || 10;
  var scale = params.bodyScaleY || 1.2;
  var hx = side * radius * 0.25;
  var hy = scale * radius * -0.9;
  leg.position.set(hx, hy, 0);
  clown.add(leg);
  addFeet(leg, params, side);
}

function addHand(arm, params, side) {
  var hand = createHand(params);
  hand.name = (side == 1 ? "right hand" : "left hand");
  arm.add(hand);
}

function addArm(shoulder, params, side) {
  var arm = createArm(params);
  arm.name = (side == 1 ? "right arm" : "left arm");
  shoulder.add(arm);
  arm.rotation.z = side * Math.PI/12;
  addHand(arm, params, side);
}

function addShoulder(clown, params, side) {
  var shoulder = createShoulder(params);
  shoulder.name = (side == 1 ? "right shoulder" : "left shoulder");
  var radius = params.bodyRadius || 10;
  var scale = params.bodyScaleY || 2;
  var hx = side * radius * 0.95;
  var hy = scale * radius * 0.5;
  shoulder.position.set(hx, hy, 0);
  clown.add(shoulder);
  addArm(shoulder, params, side);
}

function addEars(head, params, side) {
  var ear = createEar(params);
  ear.name = (side == 1 ? "right ear" : "left ear");
  var radius = params.headRadius || 7;
  var hx = side * radius * 0.95;
  ear.position.set(hx, 0, 0);
  head.add(ear);
}

function addEyes(head, params, side) {
  var eye = createEye(params);
  eye.name = (side == 1 ? "right eye" : "left eye");
  var radius = params.headRadius || 7;
  var hx = side * radius * 0.35;
  eye.position.set(hx, 0, radius);
  head.add(eye);
}

function addNose(head, params) {
  var nose = createNose(params);
  var radius = params.headRadius || 7;
  var hy = radius * -0.15;
  nose.position.set(0, hy, radius);
  head.add(nose);
}

function addMouth(head, params) {
  var mouth = createMouth(params);
  var radius = params.headRadius || 7;
  var hy = radius * -0.45;
  var hz = radius * 0.85;
  mouth.position.set(0, hy, hz);
  head.add(mouth);
}

function addHat(head, params) {
  var rim = createRim(params);
  var hat = createHat(params);
  var radius = params.headRadius || 7;
  var hx = radius * 0.25;
  rim.position.set(0, radius*0.6, 0);
  hat.position.set(hx, radius, 0);
  head.add(rim);
  head.add(hat);
  // rim.rotation.x = Math.PI/2;
  rim.rotation.z = -Math.PI/16;
  rim.rotation.y = -Math.PI/8;
  hat.rotation.z = -Math.PI/8;
  hat.rotation.y = Math.PI/4;
}

function createBody(params) {
  var body = new THREE.Object3D();
  var radius = params.bodyRadius || 3;
  var sd = params.sphereDetail || 20;
  var scale = params.bodyScaleY || 2;
  var bodyGeom = new THREE.SphereGeometry(radius, sd, sd);
  var bodyMesh = new THREE.Mesh(bodyGeom,  params.basicMaterials.bodyMaterial);
  bodyMesh.scale.y = scale;
  body.add(bodyMesh);
  addLeg(body, params, 1);
  addLeg(body, params, -1);
  addShoulder(body, params, 1);
  addShoulder(body, params, -1);
  return body;
}

function createHead(params) {
  var head = new THREE.Object3D();
  var sd = params.sphereDetail || 20;
  var headGeom = new THREE.SphereGeometry(params.headRadius, sd, sd);
  var headMesh = new THREE.Mesh(headGeom,  params.basicMaterials.headMaterial);
  head.add(headMesh);
  addEars(head, params, 1);
  addEars(head, params, -1);
  addEyes(head, params, 1);
  addEyes(head, params, -1);
  addNose(head, params);
  addMouth(head, params);
  addHat(head, params);
  return head;
}

function clown() {

  var clown = new THREE.Object3D();
  var body = createBody(clownParams);
  clown.add(body);

  var head = createHead(clownParams);
  var bs = clownParams.bodyScaleY || 1.1;
  var br = clownParams.bodyRadius || 10;
  var hr = clownParams.headRadius || 7;
  head.position.y = bs*br + hr;
  clown.add(head);
  clown.position.y = bs*br/2 + clownParams.legLength + clownParams.feetRadius*2;

  //sets bounding box location
  var boundingBox = {
    minx: -5, maxx: 5,
    miny: -10, maxy: 50,
    minz: -20, maxz: 20
  };

  var geometry = new THREE.SphereGeometry( 1, 20, 20 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  var sphere = new THREE.Mesh( geometry, material );

  scene.add(sphere);
  scene.add(clown);
  //initializes and sets up camera, scene, renderer, boundingBox
  TW.mainInit(renderer, scene);
  document.getElementById('clown').appendChild(renderer.domElement);
  TW.cameraSetup(renderer, scene, boundingBox);
}
