# 🧠 React Quiz Application

A web-based quiz application built with **React.js** that allows users to sign up, log in, and take a timed multiple-choice quiz.  
The application emphasizes **state management, user experience, and persistence using localStorage**, without using a backend server.

---

## 🎯 Project Objectives

This project aims to:

- Build a quiz application using **React functional components and hooks**
- Implement **client-side authentication (login & signup)** without a backend
- Consume quiz data from a public API (**OpenTDB**)
- Apply proper **state management**, **UI feedback**, and **edge-case handling**
- Provide a smooth user experience similar to popular learning platforms (e.g. Coursera)

---

## 📋 Core Requirements

### 1. Authentication (No Backend)

- Provide **Signup** and **Login** pages
- Each user must register with:
  - `username` 
  - `password` (alphanumeric: letters and numbers)
- Validation rules:
  - Username must be unique
  - Password must match the registered username on login
- Authentication data is stored using **localStorage**
- Quiz data and history are **user-specific** (not shared between accounts)

---

### 2. Quiz Rules

The quiz are setting by default and not yet free to be choose by the user. 
- Total questions: **10**
- Time limit: **60 seconds**
- Question type: **Multiple choice**
- Questions are fetched from **OpenTDB API**
- Quiz behavior rules:
  - User can select **only one answer per question**
  - Once an answer is selected, it **cannot be changed**
  - User **cannot go back** to previous questions
  - A **Next** button appears only after answering
- When an answer is selected:
  - Correct answer is highlighted in **green**
  - Wrong answer is highlighted in **red**
  - Correct answer is still shown for learning feedback

---

### 3. Quiz Flow

1. User logs in (or signs up if new)
2. User sees a **quiz introduction screen** with:
   - Total number of questions
   - Time limit
   - Quiz rules (e.g. no going back)
3. User starts the quiz
4. Quiz progresses **one question at a time**
5. A **progress bar** shows quiz progress
6. Timer counts down from 60 seconds
7. Quiz ends when:
   - All questions are answered, or
   - Time runs out

---

### 4. Quiz Result & History

- After finishing the quiz, the user sees:
  - Total questions
  - Answered questions
  - Correct answers
  - Wrong answers
- A **Restart Quiz** button is available
- Quiz results are saved as **history per user**
- History is shown:
  - After finishing a quiz
  - Before starting a new quiz session

---

### 5. Resume Quiz (Bonus Feature)

- If the browser is closed or refreshed:
  - Quiz progress is **not lost**
- The following data is saved in `localStorage`:
  - Current question index
  - Selected answers
  - Remaining time
- When the user returns:
  - The quiz **resumes automatically** from the last state

---

## 🎨 UI / UX Requirements

- Use a **card-based layout**
- Centered quiz container
- Smooth transitions and hover effects
- Progress bar for quiz completion
- Clear visual feedback for:
  - Selected answers
  - Correct vs wrong answers
- Custom font (not default browser font)
- Clean, modern appearance (not plain text)

---

## 🛠 Technical Constraints

- React only (no backend, no database)
- Functional components + hooks (`useState`, `useEffect`, `useRef`)
- State persistence using **localStorage**
- No external UI framework required (CSS is acceptable)
- Focus on clarity, correctness, and maintainability

---

## ✅ Expected Outcome

By completing this project, the application demonstrates:

- Proper React state management
- Understanding of component lifecycle
- Client-side authentication logic
- API integration and error handling
- UX decisions aligned with real-world quiz platforms
- Bonus capability: session persistence (resume quiz)

---

## 📌 Notes

- The project prioritizes **logic correctness and UX flow** over visual complexity
- All data is stored locally and scoped per user
-
---
