import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import BrowseProjects from './pages/BrowseProjects';
import ProjectDetails from './pages/ProjectDetails';
import MyBids from './pages/MyBids';
import SearchFreelancers from './pages/SearchFreelancers';
import FreelancerPortfolio from './pages/FreelancerPortfolio';
import Portfolio from './pages/Portfolio';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <>
                <Header />
                <Dashboard />
              </>
            } />
            <Route path="/create-project" element={
              <>
                <Header />
                <CreateProject />
              </>
            } />
            <Route path="/browse-projects" element={
              <>
                <Header />
                <BrowseProjects />
              </>
            } />
            <Route path="/projects/:id" element={
              <>
                <Header />
                <ProjectDetails />
              </>
            } />
            <Route path="/my-bids" element={
              <>
                <Header />
                <MyBids />
              </>
            } />
            <Route path="/search-freelancers" element={
              <>
                <Header />
                <SearchFreelancers />
              </>
            } />
            <Route path="/freelancer/:id" element={
              <>
                <Header />
                <FreelancerPortfolio />
              </>
            } />
            <Route path="/portfolio" element={
              <>
                <Header />
                <Portfolio />
              </>
            } />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
