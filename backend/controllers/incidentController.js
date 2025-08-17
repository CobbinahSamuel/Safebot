import asyncHandler from "express-async-handler"; 
import Incident from "../models/incidentModel.js"; // Import the Incident model

// @desc    Get all incidents
// @route   GET /api/incidents
export const getIncidents = asyncHandler(async (req, res) => {
  const { limit = 100, sort = '-createdAt' } = req.query;
  
  const incidents = await Incident.find({})
    .sort(sort)
    .limit(parseInt(limit));
    
  // Transform to match frontend expectations
  const transformedIncidents = incidents.map(incident => ({
    _id: incident._id,
    title: incident.incidentTitle,
    category: incident.category.toLowerCase().replace(' ', '_'),
    description: incident.detailedDescription,
    location: incident.location,
    urgency: incident.urgencyLevel.toLowerCase(),
    status: incident.status || 'pending',
    anonymous: incident.submitAnonymously,
    contact_email: incident.contactEmail,
    incident_date: incident.whenOccurred,
    created_date: incident.createdAt,
    updated_date: incident.updatedAt,
    response_time: incident.responseTime || Math.floor(Math.random() * 60) + 5
  }));
  
  res.json(transformedIncidents);
});

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

// @desc    Add sample incident data for testing
// @route   POST /api/incidents/add-sample-data
export const addSampleIncidents = asyncHandler(async (req, res) => {
  // Check if sample data already exists
  const existingIncidents = await Incident.find({});
  if (existingIncidents.length > 0) {
    return res.status(200).json({
      success: true,
      message: "Sample incidents already exist in database",
      count: existingIncidents.length
    });
  }

  const sampleIncidents = [
    {
      incidentTitle: "Suspicious Activity in Library",
      category: "Other",
      detailedDescription: "Individual acting suspiciously near computer lab, taking photos of security systems",
      location: "Main Library - Computer Lab",
      whenOccurred: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      urgencyLevel: "High",
      submitAnonymously: true,
      status: "investigating",
      responseTime: 15
    },
    {
      incidentTitle: "Harassment Incident",
      category: "Harassment",
      detailedDescription: "Student being verbally harassed by group of individuals near dormitory entrance",
      location: "Dormitory Block A",
      whenOccurred: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      urgencyLevel: "Critical",
      submitAnonymously: false,
      contactEmail: "concerned.student@umat.edu.gh",
      status: "resolved",
      responseTime: 8
    },
    {
      incidentTitle: "Theft Report",
      category: "Theft",
      detailedDescription: "Laptop stolen from classroom during break period",
      location: "Engineering Block - Room 203",
      whenOccurred: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      urgencyLevel: "Medium",
      submitAnonymously: false,
      contactEmail: "student123@umat.edu.gh",
      status: "pending",
      responseTime: null
    },
    {
      incidentTitle: "Safety Violation",
      category: "Safety Violation",
      detailedDescription: "Fire exit door blocked by construction materials",
      location: "Science Building - 2nd Floor",
      whenOccurred: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      urgencyLevel: "High",
      submitAnonymously: true,
      status: "resolved",
      responseTime: 45
    },
    {
      incidentTitle: "Accident Report",
      category: "Accident",
      detailedDescription: "Student fell down stairs due to wet floor without warning signs",
      location: "Administration Building - Main Staircase",
      whenOccurred: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      urgencyLevel: "Critical",
      submitAnonymously: false,
      contactEmail: "witness@umat.edu.gh",
      status: "closed",
      responseTime: 5
    },
    {
      incidentTitle: "Vandalism in Parking Area",
      category: "Other",
      detailedDescription: "Multiple vehicles damaged with scratches and broken mirrors",
      location: "Student Parking Lot B",
      whenOccurred: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      urgencyLevel: "Medium",
      submitAnonymously: true,
      status: "investigating",
      responseTime: 30
    }
  ];

  try {
    const createdIncidents = await Incident.insertMany(sampleIncidents);
    
    res.status(201).json({
      success: true,
      message: "Sample incidents created successfully",
      count: createdIncidents.length,
      incidents: createdIncidents.map(incident => ({
        id: incident._id,
        title: incident.incidentTitle,
        category: incident.category,
        status: incident.status,
        urgency: incident.urgencyLevel
      }))
    });
  } catch (error) {
    res.status(400);
    throw new Error("Failed to create sample incidents: " + error.message);
  }
});



