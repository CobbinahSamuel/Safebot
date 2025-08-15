import { useState } from "react";
import { createIncidentAPI } from "../api/incidentAPI";

export const useIncident = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [incident, setIncident] = useState(null);

  const submitIncident = async (incidentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createIncidentAPI(incidentData);
      setIncident(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitIncident,
    loading,
    error,
    incident,
  };
};
