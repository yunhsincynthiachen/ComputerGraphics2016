var loader = new THREE.TextureLoader(); //Initializes three.js textureLoader to obtain image textures

var paramsMikey = {
  bodyWidth: 25,
  bodyHeight: 50,
  eyeRadius: 15,
  hipHeight: 0,
  hipWidth: 10,
  shoulderHeight: 8,
  shoulderWidth: 20,
  handFeetRadius: 5,
  limbRadius: 3,
  limbHeight: 20,
  widthHeightSegments: 50,
  options: {
    amount: 4,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 1,
    bevelThickness: 1
  }
}

//Master function to create Mike Wazowski. Adds object to scene after textures are loaded
function createMikey(scene) {
  var bodyMaterials; //materials index for all functions to access and utilize

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

  //updateEyeGeom(geom): takes in geometry of eye and updates it, so that there is a clear front and back of the eyeball
  function updateEyeGeom(geom) {
    var faceVertexUvs = geom.faceVertexUvs[0];

    for (var i=0; i< faceVertexUvs.length;i++) {
      var uvs = faceVertexUvs[ i ];
  		var face = geom.faces[ i ];
      for ( var j = 0; j < 3; j ++ ) {
  			uvs[ j ].x = face.vertexNormals[ j ].x * 0.5 + 0.5;
  			uvs[ j ].y = face.vertexNormals[ j ].y * 0.5 + 0.5;
  		}
    }
  }

  //createHandFeet(): creates spherical hand and feet that will be appended to arms and legs
  function createHandFeet() {
    var handFeetObj = new THREE.Object3D();
    var handFeetGeom = new THREE.SphereGeometry(paramsMikey.handFeetRadius, paramsMikey.widthHeightSegments, paramsMikey.widthHeightSegments);
    var handFeetMesh = new THREE.Mesh(handFeetGeom, bodyMaterials.bodyMat);
    handFeetMesh.position.y -= paramsMikey.limbHeight/2; //position it lower by half of the arm/leg height

    handFeetObj.add(handFeetMesh);

    return handFeetObj;
  }

  //createLimb(side, bodyPart): creates limb (arms and legs) given a side, so that it can be positioned correctly
  function createLimb(side, bodyPart) {
    var limbObj = new THREE.Object3D();
    var limbGeom = new THREE.CylinderGeometry(paramsMikey.limbRadius, paramsMikey.limbRadius, paramsMikey.limbHeight, paramsMikey.widthHeightSegments, paramsMikey.widthHeightSegments);
    var limbMesh = new THREE.Mesh(limbGeom, bodyMaterials.bodyMat);

    var bodyPartWidth = (bodyPart == "arm") ? paramsMikey.shoulderWidth : paramsMikey.hipWidth;
    var bodyPartHeight = (bodyPart == "arm") ? paramsMikey.shoulderHeight : paramsMikey.hipHeight;

    limbMesh.position.x = bodyPartWidth*side;
    limbMesh.position.y = bodyPartHeight;

    limbMesh.add(createHandFeet());
    limbObj.add(limbMesh);
    return limbObj;

  }

  //createSmile(): creates a bezier curve-formed smile that is extruded and positioned on bottom of body
  function createSmile() {
    var mouthObj = new THREE.Object3D();
    var x = paramsMikey.bodyWidth/2-3;
    var y = 0;

    var mouthShape = new THREE.Shape(); //mouth shape with bezier curve
    mouthShape.moveTo(-x,y);
    mouthShape.bezierCurveTo(-x,0, 0,-x, x,0);

    var mouthExtrude = new THREE.ExtrudeGeometry(mouthShape, paramsMikey.options); //extrudes mouth shape
    var mouthMesh = new THREE.Mesh(mouthExtrude, bodyMaterials.moutMat);

    //positions mouth correctly to be the bottom part of the body
    mouthMesh.position.y += paramsMikey.bodyWidth/2;
    mouthMesh.position.z += paramsMikey.bodyWidth/2 + 3;

    mouthObj.add(mouthMesh);
    return mouthObj;
  }

  //createEye(): creates a sphere eye with the texture of eye and correct geometry, positioned to bulge out of top part of body
  function createEye() {
    var eyeObj = new THREE.Object3D();
    var eye = new THREE.SphereGeometry(paramsMikey.eyeRadius, paramsMikey.widthHeightSegments, paramsMikey.widthHeightSegments);
    updateEyeGeom(eye); //updates eye geometry so that texture can be mapped on the front and back of eye
    var eyeMesh = new THREE.Mesh( eye, bodyMaterials.eyeMat );

    //positions eye correctly to be the top part of the body
    eyeMesh.position.y += (paramsMikey.bodyHeight/2 + 4);
    eyeMesh.position.z += (paramsMikey.bodyWidth/2 + 2);
    eyeObj.add(eyeMesh);

    return eyeObj;
  }

  //createBody(): creates a body of lathed geometry given the right dimensions
  //and then adds the eye, limbs and smile to the body lathe object
  function createBody() {
    var bodyObj = new THREE.Object3D();

    var bodyDimen = [ [0, 0],
                    [paramsMikey.bodyWidth/5, 1],
                    [paramsMikey.bodyWidth*4/5, paramsMikey.bodyHeight/5],
                    [paramsMikey.bodyWidth, paramsMikey.bodyHeight/2],
                    [paramsMikey.bodyWidth*3/5, paramsMikey.bodyHeight-9],
                    [paramsMikey.bodyWidth/2, paramsMikey.bodyHeight-6],
                    [paramsMikey.bodyWidth*2/5, paramsMikey.bodyHeight-3],
                    [0, paramsMikey.bodyHeight]]; //body dimension

    var bodyCurve = new THREE.CatmullRomCurve3( makeVertices(bodyDimen) );
    var bodyGeom = new THREE.LatheGeometry( bodyCurve.getPoints(20) );

    var bodyLatheObj = new THREE.Mesh (bodyGeom, bodyMaterials.bodyMat);

    bodyLatheObj.add(createEye());
    bodyLatheObj.add(createLimb(1, "leg"));
    bodyLatheObj.add(createLimb(-1, "leg"));
    bodyLatheObj.add(createLimb(1, "arm"));
    bodyLatheObj.add(createLimb(-1, "arm"));
    bodyLatheObj.add(createSmile());

    bodyObj.add(bodyLatheObj);
    return bodyObj;
  }

  // main code here: gets the textures, maps the bodyMaterials and then adds and renders scene with object
  TW.loadTextures(["mikeyeye.jpg"], function (mikeyTextures) {

    bodyMaterials = {
      bodyMat: new THREE.MeshPhongMaterial({color: "#94E059"}),
      eyeMat: new THREE.MeshPhongMaterial({color: "#FFFFFF", map: mikeyTextures[0]}),
      moutMat: new THREE.MeshPhongMaterial({color: "#ffffff"})
    }; //sets all of the body materials to be the right textures

    scene.add(createBody());
    TW.render();
  });
}
