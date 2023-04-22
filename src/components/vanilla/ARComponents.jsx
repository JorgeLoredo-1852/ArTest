import React, {useEffect} from "react"
import ARExperience from "./Experience"
import ARL3_1 from "../lectures/l3_1"


const ARComponents = () => {
    const ARExp = new ARL3_1()

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