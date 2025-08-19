import React, { createContext, useContext, useEffect } from "react";
import { useIncidents } from "../hooks/useIncident";
import { useAuth } from "../hooks/useAuth";

const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const {
    loading,
    error,
    incidents,
    singleIncident,
    fetchAllIncidents,
    submitIncident,
    updateIncidentStatus,
    deleteIncident,
  } = useIncidents();

  const { isAuthenticated, loading: authLoading } = useAuth();

  // A new effect to log the state for debugging purposes.
  useEffect(() => {
    console.log("IncidentContext State Update:");
    console.log("Is Authenticated:", isAuthenticated);
    console.log("Auth Loading:", authLoading);
    console.log("Incidents Loading:", loading);
    console.log("Incidents Error:", error);
    console.log("Incidents Data:", incidents);
    // You should see the incident data here once it's fetched successfully.
  }, [isAuthenticated, authLoading, loading, error, incidents]);

  useEffect(() => {
    // Fetch incidents on component mount (for public analytics)
    // and when user is authenticated (for admin features)
    if (!authLoading) {
      console.log("Fetching incidents...");
      fetchAllIncidents();
    }
  }, [authLoading, fetchAllIncidents]);

  const contextValue = {
    loading,
    error,
    incidents,
    singleIncident,
    fetchAllIncidents,
    submitIncident,
    updateIncidentStatus,
    deleteIncident,
  };

  return (
    <IncidentContext.Provider value={contextValue}>
      {children}
    </IncidentContext.Provider>
  );
};

// Custom hook for easy access
export const useIncidentContext = () => {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error(
      "useIncidentContext must be used within an IncidentProvider"
    );
  }
  return context;
};
