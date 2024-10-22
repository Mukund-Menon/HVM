import React, { ReactElement } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Login from './pages/login/login';
import PrintPDF from './pages/print-pdf/PrintPDF';
import Register from './pages/register/register';
import Home from './pages/home/home';
import Navigate from './pages/navigate-lead/NavigateLead';
import Mainform from './pages/forms/Form'; 
import AccompanyingForm from './pages/forms/accompanyingForm';
import Navbar from './components/navbar/navbar';
import Auth from './services/auth/checkAuth';
import ExpiryStatus from './pages/qr-verification/expiry-status';

// RouteComponent type for clarity (ensures all components passed to Route are React elements)
type RouteComponent = ReactElement | null;

function App(): RouteComponent {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/navigate" element={<Navigate />} />
        <Route
          path="/home"
          element={
            <>
              <Auth />
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/leadform"
          element={
            <>
              <Auth />
              <Navbar />
              <Mainform />
            </>
          }
        />
        <Route
          path="/accompanyingform"
          element={
            <>
              <Auth />
              <AccompanyingForm />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Auth />
              <Navbar />
              <Register />
            </>
          }
        />
        <Route
          path="/print"
          element={
            <>
              <Auth />
              <Navbar />
              <PrintPDF />
            </>
          }
        />
        <Route path="/expiry/:uniqueId" element={<ExpiryStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
