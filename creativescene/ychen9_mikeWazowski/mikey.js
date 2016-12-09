var paramsMikey = {
  bodyWidth: 30,
  bodyHeight: 60,
  eyeRadius: 17,
  hipHeight: 0,
  hipWidth: 10,
  shoulderHeight: 8,
  shoulderWidth: 25,
  handFeetRadius: 3,
  limbRadius: 3,
  limbHeight: 25,
  widthHeightSegments: 50,
  mouthOpen: 3,
  options: {
    amount: 5,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 1,
    bevelThickness: 1
  }
}

var bodyMesh;

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

  function makeBezierCurvePoints(cp) {
    var multiplier = 1;
    var a = new THREE.Vector3(cp[0][0]*multiplier,cp[0][1]*multiplier,cp[0][2]*multiplier);
    var b = new THREE.Vector3(cp[1][0]*multiplier,cp[1][1]*multiplier,cp[1][2]*multiplier);
    var c = new THREE.Vector3(cp[2][0]*multiplier,cp[2][1]*multiplier,cp[2][2]*multiplier);
    var d = new THREE.Vector3(cp[3][0]*multiplier,cp[3][1]*multiplier,cp[3][2]*multiplier);

    var curve = new THREE.CubicBezierCurve3(a,b,c,d);

    return curve.getPoints(20);
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

  function createToes(side) {
    var handFeetObj = new THREE.Object3D();
    var handFeetGeom = new THREE.CylinderGeometry(2.5, 1, 10, paramsMikey.widthHeightSegments, paramsMikey.widthHeightSegments);
    var handFeetMesh = new THREE.Mesh(handFeetGeom, bodyMaterials.bodyMat);
    handFeetMesh.rotation.x = -Math.PI/4;
    handFeetMesh.rotation.z = side*Math.PI/5;
    handFeetMesh.position.x = side*2;
    handFeetMesh.position.y -= 2.5;
    handFeetMesh.position.z = 3;

    var fingerTipsObj = new THREE.Object3D();
    var fingerTipGeom = new THREE.SphereGeometry(1, paramsMikey.widthHeightSegments, paramsMikey.widthHeightSegments);
    var fingerTipMesh = new THREE.Mesh(fingerTipGeom, bodyMaterials.bodyMat);
    fingerTipMesh.position.y -= 5;

    handFeetMesh.add(fingerTipsObj.add(fingerTipMesh));
    return handFeetObj.add(handFeetMesh);
  }

  //createHandFeet(): creates spherical hand and feet that will be appended to arms and legs
  function createHandFeet() {
    var handFeetObj = new THREE.Object3D();
    var handFeetGeom = new THREE.SphereGeometry(paramsMikey.handFeetRadius, paramsMikey.widthHeightSegments, paramsMikey.widthHeightSegments);
    var handFeetMesh = new THREE.Mesh(handFeetGeom, bodyMaterials.bodyMat);
    handFeetMesh.position.y -= paramsMikey.limbHeight/2; //position it lower by half of the arm/leg height

    handFeetMesh.add(createToes(-1));
    handFeetMesh.add(createToes(0));
    handFeetMesh.add(createToes(1));
    handFeetObj.add(handFeetMesh);

    return handFeetObj;
  }

  function createShoulder() {
    var handFeetObj = new THREE.Object3D();
    var handFeetGeom = new THREE.SphereGeometry(paramsMikey.handFeetRadius, paramsMikey.widthHeightSegments, paramsMikey.widthHeightSegments);
    var handFeetMesh = new THREE.Mesh(handFeetGeom, bodyMaterials.bodyMat);
    handFeetMesh.position.y += paramsMikey.limbHeight/2; //position it lower by half of the arm/leg height

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
    limbMesh.rotation.x = (bodyPart == "arm") ? -Math.PI/4 : 0;
    limbMesh.position.x = bodyPartWidth*side;
    limbMesh.position.y = bodyPartHeight;

    limbMesh.add(createHandFeet());
    limbMesh.add(createShoulder());
    limbObj.add(limbMesh);
    return limbObj;

  }

  function createTeeth(side, smileWidth) {
    var mouthObj = new THREE.Object3D();
    var mouthShape = new THREE.Shape(); //mouth shape with bezier curve
    mouthShape.moveTo(-smileWidth/4,0);
    mouthShape.bezierCurveTo(-smileWidth/4,0, 0,smileWidth/3, smileWidth/4,0);

    var mouthExtrude = new THREE.ExtrudeGeometry(mouthShape, paramsMikey.options); //extrudes mouth shape
    // var mouthShapeGeo = new THREE.ShapeGeometry(mouthShape);
    var mouthMesh = new THREE.Mesh(mouthExtrude, bodyMaterials.teethMat);

    //positions mouth correctly to be the bottom part of the body
    mouthMesh.position.x += side*smileWidth/3;
    mouthMesh.position.y -= smileWidth/4;
    mouthMesh.position.z += 0.5;

    mouthObj.add(mouthMesh);
    return mouthObj;
  }

  //createSmile(): creates a bezier curve-formed smile that is extruded and positioned on bottom of body
  function createSmile() {
    var mouthObj = new THREE.Object3D();
    var x = paramsMikey.bodyWidth/4;
    var y = -2;

    var mouthShape = new THREE.Shape(); //mouth shape with bezier curve
    mouthShape.moveTo(-x,y);
    mouthShape.bezierCurveTo(-x,y, 0,paramsMikey.mouthOpen*x, x,y);

    var mouthExtrude = new THREE.ExtrudeGeometry(mouthShape, paramsMikey.options); //extrudes mouth shape
    var mouthMesh = new THREE.Mesh(mouthExtrude, bodyMaterials.moutMat);

    //positions mouth correctly to be the bottom part of the body
    mouthMesh.position.y += paramsMikey.bodyWidth/2;
    mouthMesh.position.z += paramsMikey.bodyWidth/2 + 4;
    mouthMesh.rotation.x += Math.PI/4;

    mouthMesh.add(createTeeth(-1, x));
    mouthMesh.add(createTeeth(1, x));
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
    eyeMesh.position.z += (paramsMikey.bodyWidth/2 + 1);
    eyeObj.add(eyeMesh);

    return eyeObj;
  }

  function createHorn(side) {
    var hornObj = new THREE.Object3D();
    var hornSpline = [ [0.0, 7.0, 0.0],
                        [2, 7.0, 0.0],
                        [4, -1, 0.0],
                        [0.0, 0.0, 0.0] ];

    var curvePoints = makeBezierCurvePoints(hornSpline);

    var hornGeom = new THREE.LatheGeometry( curvePoints );
    var hornMesh = new THREE.Mesh (hornGeom, bodyMaterials.teethMat);
    hornMesh.position.x += side*paramsMikey.bodyWidth/2;
    hornMesh.position.y += paramsMikey.bodyHeight - 5;
    hornMesh.rotation.z += side*-Math.PI/6;
    hornObj.add(hornMesh);

    return hornObj;
  }

  //createBody(): creates a body of lathed geometry given the right dimensions
  //and then adds the eye, limbs and smile to the body lathe object
  function createBody() {
    var bodyObj = new THREE.Object3D();

    var bodyDimen = [ [0, 0],
                    [paramsMikey.bodyWidth*1.5/5, 1],
                    [paramsMikey.bodyWidth*4/5, paramsMikey.bodyHeight/5],
                    [paramsMikey.bodyWidth, paramsMikey.bodyHeight/2],
                    [paramsMikey.bodyWidth*3/5, paramsMikey.bodyHeight*9/10],
                    [paramsMikey.bodyWidth*1/5, paramsMikey.bodyHeight-1],
                    [0, paramsMikey.bodyHeight]]; //body dimension

    var bodyCurve = new THREE.CatmullRomCurve3( makeVertices(bodyDimen) );
    var bodyGeom = new THREE.LatheGeometry( bodyCurve.getPoints(20) );

    bodyMesh = new THREE.Mesh (bodyGeom, bodyMaterials.bodyMat);

    bodyMesh.add(createHorn(1));
    bodyMesh.add(createHorn(-1));
    bodyMesh.add(createEye());
    bodyMesh.add(createLimb(1, "leg"));
    bodyMesh.add(createLimb(-1, "leg"));
    bodyMesh.add(createLimb(1, "arm"));
    bodyMesh.add(createLimb(-1, "arm"));
    bodyMesh.add(createSmile());

    bodyObj.add(bodyMesh);
    return bodyObj;
  }

  // main code here: gets the textures, maps the bodyMaterials and then adds and renders scene with object
  TW.loadTextures(["mikeyeye.jpg"], function (mikeyTextures) {

    bodyMaterials = {
      bodyMat: new THREE.MeshPhongMaterial({color: "#94E059"}),
      eyeMat: new THREE.MeshPhongMaterial({color: "#FFFFFF", map: mikeyTextures[0]}),
      moutMat: new THREE.MeshPhongMaterial({color: "#000000"}),
      teethMat: new THREE.MeshPhongMaterial({color: "#FFFFFF"})
    }; //sets all of the body materials to be the right textures

    scene.add(createBody());
    TW.render();
  });
}
