import React, { useEffect, useState } from 'react';
import logo from "../../../assets/logo/logo.png";

const GainersRanking = () => {
  // State to store the token data
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dummy data for testing
  const dummyData = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      price_change_percentage_24h: 5.6,
      market_cap: 874000000000,
      total_supply: 19000000,
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      price_change_percentage_24h: 4.2,
      market_cap: 430000000000,
      total_supply: 120000000,
    },
    {
      id: 'binancecoin',
      name: 'Binance Coin',
      image: 'https://assets.coingecko.com/coins/images/2710/large/binance-coin-logo.png',
      price_change_percentage_24h: 3.8,
      market_cap: 70000000000,
      total_supply: 160000000,
    },
    {
      id: 'cardano',
      name: 'Cardano',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      price_change_percentage_24h: 2.9,
      market_cap: 30000000000,
      total_supply: 45000000000,
    },
    {
      id: 'solana',
      name: 'Solana',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      price_change_percentage_24h: 6.1,
      market_cap: 55000000000,
      total_supply: 510000000,
    },
  ];

  // Simulate fetching data with dummy data
  useEffect(() => {
    const fetchTokenData = () => {
      try {
        // Here we simulate fetching data
        setTokens(dummyData);
      } catch (error) {
        setError('Failed to fetch token data');
      } finally {
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
    </div>;
  }

  // If there's an error fetching data, show error message
  if (error) {
    return <div>{error}</div>;
  }

  // Helper function to format large numbers (like market cap)
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <table className="min-w-full table-auto text-sm sm:text-base">
        {/* Table Header */}
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-purple-200">Rank</th>
            <th className="px-4 py-3 text-left font-semibold text-purple-200">Token</th>
            <th className="px-4 py-3 text-left font-semibold text-purple-200">Market Cap</th>
            <th className="px-4 py-3 text-left font-semibold text-purple-200">Raised Token</th>
            <th className="px-4 py-3 text-left font-semibold text-purple-200">Rise (24h)</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-purple-700">
          {tokens.map((token, index) => {
            const gainPercentage = token.price_change_percentage_24h;
            const marketCap = token.market_cap;
            const raisedToken = token.total_supply || "N/A"; // Assuming "raised token" refers to total supply if not available
            return (
              <tr
                key={token.id}
                className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50`}
              >
                <td className="px-5 py-5 text-purple-700">{index + 1}</td>
                <td className="px-5 py-5 flex items-center space-x-2 text-purple-700">
                  {/* Display the token logo and name */}
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm sm:text-base">{token.name}</span>
                </td>
                <td className="px-4 py-3 text-purple-500">${formatNumber(marketCap)}</td>
                <td className="px-4 py-3 text-purple-500">{formatNumber(raisedToken)}</td>
                <td className={`px-4 py-3 ${gainPercentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {gainPercentage.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GainersRanking;
