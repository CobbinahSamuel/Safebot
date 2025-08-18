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
  MapPin,
  Info,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Import the custom hook to access the shared incident state
// The path has been corrected to assume a base path of '@'
import { useIncidentContext } from "@/context/IncidentContext";

/**
 * Utility function to get the appropriate badge variant based on incident status.
 * @param {string} status The status of the incident.
 * @returns {'destructive' | 'default' | 'outline' | 'secondary' | null} The badge variant.
 */
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Resolved":
    case "Closed":
      return "default"; // Green badge for resolved/closed
    case "In Progress":
      return "secondary"; // Gray badge for in progress
    case "Pending":
      return "destructive"; // Red badge for pending
    default:
      return null;
  }
};

/**
 * Renders the Analytics dashboard page.
 * This component fetches incident data from the backend via a shared context
 * and displays various statistics, charts, and a table of recent incidents.
 */
export default function Analytics() {
  // Use the state and functions from the IncidentContext, replacing local state and mock data.
  const { incidents, loading, error } = useIncidentContext();
  
  // State for sorting the incident table
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  // Use useMemo to re-calculate aggregated data only when incidents change
  const { totalIncidents, pendingIncidents, resolvedIncidents, incidentsByLocation, incidentsByCategory, incidentsByDate } = useMemo(() => {
    // Check if incidents is null or undefined to avoid errors
    if (!incidents || incidents.length === 0) {
      return {
        totalIncidents: 0,
        pendingIncidents: 0,
        resolvedIncidents: 0,
        incidentsByLocation: [],
        incidentsByCategory: [],
        incidentsByDate: [],
      };
    }

    const total = incidents.length;
    const pending = incidents.filter(inc => inc.status === "Pending" || inc.status === "In Progress").length;
    const resolved = incidents.filter(inc => inc.status === "Resolved" || inc.status === "Closed").length;

    // Aggregate data for bar chart (by location)
    const locationCounts = incidents.reduce((acc, inc) => {
      acc[inc.location] = (acc[inc.location] || 0) + 1;
      return acc;
    }, {});
    const locations = Object.keys(locationCounts).map(location => ({
      name: location,
      count: locationCounts[location],
    })).sort((a, b) => b.count - a.count);

    // Aggregate data for pie chart (by category)
    const categoryCounts = incidents.reduce((acc, inc) => {
      acc[inc.category] = (acc[inc.category] || 0) + 1;
      return acc;
    }, {});
    const categories = Object.keys(categoryCounts).map(category => ({
      name: category,
      value: categoryCounts[category],
    }));
    
    // Aggregate data for line chart (by date)
    const dateCounts = incidents.reduce((acc, inc) => {
      // Assuming 'date' field exists and is in a format compatible with Date object
      const date = new Date(inc.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const dates = Object.keys(dateCounts).map(date => ({
      date,
      count: dateCounts[date],
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      totalIncidents: total,
      pendingIncidents: pending,
      resolvedIncidents: resolved,
      incidentsByLocation: locations,
      incidentsByCategory: categories,
      incidentsByDate: dates,
    };
  }, [incidents]);

  // Use useMemo for sorting to prevent re-calculation on every render
  const sortedIncidents = useMemo(() => {
    const sortableItems = [...incidents];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        // Handle sorting for different data types (e.g., strings, numbers, dates)
        if (sortConfig.key === 'date') {
          const dateA = new Date(aVal);
          const dateB = new Date(bVal);
          if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
        } else {
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
          } else {
            if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
          }
        }
        return 0;
      });
    }
    return sortableItems;
  }, [incidents, sortConfig]);

  // Function to request sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
    }
    return null;
  };

  // Render loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-8">
        <div className="text-center">
          <Info className="h-12 w-12 text-blue-500 animate-pulse mx-auto" />
          <p className="mt-4 text-xl font-semibold text-gray-700">Loading incident data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {error || "An error occurred while fetching data."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-6">Incident Analytics</h1>

      {/* Analytics Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Incidents</CardTitle>
            <Info className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalIncidents}</div>
            <p className="text-xs text-gray-500 mt-1">Total reports recorded</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending/In Progress</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{pendingIncidents}</div>
            <p className="text-xs text-gray-500 mt-1">Reports awaiting action</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resolved Incidents</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedIncidents}</div>
            <p className="text-xs text-gray-500 mt-1">Reports successfully closed</p>
          </CardContent>
        </Card>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg p-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Incidents by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incidentsByLocation} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Number of Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-lg p-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Incidents Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incidentsByDate} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Daily Incidents" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Recent Incidents Table */}
      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Incident Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('incidentTitle')}>
                      Title
                      {getSortIcon('incidentTitle')}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('location')}>
                      Location
                      {getSortIcon('location')}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('urgencyLevel')}>
                      Urgency
                      {getSortIcon('urgencyLevel')}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('status')}>
                      Status
                      {getSortIcon('status')}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600 cursor-pointer" onClick={() => requestSort('date')}>
                      Date
                      {getSortIcon('date')}
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedIncidents.map((incident) => (
                    <TableRow key={incident._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <TableCell className="font-medium text-gray-900">{incident.incidentTitle}</TableCell>
                      <TableCell className="text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-blue-500" />{incident.location}
                      </TableCell>
                      <TableCell className="text-gray-700">{incident.urgencyLevel}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(incident.status)} className="px-3 py-1 rounded-full text-xs font-semibold">
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm">
                        {new Date(incident.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-green-500 text-white hover:bg-green-600 transition-all duration-300 rounded-md shadow-md"
                        >
                          View Data
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {incidents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-500">
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
