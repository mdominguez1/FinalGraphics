/**
 * Building a 3D model of a plane where the propelers will spin
 * and there will be several camera angles
 * @author Melchor Dominguez & Jorge Arcos Jr.
 * @version 5-3-2019
 */

/** Various different variables needed*/
var scene, camera, renderer, canvasHeight, canvasWidth,
    aspRat, viewLength, currentCamera;

/** pivot point for the propelers **/
var propPivot;

init();
draw();
renderScene();

/**
 * S4ets the window color, the canvas width and height, create a new scene
 * and orthographic camera, and add an event handler that listens
 * for the alpha change.
 */
function init() {

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    renderer.setSize(canvasWidth, canvasHeight);
    document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    viewLength = 500;
    aspRat = canvasWidth / canvasHeight;
    document.addEventListener("keydown", onDocumentKeyDown);
    camera = setCamera0();
    propPivot = new THREE.Object3D();
    scene.add(camera);
}

/**
 * Returns the camera to its initial position when the scene is 
 * first loaded
 */
function setCamera0() {
    var cameraTemp = new THREE.OrthographicCamera(-aspRat * viewLength / 2, aspRat * viewLength / 2,
        viewLength / 2, -viewLength / 2, -1000, 1000);
    cameraTemp.position.set(100, 100, 190);
    cameraTemp.lookAt(scene.position);
    currentCamera = 0;
    return cameraTemp;
}

function draw() {
    buildGround();
}

function buildGround() {
    var planeGeo = new THREE.Geometry();
    var planelength = 500;
    planeGeo.vertices.push(
        new THREE.Vector3(-planelength, 0, -planelength),
        new THREE.Vector3(planelength, 0, -planelength),
        new THREE.Vector3(planelength, 0, planelength),
        new THREE.Vector3(-planelength, 0, planelength)
    );

    planeGeo.faces.push(
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(2,3,0)
    );

    var material = new THREE.MeshBasicMaterial({
        color: 0x242424,
        transparent: false,
        side: THREE.DoubleSide
    });

    var plane = new THREE.Mesh(planeGeo, material);

    scene.add(plane);

}

function renderScene() {
    renderer.render(scene, camera);
}

function onDocumentKeyDown(event) {

}