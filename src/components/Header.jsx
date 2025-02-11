import React from 'react';
import { Menu } from 'lucide-react';

const Header = () => {
  return (
    <div className="px-0 py-3">
      <header className="bg-white rounded-lg shadow-md mx-auto max-w-[98%]">
        <div className="px-4 py-1 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-200 rounded"></div>
            <div>
              <h1 className="font-bold text-gray-800">MONARCH - MOD</h1>
              <p className="text-sm text-gray-600" style={{fontSize:"10px"}}>Memorandum of Deposit</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;