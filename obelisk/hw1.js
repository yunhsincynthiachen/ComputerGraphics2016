// ====================================================================
//Initializes scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

//Default sceneParams for the obelisk
var sceneParams = {
    baseWidth: 55,
    topWidth: 34,
    mainHeight: 500,
    topHeight: 55
};

//clearScene: removes the obeliskMesh object from the scene;
function clearScene() {
  var selectedObject = scene.getObjectByName("obeliskMesh");
  scene.remove(selectedObject);
}

//createBody: creates the geometry of the obelisk
function createBody(baseWidth, topWidth, mainHeight, topHeight) {
    var geom = new THREE.Geometry();

    // add the front vertices
    geom.vertices.push(new THREE.Vector3(0, 0, 0));
    geom.vertices.push(new THREE.Vector3(baseWidth, 0, 0));
    geom.vertices.push(new THREE.Vector3(baseWidth*0.5+topWidth*0.5, mainHeight, -(baseWidth*0.5-topWidth*0.5)));
    geom.vertices.push(new THREE.Vector3(baseWidth*0.5-topWidth*0.5, mainHeight, -(baseWidth*0.5-topWidth*0.5)));

    //add the back vertices
    geom.vertices.push(new THREE.Vector3(0, 0, -baseWidth));
    geom.vertices.push(new THREE.Vector3(baseWidth, 0, -baseWidth));
    geom.vertices.push(new THREE.Vector3(baseWidth*0.5+topWidth*0.5, mainHeight, -(baseWidth*0.5+topWidth*0.5)));
    geom.vertices.push(new THREE.Vector3(baseWidth*0.5-topWidth*0.5, mainHeight, -(baseWidth*0.5+topWidth*0.5)));

    //add the tip vertex
    geom.vertices.push(new THREE.Vector3(0.5*baseWidth, mainHeight+topHeight, -0.5*baseWidth));

    //All of the faces
    geom.faces.push(new THREE.Face3(0, 1, 2));//front
    geom.faces.push(new THREE.Face3(2, 3, 0));

    geom.faces.push(new THREE.Face3(4, 6, 5));//back
    geom.faces.push(new THREE.Face3(4, 7, 6));

    geom.faces.push(new THREE.Face3(1, 5, 6));//side right
    geom.faces.push(new THREE.Face3(1, 6, 2));

    geom.faces.push(new THREE.Face3(0, 3, 7));//side left
    geom.faces.push(new THREE.Face3(7, 4, 0));

    geom.faces.push(new THREE.Face3(7, 2, 6));//top face
    geom.faces.push(new THREE.Face3(7, 3, 2));

    //top pyramid faces
    geom.faces.push(new THREE.Face3(2, 6, 8));
    geom.faces.push(new THREE.Face3(3, 2, 8));
    geom.faces.push(new THREE.Face3(3, 8, 7));
    geom.faces.push(new THREE.Face3(7, 8, 6));


    // calculate the normals for shading
    geom.computeFaceNormals();
    geom.computeVertexNormals(true);

    return geom;
}

//drawObelisk: draws obelisk with
function drawObelisk() {

  var steepleMaterials = []; //array of meshbasicmaterials for all of the faces
  steepleMaterials.push(new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.lightcoral}));
  steepleMaterials.push(new THREE.MeshBasicMaterial({color: new THREE.Color("rgb(102, 205, 170)")})); //aquamarine
  steepleMaterials.push(new THREE.MeshBasicMaterial({color: new TW.randomColor})); //random color
  steepleMaterials.push(new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.mistyrose}));
  steepleMaterials.push(new THREE.MeshBasicMaterial({color: new THREE.Color("rgb(188, 143, 143)")})); //rosy brown
  steepleMaterials.push(new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.yellowgreen}));
  steepleMaterials.push(new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.crimson}));
  steepleMaterials.push(new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.orange}));
  steepleMaterials.push(new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.thistle}));

  //create the obeliskgeom
  var obeliskgeom = createBody(sceneParams.baseWidth, sceneParams.topWidth, sceneParams.mainHeight, sceneParams.topHeight);

  //sets material for 9 faces
  TW.setMaterialForFaces(obeliskgeom, 0,0,1);
  TW.setMaterialForFaces(obeliskgeom, 1,2,3);
  TW.setMaterialForFaces(obeliskgeom, 2,4,5);
  TW.setMaterialForFaces(obeliskgeom, 3,6,7);
  TW.setMaterialForFaces(obeliskgeom, 4,8,9);
  TW.setMaterialForFaces(obeliskgeom, 5,10);
  TW.setMaterialForFaces(obeliskgeom, 6,11);
  TW.setMaterialForFaces(obeliskgeom, 7,12);
  TW.setMaterialForFaces(obeliskgeom, 8,13);

  var faceMaterial = new THREE.MeshFaceMaterial(steepleMaterials); //sets face material to the steeplematerials

  var obeliskmesh = new THREE.Mesh(obeliskgeom, faceMaterial); //creates mesh with the face material and geometry
  obeliskmesh.name = "obeliskMesh"; //sets name to obeliskmesh
  obeliskmesh.position.set(-sceneParams.baseWidth/2,0,sceneParams.baseWidth/2); //the origin of the monument is at the center of the base, directly below the peak
  scene.add(obeliskmesh); //add obelisk to scene

  //sets bounding box location
  var boundingBox = {
    minx: -sceneParams.baseWidth/2,
    maxx: sceneParams.baseWidth/2,
    miny: 0,
    maxy: sceneParams.topHeight+sceneParams.mainHeight,
    minz: -sceneParams.baseWidth/2,
    maxz: sceneParams.baseWidth/2
 };

  //initializes and sets up camera, scene, renderer, boundingBox
  TW.mainInit(renderer, scene);
  document.getElementById('obelisk').appendChild(renderer.domElement);
  TW.cameraSetup(renderer, scene, boundingBox);
}

function firstDrawObelisk() {
  drawObelisk();
  //creates a gui that allows the changing of the scene parameters
  var gui = new dat.GUI();
     gui.add(sceneParams, 'baseWidth',0,100).onChange(redrawObelisk);
     gui.add(sceneParams, 'topWidth',0,100).onChange(redrawObelisk);
     gui.add(sceneParams, 'mainHeight',0,1000).onChange(redrawObelisk);
     gui.add(sceneParams, 'topHeight',0,100).onChange(redrawObelisk);
}

//redrawObelisk: gets called when gui is changed and sceneParams
function redrawObelisk() {
    clearScene();
    drawObelisk();
}
