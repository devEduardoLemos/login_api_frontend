// src/App.js
import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
    </AuthProvider>
  );
}

export default App;
