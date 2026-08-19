import { useState } from "react";
import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import Chat from "./pages/chat.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" element={<Home />} />
      <Route path="auth/signup" element={<Signup />} />
      <Route path="auth/login" element={<Login />} />
      <Route path="chat/:chatId" element={<Chat />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Route>,
  ),
);

function App() {
  return (
    <UserContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}

export default App;
