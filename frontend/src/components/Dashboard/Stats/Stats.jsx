import "./Stats.css";

import {
    Fingerprint,
    Users,
    Clock3,
    ShieldCheck,
} from "lucide-react";

const stats = [

    {
        icon: Fingerprint,
        value: "99.97%",
        title: "Recognition Accuracy",
        color: "#4F7CFF",
    },

    {
        icon: Users,
        value: "842",
        title: "Employees",
        color: "#22C55E",
    },

    {
        icon: Clock3,
        value: "713",
        title: "Today's Attendance",
        color: "#F59E0B",
    },

    {
        icon: ShieldCheck,
        value: "Protected",
        title: "Security Status",
        color: "#7C4DFF",
    },

];

export default function Stats(){

    return(

        <section className="stats-grid">

            {

                stats.map((item,index)=>{

                    const Icon=item.icon;

                    return(

                        <div

                            key={index}

                            className="stat-box"

                        >

                            <div

                                className="stat-icon"

                                style={{

                                    background:item.color

                                }}

                            >

                                <Icon size={24}/>

                            </div>

                            <div>

                                <h2>{item.value}</h2>

                                <span>{item.title}</span>

                            </div>

                        </div>

                    )

                })

            }

        </section>

    )

}