
import React, { useState, useEffect } from "react";
import { Report } from "@/entities/Report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  MapPin,
  Calendar,
  Activity
} from "lucide-react";

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color, iconColor }) => (
  <Card className="bg-white border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 group">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-green-700" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
          <span className="text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const CategoryCard = ({ category, count, percentage, color }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200/80">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 ${color} rounded-full`}></div>
      <span className="text-gray-800 font-medium capitalize">{category.replace('_', ' ')}</span>
    </div>
    <div className="text-right">
      <p className="text-gray-900 font-bold">{count}</p>
      <p className="text-gray-500 text-sm">{percentage}%</p>
    </div>
  </div>
);

export default function Analytics() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const reportData = await Report.list('-created_date', 100);
        if (isMounted) {
          setReports(reportData);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading analytics data:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const averageResponseTime = reports.reduce((sum, r) => sum + (r.response_time || 0), 0) / totalReports || 0;
  const successRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

  const categoryBreakdown = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryBreakdown).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / totalReports) * 100) || 0
  }));

  const colors = [ 'bg-green-500', 'bg-blue-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500', 'bg-yellow-500', 'bg-teal-500' ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-8">
            <Activity className="w-4 h-4 text-green-700" />
            <span className="text-green-700 text-sm font-medium">Live Analytics</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Campus Safety{" "}
            <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
              Analytics
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real-time insights into campus safety trends, response times, and incident patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Handling Success" value={`${successRate}%`} subtitle="Issues resolved" icon={CheckCircle} trend="+12% this month" color="text-green-600" iconColor="bg-green-100" />
          <StatCard title="Avg Response Time" value={`${Math.round(averageResponseTime)}m`} subtitle="From report to action" icon={Clock} trend="-8% improvement" color="text-green-600" iconColor="bg-green-100" />
          <StatCard title="Total Reports" value={totalReports} subtitle="All-time submissions" icon={AlertTriangle} trend="+23 this month" color="text-gray-800" iconColor="bg-gray-100" />
          <StatCard title="Active Users" value="1,247" subtitle="Registered students" icon={Users} trend="+156 this week" color="text-gray-800" iconColor="bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white border border-gray-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl">Incident Categories</CardTitle>
              <p className="text-gray-500">Breakdown by report type</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryData.map((item, index) => ( <CategoryCard key={item.category} category={item.category} count={item.count} percentage={item.percentage} color={colors[index % colors.length]} /> ))}
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl">Response Metrics</CardTitle>
              <p className="text-gray-500">Performance indicators</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2"> <span className="text-gray-600">Under 5 minutes</span> <span className="text-green-600 font-bold">67%</span> </div>
                <div className="w-full bg-gray-200 rounded-full h-2"> <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div> </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2"> <span className="text-gray-600">5-15 minutes</span> <span className="text-yellow-500 font-bold">24%</span> </div>
                <div className="w-full bg-gray-200 rounded-full h-2"> <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '24%' }}></div> </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2"> <span className="text-gray-600">Over 15 minutes</span> <span className="text-red-500 font-bold">9%</span> </div>
                <div className="w-full bg-gray-200 rounded-full h-2"> <div className="bg-red-400 h-2 rounded-full" style={{ width: '9%' }}></div> </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
