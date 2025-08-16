import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  MapPin, // MapPin icon for location emphasis
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Mock data generation for demonstration purposes
const generateMockIncidents = (count) => {
  const categories = ["Harassment", "Theft", "Medical Emergency", "Violence", "Suspicious Activity", "Facility Issue", "Other"];
  const locations = ["Classroom", "Library", "Cafeteria", "Parking Lot", "Dormitory", "Sports Complex", "Administration Building", "Other", "Sporting Arena", "Main Gate", "Campus Clinic"];
  const urgencyLevels = ["Low", "Medium", "High", "Critical"]; // Keeping this for incident data, but not explicitly charted
  const statuses = ["Pending", "In Progress", "Resolved", "Closed"]; // Keeping this for incident data

  const incidents = [];
  for (let i = 1; i <= count; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomUrgency = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate dates/times over the last 30 days, including various hours
    const randomTimestamp = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000) - Math.floor(Math.random() * 24 * 60 * 60 * 1000); // Up to 30 days ago, with random hours
    const randomDate = new Date(randomTimestamp);
    
    incidents.push({
      id: String(i),
      title: `Incident ${i}: ${randomCategory} at ${randomLocation}`,
      category: randomCategory,
      location: randomLocation,
      urgency: randomUrgency,
      status: randomStatus, // Still relevant for historical data analysis
      date: randomDate.toLocaleString(),
      timestamp: randomDate.getTime(), // Numeric timestamp for calculations
      detailedDescription: `Detailed data for incident ${i} concerning a ${randomCategory.toLowerCase()} issue.`,
      submitAnonymously: Math.random() < 0.3, // Not used for display but kept for potential future use
    });
  }
  return incidents;
};

// Simulate API call
const fetchIncidents = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(generateMockIncidents(100)); // Generate more mock incidents for richer data
    }, 1500); // Simulate network delay
  });
};

// Colors to match the green theme and gradients
const DASHBOARD_PRIMARY_COLOR = '#36D6B5';
const BAR_FILL_COLOR = '#36D6B5';
const LINE_STROKE_COLOR = '#36D6B5';

export default function Analytics() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  useEffect(() => {
    const getIncidents = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        setIncidents(data);
      } catch (err) {
        console.error("Error fetching incidents:", err);
        setError("Failed to fetch incident data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getIncidents();
  }, []);

  // Prepare data for charts and summary cards
  const dashboardData = useMemo(() => {
    const totalIncidents = incidents.length;
    const resolvedIncidents = incidents.filter(i => i.status === "Resolved" || i.status === "Closed").length;
    const pendingIncidents = incidents.filter(i => i.status === "Pending").length;
    
    // Category distribution
    const categoryMap = incidents.reduce((acc, incident) => {
      acc[incident.category] = (acc[incident.category] || 0) + 1;
      return acc;
    }, {});
    const categoryData = Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    }));

    // Location analysis data (for hotspots and monitored locations)
    const locationMap = incidents.reduce((acc, incident) => {
      acc[incident.location] = (acc[incident.location] || 0) + 1;
      return acc;
    }, {});
    const uniqueLocationsCount = Object.keys(locationMap).length;
    const topLocationsData = Object.keys(locationMap)
      .map(key => ({
        name: key,
        value: locationMap[key]
      }))
      .sort((a, b) => b.value - a.value); // Sort descending by count, no slice for list

    // Incidents by Hour of Day
    const hourMap = incidents.reduce((acc, incident) => {
      const hour = new Date(incident.timestamp).getHours(); // 0-23
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: hourMap[i] || 0
    }));

    // Incidents by Day of Week
    const dayOfWeekMap = incidents.reduce((acc, incident) => {
      const day = new Date(incident.timestamp).getDay(); // 0 (Sunday) - 6 (Saturday)
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dailyData = Array.from({ length: 7 }, (_, i) => ({
      day: days[i],
      count: dayOfWeekMap[i] || 0
    }));
    

    // Incidents over time (daily count for the last 30 days)
    const timeSeriesMap = incidents.reduce((acc, incident) => {
      const date = new Date(incident.date);
      const dayKey = date.toISOString().split('T')[0];
      acc[dayKey] = (acc[dayKey] || 0) + 1;
      return acc;
    }, {});
    const timeSeriesData = Object.keys(timeSeriesMap)
      .map(key => ({
        date: key,
        count: timeSeriesMap[key]
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));


    return {
      totalIncidents,
      resolvedIncidents,
      pendingIncidents,
      categoryData,
      timeSeriesData,
      uniqueLocationsCount,
      topLocationsData,
      hourlyData,
      dailyData,
    };
  }, [incidents]);

  // Sort incident data for the table
  const sortedIncidents = useMemo(() => {
    let sortableItems = [...incidents];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [incidents, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />;
    }
    return null;
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Pending": return "destructive";
      case "In Progress": return "default";
      case "Resolved": return "success";
      case "Closed": return "outline";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center text-green-600 font-semibold text-xl">
          <svg className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Dashboard Data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <Alert variant="destructive" className="max-w-xl mx-auto mt-10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
          Campus Safety Insights Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Analyze incident data, identify trends, and pinpoint crime hotspots for informed decision-making.
        </p>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Incidents Recorded</CardTitle>
            <AlertTriangle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.totalIncidents}</div>
            <p className="text-xs text-gray-500 mt-1">Overall reports collected</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Resolved for Analysis</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.resolvedIncidents}</div>
            <p className="text-xs text-gray-500 mt-1">Incidents marked as resolved for data review</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Review</CardTitle>
            <Clock className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.pendingIncidents}</div>
            <p className="text-xs text-gray-500 mt-1">Reports awaiting initial data classification</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Unique Locations Tracked</CardTitle>
            <MapPin className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.uniqueLocationsCount}</div>
            <p className="text-xs text-gray-500 mt-1">Distinct areas with recorded incidents</p>
          </CardContent>
        </Card>
      </section>

      {/* Main Charts Section - Category & Location Hotspots */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Card className="shadow-md rounded-xl p-6">
          <CardTitle className="text-lg font-semibold mb-4 text-gray-800">Incidents by Category (Data Distribution)</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="value" name="Number of Incidents" fill={BAR_FILL_COLOR} barSize={30} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* New implementation for Top Locations (Hotspots) */}
        <Card className="shadow-md rounded-xl p-6">
          <CardTitle className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-500" />
            Top Locations with Incidents (Potential Hotspots)
          </CardTitle>
          <CardContent className="flex flex-col gap-4 p-0">
            {dashboardData.topLocationsData.slice(0, 5).map((location, index) => ( // Showing top 5 for brevity in card list
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">
                <span className="font-medium text-gray-800">{location.name}</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                  {location.value} Incidents
                </Badge>
              </div>
            ))}
            {dashboardData.topLocationsData.length > 5 && (
              <p className="text-gray-500 text-sm mt-2 text-center">
                See full table below for all locations.
              </p>
            )}
            {dashboardData.topLocationsData.length === 0 && (
              <p className="text-gray-500 text-sm text-center">
                No location data available yet.
              </p>
            )}
          </CardContent>
          <p className="text-gray-600 text-sm mt-4">
            This list highlights locations with the highest number of reported incidents, indicating potential crime hotspots requiring further investigation.
          </p>
        </Card>
      </section>

      {/* Timing Analysis Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Card className="shadow-md rounded-xl p-6">
          <CardTitle className="text-lg font-semibold mb-4 text-gray-800">Incidents by Hour of Day</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="hour" interval={0} tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="count" name="Number of Incidents" fill={BAR_FILL_COLOR} barSize={20} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-gray-600 text-sm mt-4">
            Understanding the hourly distribution of incidents can help in allocating security resources more effectively.
          </p>
        </Card>

        <Card className="shadow-md rounded-xl p-6">
          <CardTitle className="text-lg font-semibold mb-4 text-gray-800">Incidents by Day of Week</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="day" interval={0} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="count" name="Number of Incidents" fill={BAR_FILL_COLOR} barSize={30} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-gray-600 text-sm mt-4">
            Analyzing incident patterns across the week can reveal specific days that require increased vigilance or attention.
          </p>
        </Card>
      </section>

      {/* Incident Reporting Trends */}
      <section className="mb-10">
        <Card className="shadow-md rounded-xl p-6">
          <CardTitle className="text-lg font-semibold mb-4 text-gray-800">Incident Reporting Trends (Last 30 Days)</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" interval="preserveStartEnd" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="count" name="Daily Incidents" stroke={LINE_STROKE_COLOR} strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>


      {/* Raw Incident Data Table */}
      <section>
        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Raw Incident Data for Analysis</CardTitle>
            <p className="text-gray-600">Review individual reports to identify patterns and location-specific insights.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto"> {/* Added for horizontal scrolling on small screens */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">
                      <Button variant="ghost" onClick={() => requestSort('title')} className="flex items-center text-gray-700 hover:bg-gray-100">
                        Incident Title {getSortIcon('title')}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <Button variant="ghost" onClick={() => requestSort('category')} className="flex items-center text-gray-700 hover:bg-gray-100">
                        Category {getSortIcon('category')}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <Button variant="ghost" onClick={() => requestSort('location')} className="flex items-center text-gray-700 hover:bg-gray-100">
                        <MapPin className="w-4 h-4 mr-1 text-gray-500" /> Location {getSortIcon('location')}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      <Button variant="ghost" onClick={() => requestSort('urgency')} className="flex items-center text-gray-700 hover:bg-gray-100">
                        Urgency {getSortIcon('urgency')}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <Button variant="ghost" onClick={() => requestSort('status')} className="flex items-center text-gray-700 hover:bg-gray-100">
                        Status (for historical data) {getSortIcon('status')}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[180px]">
                      <Button variant="ghost" onClick={() => requestSort('date')} className="flex items-center text-gray-700 hover:bg-gray-100">
                        Date Recorded {getSortIcon('date')}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[100px] text-gray-700">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedIncidents.map((incident) => (
                    <TableRow key={incident.id} className="hover:bg-green-50/20 transition-colors">
                      <TableCell className="font-medium text-gray-900">{incident.title}</TableCell>
                      <TableCell className="text-gray-700">{incident.category}</TableCell>
                      <TableCell className="text-gray-700">{incident.location}</TableCell>
                      <TableCell className="text-gray-700">{incident.urgency}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(incident.status)} className="px-3 py-1 rounded-full text-xs font-semibold">
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm">{incident.date}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-500 text-white border-green-500 hover:bg-green-600 hover:text-white transition-all duration-300 rounded-md"
                        >
                          View Data
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {incidents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                        No incident data to display.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
