// ====================================================================
//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var loader = new THREE.TextureLoader(); //Initializes three.js textureLoader to obtain image textures

scene.background = new THREE.Color( 0xffffff ); //Sets background of scene to be white

var barn, lightAmbient, lightDirectional; //Initializes the three scene objects that we will want to set and remove

//The main param is the different modes that you can sfet (I have three modes implemented: the two required and the textures one)
var params = {
  mode: 'showResult',
  directionalLightIntensity: 0.6,
  directionalLightPositionX: 0.25,
  directionalLightPositionY: 0.4,
  directionalLightPositionZ: 0.6
};

//Adds texture coordinates to all of the barn verties, and sets the material indexes
//for the front, back, roof, sides and floor.
function addTextureCoords(barnGeom) {
    if( ! barnGeom instanceof THREE.Geometry ) {
        throw "not a THREE.Geometry: "+barnGeom;
    }
    // array of face descriptors
    var UVs = [];
    function faceCoords(as,at, bs,bt, cs,ct) {
        UVs.push( [ new THREE.Vector2(as,at),
                    new THREE.Vector2(bs,bt),
                    new THREE.Vector2(cs,ct)] );
    }
    // front
    faceCoords(0,0, 1,0, 1,1);
    faceCoords(0,0, 1,1, 0,1);
    faceCoords(0,1, 1,1, 1,1);  // special for the upper triangle
    // back.  Vertices are not quite analogous to the front, alas
    faceCoords(1,0, 0,1, 0,0);
    faceCoords(1,0, 1,1, 0,1);
    faceCoords(0,1, 1,1, 1,1);  // special for upper triangle
    //roof
    faceCoords(1,0, 1,1, 0,0);
    faceCoords(1,1, 0,1, 0,0);
    faceCoords(0,0, 1,0, 1,1);
    faceCoords(0,1, 0,0, 1,1);
    // sides
    faceCoords(1,0, 0,1, 0,0);
    faceCoords(1,1, 0,1, 1,0);
    faceCoords(1,0, 1,1, 0,0);
    faceCoords(1,1, 0,1, 0,0);
    // floor
    faceCoords(0,0, 1,0, 0,1);
    faceCoords(1,0, 1,1, 0,1);
    // Finally, attach this to the geometry
    barnGeom.faceVertexUvs = [ UVs ];

    TW.setMaterialForFaces(barnGeom, 0, 0,1,2,3,4,5); //Index 0 for front and back
    TW.setMaterialForFaces(barnGeom, 1, 6,7,8,9); //Index 1 for roof
    TW.setMaterialForFaces(barnGeom, 2, 10,11,12,13); //Index 2 for sides
    TW.setMaterialForFaces(barnGeom, 3, 14,15); //Index 3 for fllor
}

//addLighting() adds directional and ambient lighting to scene when called
function addLighting() {
  lightDirectional = new THREE.DirectionalLight(0xffffff, params.directionalLightIntensity);
  lightDirectional.position.set(params.directionalLightPositionX, params.directionalLightPositionY, params.directionalLightPositionZ);
  scene.add(lightDirectional);
  lightAmbient = new THREE.AmbientLight(0x696969);
  scene.add(lightAmbient);
}

//Gets invoked by createBarnResult to update the top face (upper triangle) in the front and back
//for the material to follow same pattern as the other faces
function updateTextureCoords(barnGeom) {
    var faceVertexUvs = barnGeom.faceVertexUvs[0];

    faceVertexUvs[2][2].y = 0.5 - faceVertexUvs[2][2].y;
    faceVertexUvs[5][2].y = 0.5 - faceVertexUvs[5][2].y;
}

//createBarnTextures() creates the barn with a flag texture on all of the planes
function createBarnTextures() {
  var flagTexture = TW.makeFlagTexture('US-RWB');
  var flagMat = new THREE.MeshBasicMaterial(
      {
          color: THREE.ColorKeywords.white,
          map: flagTexture,
      });
  var barnGeom = TW.createBarn(20,10,50);
  barn = new THREE.Mesh(barnGeom, flagMat);
  addTextureCoords(barnGeom);
  scene.add(barn);
  TW.render();
}

//createBarnLighting() creates white Phong material on all of the planes of the barn
// and adds directional and ambient light to create the right shading
function createBarnLighting() {
  var barnGeom = TW.createBarn(20,10,50);
  var barnMat = new THREE.MeshPhongMaterial({color: "#ffffff"});
  barn = new THREE.Mesh(barnGeom, barnMat);
  addTextureCoords(barnGeom);
  scene.add(barn);

  addLighting(); //adds directional and ambient light
  TW.render();
}

//createBarnResult() creates a barn with brick and roof texture material
//and adds lighting on the barn
function createBarnResult() {
  loader.load('brick.png', function (brickTexture) {
    loader.load('roof.png', function (roofTexture) {
      //brickTexture with repeat wrapping and setting the repeat texture
      brickTexture.wrapS = THREE.RepeatWrapping;
      brickTexture.wrapT = THREE.RepeatWrapping;
      brickTexture.repeat.set(3,1);

      //roofTexture with repeat wrapping and setting the repeat texture
      roofTexture.wrapS = THREE.RepeatWrapping;
      roofTexture.wrapT = THREE.RepeatWrapping;
      roofTexture.repeat.set(2,1);

      //creates barnGeom
      var barnGeom = TW.createBarn(20,10,50);

      //brick phong material with the texture mapped to it
      var brick = new THREE.MeshPhongMaterial({color: "#ffffff"});
      brick.map = brickTexture;

      //roof phong material with the texture mapped to it
      var roof = new THREE.MeshPhongMaterial({color: "#ffffff"});
      roof.map = roofTexture;

      //creates barnMaterials with the different materials in order of index order
      var barnMaterials = [];
      barnMaterials.push(brick);
      barnMaterials.push(roof);
      barnMaterials.push(brick);
      barnMaterials.push(brick);

      var faceMaterial = new THREE.MeshFaceMaterial(barnMaterials); //makes mesh face material out of barnMaterials array
      barn = new THREE.Mesh(barnGeom, faceMaterial);
      addTextureCoords(barnGeom);
      updateTextureCoords(barnGeom); //takes into account the top plane of the front and back side needs to be updated
      scene.add(barn);

      addLighting(); //adds directional and ambient light
      TW.render();
    });
  });
}

//creates initiaal barn setup and gui
function createBarn() {
  TW.mainInit(renderer,scene);

  createBarnResult(); //initiaal barn with the roof and brick textures and lighting
  document.getElementById('barnscene').appendChild(renderer.domElement);
  var state = TW.cameraSetup(renderer,
                             scene,
                             {minx: 0, maxx: 20,
                              miny: 0, maxy: 10,
                              minz: 0, maxz: 5}); //cameraSetup with bounding box

  function redoScene() { //when params is changed, redoScene is changed depending on params mode
    //Removes barn and any lighting first
    scene.remove(barn);
    scene.remove(lightAmbient);
    scene.remove(lightDirectional);

    //Then adds the barn depending on mode chosen
    if (params.mode == 'showTextures') {
      createBarnTextures();
    } else if (params.mode == 'showLighting') {
      createBarnLighting();
    } else if (params.mode == 'showResult') {
      createBarnResult();
    }
  }

  //sets params gui
  var gui = new dat.GUI();
    gui.add(params,"mode",["showTextures","showLighting","showResult"]).onChange(redoScene);
}
