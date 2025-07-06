# Micro-Quiz Platform

A modern, public micro-quiz platform built with Next.js (App Router), MongoDB Atlas, and Tailwind CSS. This project demonstrates best practices in SSG, SSR, API routes, and clean UI/UX for a quiz application.

---

## 🚀 Project Overview

The Micro-Quiz Platform allows users to browse and take quizzes by category, view quiz details, and see results. The platform is public (no authentication required) and demonstrates:
- Static generation (SSG) for the home page
- Server-side rendering (SSR) for category pages
- API routes serving mock or real data
- Clean, responsive UI with Tailwind CSS

---

## ✨ Features
- Browse quizzes by category
- Take quizzes and view instant results
- Public access (no login required)
- Modern navigation and layout
- API routes for quizzes, categories, and results
- SSG/SSR/CSR examples using Next.js App Router

---

## 🛠️ Tech Stack
- **Next.js** (App Router)
- **MongoDB Atlas** (or mock data)
- **Tailwind CSS**
- **React**

---

## 📁 Folder Structure

```
quizapp/
├── src/
│   ├── app/                # Next.js app directory (pages, layouts, API routes)
│   ├── components/         # Reusable React components
│   ├── lib/                # Database, models, and utility functions
│   └── styles/             # Global and component styles
├── public/                 # Static assets
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation
```

---

## 🧑‍💻 Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd quizapp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root with your MongoDB connection string:
```
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
```

### 4. Run the development server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧪 Testing
- Use `npm run test` to run unit and integration tests (if available).

---

## 🤝 Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License.

---

## 🙏 Acknowledgements
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
