import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GainersRanking = () => {
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
            order: 'percent_change_24h', // Sort by 24h percentage change
            per_page: 5, // Number of tokens to fetch (adjust as needed)
            page: 1,
          },
        });

        // Filter tokens with positive 24h price change (gainers)
        const gainers = response.data.filter((token) => token.price_change_percentage_24h > 0);

        // Set the fetched token data in state
        setTokens(gainers);
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

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <table className="min-w-full table-auto">
        {/* Table Header */}
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Rank</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Token</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Market Cap</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Raised Token</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Rise (24h)</th>
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
                <td className="px-6 py-4 text-purple-500">${formatNumber(marketCap)}</td>
                <td className="px-6 py-4 text-purple-500">{formatNumber(raisedToken)}</td>
                <td className={`px-6 py-4 ${gainPercentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
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
