import React, { createContext, useContext, useState, useEffect } from "react";
import { useIncidents } from "../hooks/useIncidents"; // Use the renamed hook
import { useAuth } from "./AuthContext"; // Assuming you need auth status to fetch incidents

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
    deleteIncident 
  } = useIncidents(); // Use the useIncidents hook

  const { isAuthenticated, loading: authLoading } = useAuth(); // Get auth status

  // Effect to fetch all incidents when the component mounts or auth status changes
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // Only fetch if authenticated and auth loading is complete
      // Or, you might want to fetch based on user role (e.g., only for admin/staff)
      // For now, fetching for any authenticated user.
      fetchAllIncidents();
    }
  }, [isAuthenticated, authLoading, fetchAllIncidents]);

  const contextValue = {
    loading,
    error,
    incidents, // The list of all incidents
    singleIncident, // The result of a specific incident operation (e.g., newly created)
    fetchAllIncidents, // Function to refetch all incidents
    submitIncident, // Function to submit a new incident
    updateIncidentStatus, // Function to update an incident's status
    deleteIncident, // Function to delete an incident
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
    throw new Error("useIncidentContext must be used within an IncidentProvider");
  }
  return context;
};
