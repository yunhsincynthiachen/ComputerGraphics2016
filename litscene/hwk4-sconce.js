//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

//Initializes the different lights (one ambient, one directional, two spotlights)
var lightAmbient, lightDirectional, lightSpotlightBottom, lightSpotlightTop;

//Initial parameters: all lights are on
var params = {
  'ambientOn': true,
  'directionalOn': true,
  'spotlightOn': true
};

//makeLights: depending on the parameters, creates the lights and adds them to the scene
function makeLights() {
  //white ambient light set in the room scene if ambient light turned on
  if (params.ambientOn) {
    lightAmbient = new THREE.AmbientLight("#FFFFFF");
    scene.add(lightAmbient);
  }

  //white directional light of 1.3 intensity set in the room scene if turned on
  if (params.directionalOn) {
    lightDirectional = new THREE.DirectionalLight(TW.WHITE, 1.3);
    lightDirectional.position.set(0.5, 1, 1);
    scene.add(lightDirectional);
  }

  //two spotlights of 4 intensity, distance of 400 and angle of Math.PI/6
  if (params.spotlightOn) {
    lightSpotlightBottom = new THREE.SpotLight( TW.WHITE, 4, 200, Math.PI/6);
    lightSpotlightBottom.position.set(-35, 10, -45); //set to match sconce location
    lightSpotlightBottom.target.position.set(-35, -50, -47); //aimed to the floor of room
    lightSpotlightBottom.target.updateMatrixWorld(); //update matrix
    scene.add(lightSpotlightBottom);

    lightSpotlightTop = new THREE.SpotLight( TW.WHITE, 4, 200, Math.PI/6);
    lightSpotlightTop.position.set(-35, 10, -45); //set to match sconce location
    lightSpotlightTop.target.position.set(-35, 50, -47); //aimed to the ceiling of room
    lightSpotlightTop.target.updateMatrixWorld(); //update matrix
    scene.add(lightSpotlightTop);
  }
}

//redo: If gui controls are toggled, all lights are removed and then recreated
//depending on the parameters. Lastly, everything is rendered
function redo() {
  scene.remove(lightAmbient);
  scene.remove(lightDirectional);
  scene.remove(lightSpotlightBottom);
  scene.remove(lightSpotlightTop);
  makeLights();
  TW.render();
}

//createSconce: creates cone geometry with lambert material (either flipped or not)
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

//createSphere: sphere ball on the floor of the room
function createSphere() {
  var sphereLight = new THREE.SphereGeometry(10, 100, 100);
  //sphere has a phong material with grey specular shade and shininess of 50
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

//createRoom: initializes the room, creates lights, room of Phong material and
//adds the sphere and two sconces, as well as the lights in the room
function createRoom() {
  TW.mainInit(renderer,scene);

  makeLights();

  var roomGeometry = new THREE.BoxGeometry(100,100,100);
  var materialArray = [];
  var faceColors = [0x1a4d66, 0x1a4d66, 0x17452b, 0x80664d, 0x1a4d66, 0x1a4d66];

  //each face of the room is set to a phong material with colors based on faceColors
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

  //Create GUI for the 3 light choices and calls redo if changed
  var gui = new dat.GUI();
  gui.add(params, 'ambientOn' ).onChange(redo);
  gui.add(params, 'directionalOn' ).onChange(redo);
  gui.add(params, 'spotlightOn' ).onChange(redo);
}
