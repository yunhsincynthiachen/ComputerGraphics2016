// ====================================================================
//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
scene.background = new THREE.Color( 0xffffff );

var barn;

var params = {
  mode: 'showResult'
};
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
}

function createBarnTextures() {
  var flagTexture = TW.makeFlagTexture('US-RWB');
  var flagMat = new THREE.MeshBasicMaterial(
      {
          color: THREE.ColorKeywords.white,
          map: flagTexture,
      });
  var barnGeom = TW.createBarn(20,10,50);
  var barn = new THREE.Mesh(barnGeom, flagMat);
  addTextureCoords(barnGeom);
  scene.add(barn);
  TW.render();
}

function createBarnLighting() {
  var barnGeom = TW.createBarn(20,10,50);
  var flagMat = new THREE.MeshPhongMaterial({color: "#ffffff"});
  var barn = new THREE.Mesh(barnGeom, flagMat);
  addTextureCoords(barnGeom);
  scene.add(barn);

  var lightDirectional = new THREE.DirectionalLight(0xffffff, 0.55);
  lightDirectional.position.set(0.25, 0.4, 0.65);
  scene.add(lightDirectional);
  var lightAmbient = new THREE.AmbientLight(0x696969);
  scene.add(lightAmbient);
  TW.render();
}

function createBarnResult() {
  TW.loadTexture('brick.png', function makePlane(texture) {
    var barnGeom = TW.createBarn(20,10,50);
    var flagMat = new THREE.MeshPhongMaterial({color: "#ffffff"});
    flagMat.map = texture;
    barn = new THREE.Mesh(barnGeom, flagMat);
    addTextureCoords(barnGeom);
    scene.add(barn);

    var lightDirectional = new THREE.DirectionalLight(0xffffff, 0.55);
    lightDirectional.position.set(0.25, 0.4, 0.65);
    scene.add(lightDirectional);
    var lightAmbient = new THREE.AmbientLight(0x696969);
    scene.add(lightAmbient);
    TW.render();
  })
}
// function createBarnFaces() {
//   var steepleMaterials = []; //array of meshbasicmaterials for all of the faces
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#ff0000"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#ff5e00"})); //aquamarine
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#ffbb00"})); //random color
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#e1ff00"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#80ff00"})); //rosy brown
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#22ff00"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#00ff3c"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#00ff9d"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#00ffff"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#00a2ff"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#0040ff"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#1e00ff"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#7b00ff"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#dd00ff"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#ff00bb"}));
//   steepleMaterials.push(new THREE.MeshBasicMaterial({color: "#ff005d"}));
//
//
//   //create the obeliskgeom
//   var barnGeom = TW.createBarn(20,10,50);
//   var faceMaterial = new THREE.MeshFaceMaterial(steepleMaterials); //sets face material to the steeplematerials
//   var barn = new THREE.Mesh(barnGeom, faceMaterial);
//   addTextureCoords(barnGeom);
//
//   return barn;
// }

function createBarn() {
  createBarnResult();

  TW.mainInit(renderer,scene);
  document.getElementById('barnscene').appendChild(renderer.domElement);
  var state = TW.cameraSetup(renderer,
                             scene,
                             {minx: 0, maxx: 20,
                              miny: 0, maxy: 20,
                              minz: 0, maxz: 15});

  function redoScene() {
    scene.remove(barn);
    if (params.mode == 'showTextures') {
      createBarnTextures();
    } else if (params.mode == 'showLighting') {
      createBarnLighting();
    } else {
      createBarnResult();
    }
  }

  var gui = new dat.GUI();
    gui.add(params,"mode",["showFaces","showTextures","showLighting","showResult"]).onChange(redoScene);
}
