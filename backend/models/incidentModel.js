import mongoose from "mongoose";

// Define the schema for an incident report
const incidentSchema = mongoose.Schema(
  {
    // Title of the incident, e.g., "Brief description"
    incidentTitle: {
      type: String,
      required: [true, "Please add an incident title"],
      trim: true,
    },
    // Category of the incident, chosen from a predefined list
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: ["Accident", "Theft", "Harassment", "Safety Violation", "Other"],
    },
    // Detailed description of the incident
    detailedDescription: {
      type: String,
      required: [true, "Please provide a detailed description"],
    },
    // Location where the incident occurred
    location: {
      type: String,
      required: [true, "Please add the location of the incident"],
      trim: true,
    },
    // Date and time when the incident occurred
    whenOccurred: {
      type: Date,
      required: [true, "Please specify when the incident occurred"],
    },
    // Urgency level of the incident
    urgencyLevel: {
      type: String,
      required: [true, "Please select an urgency level"],
      enum: ["Low", "Medium", "High", "Critical"],
    },
    // Flag to indicate if the report is submitted anonymously
    submitAnonymously: {
      type: Boolean,
      default: false, // Default to not anonymous
    },
    // Contact email for updates, required if not anonymous
    contactEmail: {
      type: String,
      // Only required if submitAnonymously is false
      required: function () {
        return !this.submitAnonymously;
      },
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    // Current status of the incident report
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "closed"],
      default: "pending",
    },
    // Response time in minutes (calculated when status changes)
    responseTime: {
      type: Number,
      default: null,
    },
    // Reference to the student who submitted the incident
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    // Student information (for quick access without population)
    studentInfo: {
      name: {
        type: String,
        default: null,
      },
      indexNumber: {
        type: String,
        default: null,
      },
      department: {
        type: String,
        default: null,
      },
    },
    // Telegram information
    telegramInfo: {
      chatId: {
        type: String,
        default: null,
      },
      userId: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create the Incident model from the schema
const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;
