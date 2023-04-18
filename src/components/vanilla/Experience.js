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
            this.camera.position.set(5,5,5)
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
    
            
            window.addEventListener('resize', this.resize.bind(this))
        }
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
        console.log(document.querySelector("canvas"))

    }

    loadModel(){
        const gltfLoader = new GLTFLoader();
        gltfLoader.load("./models/amongus.glb", (gltf) => {
            this.scene.add(gltf.scene)
        })
        console.log(document.querySelector('canvas'))
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