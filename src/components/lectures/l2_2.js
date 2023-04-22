import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class ARL2_2{
	constructor(){
        if(document && window.innerHeight){
            this.container = document.createElement( 'div' );
            document.body.appendChild( this.container );
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/ window.innerHeight, 0.1, 100);
            this.camera.position.set(0,0,4);

            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0Xaaaaaa);

            const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
            this.scene.add(ambient);

            const light = new THREE.DirectionalLight();
            light.position.set(0.2, 1, 1);
            this.scene.add(light)

            this.renderer = new THREE.WebGLRenderer({antialias: true});
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.container.appendChild(this.renderer.domElement);

            const geometry = new THREE.BoxGeometry(2,2,2);
            const material = new THREE.MeshStandardMaterial({color: 0xff0000})
            this.mesh = new THREE.Mesh(geometry, material)   
            this.scene.add(this.mesh)         

            const controls = new OrbitControls(this.camera, this.renderer.domElement)

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
    initScene(){
        document.querySelector(".container3D").appendChild(this.container)
        this.renderer.setAnimationLoop(this.render.bind(this))
        console.log("Scene initialized")
    }
    
	render() {  
        this.mesh.rotateY(0.01)
        this.renderer.render(this.scene, this.camera)
    }

}

export default ARL2_2;