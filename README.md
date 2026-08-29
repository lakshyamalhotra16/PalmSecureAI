\# PalmSecureAI



> AI-powered palm biometric authentication and employee attendance management system.



PalmSecureAI is a full-stack biometric security application that uses palm images to identify enrolled employees and automatically manage attendance.



The system combines a React frontend, FastAPI backend, computer-vision-based palm feature extraction, biometric matching, and attendance management into a single web application.



\---



\## 🚀 Live Demo



\*\*Frontend:\*\*  

https://palm-secure-ai-psi.vercel.app



\*\*Backend API:\*\*  

https://palmsecureai-1.onrender.com



\*\*API Documentation:\*\*  

https://palmsecureai-1.onrender.com/docs



\---



\## ✨ Features



\### 🔐 Palm Biometric Authentication



\- Capture palm images directly through the webcam.

\- Upload palm images for authentication.

\- Detect palm landmarks using computer vision.

\- Generate a fixed-size biometric feature vector.

\- Compare the captured palm against enrolled biometric records.

\- Identify the matching employee using similarity-based matching.

\- Return authentication confidence, similarity, and distance scores.



\### 👤 Employee Enrollment



\- Register new employees with:

&#x20; - Employee ID

&#x20; - Full Name

&#x20; - Department

&#x20; - Palm biometric data

\- Capture or upload palm images.

\- Validate palm detection and image quality.

\- Store biometric feature vectors for future authentication.



\### 🕐 Automated Attendance



\- Automatically record employee check-in after successful authentication.

\- Record check-out on subsequent authentication.

\- Calculate working hours automatically.

\- Store attendance date, time, confidence, and status.



\### 📊 Workforce Dashboard



\- Total employees

\- Today's attendance

\- Attendance percentage

\- Recognition confidence

\- Employee status

\- Attendance history

\- Recent authentication activity

\- Seven-day attendance analytics

\- Working-hour information



\### 🌐 Production Deployment



\- React frontend deployed on Vercel.

\- FastAPI backend deployed on Render.

\- Production API configuration using environment variables.

\- CORS configured for production frontend.

\- REST API architecture connecting frontend and backend.



\---



\## 🏗️ System Architecture



```text

&#x20;                   ┌─────────────────────┐

&#x20;                   │     React Frontend  │

&#x20;                   │       (Vercel)      │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              │ REST API

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │    FastAPI Backend  │

&#x20;                   │       (Render)      │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;               ┌──────────────┼──────────────┐

&#x20;               │              │              │

&#x20;               ▼              ▼              ▼

&#x20;       ┌────────────┐ ┌─────────────┐ ┌─────────────┐

&#x20;       │ Palm       │ │ Feature     │ │ Palm        │

&#x20;       │ Detection  │ │ Extraction  │ │ Matching    │

&#x20;       └────────────┘ └─────────────┘ └─────────────┘

&#x20;                              │

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │      Database       │

&#x20;                   │ Users / Palms /     │

&#x20;                   │ Attendance Records  │

&#x20;                   └─────────────────────┘

