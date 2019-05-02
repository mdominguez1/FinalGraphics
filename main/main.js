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

/**
 * function which will return a perspective camera looking at the propelor
 */
function setCamera1() {
    var cameraTemp = new THREE.PerspectiveCamera(100, aspRat, 1, 100);
    cameraTemp.position.set(0, 50, -100);
    cameraTemp.lookAt(scene.position);
    currentCamera = 1;
    return cameraTemp;
}

/**
 * function which will draw all required items for the scene.
 * This function will call all other functions needed to render the entire scene.
 */
function draw() {
    buildGround();
    buildPropelor();
}


/**
 * Ground which signifies the asphalt the Plane will be placed on
 * grey and large.
 */
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

/**
 * function which will draw all the objects for the propelor 
 */
function buildPropelor() {
    propPivot.position.set(0, 20, -20)

    //base for the propelors to hold onto - will be connected to base of the plane
    var baseGeometry = new THREE.CylinderGeometry(20, 20, 10, 50);
    var baseMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotateX(Math.PI / 2);

    //Lathe - for a portion of the cone where the propelors will spin on
    var points = [];
    for (var i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
    }
    var latheGeometry = new THREE.LatheGeometry(points);
    var latheMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    var lathe = new THREE.Mesh(latheGeometry, latheMaterial);
    lathe.position.set(0, 0, -15);
    lathe.rotateX(Math.PI / 2);

    //Cap for the cone
    var circleGeometry = new THREE.CircleGeometry(12, 50);
    var circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(0, -4, -15);
    circle.rotateX(-Math.PI / 2); 


    propPivot.add(base);
    propPivot.add(lathe);
    propPivot.add(circle);
    scene.add(propPivot);
}

function renderScene() {
    renderer.render(scene, camera);
}

/**
 * Event handler for key down events in the scene.
 * 0(48/96) puts the camera back to its initial state
 * 1(49/97) puts the camera in a perspective view looking at the propelors
 * @param {any} event - event holding the keycodes 
 */
function onDocumentKeyDown(event) {
    if (event.keyCode == 48 || event.keyCode == 96) {
        // The camera is positioned at its initial position in the upper
        // right corner closest to the viewer

        if (currentCamera != 0) {
            scene.remove(camera);
            camera = setCamera0();
            scene.add(camera);
            renderScene();
        }
    } else if (event.keyCode == 49 || 97) {
        // Moves the camera in front of the propelors 

        if (currentCamera != 1) {
            scene.remove(camera);
            camera = setCamera1();
            scene.add(camera);
            renderScene();
        }
    }
}