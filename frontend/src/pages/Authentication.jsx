import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Layout/Navbar/Navbar";
import "./Authentication.css";

import Button from "../components/Button";

import CameraSection from "../components/Enrollment/CameraSection/CameraSection";
import PreviewSection from "../components/Enrollment/PreviewSection/PreviewSection";
import AIStatusPanel from "../components/Enrollment/AIStatusPanel/AIStatusPanel";

import { authenticateUser } from "../services/authenticationService";

export default function Authentication() {
    const webcamRef = useRef(null);

    const navigate = useNavigate();

    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    // =========================================================
    // CONVERT CAMERA IMAGE TO FILE
    // =========================================================

    const cameraImageToFile = async (imageSrc) => {
        const response = await fetch(imageSrc);

        if (!response.ok) {
            throw new Error(
                "Unable to process camera image."
            );
        }

        const blob = await response.blob();

        return new File(
            [blob],
            `authentication_palm_${Date.now()}.jpg`,
            {
                type: "image/jpeg",
                lastModified: Date.now(),
            }
        );
    };

    // =========================================================
    // LIVE CAMERA HELPERS
    // =========================================================

    const sleep = (ms) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    const captureFreshImage = async () => {
        if (!webcamRef.current) {
            throw new Error(
                "Camera is not ready. Please wait for the webcam to start."
            );
        }

        // Give the webcam time to become ready after refresh/navigation.
        await sleep(700);

        let imageSrc = null;

        for (let attempt = 0; attempt < 5; attempt++) {
            imageSrc =
                webcamRef.current?.getScreenshot();

            if (imageSrc) {
                break;
            }

            await sleep(300);
        }

        if (!imageSrc) {
            throw new Error(
                "Unable to capture live palm image. Please allow camera access."
            );
        }

        setPreviewImage(imageSrc);

        return await cameraImageToFile(imageSrc);
    };

    // =========================================================
    // CAPTURE PALM FROM WEBCAM
    // =========================================================

    const captureImage = async () => {
        try {
            const file =
                await captureFreshImage();

            setImageFile(file);
            setResult(null);
            setErrorMessage("");

            return file;
        } catch (error) {
            console.error(
                "Camera capture error:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to capture palm from camera."
            );

            return null;
        }
    };

    // =========================================================
    // UPLOAD PALM IMAGE
    // =========================================================

    const uploadImage = (event) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setErrorMessage(
                "Please select a valid image file."
            );

            return;
        }

        setImageFile(file);

        setResult(null);

        setErrorMessage("");

        const reader =
            new FileReader();

        reader.onload = () => {
            setPreviewImage(
                reader.result
            );
        };

        reader.onerror = () => {
            setErrorMessage(
                "Unable to preview selected image."
            );
        };

        reader.readAsDataURL(file);
    };

    // =========================================================
    // GET IMAGE FOR AUTHENTICATION
    //
    // Priority:
    // 1. Uploaded image
    // 2. Fresh camera capture
    //
    // If the page was refreshed and no file is selected,
    // authentication automatically uses the live webcam.
    // =========================================================

    const getAuthenticationImage = async () => {
        if (imageFile) {
            return imageFile;
        }

        const capturedFile =
            await captureFreshImage();

        if (!capturedFile) {
            throw new Error(
                "Please allow camera access and place your palm in front of the camera."
            );
        }

        return capturedFile;
    };

    // =========================================================
    // AUTHENTICATE PALM
    //
    // Uploaded/file-browser image:
    //   -> authenticate that image once.
    //
    // Direct live authentication:
    //   -> capture 4 fresh webcam frames.
    //   -> try each frame until one matches.
    // =========================================================

    const handleAuthenticate = async () => {
        if (loading) {
            return;
        }

        try {
            setLoading(true);
            setResult(null);
            setErrorMessage("");

            let filesToTry = [];
            const usingUploadedImage =
                Boolean(imageFile);

            // -------------------------------------------------
            // FILE BROWSER / SAVED PALM IMAGE
            // -------------------------------------------------

            if (usingUploadedImage) {
                filesToTry = [imageFile];
            }

            // -------------------------------------------------
            // DIRECT LIVE AUTHENTICATION
            // -------------------------------------------------

            else {
                console.log(
                    "No uploaded image found."
                );

                console.log(
                    "Starting live palm authentication..."
                );

                for (let i = 0; i < 4; i++) {
                    try {
                        const liveFile =
                            await captureFreshImage();

                        if (liveFile) {
                            filesToTry.push(liveFile);
                        }

                        await sleep(250);
                    } catch (captureError) {
                        console.error(
                            `Live frame ${i + 1} capture failed:`,
                            captureError
                        );
                    }
                }
            }

            if (filesToTry.length === 0) {
                throw new Error(
                    "Unable to capture palm from camera. Please place your palm clearly in front of the webcam and try again."
                );
            }

            let bestResponse = null;

            // -------------------------------------------------
            // TRY EACH IMAGE
            // -------------------------------------------------

            for (
                let i = 0;
                i < filesToTry.length;
                i++
            ) {
                const file =
                    filesToTry[i];

                console.log(
                    `Authenticating frame ${i + 1}/${filesToTry.length}...`
                );

                const formData =
                    new FormData();

                formData.append(
                    "palm_image",
                    file,
                    file.name
                );

                try {
                    const response =
                        await authenticateUser(
                            formData
                        );

                    console.log(
                        `Frame ${i + 1} response:`,
                        response
                    );

                    if (!bestResponse) {
                        bestResponse = response;
                    }

                    // Any successful frame is enough.
                    if (
                        response?.authenticated === true
                    ) {
                        console.log(
                            "Palm authentication successful."
                        );

                        setResult(response);

                        try {
                            localStorage.setItem(
                                "palm_auth_employee",
                                JSON.stringify({
                                    employee_id:
                                        response.employee_id,

                                    full_name:
                                        response.full_name,

                                    department:
                                        response.department,

                                    confidence:
                                        response.confidence,

                                    authenticated_at:
                                        new Date().toISOString(),
                                })
                            );
                        } catch (storageError) {
                            console.warn(
                                "Local storage error:",
                                storageError
                            );
                        }

                        navigate(
                            "/dashboard",
                            {
                                state: response,
                                replace: true,
                            }
                        );

                        return;
                    }
                } catch (apiError) {
                    console.error(
                        `Frame ${i + 1} authentication error:`,
                        apiError
                    );
                }

                if (!usingUploadedImage) {
                    await sleep(200);
                }
            }

            // -------------------------------------------------
            // ALL ATTEMPTS FAILED
            // -------------------------------------------------

            setResult(bestResponse);

            setErrorMessage(
                "Palm authentication failed. Please place your complete palm inside the camera area with good lighting and try again."
            );
        } catch (error) {
            console.error(
                "Authentication Error:",
                error
            );

            console.error(
                "Backend response:",
                error?.response
            );

            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "Authentication failed.";

            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // CLEAR
    // =========================================================

    const clearAuthentication = () => {
        setImageFile(null);

        setPreviewImage(null);

        setResult(null);

        setErrorMessage("");
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <>
            <Navbar />

            <div className="enrollment-page">

                <div className="container">

                    <h1 className="page-title">
                        Palm Identification
                    </h1>

                    <p className="page-subtitle">
                        Capture or upload a palm image
                        for secure employee identification.
                    </p>

                    <div className="enrollment-card">

                        <div className="camera-section">

                            <CameraSection
                                webcamRef={webcamRef}
                                onCapture={captureImage}
                            />

                            <PreviewSection
                                image={previewImage}
                                onUpload={uploadImage}
                            />

                            <AIStatusPanel
                                cameraConnected={true}

                                palmDetected={
                                    previewImage !== null
                                }

                                lighting={
                                    previewImage
                                        ? "Image Ready"
                                        : "Camera Ready"
                                }

                                confidence={
                                    result
                                        ? `${result.confidence}%`
                                        : "--"
                                }
                            />

                        </div>

                        {/* =================================================
                            AUTHENTICATE BUTTON
                        ================================================= */}

                        <Button
                            fullWidth
                            size="lg"
                            onClick={
                                handleAuthenticate
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Authenticating..."
                                : "Identify & Login"}
                        </Button>

                        {/* =================================================
                            DIRECT AUTHENTICATION INFO
                        ================================================= */}

                        {!imageFile &&
                            !loading &&
                            !result && (
                                <p
                                    style={{
                                        marginTop: "10px",
                                        textAlign: "center",
                                        fontSize: "13px",
                                        opacity: 0.7,
                                    }}
                                >
                                    No image selected — clicking
                                    Identify & Login will capture
                                    your palm directly from the
                                    camera.
                                </p>
                            )}

                        {/* =================================================
                            CLEAR BUTTON
                        ================================================= */}

                        {(previewImage ||
                            result ||
                            errorMessage) && (

                            <button
                                type="button"
                                onClick={
                                    clearAuthentication
                                }
                                style={{
                                    width: "100%",
                                    marginTop: "12px",
                                    padding: "12px",
                                    cursor: "pointer",
                                }}
                            >
                                Clear
                            </button>
                        )}

                        {/* =================================================
                            SUCCESS RESULT
                        ================================================= */}

                        {result &&
                            result.authenticated && (

                            <div
                                style={{
                                    marginTop: "20px",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    background: "#e8f8ef",
                                    border:
                                        "1px solid #28a745",
                                }}
                            >

                                <h2>
                                    ✓ Authentication
                                    Successful
                                </h2>

                                <p>
                                    <strong>
                                        Employee ID:
                                    </strong>{" "}
                                    {result.employee_id}
                                </p>

                                <p>
                                    <strong>
                                        Name:
                                    </strong>{" "}
                                    {result.full_name}
                                </p>

                                <p>
                                    <strong>
                                        Department:
                                    </strong>{" "}
                                    {result.department}
                                </p>

                                <p>
                                    <strong>
                                        Confidence:
                                    </strong>{" "}
                                    {result.confidence}%
                                </p>

                                <p>
                                    <strong>
                                        Similarity:
                                    </strong>{" "}
                                    {result.similarity}
                                </p>

                                <p>
                                    <strong>
                                        Distance:
                                    </strong>{" "}
                                    {result.distance}
                                </p>

                                {/* =========================================
                                    ATTENDANCE
                                ========================================= */}

                                {result.attendance && (

                                    <div
                                        style={{
                                            marginTop: "15px",
                                            paddingTop: "15px",
                                            borderTop:
                                                "1px solid #b7dfc7",
                                        }}
                                    >

                                        <h3>
                                            Attendance
                                        </h3>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            {
                                                result
                                                    .attendance
                                                    .status
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Check-in:
                                            </strong>{" "}
                                            {
                                                result
                                                    .attendance
                                                    .check_in
                                            }
                                        </p>

                                    </div>
                                )}

                            </div>
                        )}

                        {/* =================================================
                            ERROR RESULT
                        ================================================= */}

                        {errorMessage && (

                            <div
                                style={{
                                    marginTop: "20px",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    background: "#fff0f0",
                                    border:
                                        "1px solid #dc3545",
                                }}
                            >

                                <h2>
                                    ✕ Authentication Failed
                                </h2>

                                <p>
                                    {errorMessage}
                                </p>

                            </div>
                        )}

                    </div>

                </div>

            </div>
        </>
    );
}
