import asyncHandler from "express-async-handler"; 
import Incident from "../models/incidentModel.js"; // Import the Incident model

// @desc    Create a new incident report
// @route   POST /api/incidents
export const createIncident = asyncHandler(async (req, res) => {
  // Destructure incident details from the request body
  const {
    incidentTitle,
    category,
    detailedDescription,
    location,
    whenOccurred,
    urgencyLevel,
    submitAnonymously,
    contactEmail,
  } = req.body;

  // Basic validation for required fields
  if (
    !incidentTitle ||
    !category ||
    !detailedDescription ||
    !location ||
    !whenOccurred ||
    !urgencyLevel
  ) {
    res.status(400); // Bad Request
    throw new Error("Please fill in all required incident details.");
  }

  // If not submitting anonymously, ensure a contact email is provided and is valid
  if (!submitAnonymously && !contactEmail) {
    res.status(400);
    throw new Error("Contact email is required if not submitting anonymously.");
  }

  // Create the new incident report in the database
  const incident = await Incident.create({
    incidentTitle,
    category,
    detailedDescription,
    location,
    whenOccurred,
    urgencyLevel,
    submitAnonymously,
    // Only include contactEmail if it's not anonymous
    contactEmail: submitAnonymously ? undefined : contactEmail,
  });

  if (incident) {
    // If the incident was created successfully, send a success response
    res.status(201).json({
      _id: incident._id,
      incidentTitle: incident.incidentTitle,
      category: incident.category,
      detailedDescription: incident.detailedDescription,
      location: incident.location,
      whenOccurred: incident.whenOccurred,
      urgencyLevel: incident.urgencyLevel,
      submitAnonymously: incident.submitAnonymously,
      contactEmail: incident.contactEmail,
      createdAt: incident.createdAt,
    });
  } else {
    // If there was an issue creating the incident
    res.status(400); // Bad Request
    throw new Error("Invalid incident data.");
  }
});



// @desc    Get all incidents with optional filters (for analytics dashboard)
// @route   GET /api/incidents
// @access  Private (Admin)
export const getIncidents = asyncHandler(async (req, res) => {
  // Fetch all incidents from the database
  const incidents = await Incident.find({}); 


  res.status(200).json(incidents);
});

// @desc    Get single incident by ID
// @route   GET /api/incidents/:id
// @access  Private (Admin)
export const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);

  if (incident) {
    if (req.user) {
      await logActivity(req.user._id, "VIEW_INCIDENT_DETAILS", `Viewed details for incident ${incident._id}.`);
    }
    res.status(200).json(incident);
  } else {
    res.status(404);
    throw new Error('Incident not found');
  }
});


// @desc    Update incident status (e.g., for admin/staff to mark as resolved)
// @route   PUT /api/incidents/:id/status
// @access  Private (Admin)
export const updateIncidentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; 

  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    res.status(404);
    throw new Error('Incident not found');
  }

  const validStatuses = ["Pending", "In Progress", "Resolved", "Closed"];
  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status provided.');
  }

  incident.status = status;
  const updatedIncident = await incident.save();

  if (req.user) {
    await logActivity(req.user._id, "UPDATE_INCIDENT_STATUS", `Updated status of incident ${updatedIncident._id} to ${updatedIncident.status}.`);
  }

  res.status(200).json({
    _id: updatedIncident._id,
    status: updatedIncident.status,
    message: 'Incident status updated successfully.',
  });
});

// @desc    Delete an incident
// @route   DELETE /api/incidents/:id
// @access  Private (Admin only)
export const deleteIncident = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    res.status(404);
    throw new Error('Incident not found');
  }

  // Ensure only admin can delete
  if (req.user && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete incidents.');
  }

  await Incident.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: 'Incident removed' });
});

