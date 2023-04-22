import React, {useEffect} from "react"
import ARExperience from "./Experience"
import ARL3_9 from "../lectures/l3_9"


const ARComponents = () => {
    const ARExp = new ARL3_9()

    useEffect(() => {
        ARExp.initScene()
        ARExp.setupXR()
        console.log("asdd")
    }, [])
    return (
        <div
            className="container3D"
            style={{
                width: "100vw",
                height: "100vh",
                overflow: 'hidden'
            }}
        >

        </div>
    )
}

export default ARComponents;