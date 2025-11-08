import React from 'react';
// import { getAuth } from 'firebase/auth';
// import { initializeApp } from 'firebase/app';
// // import "../asserts/style/nav.css"; 

// const firebaseConfig = {
//   apiKey: "AIzaSyBnnUtNzcnw0UYR8ikFJptHkuzZFkvp4k4",
//   authDomain: "online-food-order-80833.firebaseapp.com",
//   databaseURL: "https://online-food-order-80833-default-rtdb.firebaseio.com",
//   projectId: "online-food-order-80833",
//   storageBucket: "online-food-order-80833.appspot.com",
//   messagingSenderId: "980243962311",
//   appId: "1:980243962311:web:6c80cf64470477b1bc21e2",
//   measurementId: "G-FF4PLG3S2T",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app); // Get the Auth instance

export default function Navbar() {
  // const logout = async () => {
  //   try {
  //     await auth.signOut(); // Use signOut method
  //     alert("Signed out successfully");
  //   } catch (error) {
  //     alert("Error signing out: " + error.message); // Corrected error handling
  //   }
  // };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-stone-200 px-6 md:px-10 py-4">
      <div className="flex items-center gap-3 text-stone-800">
        <svg className="w-8 h-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
        </svg>
        <h1 className="text-stone-800 text-2xl font-bold leading-tight tracking-[-0.015em]">Delightio</h1>
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-stone-600 hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors" href="/">Menu</a>
          <a className="text-stone-600 hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors" href="/about">About</a>
          <a className="text-stone-600 hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors" href="/contact">Contact</a>
        </nav>

        <button className="md:hidden flex items-center justify-center size-10 rounded-md border border-stone-200 bg-white text-stone-600">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
    // <nav>
    //   <h2>Delightio</h2>
    //   <ul className='side'>
    //     <Link to='/admin' className='log'>Admin</Link> 
    //     <Link to='/order' className='log'>Order</Link>
    //     <a href='' onClick={logout} className='log' style={{ cursor: 'pointer' }}>Logout</a>
    //   </ul>
    // </nav>
  );
}
