import React, { useEffect, useState } from 'react';
import logo from "../../../assets/logo/logo.png";

// The API endpoint for CoinGecko to fetch market data
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/';

const TradingVolume = () => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // List of token IDs to fetch data for
    const tokenIds = [
        'bitcoin',
        'ethereum',
        'binancecoin',
        'cardano',
        'polkadot',
    ];

    // Fetch the token data including market cap, raised tokens, and trading volume
    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                const fetchedTokens = await Promise.all(
                    tokenIds.map(async (id) => {
                        // Fetching data for each token from CoinGecko API
                        const response = await fetch(`${COINGECKO_API_URL}${id}`);
                        const data = await response.json();

                        // Extracting the required fields from CoinGecko's response
                        const { name, image, market_data } = data;
                        const marketCap = market_data.market_cap.usd;
                        const tradingVolume = market_data.total_volume.usd;
                        const raisedToken = market_data.raised_token || 0; // Placeholder for raised_token (CoinGecko does not provide this directly)

                        return {
                            id,
                            name,
                            image: image.small,
                            market_cap: marketCap,
                            raised_token: raisedToken,
                            trading_volume: tradingVolume,
                        };
                    })
                );

                setTokens(fetchedTokens);
                setLoading(false);
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
        return <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="flex flex-col items-center space-y-4">
                <img src={logo} alt="Loading Logo" className="w-24 h-24 animate-spin-slow" />
                <span className="text-lg text-gray-700 font-semibold">Loading...</span>
            </div>
        </div>;
    }

    const formatNumber = (num) => {
        return num.toLocaleString();
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
                        <th className="px-6 py-4 text-left font-semibold text-purple-200">Trading Volume</th>
                    </tr>
                </thead>

                <tbody className="text-purple-700">
                    {tokens.map((token, index) => (
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
                            <td className="px-3 py-2 text-purple-500">${formatNumber(token.trading_volume)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TradingVolume;
