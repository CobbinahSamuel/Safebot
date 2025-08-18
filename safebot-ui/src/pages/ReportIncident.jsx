import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MapPin, Clock, Shield } from "lucide-react";
import { useIncidentContext } from "../context/IncidentContext"; // Corrected import path
import { toast } from 'react-toastify'; // Import toast for notifications

// Data for incident categories, locations, and urgency levels
const categories = [
  { value: "Theft", label: "Theft" },
  { value: "Vandalism", label: "Vandalism" },
  { value: "Assault", label: "Assault" },
  { value: "Robbery", label: "Robbery" },
  { value: "Sexual Harassment", label: "Sexual Harassment" },
  { value: "Substance Abuse", label: "Substance Abuse" },
  { value: "Unauthorized Access or Trespassing", label: "Unauthorized Access or Trespassing" }
];

const locations = [
  { value: "Zion Hostel", label: "Zion Hostel" },
  { value: "Railway Hall", label: "Railway Hall" },
  { value: "MMOH Hostel", label: "MMOH Hostel" },
  { value: "Victory Hostel", label: "Victory Hostel" },
  { value: "Borger Hostel", label: "Borger Hostel" },
  { value: "Hilton Hostel", label: "Hilton Hostel" },
  { value: "Kojokrom", label: "Kojokrom" },
  { value: "Essikado Town", label: "Essikado Town" },
  { value: "BU", label: "BU" },
  { value: "KETAN", label: "KETAN" }
];

const urgencyLevels = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" }
];

/**
 * Renders the Report Incident form component.
 * This component allows users to submit a new safety incident report.
 */
export default function ReportIncident() {
  // State to manage form data
  const [formData, setFormData] = useState({
    incidentTitle: "",
    category: "",
    detailedDescription: "",
    location: "",
    whenOccurred: "",
    urgencyLevel: "Medium",
    submitAnonymously: false,
    contactEmail: ""
  });

  // Accessing the submitIncident function and loading/error states from the context
  const { submitIncident, loading, error } = useIncidentContext();

  /**
   * Handles changes to form input fields.
   * @param {string} field The name of the field to update.
   * @param {*} value The new value for the field.
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handles the form submission.
   * Prevents default form behavior, calls the submitIncident function,
   * and handles success or failure with toast notifications.
   * @param {Event} e The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitIncident(formData);
      // Use a toast notification for success instead of an alert
      toast.success("Incident submitted successfully!");
      // Reset form after successful submission
      setFormData({
        incidentTitle: "",
        category: "",
        detailedDescription: "",
        location: "",
        whenOccurred: "",
        urgencyLevel: "Medium",
        submitAnonymously: false,
        contactEmail: ""
      });
    } catch (err) {
      console.error(err);
      // Use a toast notification for errors
      toast.error("Failed to submit incident.");
    }
  };

  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Report a Safety Incident
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Help us keep UMaT safe by reporting incidents quickly and securely.
          </p>
        </div>

        {/* Display a destructive alert if there's a submission error */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* The main form for submitting the incident report */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="bg-white border border-gray-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-gray-500" />
                Incident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Incident Title Input */}
              <div>
                <Label htmlFor="incidentTitle">Incident Title</Label>
                <Input
                  id="incidentTitle"
                  value={formData.incidentTitle}
                  onChange={(e) => handleInputChange("incidentTitle", e.target.value)}
                  placeholder="Brief description"
                  required
                  className="w-full"
                />
              </div>

              {/* Category, Location, and When Occurred fields in a grid */}
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select incident location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="whenOccurred" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    When did this occur?
                  </Label>
                  <Input
                    id="whenOccurred"
                    type="datetime-local"
                    value={formData.whenOccurred}
                    onChange={(e) => handleInputChange("whenOccurred", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              {/* Detailed Description Textarea */}
              <div>
                <Label htmlFor="detailedDescription">Detailed Description</Label>
                <Textarea
                  id="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={(e) => handleInputChange("detailedDescription", e.target.value)}
                  placeholder="Provide as much detail as possible..."
                  required
                  className="w-full"
                />
              </div>

              {/* Urgency Level selection buttons */}
              <div>
                <Label className="mb-4 block">Urgency Level</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {urgencyLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleInputChange("urgencyLevel", level.value)}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        formData.urgencyLevel === level.value
                          ? "bg-green-100 border-green-300"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium text-gray-800">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Privacy & Contact Section */}
          <Card className="bg-white border border-gray-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                Privacy & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.submitAnonymously}
                  onCheckedChange={(checked) => handleInputChange("submitAnonymously", checked)}
                />
                <Label htmlFor="anonymous">
                  Submit anonymously
                </Label>
              </div>
              {!formData.submitAnonymously && (
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="your.email@umat.edu.gh"
                    required
                    className="w-full"
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    We'll use this for updates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={loading || !formData.incidentTitle || !formData.category || !formData.detailedDescription || !formData.location}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
