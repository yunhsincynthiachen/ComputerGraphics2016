// ====================================================================
//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

var cameraParams = {
  fov: 90,
  aspectRatio: 800/500,
  near: 1,
  far: 200,
  eyex: 0,
  eyey: 0,
  eyez: 30,
  upx: 0,
  upy: 1,
  upz: 0,
  atx: 0,
  aty: 0,
  atz: 0
}

function setupCamera(scene) {
    // camera shape
    var fov    = cameraParams.fov || 90;  // in degrees
    var aspect = cameraParams.aspectRatio || 800/500;  // canvas width/height
    var near   = cameraParams.near ||  1;  // measured from eye
    var far    = cameraParams.far  || 200;  // measured from eye
    var camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    // camera location
    camera.position.set(cameraParams.eyex,cameraParams.eyey,cameraParams.eyez);
    camera.up.set(cameraParams.upx,cameraParams.upy,cameraParams.upz);
    camera.lookAt(new THREE.Vector3(cameraParams.atx,cameraParams.aty,cameraParams.atz));
    camera.updateProjectionMatrix();
    return camera;
}

function setupCamera1() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 90, 800/500, 0, 0, 30, 0, 1, 0, 0, 0, 0);

  renderer.render(scene, camera);
}

function setupCamera2() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 60, 800/500, 30, 0, 40, 0, 1, 0, 0, 0, 0);

  renderer.render(scene, camera);
}

function setupCamera3() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 60, 800/500, 20, 20, 20, 0, 1, 0, 0, 0, 0);

  renderer.render(scene, camera);
}

function setupCamera4() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 60, 800/500, 0, 50, 0, 2, 2, 0, 0, 0, 0);

  renderer.render(scene, camera);
}

function setupCamera5() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene, 60, 800/500, 0, 50, 0, 10, 0, -20, 0, 0, 0);

  renderer.render(scene, camera);
}

function redrawCamera() {
  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene);

  renderer.render(scene, camera);
}

function cameraangles() {

  var wireBarn = TW.createWireBarn(10,10,20);
  scene.add(wireBarn);

  var camera = setupCamera(scene);

  //initializes and sets up camera, scene, renderer, boundingBox
  TW.mainInit(renderer, scene);
  document.getElementById('cameraangles').appendChild(renderer.domElement);
  renderer.render(scene, camera);

  var gui = new dat.GUI();
     gui.add(cameraParams, 'fov',0,100).onChange(redrawCamera);
     gui.add(cameraParams, 'eyex',0,200).onChange(redrawCamera);
     gui.add(cameraParams, 'eyey',0,200).onChange(redrawCamera);
     gui.add(cameraParams, 'eyez',0,200).onChange(redrawCamera);
     gui.add(cameraParams, 'upx',-200,200).onChange(redrawCamera);
     gui.add(cameraParams, 'upy',-200,200).onChange(redrawCamera);
     gui.add(cameraParams, 'upz',-200,200).onChange(redrawCamera);
     gui.add(cameraParams, 'atx',0,100).onChange(redrawCamera);
     gui.add(cameraParams, 'aty',0,100).onChange(redrawCamera);
     gui.add(cameraParams, 'atz',0,100).onChange(redrawCamera);


  // TW.setKeyboardCallback("1",setupCamera1,"camera setup 1");
  // TW.setKeyboardCallback("2",setupCamera2,"camera setup 2");
  // TW.setKeyboardCallback("3",setupCamera3,"camera setup 3");

}
