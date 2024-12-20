import React from 'react';
import { NavLink } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import logo from "../../assets/logo/logo.png";

const Navbar = () => {
  const { t, i18n } = useTranslation(); // Use translation hook

  // Change language function
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-md px-4">
      <div className="flex justify-between items-center h-[56px] lg:h-[80px] xl:h-[80px]">
        {/* Left side: Logo and Links (Board, Create Token) */}
        <div className="flex items-center gap-5">
          <NavLink to="/" className="w-8 sm:w-[80px]">
            <img src={logo} alt="logo" className="w-13 h-13 object-contain" />
          </NavLink>
          <div className="flex space-x-6">
            <NavLink
              to="/"
              className="text-sm text-gray-900 hover:text-purple-500 font-semibold"
              activeClassName="font-bold text-purple-500"
            >
              {t('board')} {/* Use translation key */}
            </NavLink>
            <NavLink
              to="/create-token"
              className="text-sm text-gray-900 hover:text-purple-500 font-semibold"
              activeClassName="font-bold text-purple-500"
            >
              {t('createToken')} {/* Use translation key */}
            </NavLink>
          </div>
        </div>

        {/* Right side: ConnectButton and Language Selector */}
        <div className="flex items-center gap-4">
          {/* Language Select */}
          <select
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-4 py-2 rounded-md text-sm"
            defaultValue={i18n.language}
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>

          <ConnectButton
            label={t('connectWallet')} // Use translation key for button
            accountStatus="address"
            chainStatus="name"
            className="text-sm px-4 py-2 rounded-full focus:ring-2 focus:ring-offset-2"
          >
            {({ isConnected, isConnecting }) => {
              let bgColor = isConnected ? 'bg-green-500' : 'bg-purple-500';
              let hoverColor = isConnected ? 'hover:bg-green-600' : 'hover:bg-purple-600';
              let statusText = isConnected ? t('walletConnected') : t('connectWallet'); // Translate status text

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
