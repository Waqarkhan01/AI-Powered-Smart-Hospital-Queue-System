# ?? AI-Powered Smart Hospital Bed Queue Management System

> Final Year Project | B.Tech CSE (Artificial Intelligence)

A production-ready, full-stack AI-integrated Hospital Management System that intelligently manages patient queues, bed availability, and appointments using Machine Learning.

---

## ?? Key Features

- ?? JWT Authentication with Role-Based Access (Patient / Doctor / Admin)
- ?? Hospital & Bed Management with real-time availability
- ?? Smart Queue Management with AI-based Priority Assignment
- ?? AI Patient Priority Prediction — Random Forest (94% accuracy)
- ?? Estimated Wait Time Prediction using ML
- ?? Appointment Booking, Confirmation & Cancellation
- ????? Doctor Dashboard — manage appointments, confirm/cancel
- ??? Admin Dashboard — manage hospitals, beds, queue, doctors
- ?? Real-time Toast Notifications
- ?? Fully Responsive UI with Bootstrap 5

---

## ??? Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React.js, Bootstrap 5, Axios, React Router DOM | React 18 |
| Backend | Spring Boot, Java, JWT, Spring Security | Java 21 |
| Database | MySQL, Spring Data JPA, Hibernate ORM | MySQL 8.0 |
| AI Module | Python, Flask, Scikit-Learn, Random Forest | Python 3.14 |
| Build Tools | Maven, npm | Maven 3.9 |

---

## ?? Project Structure

\\\
AI-Powered-Smart-Hospital-Queue-System/
+-- backend/                    # Spring Boot REST API
¦   +-- hospital-backend/
¦       +-- controller/         # REST Controllers
¦       +-- service/            # Business Logic
¦       +-- repository/         # JPA Repositories
¦       +-- entity/             # Database Entities
¦       +-- config/             # JWT & Security Config
+-- frontend/                   # React.js UI
¦   +-- hospital-frontend/
¦       +-- src/
¦           +-- pages/          # All UI Pages
¦           +-- services/       # Axios API Services
+-- ai-module/                  # Python Flask AI Service
¦   +-- app.py                  # Flask API
¦   +-- generate_dataset.py     # Synthetic Data Generator
¦   +-- priority_model.pkl      # Trained ML Model
+-- docs/                       # Documentation
\\\

---

## ?? How to Run

### 1. Backend (Spring Boot)
\\\ash
cd backend/hospital-backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
\\\

### 2. AI Module (Flask)
\\\ash
cd ai-module
python app.py
# Runs on http://localhost:5000
\\\

### 3. Frontend (React)
\\\ash
cd frontend/hospital-frontend
npm install
npm start
# Runs on http://localhost:3000
\\\

---

## ?? Default Login Credentials

| Role | Email | Password |
|---|---|---|
| ?? Patient | test@example.com | test1234 |
| ??? Admin | admin@hospital.com | password |
| ????? Doctor | ramesh@hospital.com | password |

---

## ?? AI Model Details

| Model | Algorithm | Accuracy | Purpose |
|---|---|---|---|
| Priority Predictor | Random Forest | 94% | Predicts LOW/MEDIUM/HIGH/CRITICAL |
| Wait Time Estimator | Rule-based ML | - | Estimates waiting time in minutes |
| Hospital Recommender | Scoring Algorithm | - | Ranks hospitals by suitability |

**Input Features:** Age, Gender, Temperature, SpO2, Heart Rate, Blood Pressure, Disease Type, Emergency Flag

---

## ?? Team Members

| # | Name | Role | Contribution |
|---|---|---|---|
| 1 | **Mohammad Waqar Khan** *(Team Lead)* | AI/ML Engineer | Random Forest model, Flask API, AI integration, Project architecture |
| 2 | **Gavrang Kol** | Database Architect | MySQL schema design, ER diagram, JPA entities, SQL optimization |
| 3 | **Chaitanya Arora** | Backend Developer | Spring Boot APIs, JWT auth, Security config, REST endpoints |
| 4 | **Prince Raj** | Frontend Developer | React UI, Bootstrap design, Axios integration, Role-based routing |

---

## ?? API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Login (Patient/Doctor/Admin) |
| POST | /api/auth/register | Register new patient |
| GET | /api/hospitals | Get all hospitals |
| GET | /api/beds/hospital/{id}/available | Get available beds |
| POST | /api/queue/join | Join hospital queue |
| POST | /api/ai/predict/priority | AI priority prediction |
| POST | /api/appointments | Book appointment |
| PUT | /api/appointments/{id}/status | Update appointment status |

---

## ?? Screenshots

### Patient Dashboard
- Search Hospitals, AI Priority Prediction, Queue Status, Find Doctors

### Admin Dashboard  
- Manage Hospitals, View Patient Queue, Admit Patients, Manage Doctors

### Doctor Dashboard
- View Appointments, Confirm/Cancel/Complete Appointments

### AI Prediction Page
- Fill patient vitals ? Get CRITICAL/HIGH/MEDIUM/LOW priority with confidence %

---

*Built with ?? by Team — B.Tech CSE AI | Final Year Project 2026*
