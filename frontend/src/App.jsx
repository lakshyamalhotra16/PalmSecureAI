import { Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Enrollment from "./pages/Enrollment";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/enrollment"
                element={<Enrollment />}
            />

            <Route
                path="/authentication"
                element={<Authentication />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />

            <Route
                path="/employees"
                element={<Employees />}
            />

            <Route
                path="/attendance"
                element={<Attendance />}
            />

            <Route
                path="/analytics"
                element={<Analytics />}
            />

            <Route
                path="/settings"
                element={<Settings />}
            />

        </Routes>
    );
}

export default App;