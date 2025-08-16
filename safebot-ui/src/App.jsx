import React from 'react'
import Layout from './Layout'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import HowItWorks from './pages/HowItWorks'
import ReportIncident from './pages/ReportIncident'
import AdminReports from './pages/AdminReports'
import Login from './pages/Login'




const App = () => {
  return (
    <>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} /> 
        <Route path="/Analytics" element={<Analytics />} />
        <Route path="/HowItWorks" element={<HowItWorks />} />
        <Route path="/ReportIncident" element={<ReportIncident />} />
        <Route path="/AdminReports" element={<AdminReports />} />
        <Route path="/Login" element={<Login />} />
    </Routes>
    </Layout>

    </>
  )
}

export default App