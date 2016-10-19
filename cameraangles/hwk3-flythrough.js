// ====================================================================
//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

//All of the position, up.set and lookAt information for the camera for each key click
var keyParams = {
  0: [90, 0, 45, 40, 0, 1, 0, 0, 0, 0],
  1: [90, 0, 41, 37, 0, 1, 0, 0, 1, 0],
  2: [90, 0, 37, 34, 0, 1, 0, 0, 2, 0],
  3: [90, 0, 33, 31, 0, 1, 0, 0, 3, 0],
  4: [90, 0, 29, 28, 0, 1, 0, 0, 4, 0],
  5: [90, 0, 25, 25, 0, 1, 0, 0, 5, 0],
  6: [90, 0, 21, 22, 0, 1, 0, 0, 6, 0],
  7: [90, 0, 17, 19, 0, 1, 0, 0, 7, 0],
  8: [90, 0, 13, 16, 0, 1, 0, 0, 8, 0],
  9: [90, 0, 9, 13, 0, 1, 0, 0, 9, 0]
}

function setupCamera(scene, keyInt) {
    // camera shape
    var fov    = keyParams[keyInt][0] || 90;  // in degrees
    var aspect = 800/500;  // canvas width/height
    var near   = 1;  // measured from eye
    var far    = 200;  // measured from eye
    var camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    // camera location
    camera.position.set(keyParams[keyInt][1],keyParams[keyInt][2],keyParams[keyInt][3]);
    camera.up.set(keyParams[keyInt][4],keyParams[keyInt][5],keyParams[keyInt][6]);
    camera.lookAt(new THREE.Vector3(keyParams[keyInt][7],keyParams[keyInt][8],keyParams[keyInt][9]));
    camera.updateProjectionMatrix();
    return camera;
}

function flythroughCreater() {
  //this function is a slightly modified version of a function taken from the fence demo
  //cs.wellesley.edu/~cs307/readings/05-nested-transforms.shtml
  function makeFence(numPickets) {
      /* Makes a fence, with the left end at the origin and proceeding down
         the x axis. The pickets are made from barn objects, scaled to be unit
         height (at the shoulder) and very thin. */
      var fence = new THREE.Object3D();

      var picketG = TW.createBarn(.09, 1, 0.1);
      var picketM = new THREE.MeshNormalMaterial();
      var picket = new THREE.Mesh(picketG,picketM);
      var i;

      for( i = 0; i < numPickets; ++i ) {
          picket = picket.clone();
          picket.translateX(0.1);
          fence.add(picket);
      }
      return fence;
  }

  //create a barn, fence and ground
  var barn = new TW.createMesh(TW.createBarn(5,5,10));
  scene.add(barn);

  fence = makeFence(40);
  //fence.rotation.y = Math.PI/2;
  fence.translateX(5);

  fence2 = fence.clone();
  fence2.translateZ(-10);

  fence3 = makeFence(100);
  fence3.translateX(9.2);
  fence3.rotation.y = Math.PI/2;

  scene.add(fence);
  scene.add(fence2);
  scene.add(fence3);

  // ground will go from -10 to +10 in X and Z
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(20,20),
                              new THREE.MeshBasicMaterial({color:THREE.ColorKeywords.darkgreen}));
  ground.rotation.x = -Math.PI/2;

  scene.add(ground);
  return scene;
}

//setupCameraKey takes in the int of the key that is clicked and then creates scene plus camera with correct params to be rendered
function setupCameraKey(keyInt) {
  var scene = flythroughCreater();
  var camera = setupCamera(scene, keyInt);
  renderer.render(scene, camera);
}

//initial creation of the scene and camera to be rendered, plus the keyboardCallback setup
function flythrough() {
  var scene = flythroughCreater();
  var camera = setupCamera(scene, 0);

  TW.mainInit(renderer,scene);
  document.getElementById('flythrough').appendChild(renderer.domElement);
  renderer.render(scene, camera);

  TW.setKeyboardCallback("0",setupCameraKey.bind(this, 0),"camera setup 0"); //binding to be able to pass in params
  TW.setKeyboardCallback("1",setupCameraKey.bind(this, 1),"camera setup 1");
  TW.setKeyboardCallback("2",setupCameraKey.bind(this, 2),"camera setup 2");
  TW.setKeyboardCallback("3",setupCameraKey.bind(this, 3),"camera setup 3");
  TW.setKeyboardCallback("4",setupCameraKey.bind(this, 4),"camera setup 4");
  TW.setKeyboardCallback("5",setupCameraKey.bind(this, 5),"camera setup 5");
  TW.setKeyboardCallback("6",setupCameraKey.bind(this, 6),"camera setup 6");
  TW.setKeyboardCallback("7",setupCameraKey.bind(this, 7),"camera setup 7");
  TW.setKeyboardCallback("8",setupCameraKey.bind(this, 8),"camera setup 8");
  TW.setKeyboardCallback("9",setupCameraKey.bind(this, 9),"camera setup 9");
}
