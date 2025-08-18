import React from 'react'
import Layout from './Layout'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import HowItWorks from './pages/HowItWorks'
import ReportIncident from './pages/ReportIncident'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './context/AuthContex'





const App = () => {
  return (
    <>
  <AuthProvider>

        <Layout>
          <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Analytics" element={<Analytics />} />
            <Route path="/HowItWorks" element={<HowItWorks />} />
            <Route path="/ReportIncident" element={<ReportIncident />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            
          </Routes>
        </Layout>
      </AuthProvider>

    </>
  )
}

export default App
