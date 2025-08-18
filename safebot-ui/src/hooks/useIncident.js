import { useState, useCallback, useEffect } from "react";
import { 
  createIncidentAPI,
  getAllIncidentsAPI,
  updateIncidentStatusAPI,
  deleteIncidentAPI
} from "../api/incidentAPI"; // Import all new API functions
import { toast } from 'react-toastify'; // Assuming you have toast for notifications

// It's better to rename this hook to useIncidents to reflect its broader scope
export const useIncidents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [incidents, setIncidents] = useState([]); // State to hold all fetched incidents
  const [singleIncident, setSingleIncident] = useState(null); // For single incident operations/results

  // Function to fetch all incidents (for analytics/admin reports)
  const fetchAllIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllIncidentsAPI();
      setIncidents(data);
      return data;
    } catch (err) {
      console.error("Error fetching all incidents:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch incidents.");
      toast.error(err.response?.data?.message || "Failed to fetch incidents.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to submit a new incident (your existing logic)
  const submitIncident = useCallback(async (incidentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createIncidentAPI(incidentData);
      setSingleIncident(response); // Store the newly created incident
      toast.success("Incident reported successfully!");
      // Optionally refetch all incidents to update the list if needed immediately
      // await fetchAllIncidents(); 
      return response;
    } catch (err) {
      console.error("Error submitting incident:", err);
      setError(err.response?.data?.message || err.message || "Failed to submit incident.");
      toast.error(err.response?.data?.message || "Failed to submit incident.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to update an incident's status
  const updateIncidentStatus = useCallback(async (incidentId, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateIncidentStatusAPI(incidentId, { status });
      // Update the incidents list in state if the update was successful
      setIncidents(prevIncidents => 
        prevIncidents.map(inc => 
          inc._id === incidentId ? { ...inc, status: response.status } : inc
        )
      );
      toast.success("Incident status updated successfully!");
      return response;
    } catch (err) {
      console.error("Error updating incident status:", err);
      setError(err.response?.data?.message || err.message || "Failed to update incident status.");
      toast.error(err.response?.data?.message || "Failed to update incident status.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to delete an incident
  const deleteIncident = useCallback(async (incidentId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteIncidentAPI(incidentId);
      // Remove the deleted incident from the state
      setIncidents(prevIncidents => prevIncidents.filter(inc => inc._id !== incidentId));
      toast.success("Incident deleted successfully!");
      return true;
    } catch (err) {
      console.error("Error deleting incident:", err);
      setError(err.response?.data?.message || err.message || "Failed to delete incident.");
      toast.error(err.response?.data?.message || "Failed to delete incident.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  return {
    loading,
    error,
    incidents, // All incidents fetched
    singleIncident, // Result of single operations like create/get by ID
    fetchAllIncidents,
    submitIncident,
    updateIncidentStatus,
    deleteIncident,
  };
};
