import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import HowItWorks from "./pages/HowItWorks";
import ReportIncident from "./pages/ReportIncident";
import AdminLogin from "./pages/adminLogin";
import { AuthProvider } from "./context/AuthContex";

// ✅ Import generator from utils
import { generateMockIncidents } from "./utils/mockData";
import AdminDashboard from "./pages/AdminDashboard";
import { IncidentProvider } from "./context/IncidentContext";

const App = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    // simulate API fetch delay
    setTimeout(() => {
      setIncidents(generateMockIncidents(100));
    }, 1000);
  }, []);

  return (
    <AuthProvider>
      <IncidentProvider>
      <Layout>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Analytics" element={<Analytics incidents={incidents} />} />
          <Route path="/HowItWorks" element={<HowItWorks />} />
          <Route path="/ReportIncident" element={<ReportIncident />} />
          <Route path="/AdminDashboard" element={<AdminDashboard incidents={incidents} />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
        </Routes>
      </Layout>
      </IncidentProvider>
    </AuthProvider>
  );
};

export default App;
