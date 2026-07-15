import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileView from './pages/ProfileView';

function App() {
  return (
    <Router>
      <div className="app-routing-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/:username" element={<ProfileView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
