/** Various different variables needed */
var scene, camera, renderer, canvasHeight, canvasWidth, light;

init();
draw();
renderScene();

/**
 * Sets the window color, the canvas width and height, create a new 
 * scene and orthographic camera, and add an event handler that listens
 * for the alpha change.
 */
function init(){

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor(0xffffff, 1);

	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	renderer.setSize(canvasWidth, canvasHeight);
	document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, 16/9, 1, 1500);

	camera.position.set(0, 0, 1000);
	camera.lookAt(new THREE.Vector3(0,0,0));
	airplane = new THREE.Object3D();
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 1, 1 ).normalize();
	
	
	scene.add(light);
	scene.add(camera);

	document.addEventListener("keydown", onDocumentKeyDown);
}

function draw() {
		createPlane();
}


function createPlane(){ 
	makeBody();
	makeTail();
	makeWing();
	wingSupport();
	
	airplane.scale.set(2,2,2);
	scene.add(airplane);
}

function makeBody() {
	var body = new THREE.Object3D();
	var cabin = new THREE.Shape();
	cabin.moveTo(-120, 40);
	cabin.lineTo(-120, -40);
	cabin.lineTo( 0, -40);
	cabin.lineTo( 0, 80);
	cabin.bezierCurveTo(-40, -20, 0, -20, -90, -20)
	cabin.lineTo(-120, 40);
	var extrude = new THREE.ExtrudeGeometry(cabin, {amount: 80, bevelEnabled: false});
	var cabinMat = new THREE.MeshPhongMaterial({color: 0xff0000, flatShading:THREE.FlatShading});
	var cabinMesh = new THREE.Mesh(extrude, cabinMat);
	cabinMesh.castShadow = true;
	cabinMesh.receiveShadow = true;
	body.add(cabinMesh);

	var cabinLeft = new THREE.Shape();
	cabinLeft.moveTo(-40, 0);
	cabinLeft.bezierCurveTo(-10, 10, 10, 10, 40, 0)
	cabinLeft.lineTo(-40, 0);
	var cabinSideExtrude = new THREE.ExtrudeGeometry(cabinLeft, {amount: 120, bevelEnabled: false});
	var cabinLeftMesh = new THREE.Mesh(cabinSideExtrude, cabinMat);
	cabinLeftMesh.rotateX(-Math.PI/2);
	cabinLeftMesh.rotateY(-Math.PI/2);
	cabinLeftMesh.castShadow = true;
	cabinLeftMesh.receiveShadow = true;
	body.add(cabinLeftMesh);

	var cabinRightMesh = cabinLeftMesh.clone();
	cabinRightMesh.rotateZ(Math.PI);
	cabinRightMesh.position.set(0, 0, 80);
	body.add(cabinRightMesh);
	
	var cabinBottomMesh = cabinLeftMesh.clone();
	cabinBottomMesh.rotateZ(Math.PI/2); 
	cabinBottomMesh.position.set(0, -40, 40);
	body.add(cabinBottomMesh);

	airplane.add(body);
}

function makeTail() {
	var tail = new THREE.Shape();
	tail.moveTo(0, 40);
	tail.bezierCurveTo(40, 50, 80, 50, 120, 70);
	//tail.lineTo(160, 120);
	tail.bezierCurveTo(140, 160, 160, 160, 160, 80);
	tail.lineTo(160, 20);
	//tail.bezierCurveTo(160, 0, 150, 0, 140, 0);
	tail.bezierCurveTo(160, -40, 40, -10, 0, -40);
	//tail.lineTo(0, -40);
	tail.lineTo(0, 40);
	var extrude = new THREE.ExtrudeGeometry(tail, {amount: 80, bevelEnabled: false});
	var tailMat = new THREE.MeshPhongMaterial({color: 0xff0000, flatShading:THREE.FlatShading});
	var tailMesh = new THREE.Mesh(extrude, tailMat);

	airplane.add(tailMesh);
}

function makeWing() {
	var wing = new THREE.SphereGeometry(20, 60, 60);
	wing.applyMatrix( new THREE.Matrix4().makeScale( 2.5, .5, 10.0 ) );
	var wingMat = new THREE.MeshPhongMaterial({color: 0xfa000, flatShading:THREE.FlatShading});
	var wingMesh = new THREE.Mesh(wing, wingMat);
	wingMesh.position.set(-120, 80, 40);
	wingMesh.castShadow = true;
	wingMesh.receiveShadow = true;
	airplane.add(wingMesh);

	var bottomWing = wing.clone();
	var bottomWingMesh = new THREE.Mesh(bottomWing, wingMat);
	bottomWingMesh.position.set(-120, -60, 40);
	bottomWingMesh.castShadow = true;
	bottomWingMesh.receiveShadow = true;
	airplane.add(bottomWingMesh);
}

function wingSupport() {
	var completeSupport = new THREE.Object3D(); 
	var support = new THREE.CylinderGeometry(1, 1, 140, 60);
	var supportMat = new THREE.MeshPhongMaterial({color: 0xff0aa, flatShading:THREE.FlatShading});
	var supportMesh = new THREE.Mesh(support, supportMat);
	supportMesh.position.set(-27,10,0);
	supportMesh.castShadow = true;
	supportMesh.receiveShadow = true;
	completeSupport.add(supportMesh);

	var support1 = support.clone();
	var supportMesh1 = new THREE.Mesh(support1, supportMat);
	supportMesh1.position.set(27,10,0);
	supportMesh1.castShadow = true;
	supportMesh1.receiveShadow = true;
	completeSupport.add(supportMesh1);

	var support2 = new THREE.CylinderGeometry(1, 1, 140, 60);
	var supportMesh2 = new THREE.Mesh(support2, supportMat);
	supportMesh2.position.set(0,10,0);
	supportMesh2.rotateZ(Math.PI/8);
	supportMesh2.castShadow = true;
	supportMesh2.receiveShadow = true;
	completeSupport.add(supportMesh2);

	var support3 = support2.clone();
	var supportMesh3 = new THREE.Mesh(support3, supportMat);
	supportMesh3.position.set(0,10,0);
	supportMesh3.rotateZ(-Math.PI/8);
	supportMesh3.castShadow = true;
	supportMesh3.receiveShadow = true;
	completeSupport.add(supportMesh3);

	completeSupport.position.set(-120, 0, 180);
	airplane.add(completeSupport);

	var cS1 = completeSupport.clone();
	cS1.position.set(-120, 0, 120);
	airplane.add(cS1);
	var cS2 = completeSupport.clone();
	cS2.position.set(-120, 0, -40);
	airplane.add(cS2);
	var cS3 = completeSupport.clone();
	cS3.position.set(-120, 0, -100);
	airplane.add(cS3);
}

function renderScene(){
  renderer.render(scene, camera);
}

//  Version 1:  Incremental rotation
function onDocumentKeyDown(event) {
  if(event.keyCode == 81) {
		airplane.rotateY(Math.PI / 16);
        renderScene();
	} else if(event.keyCode == 87) {
		airplane.rotateX(Math.PI / 16);
        renderScene();
	} else if(event.keyCode == 69) {
		airplane.rotateZ(Math.PI / 16);
        renderScene();
	} else if(event.keyCode == 65) {
		airplane.rotateY(-Math.PI / 16);
        renderScene();
	} else if(event.keyCode == 83) {
		airplane.rotateX(-Math.PI / 16);
        renderScene();
	} else if(event.keyCode == 68) {
		airplane.rotateZ(-Math.PI / 16);
        renderScene();
	}
	
}