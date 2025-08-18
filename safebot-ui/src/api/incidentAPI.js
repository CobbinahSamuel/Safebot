import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/incidents`; // Matches your backend route

// Create a new incident
export const createIncidentAPI = async (incidentData) => {
  const response = await axios.post(BASE_URL, incidentData);
  return response.data;
};
