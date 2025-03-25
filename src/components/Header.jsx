import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="px-0 py-3 relative">
      <header className="bg-white rounded-lg shadow-md mx-auto max-w-[98%]">
        <div className="px-4 py-1 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-200 rounded"></div>
            <div>
              <h1 className="font-bold text-gray-800">MONARCH - MOD</h1>
              <p className="text-sm text-gray-600" style={{ fontSize: "10px" }}>Memorandum of Deposit</p>
            </div>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {isMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>
      </header>
      
      {/* Popup Menu */}
      {isMenuOpen && (
        <div className="absolute top-14 right-4 bg-white shadow-lg rounded-lg w-48 p-2 z-50">
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>
                Login Page
              </Link>
            </li>
            <li>
              <Link to="/LandingPage" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded" onClick={() => setIsMenuOpen(false)}>
                Landing Page
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
