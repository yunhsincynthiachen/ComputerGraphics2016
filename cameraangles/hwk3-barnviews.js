// ====================================================================
//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

var cameraParams = {
  aspectRatio: 800/500,
  near: 1,
  far: 200
}

function setupCamera(scene, fov, eyex, eyey, eyez, upx, upy, upz, atx, aty, atz) {
    // camera shape
    var fov    = fov || 90;  // in degrees
    var aspect = cameraParams.aspectRatio || 800/500;  // canvas width/height
    var near   = cameraParams.near ||  1;  // measured from eye
    var far    = cameraParams.far  || 200;  // measured from eye
    var camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    // camera location
    camera.position.set(eyex,eyey,eyez);
    camera.up.set(upx,upy,upz);
    camera.lookAt(new THREE.Vector3(atx,aty,atz));
    camera.updateProjectionMatrix();
    return camera;
}

function setupCamera1() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 90, 0, 0, 30, 0, 1, 0, 0, 0, 0);

  renderer.render(scene, camera);
}

function setupCamera2() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 60, 30, 0, 40, 0, 1, 0, 0, 0, 0);

  renderer.render(scene, camera);
}

function setupCamera3() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 60, 20, 20, 20, 0, 1, 0, 0, 0, 0);

  renderer.render(scene, camera);
}

function setupCamera4() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 60, 0, 50, 0, 2, 2, 0, 0, 0, 0);

  renderer.render(scene, camera);
}

function setupCamera5() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 60, 0, 50, 0, 10, 0, -20, 0, 0, 0);

  renderer.render(scene, camera);
}

function cameraangles() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 90, 0, 0, 30, 0, 1, 0, 0, 0, 0);

  //initializes and sets up camera, scene, renderer, boundingBox
  TW.mainInit(renderer, scene);
  document.getElementById('cameraangles').appendChild(renderer.domElement);
  renderer.render(scene, camera);

  TW.setKeyboardCallback("1",setupCamera1,"camera setup 1");
  TW.setKeyboardCallback("2",setupCamera2,"camera setup 2");
  TW.setKeyboardCallback("3",setupCamera3,"camera setup 3");
  TW.setKeyboardCallback("4",setupCamera4,"camera setup 4");
  TW.setKeyboardCallback("5",setupCamera5,"camera setup 5");

}
