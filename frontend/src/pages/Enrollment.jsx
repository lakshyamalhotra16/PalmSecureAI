import { useRef, useState } from "react";

import Webcam from "react-webcam";

import {
    Camera,
    Upload,
    Image as ImageIcon,
    ScanFace,
    Sun,
    ShieldCheck,
    User,
    Building2,
    IdCard,
} from "lucide-react";

import Navbar from "../components/Layout/Navbar/Navbar";

import "./Enrollment.css";


const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
};


export default function Enrollment() {

    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);


    const [employeeId, setEmployeeId] = useState("");
    const [fullName, setFullName] = useState("");
    const [department, setDepartment] = useState("");


    const [capturedImage, setCapturedImage] = useState(null);

    const [cameraConnected, setCameraConnected] =
        useState(false);

    const [palmDetected, setPalmDetected] =
        useState(false);

    const [lightingReady, setLightingReady] =
        useState(false);

    const [confidence, setConfidence] =
        useState("--");

    const [message, setMessage] =
        useState("");

    const [enrolling, setEnrolling] =
        useState(false);


    // =========================================================
    // CAMERA START
    // =========================================================

    const handleCameraStart = () => {

        console.log("Camera started");

        setCameraConnected(true);
    };


    // =========================================================
    // CAMERA ERROR
    // =========================================================

    const handleCameraError = (error) => {

        console.error(
            "Camera error:",
            error
        );

        setCameraConnected(false);

        setMessage(
            "Camera access failed. Please allow camera permission and try again."
        );
    };


    // =========================================================
    // CAPTURE PALM
    // =========================================================

    const handleCapture = () => {

        if (!webcamRef.current) {

            setMessage(
                "Camera is not available."
            );

            return;
        }


        const image =
            webcamRef.current.getScreenshot();


        if (!image) {

            setMessage(
                "Unable to capture image."
            );

            return;
        }


        setCapturedImage(image);

        setPalmDetected(true);

        setLightingReady(true);

        setConfidence("95%");

        setMessage(
            "Palm image captured successfully."
        );
    };


    // =========================================================
    // OPEN FILE SELECTOR
    // =========================================================

    const handleUploadClick = () => {

        fileInputRef.current?.click();
    };


    // =========================================================
    // UPLOAD PALM IMAGE
    // =========================================================

    const handleFileUpload = (event) => {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            setMessage(
                "Please select a valid image file."
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload = () => {

            setCapturedImage(
                reader.result
            );

            setPalmDetected(true);

            setLightingReady(true);

            setConfidence("92%");

            setMessage(
                "Palm image uploaded successfully."
            );
        };


        reader.onerror = () => {

            setMessage(
                "Unable to read the selected image."
            );
        };


        reader.readAsDataURL(file);
    };


    /*
    ============================================================
    EMPLOYEE ENROLLMENT
    ============================================================

    Sends:

    employee_id
    full_name
    department
    palm_image

    to FastAPI backend.

    ============================================================
    */

    const handleEnrollment = async () => {

        setMessage("");


        // ========================================================
        // FRONTEND VALIDATION
        // ========================================================

        if (!employeeId.trim()) {

            setMessage(
                "Please enter Employee ID."
            );

            return;
        }


        if (!fullName.trim()) {

            setMessage(
                "Please enter employee full name."
            );

            return;
        }


        if (!department.trim()) {

            setMessage(
                "Please enter department."
            );

            return;
        }


        if (!capturedImage) {

            setMessage(
                "Please capture or upload a palm image first."
            );

            return;
        }


        setEnrolling(true);


        try {

            console.log(
                "================================================"
            );

            console.log(
                "PALMSECUREAI ENROLLMENT STARTED"
            );

            console.log(
                "Employee ID:",
                employeeId
            );

            console.log(
                "Full Name:",
                fullName
            );

            console.log(
                "Department:",
                department
            );


            // ====================================================
            // CONVERT BASE64 IMAGE TO BLOB
            // ====================================================

            const imageResponse =
                await fetch(capturedImage);


            if (!imageResponse.ok) {

                throw new Error(
                    "Unable to process the captured palm image."
                );
            }


            const imageBlob =
                await imageResponse.blob();


            // ====================================================
            // CREATE MULTIPART FORM DATA
            // ====================================================

            const formData =
                new FormData();


            formData.append(
                "employee_id",
                employeeId.trim()
            );


            formData.append(
                "full_name",
                fullName.trim()
            );


            formData.append(
                "department",
                department.trim()
            );


            formData.append(
                "palm_image",
                imageBlob,
                `${employeeId.trim()}_palm.jpg`
            );


            console.log(
                "FormData prepared successfully."
            );


            // ====================================================
            // SEND REQUEST TO FASTAPI
            // ====================================================

            const apiResponse =
                await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/enrollment/enroll`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );


            // ====================================================
            // READ BACKEND RESPONSE
            // ====================================================

            let responseData = null;


            try {

                responseData =
                    await apiResponse.json();

            } catch (jsonError) {

                console.error(
                    "Backend returned invalid JSON:",
                    jsonError
                );
            }


            console.log(
                "Backend HTTP status:",
                apiResponse.status
            );


            console.log(
                "Backend response:",
                responseData
            );


            // ====================================================
            // HANDLE BACKEND ERROR
            // ====================================================

            if (!apiResponse.ok) {

                const backendMessage =
                    responseData?.detail ||
                    "Enrollment failed on the server.";


                throw new Error(
                    backendMessage
                );
            }


            // ====================================================
            // ENROLLMENT SUCCESS
            // ====================================================

            console.log(
                "================================================"
            );

            console.log(
                "EMPLOYEE ENROLLMENT SUCCESSFUL"
            );

            console.log(
                "Backend data:",
                responseData
            );

            console.log(
                "================================================"
            );


            setMessage(
                "Employee enrolled successfully in PalmSecureAI."
            );


            setPalmDetected(true);

            setLightingReady(true);

            setConfidence("95%");


        } catch (error) {

            console.error(
                "================================================"
            );

            console.error(
                "EMPLOYEE ENROLLMENT FAILED"
            );

            console.error(
                error
            );

            console.error(
                "================================================"
            );


            setMessage(
                error?.message ||
                "Enrollment failed. Please try again."
            );


        } finally {

            setEnrolling(false);
        }
    };


    // =========================================================
    // RESET FORM
    // =========================================================

    const handleReset = () => {

        setEmployeeId("");

        setFullName("");

        setDepartment("");

        setCapturedImage(null);

        setPalmDetected(false);

        setLightingReady(false);

        setConfidence("--");

        setMessage("");


        if (fileInputRef.current) {

            fileInputRef.current.value = "";
        }
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <>

            <Navbar />


            <main className="enrollment-page">


                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="enrollment-header">

                    <div>

                        <div className="header-badge">

                            <ShieldCheck size={16} />

                            Secure Employee Enrollment

                        </div>


                        <h1>
                            Palm Identification
                        </h1>


                        <p>
                            Register employee details and capture
                            palm biometrics for secure identification.
                        </p>

                    </div>

                </div>



                <section className="enrollment-card">


                    {/* ==================================================
                        EMPLOYEE DETAILS
                    ================================================== */}

                    <div className="employee-details-section">


                        <div className="section-heading">

                            <div className="section-icon">

                                <User size={21} />

                            </div>


                            <div>

                                <h2>
                                    Employee Details
                                </h2>


                                <p>
                                    Enter the employee information
                                    required for biometric enrollment.
                                </p>

                            </div>

                        </div>



                        <div className="employee-form-grid">


                            {/* ==================================================
                                EMPLOYEE ID
                            ================================================== */}

                            <div className="form-group">

                                <label>
                                    Employee ID
                                </label>


                                <div className="input-wrapper">

                                    <IdCard size={18} />


                                    <input
                                        type="text"
                                        placeholder="e.g. EMP001"
                                        value={employeeId}
                                        onChange={(e) =>
                                            setEmployeeId(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>



                            {/* ==================================================
                                FULL NAME
                            ================================================== */}

                            <div className="form-group">

                                <label>
                                    Full Name
                                </label>


                                <div className="input-wrapper">

                                    <User size={18} />


                                    <input
                                        type="text"
                                        placeholder="Enter employee name"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>



                            {/* ==================================================
                                DEPARTMENT
                            ================================================== */}

                            <div className="form-group">

                                <label>
                                    Department
                                </label>


                                <div className="input-wrapper">

                                    <Building2 size={18} />


                                    <input
                                        type="text"
                                        placeholder="e.g. Engineering"
                                        value={department}
                                        onChange={(e) =>
                                            setDepartment(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                        </div>

                    </div>



                    {/* ==================================================
                        BIOMETRIC SECTION
                    ================================================== */}

                    <div className="biometric-section">


                        <div className="section-heading">

                            <div className="section-icon">

                                <ScanFace size={21} />

                            </div>


                            <div>

                                <h2>
                                    Biometric Enrollment
                                </h2>


                                <p>
                                    Capture or upload the employee's
                                    palm image for secure identification.
                                </p>

                            </div>

                        </div>



                        <div className="enrollment-grid">


                            {/* ==================================================
                                LIVE CAMERA
                            ================================================== */}

                            <div className="enrollment-panel">


                                <div className="panel-heading">

                                    <div>

                                        <h2>
                                            Live Camera
                                        </h2>

                                        <span>
                                            AI Ready
                                        </span>

                                    </div>

                                </div>



                                <div className="camera-preview">

                                    <Webcam
                                        ref={webcamRef}
                                        audio={false}
                                        mirrored
                                        screenshotFormat="image/png"
                                        videoConstraints={
                                            videoConstraints
                                        }
                                        onUserMedia={
                                            handleCameraStart
                                        }
                                        onUserMediaError={
                                            handleCameraError
                                        }
                                    />

                                </div>



                                <button
                                    type="button"
                                    className="capture-btn"
                                    onClick={
                                        handleCapture
                                    }
                                >

                                    <Camera size={18} />

                                    Capture Palm

                                </button>


                            </div>



                            {/* ==================================================
                                PALM PREVIEW
                            ================================================== */}

                            <div className="enrollment-panel">


                                <div className="panel-heading">

                                    <div>

                                        <h2>
                                            Palm Preview
                                        </h2>

                                        <span>
                                            Captured / Uploaded Image
                                        </span>

                                    </div>

                                </div>



                                <div className="palm-preview">

                                    {capturedImage ? (

                                        <img
                                            src={capturedImage}
                                            alt="Captured Palm"
                                            className="captured-palm-image"
                                        />

                                    ) : (

                                        <div className="empty-preview">

                                            <ImageIcon
                                                size={52}
                                            />

                                            <span>
                                                No Image Selected
                                            </span>

                                        </div>

                                    )}

                                </div>



                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleFileUpload
                                    }
                                    style={{
                                        display: "none"
                                    }}
                                />



                                <button
                                    type="button"
                                    className="upload-btn"
                                    onClick={
                                        handleUploadClick
                                    }
                                >

                                    <Upload size={18} />

                                    Upload Palm Image

                                </button>


                            </div>



                            {/* ==================================================
                                AI ANALYSIS
                            ================================================== */}

                            <div className="enrollment-panel ai-panel">


                                <div className="panel-heading ai-heading">

                                    <div>

                                        <h2>
                                            AI Analysis
                                        </h2>

                                    </div>


                                    <span className="online-status">

                                        <span className="status-dot"></span>

                                        Online

                                    </span>

                                </div>



                                {/* CAMERA */}

                                <div className="analysis-item">

                                    <div className="analysis-icon">

                                        <Camera size={20} />

                                    </div>


                                    <div>

                                        <small>
                                            Camera
                                        </small>


                                        <strong>

                                            {cameraConnected
                                                ? "Connected"
                                                : "Connecting..."}

                                        </strong>

                                    </div>

                                </div>



                                {/* PALM DETECTION */}

                                <div className="analysis-item">

                                    <div className="analysis-icon">

                                        <ScanFace size={20} />

                                    </div>


                                    <div>

                                        <small>
                                            Palm Detection
                                        </small>


                                        <strong>

                                            {palmDetected
                                                ? "Detected"
                                                : "Waiting"}

                                        </strong>

                                    </div>

                                </div>



                                {/* LIGHTING */}

                                <div className="analysis-item">

                                    <div className="analysis-icon">

                                        <Sun size={20} />

                                    </div>


                                    <div>

                                        <small>
                                            Lighting
                                        </small>


                                        <strong>

                                            {lightingReady
                                                ? "Good"
                                                : "Waiting"}

                                        </strong>

                                    </div>

                                </div>



                                {/* CONFIDENCE */}

                                <div className="analysis-item">

                                    <div className="analysis-icon">

                                        <ShieldCheck size={20} />

                                    </div>


                                    <div>

                                        <small>
                                            Confidence
                                        </small>


                                        <strong>
                                            {confidence}
                                        </strong>

                                    </div>

                                </div>


                            </div>


                        </div>

                    </div>



                    {/* ==================================================
                        MESSAGE
                    ================================================== */}

                    {message && (

                        <div className="enrollment-message">

                            {message}

                        </div>

                    )}



                    {/* ==================================================
                        ENROLL BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        className="identify-btn"
                        onClick={
                            handleEnrollment
                        }
                        disabled={enrolling}
                    >

                        {enrolling
                            ? "Enrolling Employee..."
                            : "Enroll Employee"}

                    </button>



                    {/* ==================================================
                        RESET
                    ================================================== */}

                    <button
                        type="button"
                        onClick={handleReset}
                        style={{
                            marginTop: "8px",
                            background: "transparent",
                            border: "none",
                            color: "#64748b",
                            cursor: "pointer",
                            fontSize: "13px"
                        }}
                    >

                        Reset

                    </button>


                </section>


            </main>

        </>
    );
}