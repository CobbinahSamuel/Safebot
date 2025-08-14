import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminReports = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Hardcoded credentials for now
  const validAdmin = {
    email: "admin@safebot.com",
    password: "admin123",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === validAdmin.email && password === validAdmin.password) {
      // Redirect to dashboard
      navigate("/admindashboard");
    } else {
      setErrorMsg("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Shield className="w-8 h-8 text-green-600" />
          <h2 className="text-xl font-bold text-green-700">Admin Panel</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@safebot.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm">{errorMsg}</p>
          )}

          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminReports;
