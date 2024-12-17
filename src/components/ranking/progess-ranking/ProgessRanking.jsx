import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgessRanking = () => {
  // State to store the token data
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch token data from CoinGecko API
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Fetch data from CoinGecko API
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 5, // Number of tokens to fetch (change this number as needed)
            page: 1,
          },
        });

        // Set the fetched token data in state
        setTokens(response.data);
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
    return <div></div>;
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
    <div className=" overflow-x-auto shadow-md rounded-lg bg-white">
      <table className="min-w-full table-auto">
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
                <td className="px-6 py-4 text-purple-700">{index + 1}</td>
                <td className="px-6 py-4 flex items-center space-x-2 text-purple-700">
                  {/* Display the token logo and name */}
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{token.name}</span>
                </td>
                <td className="px-6 py-4 text-purple-500">${formatNumber(token.market_cap)}</td>
                <td className="px-6 py-4 text-purple-700">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <span className="text-sm font-semibold">{Math.round(progress)}%</span>
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
