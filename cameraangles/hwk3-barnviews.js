// ====================================================================
//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

//cameraParams for aspectRation, near and far
var cameraParams = {
  aspectRatio: 800/500,
  near: 1,
  far: 200
}

//All of the position, up.set and lookAt information for the camera for each key click
var keyParams = {
  1: [90, 0, 0, 30, 0, 1, 0, 0, 0, 0],
  2: [60, 30, 0, 40, 0, 1, 0, 0, 0, 0],
  3: [60, 20, 20, 20, 0, 1, 0, 0, 0, 0],
  4: [60, 0, 50, 0, 2, 2, 0, 0, 0, 0],
  5: [60, 0, 50, 0, 10, 0, -20, 0, 0, 0]
}

function setupCamera(scene, keyInt) {
    // camera shape
    var fov    = keyParams[keyInt][0] || 90;  // in degrees
    var aspect = cameraParams.aspectRatio || 800/500;  // canvas width/height
    var near   = cameraParams.near ||  1;  // measured from eye
    var far    = cameraParams.far  || 200;  // measured from eye
    var camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    // camera location
    camera.position.set(keyParams[keyInt][1],keyParams[keyInt][2],keyParams[keyInt][3]);
    camera.up.set(keyParams[keyInt][4],keyParams[keyInt][5],keyParams[keyInt][6]);
    camera.lookAt(new THREE.Vector3(keyParams[keyInt][7],keyParams[keyInt][8],keyParams[keyInt][9]));
    camera.updateProjectionMatrix();
    return camera;
}

//depending on the key hit, the camera will be set up at the location specified by that and then rerendered
function setupCameraKey(keyInt) {
  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, keyInt);

  renderer.render(scene, camera);
}

//initial setup of camera at the first position and with keyboardcallbacks
function cameraangles() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 1);

  //initializes and sets up camera, scene, renderer, boundingBox
  TW.mainInit(renderer, scene);
  document.getElementById('cameraangles').appendChild(renderer.domElement);
  renderer.render(scene, camera);

  TW.setKeyboardCallback("1",setupCameraKey.bind(this, 1),"camera setup 1"); //using bind to pass in parameters
  TW.setKeyboardCallback("2",setupCameraKey.bind(this, 2),"camera setup 2");
  TW.setKeyboardCallback("3",setupCameraKey.bind(this, 3),"camera setup 3");
  TW.setKeyboardCallback("4",setupCameraKey.bind(this, 4),"camera setup 4");
  TW.setKeyboardCallback("5",setupCameraKey.bind(this, 5),"camera setup 5");

}
