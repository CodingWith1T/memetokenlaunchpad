import React, { useEffect, useState } from 'react';
import logo from "../../../assets/logo/logo.png";

const ProgessRanking = () => {
  // State to store the token data
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dummy data representing the token data from CoinGecko API
  const dummyTokens = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      image: 'https://cryptocurrencies-images.s3.amazonaws.com/bitcoin.png',
      market_cap: 850000000000,
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      image: 'https://cryptocurrencies-images.s3.amazonaws.com/ethereum.png',
      market_cap: 400000000000,
    },
    {
      id: 'binancecoin',
      name: 'Binance Coin',
      image: 'https://cryptocurrencies-images.s3.amazonaws.com/binancecoin.png',
      market_cap: 95000000000,
    },
    {
      id: 'cardano',
      name: 'Cardano',
      image: 'https://cryptocurrencies-images.s3.amazonaws.com/cardano.png',
      market_cap: 43000000000,
    },
    {
      id: 'polkadot',
      name: 'Polkadot',
      image: 'https://cryptocurrencies-images.s3.amazonaws.com/polkadot.png',
      market_cap: 22000000000,
    },
  ];

  // Simulate fetching token data (replace with dummy data for now)
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Simulating a delay to mimic API call
        setTimeout(() => {
          setTokens(dummyTokens); // Set the dummy token data
          setLoading(false);
        }, 1000);
      } catch (error) {
        setError('Failed to fetch token data');
        setLoading(false);
      }
    };

    fetchTokenData();
  }, []); // Empty dependency array ensures this runs once on component mount

  // If data is still loading, show loading indicator
  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100">
          {/* Loading Container */}
          <div className="flex flex-col items-center space-y-4">
            {/* Logo with animation */}
            <img
              src={logo}
              alt="Loading Logo"
              className="w-24 h-24 animate-spin-slow"
            />
            {/* Text: Loading... */}
            <span className="text-lg text-gray-700 font-semibold">Loading...</span>
          </div>
        </div>;;
  }

  // If there's an error fetching data, show error message
  if (error) {
    return <div>{error}</div>;
  }

  // Helper function to format large numbers (like market cap)
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Helper function to calculate progress (for example, based on market cap)
  const calculateProgress = (marketCap) => {
    const maxMarketCap = 5000000000; // Arbitrary max market cap for "full" progress (e.g., 5B USD)
    const progress = (marketCap / maxMarketCap) * 100;
    return Math.min(progress, 100); // Ensure that progress doesn't exceed 100%
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <table className="min-w-full table-auto text-sm sm:text-base">
        {/* Table Header */}
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Rank</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Token</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Market Cap</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Progress</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-purple-700">
          {tokens.map((token, index) => {
            const progress = calculateProgress(token.market_cap); // Calculate progress

            return (
              <tr
                key={token.id}
                className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50`}
              >
                <td className="px-3 py-5 text-purple-700">{index + 1}</td>
                <td className="px-3 py-5 flex items-center space-x-2 text-purple-700">
                  {/* Display the token logo and name */}
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{token.name}</span>
                </td>
                <td className="px-3 py-2 text-purple-500">${formatNumber(token.market_cap)}</td>
                <td className="px-3 py-2 text-purple-700">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <span className="text-xs font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <div className="flex mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-500 h-2.5 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProgessRanking;
