import * as THREE from 'three'
import React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ARButton} from 'three/examples/jsm/webxr/ARButton'
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

class ARExperience{
    constructor(){

        if(document){
            this.container = document.createElement('div');
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(
                60,
                window.innerWidth / window.innerHeight,
                0.1,
                100
            )
            this.camera.position.set(0,0,0)
            this.camera.lookAt(new THREE.Vector3())
            this.scene.add(this.camera)
            this.renderer = new THREE.WebGLRenderer(
                {
                    alpha: true
                }
            )
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.renderer.setPixelRatio(1)
            this.container.appendChild(this.renderer.domElement)
    
            this.controls = new OrbitControls(
                this.camera,
                this.renderer.domElement
            )
            this.controls.enableDamping = true
    
            
            const drLight = new THREE.DirectionalLight(0xffffff, 1.5)
            drLight.position.set(5,5,5)
            this.scene.add(drLight)
            const al = new THREE.AmbientLight(0xffffff, 0.4)
            this.scene.add(al)


            this.frame = 0
            this.spheres = []

            //document.getElementById('ARButton').onclick = ()=>{this.move()}
            
            window.addEventListener('resize', this.resize.bind(this))

            
            var canvas = document.querySelector('canvas');




            this.raycaster = new THREE.Raycaster();
  this.startPos = new THREE.Vector2();
  this.endPos = new THREE.Vector2();

var canvas = document.createElement('canvas');
  canvas.addEventListener('mousedown touchstart', function(event) {
  	if ('ontouchstart' in window) {
    	console.log(event.originalEvent.touches);
    	var cx = event.originalEvent.touches[0].clientX;
      var cy = event.originalEvent.touches[0].clientY;
    } else {
    	var cx = event.clientX;
      var cy = event.clientY;
    }
    this.startPos.x = (cx / window.innerWidth) * 2 - 1;
    this.startPos.y = -(cy / window.innerHeight) * 2 + 1;
  });

  canvas.addEventListener('mouseup touchend', function(event) {
  	if ('ontouchstart' in window) {
    	console.log(event.originalEvent.touches);
    	var cx = event.originalEvent.changedTouches[0].clientX;
      var cy = event.originalEvent.changedTouches[0].clientY;
    } else {
    	var cx = event.clientX;
      var cy = event.clientY;
    }
    this.endPos.x = (cx / window.innerWidth) * 2 - 1;
    this.endPos.y = -(cy / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.endPos, camera);
    var result = this.raycaster.ray.intersectPlane(plane);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = result.x;
    mesh.position.y = result.y;
    mesh.position.z = result.z;
    mesh.userData.dx = this.endPos.x - this.startPos.x;
    mesh.userData.dy = this.endPos.y - this.startPos.y;
    meshes.push(mesh);
    scene.add(mesh);
  });



        }
    }

    move() {

        if(this.frame % 30 == 0){
            const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
            const material = new THREE.MeshBasicMaterial( { color: 0x15885155 } );
            this.spheres.push(new THREE.Mesh( geometry, material ));
            this.scene.add( this.spheres[this.spheres.length - 1] );
            this.spheres[this.spheres.length - 1].position.x = Math.random() * (2 + 1) - 1;
            this.spheres[this.spheres.length - 1].position.y = 0;
            this.spheres[this.spheres.length - 1].position.z = Math.random() * (3 - 2) - 2;
        }

        this.frame += 1;
        for (let step = 0; step < this.spheres.length; step++) {
            this.spheres[step].translateY( 0.01 );
          }
      }

      animate() {
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

    setupARExperience(){
        this.renderer.xr.enabled = true

        const controller = this.renderer.xr.getController(0)
        this.scene.add(controller)

        this.scene.traverse(child =>{
            if(child instanceof THREE.Mesh){
                child.position.set(0,0,-1).applyMatrix4(controller.matrixWorld)
                child.quaternion.setFromRotationMatrix(
                    controller.matrixWorld
                )
            }
        })

        this.container.appendChild(
            ARButton.createButton(this.renderer)

        )

    }

    loadModel(){
        const gltfLoader = new GLTFLoader();
        gltfLoader.load("./models/amongus.glb", (gltf) => {
            this.scene.add(gltf.scene)
        })
        //console.log(document.querySelector('canvas'))
    }

    initScene(){
        document.querySelector(".container3D").appendChild(this.container)
        this.renderer.setAnimationLoop(this.render.bind(this))
    }

    resize(){
        const {
            clientWidth = width,
            clientHeight = height
        } = document.querySelector(".container3D")


        this.renderer.setSize(width, height)
        this.camera.updateProjectionMatrix()
        this.camera.aspect = width / height
    }
    render(){
        this.renderer.render(this.scene, this.camera)
    }
}


export default ARExperience;