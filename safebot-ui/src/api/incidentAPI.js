import axios from "axios";

const BASE_URL = "http://localhost:5000/api/incidents"; // Matches your backend route

// Create a new incident
export const createIncidentAPI = async (incidentData) => {
  const response = await axios.post(BASE_URL, incidentData);
  return response.data;
};
