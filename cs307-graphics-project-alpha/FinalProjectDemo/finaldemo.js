//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

//Different door types that match to different jpg/png files
var doorTypes = ['door1.jpg', 'door2.jpg', 'door3.png', 'door4.png'];

var helix_points;
var point = 0;
var sphereMesh;

var animationState;

//Default sceneParams for the spline and balls on the spline
var sceneParams = {
    helixSphereRadius: 5,
    widthHeightSegments: 50,
    numHelixPoints: 50,
    helixTubularSegments: 250,
    helixRadiusSegments: 5,
    helixTubeRadius: 2
}

//Lambert material with grey flat shading for helix spline and sphere hooks
var splineMaterial = new THREE.MeshLambertMaterial();
splineMaterial.color = new THREE.Color("grey");
splineMaterial.shading = THREE.FlatShading;

//addLight(): adds point light and dambient light to the scene
function addLight() {
  var light = new THREE.PointLight(0xFFFFFF, 1, 0);
  light.position.set(0, 0, 100);
  scene.add(light);

  var lightAmbient = new THREE.AmbientLight(0x696969);
  scene.add(lightAmbient);
}

//addDoors(helix_points): takes in list of helix points that are equally spread out along the spline
//and adds a door of random texture to that point (no rotations now, but in future iteration)
function addDoors(helix_points) {
  for (var i=0; i<helix_points.length; i++) { //for every point
    var sphere = new THREE.SphereGeometry(sceneParams.helixSphereRadius, sceneParams.widthHeightSegments, sceneParams.widthHeightSegments);

    var sphereMesh = new THREE.Mesh(sphere, splineMaterial);
    sphereMesh.position.set(helix_points[i].x, helix_points[i].y, helix_points[i].z);

    var randDoor = Math.floor(Math.random() * 4);//randomly picks an index from 0 to 3 for the four door options
    createMonIncDoor(scene, doorTypes[randDoor], helix_points[i].x, helix_points[i].y, helix_points[i].z, 0, 0, 0); //creates and adds door of the type we want to the scene
    scene.add(sphereMesh); //adds sphere to scene on the helix
  }
}

function addSphere() {
  var sphere = new THREE.SphereGeometry(sceneParams.helixSphereRadius, sceneParams.widthHeightSegments, sceneParams.widthHeightSegments);

  sphereMesh = new THREE.Mesh(sphere, splineMaterial);
  sphereMesh.position.set(helix_points[0].x, helix_points[0].y, helix_points[0].z);
  var randDoor = Math.floor(Math.random() * 4);//randomly picks an index from 0 to 3 for the four door options
  createMonIncDoor(scene, doorTypes[randDoor], helix_points[0].x, helix_points[0].y, helix_points[0].z, 0, 0, 0); //creates and adds door of the type we want to the scene
  scene.add(sphereMesh); //adds sphere to scene on the helix
}

//createSSpline(): makes a helix curve, adds doors to a number of points along the helix and adds to scene
function createSSpline() {
  var helix = new THREE.Curve(); //initializes helix curve
  helix.getPoint = function(t) { //make helix curve by setting x, y and z in vector to match helix shape
   var s = (t - 0.5)*8*Math.PI; //the radians
   return new THREE.Vector3(
        300*Math.cos(s),
        25*s,
        50*Math.sin(s)
   );
  }

  helix_points = helix.getPoints(sceneParams.numHelixPoints).reverse(); //gets a center number of helix points
  // addDoors(helix_points); //calls addDoors to get doors added in the scene

  addSphere();
  var helixGeom = new THREE.TubeGeometry(helix,
    sceneParams.helixTubularSegments,
    sceneParams.helixTubeRadius,
    sceneParams.helixRadiusSegments); //creates helix tubegeom
  var helixMesh = new THREE.Mesh(helixGeom, splineMaterial); //creates mesh of helix

  scene.add(helixMesh);
}

//ANIMATION code
var animationId = null;

function resetAnimationState() {
    animationState = {
        doorPositionX: helix_points[0].x,
        doorPositionY: helix_points[0].y,
        doorPositionZ: helix_points[0].z,
        time: 0,
        lastParam: null
    };
}

function updatePosition() {
  var pointX = animationState.doorPositionX;
  var pointY = animationState.doorPositionY;
  var pointZ = animationState.doorPositionZ;
  sphereMesh.position.set(pointX, pointY, pointZ);
  changeDoorPosition(pointX, pointY, pointZ);
  bodyMesh.position.set(pointX-35, pointY-80, pointZ-10);
  bodyMesh.rotation.set(0,0,Math.PI/2);
}

function firstState() {
  resetAnimationState();
  point = 0;
  var currentPoint = helix_points[point];
  animationState.doorPositionX = currentPoint.x;
  animationState.doorPositionY = currentPoint.y;
  animationState.doorPositionZ = currentPoint.z;
  updatePosition();
  TW.render();
}

function updateState() {
  if (doorMesh && bodyMesh && point < sceneParams.numHelixPoints) {
    point += 1;
    var currentPoint = helix_points[point];
    animationState.doorPositionX = currentPoint.x;
    animationState.doorPositionY = currentPoint.y;
    animationState.doorPositionZ = currentPoint.z;
    updatePosition();
  } else {
    stopAnimation();
  }
}

function oneStep() {
  updateState();
  TW.render();
}

function animate() {
    oneStep();
    animationId = requestAnimationFrame(animate);
    console.log(animationId);
    console.log("One step");
}

function stopAnimation() {
    if( animationId != null ) {
        cancelAnimationFrame(animationId);
        console.log("Cancelled animation using "+animationId);
    }
}

//createCreativeScene() is the main function that initializes everthing and sets the scene
function createCreativeScene() {
  TW.mainInit(renderer,scene); //initializes scene and renderer

  createSSpline(); //adds helix and doors to scene
  createMikey(scene); //adds mike wazowski to scene
  addLight(); //adds ambient and point light to scene

  resetAnimationState();
  document.getElementById('creativescene').appendChild(renderer.domElement);

  var state = TW.cameraSetup(renderer,
                             scene,
                             {minx: -50, maxx: 50,
                              miny: -150, maxy: 100,
                              minz: -50, maxz: 100});

  TW.setKeyboardCallback("0",firstState,"reset animation");
  TW.setKeyboardCallback("1",oneStep,"advance by one step");
  TW.setKeyboardCallback("g",animate,"go:  start animation");
  TW.setKeyboardCallback(" ",stopAnimation,"stop animation");
}
