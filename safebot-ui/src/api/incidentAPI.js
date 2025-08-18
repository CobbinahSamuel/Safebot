import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/incidents`; // Matches your backend route

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


// Get all incidents (for AdminReports/Analytics)
export const getAllIncidentsAPI = async () => {
   const response = await axios.get(BASE_URL);
  return response.data;
};

// Update incident status
export const updateIncidentStatusAPI = async (incidentId, statusData) => {
  // statusData should be an object like { status: "Resolved" }
  const response = await axios.put(`${BASE_URL}/${incidentId}/status`, statusData);
  return response.data;
};

// Delete an incident
export const deleteIncidentAPI = async (incidentId) => {
  const response = await axios.delete(`${BASE_URL}/${incidentId}`);
  return response.data;
};
