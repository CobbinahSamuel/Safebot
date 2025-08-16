import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  ArrowLeft,
  GraduationCap,
  UserPlus
} from "lucide-react";
import axios from "axios";

export default function Login() {
  const [loginMethod, setLoginMethod] = useState("email");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    indexNumber: "",
    password: ""
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    indexNumber: "",
    password: "",
    confirmPassword: "",
    role: "users"
  });

  const validateUMaTEmail = (email) => {
    const umatEmailRegex = /^[a-zA-Z0-9._%+-]+@umat\.edu\.gh$/;
    return umatEmailRegex.test(email);
  };

  const validateIndexNumber = (indexNumber) => {
    // UMaT index number format: typically starts with letters followed by numbers
    const indexRegex = /^[A-Z]{2,4}\/\d{2}\/\d{4}$/;
    return indexRegex.test(indexNumber);
  };

  const handleInputChange = (form, field, value) => {
    if (form === "login") {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    }
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (loginMethod === "email") {
        if (!validateUMaTEmail(loginData.email)) {
          throw new Error("Please enter a valid UMaT email address (e.g., john@umat.edu.gh)");
        }
      } else {
        if (!validateIndexNumber(loginData.indexNumber)) {
          throw new Error("Please enter a valid UMaT index number (e.g., BCS/21/001)");
        }
      }

      if (loginData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Prepare login payload
      const loginPayload = {
        password: loginData.password,
        ...(loginMethod === "email" 
          ? { email: loginData.email }
          : { indexNumber: loginData.indexNumber }
        )
      };

      // Call backend API
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginPayload,
        { withCredentials: true }
      );

      if (response.data) {
        setSuccess("Login successful! Redirecting...");
        
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
        
        // Redirect based on role
        setTimeout(() => {
          if (response.data.role === "admin") {
            navigate("/AdminReports");
          } else {
            navigate("/Home");
          }
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (!registerData.name.trim()) {
        throw new Error("Please enter your full name");
      }

      if (!validateUMaTEmail(registerData.email)) {
        throw new Error("Please enter a valid UMaT email address");
      }

      if (!validateIndexNumber(registerData.indexNumber)) {
        throw new Error("Please enter a valid UMaT index number (e.g., BCS/21/001)");
      }

      if (registerData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (registerData.password !== registerData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Call backend API
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: registerData.name,
          email: registerData.email,
          indexNumber: registerData.indexNumber,
          password: registerData.password,
          role: registerData.role
        },
        { withCredentials: true }
      );

      if (response.data) {
        setSuccess("Registration successful! You can now login.");
        setIsRegistering(false);
        
        // Reset forms
        setRegisterData({
          name: "",
          email: "",
          indexNumber: "",
          password: "",
          confirmPassword: "",
          role: "users"
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegistering ? "Join" : "Welcome to"} SAFEBOT
          </h1>
          <p className="text-gray-600">
            {isRegistering 
              ? "Create your UMaT safety account" 
              : "University of Mines and Technology Campus Safety"
            }
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {isRegistering ? (
                  <>
                    <UserPlus className="w-6 h-6 text-green-600" />
                    Register
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-6 h-6 text-green-600" />
                    Student Login
                  </>
                )}
              </CardTitle>
              {!isRegistering && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Alert Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <Shield className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {!isRegistering ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Login Method Tabs */}
                <Tabs value={loginMethod} onValueChange={setLoginMethod} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="index" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Index Number
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        UMaT Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => handleInputChange("login", "email", e.target.value)}
                        placeholder="your.name@umat.edu.gh"
                        className="mt-1"
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="index" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="indexNumber" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student Index Number
                      </Label>
                      <Input
                        id="indexNumber"
                        type="text"
                        value={loginData.indexNumber}
                        onChange={(e) => handleInputChange("login", "indexNumber", e.target.value.toUpperCase())}
                        placeholder="BCS/21/001"
                        className="mt-1"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format: Department/Year/Number (e.g., BCS/21/001)
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => handleInputChange("login", "password", e.target.value)}
                      placeholder="Enter your password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Sign In to SAFEBOT
                    </>
                  )}
                </Button>

                {/* Register Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-2">New to SAFEBOT?</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRegistering(true)}
                    className="w-full"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </Button>
                </div>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={registerData.name}
                    onChange={(e) => handleInputChange("register", "name", e.target.value)}
                    placeholder="Your full name"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="regEmail" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    UMaT Email Address
                  </Label>
                  <Input
                    id="regEmail"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => handleInputChange("register", "email", e.target.value)}
                    placeholder="your.name@umat.edu.gh"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Index Number */}
                <div>
                  <Label htmlFor="regIndexNumber" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Student Index Number
                  </Label>
                  <Input
                    id="regIndexNumber"
                    type="text"
                    value={registerData.indexNumber}
                    onChange={(e) => handleInputChange("register", "indexNumber", e.target.value.toUpperCase())}
                    placeholder="BCS/21/001"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="regPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="regPassword"
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => handleInputChange("register", "password", e.target.value)}
                      placeholder="Create a strong password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleInputChange("register", "confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create SAFEBOT Account
                    </>
                  )}
                </Button>

                {/* Back to Login */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-2">Already have an account?</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRegistering(false)}
                    className="w-full"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Sign In Instead
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 University of Mines and Technology</p>
          <p>Campus Safety & Security Division</p>
        </div>
      </div>
    </div>
  );
}
