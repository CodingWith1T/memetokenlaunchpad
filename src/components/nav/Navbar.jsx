import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
const Navbar = () => {
    return (
        <>
            <header className="navbar navbar-expand-lg navbar-white bg-white justify-content-center sticky-top">
                <div className="flex justify-between items-center lg:gap-5 xl:gap-15 backdrop-blur-md px-4 h-[56px]">
                    {/* Left side: Logo and Links (Board, Create Token) */}
                    <div className="flex items-center space-x-4">
                        <Link className="block font-bold relative w-8 sm:w-[160px]" to="/">
                            PumpFun
                        </Link>
                        {/* Use Link instead of a for navigation */}
                        <Link to="/board" className="text-sm text-gray-900 dark:text-white hover:text-purple-500 font-bold">Board</Link>
                        <Link to="/swap" className="text-sm text-gray-900 dark:text-white hover:text-purple-500 font-bold">Create Token</Link>
                    </div>

                    {/* Right side: ConnectButton */}
                    <div className="flex items-center gap-4 ">
                        {/* Customize ConnectButton */}
                        <ConnectButton
                            label="Connect Wallet"
                            accountStatus="address"
                            chainStatus="name"
                            className="text-sm rounded-full px-4 py-2 focus:ring-2 focus:ring-offset-2"
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
        </>
    );
}

export default Navbar;
