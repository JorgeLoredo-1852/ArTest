import React, {useEffect} from "react"
import ARExperience from "./Experience"

const ARComponents = () => {
    const arExperience = new ARExperience()

    useEffect(() => {
        arExperience.initScene()
        arExperience.setupARExperience()
        arExperience.loadModel()
        var interval = setInterval(() => { arExperience.move()}, 500);
    }, [])
    return (
        <div
            className="container3D"
            style={{
                marginTop: "100px",
                width: "100%",
                height: "100vh"
            }}
        >
vsdfgbdfhbdgfjnd
        </div>
    )
}

export default ARComponents;