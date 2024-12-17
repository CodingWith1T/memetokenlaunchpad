import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
    return (
        <header className="top-0 left-0 fixed w-full z-[11] bg-white dark:bg-dark border-b border-b-[#D7CAEC] dark:border-b-[#383241]">
            <div className="flex justify-between items-center lg:gap-5 xl:gap-15 backdrop-blur-md px-4 h-[56px]">
                {/* Left side: Logo and Links (Board, Create Token) */}
                <div className="flex items-center space-x-4">
                    <Link className="block relative w-8 sm:w-[160px]" to="/">
                        <div>
                            <svg className="sm:hidden w-8" viewBox="0 0 198 199" color="text" width="20px" xmlns="http://www.w3.org/2000/svg">
                                <title>Logo</title>
                                <path fillRule="evenodd" clipRule="evenodd" d="M98.552 198.607c-29.49-.022-53.246-7.027-69.844-19.609C11.91 166.265 3 148.195 3 127.748c0-19.701 8.891-33.907 18.952-43.51 7.884-7.525 16.584-12.344 22.642-15.117-1.37-4.162-3.079-9.61-4.608-15.238-2.046-7.53-4.053-16.366-4.053-22.84 0-7.663 1.687-15.36 6.238-21.34C46.98 3.385 54.218 0 62.926 0c6.806 0 12.584 2.499 17.108 6.81 4.324 4.12 7.202 9.593 9.189 15.298 3.491 10.024 4.85 22.618 5.232 35.187h8.341c.382-12.569 1.741-25.163 5.233-35.187 1.987-5.705 4.865-11.177 9.189-15.298C121.741 2.5 127.519 0 134.325 0c8.708 0 15.947 3.385 20.755 9.703 4.551 5.98 6.239 13.677 6.239 21.34 0 6.474-2.007 15.31-4.054 22.84-1.529 5.628-3.238 11.076-4.608 15.238 6.058 2.773 14.759 7.592 22.643 15.118 10.06 9.602 18.952 23.808 18.952 43.509 0 20.447-8.911 38.517-25.708 51.25-16.598 12.582-40.354 19.587-69.844 19.609h-.148z" fill="#633001"></path>
                                <path d="M62.926 7.288c-12.754 0-18.626 9.516-18.626 22.675 0 10.46 6.822 31.408 9.621 39.563.63 1.835-.36 3.844-2.164 4.555-10.222 4.031-40.39 18.789-40.39 52.588 0 35.603 30.658 62.448 87.191 62.49h.135c56.534-.042 87.19-26.887 87.19-62.49 0-33.799-30.167-48.557-40.389-52.588-1.804-.71-2.794-2.72-2.164-4.555 2.799-8.154 9.621-29.103 9.621-39.563 0-13.16-5.871-22.675-18.626-22.675-18.36 0-22.936 26.007-23.263 53.92-.022 1.863-1.528 3.375-3.392 3.375H89.58c-1.863 0-3.37-1.512-3.391-3.375-.326-27.913-4.903-53.92-23.263-53.92z" fill="#D1884F"></path>
                            </svg>
                        </div>
                        <div>
                            <svg className="sm:block hidden sm:w-[160px]" viewBox="0 0 1281 199" color="text" width="20px" xmlns="http://www.w3.org/2000/svg">
                                <title>Logo</title>
                                <path fill="var(--colors-contrast)" d="M247.013 153.096c-2.979 0-5.085-.617-6.318-1.849-1.13-1.233-1.695-3.185-1.695-5.856v-89.22c0-2.672.616-4.624 1.849-5.856 1.233-1.336 3.287-2.004 6.164-2.004h37.753c14.382 0 24.963 3.031 31.744 9.092 6.78 6.061 10.17 15.101 10.17 27.12 0 11.917-3.39 20.906-10.17 26.967-6.678 5.959-17.259 8.938-31.744 8.938h-14.639v24.963c0 2.671-.616 4.623-1.849 5.856-1.233 1.232-3.339 1.849-6.318 1.849h-14.947zm35.288-55.012c4.212 0 7.448-1.13 9.708-3.39 2.362-2.26 3.544-5.65 3.544-10.17 0-4.623-1.182-8.065-3.544-10.325-2.26-2.26-5.496-3.39-9.708-3.39h-12.174v27.275h12.174z" />
                            </svg>
                        </div>
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
    );
}

export default Navbar;
