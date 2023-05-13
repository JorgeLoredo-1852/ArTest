import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

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


            let textGeo = new TextGeometry( 'Hello three.js!', {
                size: 50,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5
            })

            textGeo.computeBoundingBox();
            let materials = [
                new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
                new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
            ];
            let textMesh1 = new THREE.Mesh( textGeo, materials );
            this.scene.add(textMesh1)
            


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
        this.controller = this.renderer.xr.getController(0);
        this.controller.addEventListener('select', onSelect);
        this.scene.add(this.controller);
        this.container.appendChild(
            ARButton.createButton(this.renderer)
        )
        //this.renderer.setAnimationLoop( this.render.bind(this) );
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

        this.renderer.render( this.scene, this.camera );
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