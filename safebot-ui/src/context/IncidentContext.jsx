import React, { createContext, useContext, useState } from "react";

const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);

  const addIncident = (newIncident) => {
    setIncidents((prev) => [...prev, newIncident]);
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident }}>
      {children}
    </IncidentContext.Provider>
  );
};

// Custom hook for easy access
export const useIncidentContext = () => {
  return useContext(IncidentContext);
};
