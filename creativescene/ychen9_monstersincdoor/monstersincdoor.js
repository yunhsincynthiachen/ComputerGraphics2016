var loader = new THREE.TextureLoader(); //Initializes three.js textureLoader to obtain image textures

var params = {
  doorWidth: 30,
  doorHeight: 65,
  doorDepth: 2,
  frameWidth: 34,
  frameHeight: 70,
  frameDepth: 6,
  widthHeightSegments: 50,
  hookRadius: 2,
  hookLength: 20,
  options: {
    amount: 4,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 1,
    bevelThickness: 1
  }
}

//Master function to create monsters inc doors. Adds object to scene after textures are loaded
function createMonIncDoor(scene, filename, x, y, z, rx, ry, rz) {
  var doorMaterials; //materials index for all functions to access and utilize

  var doorFile = (filename == "") ? "door1.jpg" : filename;
  //makeBezierCurvePoints(cp): Helper function that takes in control points an dmakes bezier curves
  function makeBezierCurvePoints(cp) {
    var multiplier = 1;
    var a = new THREE.Vector3(cp[0][0]*multiplier,cp[0][1]*multiplier,cp[0][2]*multiplier);
    var b = new THREE.Vector3(cp[1][0]*multiplier,cp[1][1]*multiplier,cp[1][2]*multiplier);
    var c = new THREE.Vector3(cp[2][0]*multiplier,cp[2][1]*multiplier,cp[2][2]*multiplier);
    var d = new THREE.Vector3(cp[3][0]*multiplier,cp[3][1]*multiplier,cp[3][2]*multiplier);

    var curve = new THREE.CubicBezierCurve3(a,b,c,d);

    return curve.getPoints(20);
  }

  //makeVertices(points): Helper function for making vertices
  function makeVertices(points) {
    var multiplier = 1;
    var i;
    var pts = [];
    for( i = 0; i < points.length; i++) {
        var p = points[i];
        pts.push(new THREE.Vector3( p[0]*multiplier, p[1]*multiplier, 0));
    }
    return pts;
  }

  //createFrame(): creates frame, given height, width and depth that will be extruded to fit around
  //the door of certain width and height
  function createFrame() {
    var frame = new THREE.Object3D();

    //sets x and y to be top left corner of frame
    var x = -params.frameWidth/2;
    var y = params.frameHeight/2;

    //creates shape that has the bezier curve as the top curve of the frame and everything else
    //lines to be a rectangular frame
    var frameShape = new THREE.Shape();
    frameShape.moveTo(x,-y);
    frameShape.lineTo(x,y);
    frameShape.lineTo(x,y+params.frameHeight/13);
    frameShape.lineTo(x+params.frameWidth/4, y+5);
    frameShape.bezierCurveTo(x+params.frameWidth/4, y+params.frameHeight/13, x+params.frameWidth/2, y+params.frameHeight/4, x+params.frameWidth*3/4, y+params.frameHeight/13);
    frameShape.lineTo(x+params.frameWidth, y+params.frameHeight/13);
    frameShape.lineTo(x+params.frameWidth, -y);

    //creates extruded geom and mesh of the frame shape with the correct frame texture
    var extrudedFrame = new THREE.ExtrudeGeometry(frameShape, params.options);
    var extrudedFrameMesh = new THREE.Mesh(extrudedFrame, doorMaterials.frameTexture);

    var outerFrameBSP = new ThreeBSP(extrudedFrameMesh); //converts to BSP for future subtraction

    //creates inner door geom, mesh and BSP from the mesh
    var innerDoorGeom = new THREE.BoxGeometry(params.doorWidth,params.doorHeight,params.frameDepth*3,params.widthHeightSegments,params.widthHeightSegments);
    var innerDoorMesh = new THREE.Mesh(innerDoorGeom, doorMaterials.frameTexture);
    var innerDoorBSP = new ThreeBSP(innerDoorMesh);

    //subtracts the innerDoor from the outer entire frame to create the outer frame
    var doorFrame = outerFrameBSP.subtract(innerDoorBSP);
    var result = doorFrame.toMesh();
    result.geometry.computeFaceNormals(); //computes face normals of the resulting geom
    result.geometry.computeVertexNormals(); //computes vertex normals of the resulting geom

    var resultMesh  = new THREE.Mesh(result.geometry, doorMaterials.frameTexture);
    resultMesh.position.z -= (params.frameDepth - params.doorDepth)/2; //positions resulting frame to have not the back tangent to the origin

    frame.add(resultMesh);
    return frame;
  }

  //createBlinker(): creates a red LED blinker made from bezier curves to give the led shape
  function createBlinker() {
    var blinkerObj = new THREE.Object3D();

    //control points to give LED shape
    var inner_cp = [[5.0, 0.5/2, 0.0],
                    [4.0, 0.5/2, 0.0],
                    [3.0, 1.5/2, 0.0],
                    [2.5, 1.5/2, 0.0]];

    var outer_cp = [[2.5,  1.5/2,  0.0],
                 [2.0,  1.5/2,  0.0],
                 [1, 1.75/2, 0.0],
                 [0, 1.75/2, 0.0]];


   var blinkerPoints = Array.prototype.concat(makeBezierCurvePoints(inner_cp), makeBezierCurvePoints(outer_cp));

   //creates resulting geom and mesh of blinker
   var blinkerGeom = new THREE.LatheGeometry( blinkerPoints );
   var blinkerMesh = new THREE.Mesh (blinkerGeom, doorMaterials.blinkerTexture);

   //positions and names blinkerMesh
   blinkerMesh.rotation.x = Math.PI/2;
   blinkerMesh.name = "blinkerLathe";
   blinkerMesh.position.y += params.doorHeight/2 + 6;
   blinkerMesh.position.z += params.frameDepth/2;

   blinkerObj.add(blinkerMesh); //adds as resulting object
   return blinkerObj;
  }

  //createHook(): creates cylindrical hook that will be attached to spline or anything (this is the top of the object)
  function createHook() {
    var hookObject = new THREE.Object3D();

    //creates hook geom of cylindrical shape and the correct hook texture
    var hookGeom = new THREE.CylinderGeometry(params.hookRadius,params.hookRadius,params.hookLength,params.widthHeightSegments,params.widthHeightSegments);
    var hookMesh = new THREE.Mesh(hookGeom, doorMaterials.hookTexture);
    hookMesh.position.y += (params.doorHeight+params.hookLength)/2; //positions the hook to be on top of the door

    hookObject.add(hookMesh);
    return hookObject;
  }

  //createKnob(): creates knob of lathed geometry given knobDimensions
  function createKnob() {
    var knobObj = new THREE.Object3D();

    var knobDimen = [ [3, 0],
                    [3, 5],
                    [5, 6],
                    [5, 7],
                    [5, 8],
                    [3, 9],
                    [0, 10]];

    var knobCurve = new THREE.CatmullRomCurve3( makeVertices(knobDimen) );
    var knobGeom = new THREE.LatheGeometry( knobCurve.getPoints(20) );

    var knobLatheObj = new THREE.Mesh (knobGeom, doorMaterials.knobTexture);

    knobLatheObj.rotation.x = Math.PI/2;
    knobLatheObj.scale.set(1/2, 0.6, 1/2);
    knobLatheObj.position.x += params.frameWidth/2 - 6;

    knobObj.add(knobLatheObj);
    return knobObj;
  }

  //createDoor() creates a box geometry door, and then adds the frame, blinker, knob and hook to it
  function createDoor() {
    var doorObj = new THREE.Object3D();

    var doorGeom = new THREE.BoxGeometry(params.doorWidth,
                                              params.doorHeight,
                                              params.doorDepth,
                                              params.widthHeightSegments,
                                              params.widthHeightSegments);

    var	doorMesh = new THREE.Mesh( doorGeom, doorMaterials.doorTexture );

    doorMesh.add(createFrame());
    doorMesh.add(createBlinker());
    doorMesh.add(createKnob());
    doorMesh.add(createHook());

    //makes the position of the doorMesh to have the origin at the very top and any rotation if set
    doorMesh.position.set(x, y-(params.frameHeight/2+params.hookLength), z);
    doorMesh.rotation.set(rx, ry, rz);

    doorObj.add(doorMesh);
    return doorObj;
  }

  // main code here: gets the textures, maps the doorMaterials and then adds and renders scene with object

  TW.loadTextures([doorFile, "frame.jpg", "doorknob.jpg", "blinker.jpg"], function (doorTextures) {
    var doorFrameTexture = doorTextures[1];
    doorFrameTexture.wrapT = THREE.RepeatWrapping;
    doorFrameTexture.repeat.set(1,1);

    doorMaterials = {
      doorTexture: new THREE.MeshPhongMaterial({ map: doorTextures[0]}),
      frameTexture: new THREE.MeshPhongMaterial({color: "#ffffff", map: doorFrameTexture}),
      blinkerTexture: new THREE.MeshPhongMaterial({color: "#ffffff", map: doorTextures[3]}),
      knobTexture: new THREE.MeshPhongMaterial({color: "#ffffff", map: doorTextures[2]}),
      hookTexture: new THREE.MeshPhongMaterial({color: "#ffffff", map: doorTextures[1]})
    }

    scene.add(createDoor());
    TW.render();
  });
}
