import "./DashboardLayout.css";

import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="dashboard-layout">

            {/* ================================
                APPLICATION SIDEBAR
            ================================= */}

            <Sidebar />


            {/* ================================
                MAIN APPLICATION AREA
            ================================= */}

            <main className="dashboard-main">

                {/* Global top navigation */}
                <Topbar />


                {/* ================================
                    PAGE CONTENT
                ================================= */}

                <section className="dashboard-content">

                    <div className="dashboard-content-inner">
                        {children}
                    </div>

                </section>

            </main>

        </div>
    );
}