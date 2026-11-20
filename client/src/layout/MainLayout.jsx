 
// import Navbar from '@/components/ui/Navbar'
// import React from 'react'
// import { Outlet } from 'react-router-dom'

// const MainLayout = () => {
//   return (
//     <div className='flex flex-col min-h-screen'>
//         <Navbar/>
//         <div className='flex-1 mt-16'>
//             <Outlet/>
//         </div>
        
//     </div>
//   )
// }

// export default MainLayout

// src/layout/MainLayout.jsx
import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer"; // <-- ensure this path matches your file structure
import { Outlet, ScrollRestoration } from "react-router-dom";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* If your Navbar is fixed, use pt-[height] so content isn't hidden */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <Footer />

      {/* New pages open at the top; Back/Forward restore the previous position */}
      <ScrollRestoration />
      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;
