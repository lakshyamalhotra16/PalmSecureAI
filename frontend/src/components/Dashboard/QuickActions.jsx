import "./QuickActions.css";

import {

    FiClock,

    FiBarChart2,

    FiLogOut,

} from "react-icons/fi";

export default function QuickActions() {

    return (

        <div className="quick-actions">

            <button>

                <FiClock />

                Attendance History

            </button>

            <button>

                <FiBarChart2 />

                Analytics

            </button>

            <button>

                <FiLogOut />

                Logout

            </button>

        </div>

    );

}