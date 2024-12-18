import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from "../../assets/logo/logo.png";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-md px-4">
      <div className="flex justify-between items-center h-[56px] lg:h-[80px] xl:h-[80px]">
        {/* Left side: Logo and Links (Board, Create Token) */}
        <div className="flex items-center gap-5">
          <Link to="/" className="w-8 sm:w-[80px]">
            <img src={logo} alt="logo" className="w-13 h-13 object-contain" />
          </Link>
          <div className="flex space-x-6">
            <Link to="/board" className="text-sm text-gray-900 hover:text-purple-500 font-semibold">Board</Link>
            <Link to="/swap" className="text-sm text-gray-900 hover:text-purple-500 font-semibold">Create Token</Link>
          </div>
        </div>

        {/* Right side: ConnectButton */}
        <div className="flex items-center gap-4">
          <ConnectButton 
            label="Connect Wallet"
            accountStatus="address"
            chainStatus="name"
            className="text-sm px-4 py-2 rounded-full focus:ring-2 focus:ring-offset-2"
          >
            {({ isConnected, isConnecting }) => {
              let bgColor = isConnected ? 'bg-green-500' : 'bg-purple-500';
              let hoverColor = isConnected ? 'hover:bg-green-600' : 'hover:bg-purple-600';
              let statusText = isConnected ? 'Wallet Connected' : 'Connect Wallet';

              return (
                <button
                  className={`${bgColor} ${hoverColor} text-white rounded-full px-4 py-2 focus:ring-2 focus:ring-purple-500`}
                >
                  {isConnecting ? 'Connecting...' : statusText}
                </button>
              );
            }}
          </ConnectButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
