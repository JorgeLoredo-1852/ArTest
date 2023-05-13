import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import en from './Inter_Bold.json';

class ARExperience{
	constructor(){
        if(document && window.innerHeight){
            this.container = document.createElement( 'div' );
            document.body.appendChild( this.container );
           
            
            this.clock = new THREE.Clock();
        
            this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

            this.scene = new THREE.Scene();
            
            this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

            const light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 1, 1, 1 ).normalize();
            this.scene.add( light );
                
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            
            this.container.appendChild( this.renderer.domElement );
            
            this.controls = new OrbitControls( this.camera, this.renderer.domElement );
            this.controls.target.set(0, 3.5, 0);
            this.controls.update();
            
            //this.stats = new Stats();
            //document.body.appendChild( this.stats.dom );
            //this.geometry = new THREE.BoxGeometry( 0.06, 0.06, 0.06 ); 
            this.meshes = [];


            //this.directions = [];
            //this.normal = new THREE.Vector3();
            //this.relativeVelocity = new THREE.Vector3();
			this.clock = new THREE.Clock();
            this.controller;


            this.frame = 0
            this.spheres = [];
            var cameraVector = new THREE.Vector3(); 



            // ADD TEXT
            this.puntaje = 1
            this.text3D = null
            this.createText()

            const axesHelper = new THREE.AxesHelper( 5 );
            this.scene.add( axesHelper );


            window.addEventListener('resize', this.resize.bind(this) );
        }
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

    setupXR(){
        this.renderer.xr.enabled = true;
        const self = this;
        function onSelect(){
            
            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.03),
                new THREE.MeshPhongMaterial({
                    color: 0xFFF111
                })
            )

            mesh.position.set(0,0,-0.3).applyMatrix4(self.controller.matrixWorld);
            mesh.quaternion.setFromRotationMatrix(self.controller.matrixWorld);

            
            let xrCamera = self.renderer.xr.getCamera(self.camera)

            mesh.userData.velocity = new THREE.Vector3();
			mesh.userData.velocity.x = (mesh.position.x - self.camera.position.x) * 0.05 ;
			mesh.userData.velocity.y = (mesh.position.y - self.camera.position.y) * 0.05 ;
			mesh.userData.velocity.z = self.camera.position.z * 0.05;


            self.scene.add(mesh);
            self.meshes.push(mesh);

            //self.directions.push(self.camera.position);
        }

        this.createText()

        this.controller = this.renderer.xr.getController(0);
        this.controller.addEventListener('select', onSelect);
        this.scene.add(this.controller);
        this.container.appendChild(
            ARButton.createButton(this.renderer)
        )
        //this.renderer.setAnimationLoop( this.render.bind(this) );
    }

    createText(){
        const self = this;
        var loader = new FontLoader();
        loader.load(
            '/Inter_Bold.json',
            function(res) {
                var textGeo = new TextGeometry(self.puntaje.toString(), {
                    font: res,
                    size: 40 / 500,
                    height: 0.005,
                    curveSegments: 10,
                    bevelEnabled: true,
                    bevelThickness: 1,
                    bevelSize: 1.8 / 300,
                    bevelOffset: 0,
                    bevelSegments: 5,
                    bevelEnabled: true
                  });
                  textGeo.computeBoundingBox();
                  textGeo.computeVertexNormals();

                  self.scene.remove(self.text3D)

                  var cubeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
                  self.text3D = new THREE.Mesh(textGeo, cubeMat);
                  self.text3D.position.x = -textGeo.boundingBox.max.x / 2;
                  self.text3D.position.z = -0.3
                  self.text3D.castShadow = true;
                  self.text3D.scale.z = self.text3D.scale.z / 300
                  self.text3D.scale.x = self.text3D.scale.x / 2
                  self.text3D.scale.y = self.text3D.scale.y / 2

                  self.scene.add(self.text3D)
            }
        );
    }

    refreshText() {
        this.createText();
    }

    initScene(){
        document.querySelector(".container3D").appendChild(this.container)
        this.renderer.setAnimationLoop(this.render.bind(this))
        console.log("Scene initialized")
    }
    
	render( ) {   
        //this.stats.update();
        /*for (let step = 0; step < this.meshes.length; step++) {
            console.log(this.meshes)
            this.meshes[step].position.set(this.meshes[step].position.x * 1.03, this.meshes[step].position.y * 1.03, this.meshes[step].position.z * 1.03)
        }*/



        this.move()
        this.moveBalls()
        this.checkCollisions()
        this.getPuntaje()

        this.renderer.render( this.scene, this.camera );
    }

    getPuntaje(){
        var aux = 1;
        for (let balloon = 0; balloon < this.spheres.length; balloon++) {
            let b = this.spheres[balloon]
            if(b.newValueCollision == true){
                aux = aux + 1;
            }
        }
        if (aux != this.puntaje){
            this.puntaje = aux
            this.refreshText()
        }
    }

    checkCollisions(){
        for (let dardo = 0; dardo < this.meshes.length; dardo++) {
            let d = this.meshes[dardo]

            for (let balloon = 0; balloon < this.spheres.length; balloon++) {
                let b = this.spheres[balloon]

                let bMinX = b.position.x - 0.1
                let bMaxX = b.position.x + 0.1

                let bMinY = b.position.y - 0.1
                let bMaxY = b.position.y + 0.1

                let bMinZ = b.position.z - 0.1
                let bMaxZ = b.position.z + 0.1

                if(d.position.x > bMinX && d.position.x < bMaxX){
                    if(d.position.y > bMinY && d.position.y < bMaxY){
                        if(d.position.z > bMinZ && d.position.z < bMaxZ){
                            this.spheres[balloon].material.color.setHex( 0xffffff );
                            this.spheres[balloon].newValueCollision = true
                        }
                    }
                }
            }
        }
    }

    move() {

        if(this.frame % 100 == 0){
            const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
            const material = new THREE.MeshPhongMaterial({
                color: 0xDD2B22
            })
            const balloon = new THREE.Mesh( geometry, material )
            balloon.geometry.computeBoundingSphere()

            this.spheres.push(balloon);
            this.scene.add( this.spheres[this.spheres.length - 1] );
            this.spheres[this.spheres.length - 1].position.x = Math.random() * (2 + 2) - 2;
            this.spheres[this.spheres.length - 1].position.y = 0;
            this.spheres[this.spheres.length - 1].position.z = Math.random() * (0 + 2) - 2;
            this.spheres[this.spheres.length - 1].newValueCollision = false
        }

        this.frame += 1;
        for (let step = 0; step < this.spheres.length; step++) {
            this.spheres[step].translateY( 0.004 );
          }
      }

    loadModel(){
        const gltfLoader = new GLTFLoader();
        gltfLoader.load("./models/amongus.glb", (gltf) => {
            this.scene.add(gltf.scene)
        })
        //console.log(document.querySelector('canvas'))
    }


    moveBalls() {

        for ( let i = 0; i < this.meshes.length; i ++ ) {

            const object = this.meshes[ i ];

            object.position.x += object.userData.velocity.x;
            object.position.y += object.userData.velocity.y;
            object.position.z += object.userData.velocity.z;

        }
    }

}


export default ARExperience;