var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var lightAmbient, lightDirectional, lightSpotlight;
var lighthelperSpotlight, lighthelperDirectional;

var params = {
  'ambientLightOn': true,
  'directionalOn': true,
  'spotlightOn': false
};

function makeLights() {
  if (params.ambientLightOn) {
    lightAmbient = new THREE.AmbientLight("#FFFFFF");
    scene.add(lightAmbient);
  }

  if (params.directionalOn) {
    lightDirectional = new THREE.DirectionalLight(TW.WHITE, 1.5);
    lightDirectional.position.set(0.5, 1, 1);
    lightDirectional.castShadow = true;
    scene.add(lightDirectional);
  }

  if (params.spotlightOn) {
    lightSpotlight = new THREE.SpotLight( TW.WHITE); // 50%
    lightSpotlight.position.set(-35, 10, -45);
    // lightSpotlight.castShadow = true;
    lightSpotlight.shadow.mapSize.width = 1;
    lightSpotlight.shadow.mapSize.height = 1;

    lightSpotlight.target.position.set(-35, -40, -40);
    scene.add(lightSpotlight);
  }
}

function redo() {
  scene.remove(lightAmbient);
  scene.remove(lightDirectional);
  scene.remove(lightSpotlight);
  makeLights();
  TW.render();
}

function createSconce(isFlipped) {
  var sconce = new THREE.ConeGeometry(5, 8, 100, 100, true);
  var sconceMaterial = new THREE.MeshLambertMaterial({color: 0x5e5e57});
  var sconceMesh = new THREE.Mesh(sconce, sconceMaterial);
  sconceMesh.castShadow = true;
  sconceMesh.position.x = -35;
  sconceMesh.position.y = 10-8/2;
  sconceMesh.position.z = -45;

  if (isFlipped) {
    sconceMesh.position.y = 10+8/2;
    sconceMesh.rotation.z = Math.PI;
  }
  scene.add(sconceMesh);
}

function createSphere() {
  var sphereLight = new THREE.SphereGeometry(10, 100, 100);
  var sphereLightMaterial = new THREE.MeshPhongMaterial({color: 0x4c3380,
                                                specular: 0xD3D3D3,
                                                shininess: 50});
  var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = true;

  sphereLightMesh.position.x = -35;
  sphereLightMesh.position.y = -40;
  sphereLightMesh.position.z = -40;
  scene.add(sphereLightMesh);
}

function createRoom() {
  TW.mainInit(renderer,scene);

  makeLights();

  var roomGeometry = new THREE.BoxGeometry(100,100,100);
  var materialArray = [];
  var faceColors = [0x1a4d66, 0x1a4d66, 0x17452b, 0x80664d, 0x1a4d66, 0x1a4d66];

  for(var i = 0; i < 6; i++) {
      materialArray.push(new THREE.MeshPhongMaterial({
          color: faceColors[i],
          side: THREE.BackSide}));
  }

  var roomMaterial = new THREE.MeshFaceMaterial(materialArray);
  var room = new THREE.Mesh(roomGeometry, roomMaterial);
  scene.add(room);

  createSphere();
  createSconce(false);
  createSconce(true);

  document.getElementById('room').appendChild(renderer.domElement);

  var state = TW.cameraSetup(renderer,
                             scene,
                             {minx: -50, maxx: 50,
                              miny: -50, maxy: 50,
                              minz: -50, maxz: 50});

  var gui = new dat.GUI();
  gui.add(params, 'ambientLightOn' ).onChange(redo);
  gui.add(params, 'directionalOn' ).onChange(redo);
  gui.add(params, 'spotlightOn' ).onChange(redo);
}
