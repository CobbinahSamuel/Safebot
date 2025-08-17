import axios from "axios";

const BASE_URL = "http://localhost:5000/api/incidents"; // Matches your backend route

// Get all incidents
export const getIncidentsAPI = async (limit = 100, sort = '-created_date') => {
  const response = await axios.get(`${BASE_URL}?limit=${limit}&sort=${sort}`);
  return response.data;
};

// Create a new incident
export const createIncidentAPI = async (incidentData) => {
  const response = await axios.post(BASE_URL, incidentData);
  return response.data;
};
