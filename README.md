# AI-Powered Smart Hospital Bed Queue Management System

> Final Year Project | B.Tech CSE (Artificial Intelligence)

A production-ready, full-stack AI-integrated Hospital Management System that intelligently manages patient queues, bed availability, and appointments using Machine Learning.

---

## Key Features

- JWT Authentication with Role-Based Access (Patient / Doctor / Admin)
- Hospital and Bed Management with real-time availability
- Smart Queue Management with AI-based Priority Assignment
- AI Patient Priority Prediction using Random Forest (94% accuracy)
- Estimated Wait Time Prediction using ML
- Appointment Booking, Confirmation and Cancellation
- Doctor Dashboard to manage appointments
- Admin Dashboard to manage hospitals, beds, queue, doctors
- Real-time Toast Notifications
- Fully Responsive UI with Bootstrap 5

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React.js, Bootstrap 5, Axios, React Router DOM | React 18 |
| Backend | Spring Boot, Java, JWT, Spring Security | Java 21 |
| Database | MySQL, Spring Data JPA, Hibernate ORM | MySQL 8.0 |
| AI Module | Python, Flask, Scikit-Learn, Random Forest | Python 3.14 |
| Build Tools | Maven, npm | Maven 3.9 |

---

## Project Structure

    AI-Powered-Smart-Hospital-Queue-System/
    |-- backend/                    Spring Boot REST API
    |   |-- controller/             REST Controllers
    |   |-- service/                Business Logic
    |   |-- repository/             JPA Repositories
    |   |-- entity/                 Database Entities
    |   |-- config/                 JWT and Security Config
    |-- frontend/                   React.js UI
    |   |-- pages/                  All UI Pages
    |   |-- services/               Axios API Services
    |-- ai-module/                  Python Flask AI Service
    |   |-- app.py                  Flask API
    |   |-- generate_dataset.py     Dataset Generator
    |   |-- priority_model.pkl      Trained ML Model
    |-- docs/                       Documentation

---

## How to Run

### 1. Backend
    cd backend/hospital-backend
    mvnw spring-boot:run
    Runs on http://localhost:8080

### 2. AI Module
    cd ai-module
    python app.py
    Runs on http://localhost:5000

### 3. Frontend
    cd frontend/hospital-frontend
    npm install
    npm start
    Runs on http://localhost:3000

---

## Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Patient | test@example.com | test1234 |
| Admin | admin@hospital.com | password |
| Doctor | ramesh@hospital.com | password |

---

## AI Model Details

| Model | Algorithm | Accuracy | Purpose |
|---|---|---|---|
| Priority Predictor | Random Forest | 94% | Predicts LOW/MEDIUM/HIGH/CRITICAL |
| Wait Time Estimator | Rule-based ML | - | Estimates waiting time in minutes |
| Hospital Recommender | Scoring Algorithm | - | Ranks hospitals by suitability |

Input Features: Age, Gender, Temperature, SpO2, Heart Rate, Blood Pressure, Disease Type, Emergency Flag

---

## Team Members

| No | Name | Role | Contribution |
|---|---|---|---|
| 1 | Mohammad Waqar Khan (Team Lead) | AI/ML Engineer | Random Forest model, Flask API, AI integration, Project architecture |
| 2 | Gavrang Kol | Database Architect | MySQL schema design, ER diagram, JPA entities, SQL optimization |
| 3 | Chaitanya Arora | Backend Developer | Spring Boot APIs, JWT auth, Security config, REST endpoints |
| 4 | Prince Raj | Frontend Developer | React UI, Bootstrap design, Axios integration, Role-based routing |

---

## API Endpoints

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

Built with dedication by Team - B.Tech CSE AI | Final Year Project 2026
