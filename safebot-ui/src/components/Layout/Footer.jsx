import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
      &copy; {new Date().getFullYear()} SafeBot. All rights reserved.
    </footer>
  );
};

export default Footer;
