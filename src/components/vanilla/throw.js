var camera, scene, renderer;
var geometry, material, mesh;
var raycaster, mouse, plane;
var startPos, endPos;
var $canvas;
var meshes;

init();
animate();

document.ontouchmove = function(event){
    event.preventDefault();
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;
  scene.add(camera);

  geometry = new THREE.CubeGeometry(200, 200, 200);
  material = new THREE.MeshBasicMaterial({
    color: 0x777777
  });
  meshes = [];

  plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);

  raycaster = new THREE.Raycaster();
  startPos = new THREE.Vector2();
  endPos = new THREE.Vector2();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
  $canvas = $('canvas');

  $canvas.on('mousedown touchstart', function(event) {
  	if ('ontouchstart' in window) {
    	console.log(event.originalEvent.touches);
    	var cx = event.originalEvent.touches[0].clientX;
      var cy = event.originalEvent.touches[0].clientY;
    } else {
    	var cx = event.clientX;
      var cy = event.clientY;
    }
    startPos.x = (cx / window.innerWidth) * 2 - 1;
    startPos.y = -(cy / window.innerHeight) * 2 + 1;
  });

  $canvas.on('mouseup touchend', function(event) {
  	if ('ontouchstart' in window) {
    	console.log(event.originalEvent.touches);
    	var cx = event.originalEvent.changedTouches[0].clientX;
      var cy = event.originalEvent.changedTouches[0].clientY;
    } else {
    	var cx = event.clientX;
      var cy = event.clientY;
    }
    endPos.x = (cx / window.innerWidth) * 2 - 1;
    endPos.y = -(cy / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(endPos, camera);
    var result = raycaster.ray.intersectPlane(plane);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = result.x;
    mesh.position.y = result.y;
    mesh.position.z = result.z;
    mesh.userData.dx = endPos.x - startPos.x;
    mesh.userData.dy = endPos.y - startPos.y;
    meshes.push(mesh);
    scene.add(mesh);
  });
}

function animate() {
  requestAnimationFrame(animate);
  for (var i = 0; i < meshes.length; i++) {
    var mesh = meshes[i];
    mesh.position.z -= 20;
    mesh.userData.dy -= 0.03;
    mesh.position.x += mesh.userData.dx * 20;
    mesh.position.y += mesh.userData.dy * 20;
  }
  render();
}

function render() {
  renderer.render(scene, camera);
}