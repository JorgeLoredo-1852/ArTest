import React, {useEffect} from "react"
import ARExperience from "./Experience"
import ARL3_9 from "../lectures/l3_9"


const ARComponents = () => {
    const ARExp = new ARExperience()

    useEffect(() => {
        ARExp.initScene()
        ARExp.setupXR()
        console.log("asdd")
    }, [])
    return (
        <div style={{position:"relative"}}>
            <div
                className="container3D"
                style={{
                    zIndex:1,
                    width: "100vw",
                    height: "100vh",
                    overflow: 'hidden'
                }}
            >
            </div>
            <div style={{position:"absolute", zIndex:10000, top:0}}>SADDJPASDIAJOA</div>
        </div>
      
)}

export default ARComponents;