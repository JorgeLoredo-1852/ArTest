import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

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
            this.geometry = new THREE.SphereGeometry( 0.03, 32, 16 );

            this.meshes = [];


            //this.directions = [];
            //this.normal = new THREE.Vector3();
            //this.relativeVelocity = new THREE.Vector3();
			this.clock = new THREE.Clock();


            this.frame = 0
            this.spheres = [];

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
        let controller;
        function onSelect(){
            const material = new THREE.MeshPhongMaterial({
                color: 0xFFF111
            })
            const mesh = new THREE.Mesh(self.geometry, material);
            mesh.position.set(0,0,-0.3).applyMatrix4(controller.matrixWorld);
            mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
            console.log(mesh)

            mesh.userData.velocity = new THREE.Vector3();
			mesh.userData.velocity.x = (mesh.position.x - self.camera.position.x) * 0.05 ;
			mesh.userData.velocity.y = (mesh.position.y - self.camera.position.y) * 0.05 ;
			mesh.userData.velocity.z = self.camera.position.z * 0.05;
            self.scene.add(mesh);
            self.meshes.push(mesh);

            //self.directions.push(self.camera.position);
        }
        controller = this.renderer.xr.getController(0);
        controller.addEventListener('select', onSelect);
        this.scene.add(controller);
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

        this.renderer.render( this.scene, this.camera );
    }

    move() {

        if(this.frame % 100 == 0){
            console.log("created balloons")
            const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
            const material = new THREE.MeshPhongMaterial({
                color: 0xDD2B22
            })
            this.spheres.push(new THREE.Mesh( geometry, material ));
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