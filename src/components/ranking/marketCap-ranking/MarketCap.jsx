import React, { useEffect, useState } from 'react';
import logo from "../../../assets/logo/logo.png";

const MarketCap = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Simulate fetching token data and blockchain data for raised_token
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Simulating a delay to mimic an API call
        setTimeout(() => {
          const updatedTokens = dummyTokens.map(async (token) => {
            // Fetching dynamic data for 'raised_token' from a blockchain API (example)
            const raisedTokenData = await fetch(`https://api.example.com/token/${token.id}/raised`) // Replace with a real API
              .then(response => response.json())
              .then(data => data.raised_token)
              .catch(err => {
                console.error(`Failed to fetch raised token data for ${token.id}`, err);
                return 0; // Default to 0 if the API fails
              });

            return { ...token, raised_token: raisedTokenData };
          });

          Promise.all(updatedTokens).then((result) => {
            setTokens(result);
            setLoading(false);
          });
        }, 1000);
      } catch (error) {
        setError('Failed to fetch token data');
        setLoading(false);
      }
    };

    fetchTokenData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <img src={logo} alt="Loading Logo" className="w-24 h-24 animate-spin-slow" />
          <span className="text-lg text-gray-700 font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const calculateProgress = (marketCap) => {
    const maxMarketCap = 5000000000; 
    const progress = (marketCap / maxMarketCap) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <table className="min-w-full table-auto text-sm sm:text-base">
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Rank</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Token Name</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Market Cap</th>
            <th className="px-6 py-4 text-left font-semibold text-purple-200">Raised Token</th>
          </tr>
        </thead>

        <tbody className="text-purple-700">
          {tokens.map((token, index) => {
            const progress = calculateProgress(token.market_cap);

            return (
              <tr
                key={token.id}
                className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-200`}
              >
                <td className="px-3 py-5 text-purple-700">{index + 1}</td>
                <td className="px-3 py-5 flex items-center space-x-2 text-purple-700">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{token.name}</span>
                </td>
                <td className="px-3 py-2 text-purple-500">${formatNumber(token.market_cap)}</td>
                <td className="px-3 py-2 text-purple-500">{formatNumber(token.raised_token)} tokens</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MarketCap;
