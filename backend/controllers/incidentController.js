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



