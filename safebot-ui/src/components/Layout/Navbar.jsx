import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">SafeBot</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/how-it-works" className="hover:text-blue-600">How It Works</Link>
        <Link to="/report" className="hover:text-blue-600">Report</Link>
        <Link to="/analytics" className="hover:text-blue-600">Analytics</Link>
      </div>
    </nav>
  );
};

export default Navbar;
