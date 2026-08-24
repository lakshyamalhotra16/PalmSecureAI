import "./AIStatusPanel.css";

import {

    Camera,
    ScanSearch,
    Sun,
    ShieldCheck,
    Circle,

} from "lucide-react";

export default function AIStatusPanel({

    cameraConnected,

    palmDetected,

    lighting,

    confidence,

}) {

    const status = [

        {

            icon: Camera,

            title: "Camera",

            value: cameraConnected ? "Connected" : "Disconnected",

            success: cameraConnected,

        },

        {

            icon: ScanSearch,

            title: "Palm Detection",

            value: palmDetected ? "Detected" : "Waiting",

            success: palmDetected,

        },

        {

            icon: Sun,

            title: "Lighting",

            value: lighting,

            success: lighting === "Excellent",

        },

        {

            icon: ShieldCheck,

            title: "Confidence",

            value: confidence,

            success: palmDetected,

        },

    ];

    return (

        <section className="ai-panel">

            <div className="panel-header">

                <h2>AI Analysis</h2>

                <div className="panel-online">

                    <Circle size={10}/>

                    Online

                </div>

            </div>

            <div className="panel-list">

                {

                    status.map((item,index)=>{

                        const Icon=item.icon;

                        return(

                            <div
                                className="panel-item"
                                key={index}
                            >

                                <div className="panel-icon">

                                    <Icon size={18}/>

                                </div>

                                <div className="panel-content">

                                    <span>

                                        {item.title}

                                    </span>

                                    <strong>

                                        {item.value}

                                    </strong>

                                </div>

                            </div>

                        )

                    })

                }

            </div>

        </section>

    );

}