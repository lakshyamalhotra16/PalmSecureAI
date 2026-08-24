import "./EnrollmentActions.css";

import {

    Camera,

    RotateCcw,

    UserPlus,

} from "lucide-react";

export default function EnrollmentActions({

    onCapture,

    onReset,

    onEnroll,

}){

    return(

        <section className="enrollment-actions">

            <button

                className="secondary-action"

                onClick={onCapture}

            >

                <Camera size={18}/>

                Capture

            </button>

            <button

                className="secondary-action"

                onClick={onReset}

            >

                <RotateCcw size={18}/>

                Reset

            </button>

            <button

                className="primary-action"

                onClick={onEnroll}

            >

                <UserPlus size={18}/>

                Enroll Employee

            </button>

        </section>

    )

}