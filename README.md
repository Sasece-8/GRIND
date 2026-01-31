# GRIND - Advanced LMS Platform

![Grind LMS Banner](https://github.com/Sasece-8/GRIND/blob/main/frontend/src/assets/banner.png)

**GRIND** is a full-featured Learning Management System (LMS) designed to bridge the gap between educators and students. It offers a seamless experience for creating, purchasing, and consuming video courses, wrapped in a premium, modern user interface.

[**Live Demo**](https://grind-lms.vercel.app) | [**GitHub Repository**](https://github.com/Sasece-8/GRIND)

---

## 🚀 Key Features

### 🎓 For Students
*   **Browse & Search Courses:** Discover courses across various categories.
*   **Secure Purchasing:** Buy courses securely using Stripe integration.
*   **Video Streaming:** High-quality video playback for enrolled courses.
*   **Progress Tracking:** Track completion status of lectures and courses.
*   **Student Dashboard:** Manage enrolled courses and view purchase history.

### 👨‍🏫 For Educators
*   **Course Management:** Create, update, and delete courses with detailed metadata.
*   **Content Upload:** Upload video lectures and thumbnails (powered by Cloudinary).
*   **Educator Dashboard:** Track student enrollments and earnings.
*   **Profile Management:** customizable educator profiles.

### 🛡️ For Admins
*   **User Management:** Oversee students and educators.
*   **Course Moderation:** Approve or reject course submissions.
*   **Analytics:** View platform-wide statistics.

### 🎨 UI/UX
*   **Premium Design:** Dark mode-first aesthetic with glassmorphism effects.
*   **Responsive:** Fully optimized for desktop, tablet, and mobile devices.
*   **Interactive:** Smooth animations and transitions using Framer Motion (if applicable) and CSS.

---

## 🛠️ Tech Stack

*   **Frontend:** React.js, Tailwind CSS, Vite
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB, Redis (for caching)
*   **Authentication:** JWT, BCrypt
*   **Payments:** Stripe
*   **File Storage:** Cloudinary
*   **Tools:** Git, GitHub, Postman, VS Code

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v14+ recommended)
*   MongoDB (Local or Atlas)
*   Redis server (optional, but recommended for production features)

### 1. Clone the Repository
```bash
git clone [https://github.com/Sasece-8/GRIND.git](https://github.com/Sasece-8/GRIND.git)
cd GRIND
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email Service (for notifications)
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

# Redis
REDIS_URL=your_redis_connection_string
```

Start the backend server:
```bash
npm run dev
# Server should run on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file (if using Vite, it might be `.env.local` or built-in variables) if required by your specific setup, typically not needed for basic run unless pointing to a different backend URL. Ensure API calls point to `http://localhost:5000`.

Start the frontend development server:
```bash
npm run dev
# Client should run on http://localhost:5173 (or similar)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.



**Developed with ❤️ by [Tushar Barnwal](https://github.com/Sasece-8)**
