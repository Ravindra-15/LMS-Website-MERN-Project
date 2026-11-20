// import { createBrowserRouter } from "react-router-dom";
// import "./App.css";
// import Login from "./pages/Login";
// import MainLayout from "./layout/MainLayout";
// import { RouterProvider } from "react-router-dom";
// import HeroSection from "./pages/student/HeroSection";
// import Courses from "./pages/student/Courses";
// import MyLearning from "./pages/student/MyLearning";
// import Profile from "./pages/student/Profile";
// import Sidebar from "./pages/admin/Sidebar";
// import Dashboard from "./pages/admin/Dashboard";
// import CourseTable from "./pages/admin/course/CourseTable";
// import AddCourse from "./pages/admin/course/AddCourse";
// import EditCourse from "./pages/admin/course/EditCourse";
// import CreateLecture from "./pages/admin/lecture/CreateLecture";
// import EditLecture from "./pages/admin/lecture/EditLecture";
// import CourseDetail from "./pages/student/CourseDetail";
// import CourseProgress from "./pages/student/CourseProgress";
// import SearchPage from "./pages/student/SearchPage";

// import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
// import {
//   AdminRoute,
//   AuthenticatedUser,
//   ProtectedRoute,
// } from "./components/ProtectedRoutes";
// import { ThemeProvider } from "./components/ThemeProvider";
// import Footer from "./components/ui/footer";

// const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       {
//         path: "/",
//         element: (
//           <>
//             <HeroSection />
//             <Courses />
//             <Footer></Footer>
//           </>
//         ),
//       },
//       {
//         path: "login",
//         element: (
//           <AuthenticatedUser>
//             <Login />
//           </AuthenticatedUser>
//         ),
//       },
//       {
//         path: "my-learning",
//         element: (
//           <ProtectedRoute>
//             <MyLearning />
//              <Footer></Footer>
//           </ProtectedRoute>
          
//         ),
//       },
//       {
//         path: "profile",
//         element: (
//           <ProtectedRoute>
//             <Profile />
//              <Footer></Footer>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "course/search",
//         element: (
//           <ProtectedRoute>
//             <SearchPage />
//              <Footer></Footer>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "course-detail/:courseId",
//         element: (
//           <ProtectedRoute>
//             <CourseDetail />
//              <Footer></Footer>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "course-progress/:courseId",
//         element: (
//           <ProtectedRoute>
//             <PurchaseCourseProtectedRoute>
//               <CourseProgress />
//                <Footer></Footer>
//             </PurchaseCourseProtectedRoute>
//           </ProtectedRoute>
//         ),
//       },
//       //admin routes here
//       {
//         path: "admin",
//         element: (
//           <AdminRoute>
//             <Sidebar />
//           </AdminRoute>
//         ),
//         children: [
//           {
//             path: "dashboard",
//             element: <Dashboard />,
//           },
//           {
//             path: "course",
//             element: <CourseTable />,
//           },
//           {
//             path: "course/create",
//             element: <AddCourse />,
//           },
//           {
//             path: "course/:courseId",
//             element: <EditCourse />,
//           },
//           {
//             path: "course/:courseId/lecture",
//             element: <CreateLecture />,
//           },
//           {
//             path: "course/:courseId/lecture/:lectureId",
//             element: <EditLecture />,
//           },
//         ],
//       },
//     ],
//   },
// ]);

// function App() {
//   return (
//     <main>
//       <ThemeProvider>
//         <RouterProvider router={appRouter}></RouterProvider>
//       </ThemeProvider>
//     </main>
//   );
// }

// export default App;


// src/App.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import { RouterProvider } from "react-router-dom";
import HeroSection from "./pages/student/HeroSection";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";

import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import { ThemeProvider } from "./components/ThemeProvider";
import About from "./pages/info/About";
import Contact from "./pages/info/Contact";
import PrivacyPolicy from "./pages/info/PrivacyPolicy";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "my-learning",
        element: (
          <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-detail/:courseId",
        element: (
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },
      // Footer pages (public)
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      // Admin routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          // "/admin" on its own opens the dashboard instead of a blank page
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "course", element: <CourseTable /> },
          { path: "course/create", element: <AddCourse /> },
          { path: "course/:courseId", element: <EditCourse /> },
          { path: "course/:courseId/lecture", element: <CreateLecture /> },
          { path: "course/:courseId/lecture/:lectureId", element: <EditLecture /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;
