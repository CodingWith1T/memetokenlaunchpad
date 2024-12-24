import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy fallback data in case the API fails
const dummyData = [
  {
    id: 1,
    image: 'https://via.placeholder.com/400',
    chainName: 'Ethereum',
    rise: 5.6,
    walletAddress: '0x1234...abcd',
    tokenName: 'Token A',
    tokenSymbol: 'TKA',
    description: 'Token A is a decentralized token built on Ethereum with a focus on fast transactions and secure contract execution.',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/400',
    chainName: 'Binance Smart Chain',
    rise: -2.4,
    walletAddress: '0x5678...efgh',
    tokenName: 'Token B',
    tokenSymbol: 'TKB',
    description: 'Token B is an innovative DeFi token on the Binance Smart Chain with high yield farming options.',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/400',
    chainName: 'Polygon',
    rise: 3.2,
    walletAddress: '0x9876...ijkl',
    tokenName: 'Token C',
    tokenSymbol: 'TKC',
    description: 'Token C leverages Polygon for scaling and is designed to support decentralized applications with low fees.',
  }
];

const NonListed = () => {
  const [data, setData] = useState([]); // Data state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state

  const itemsPerPage = 10; // Number of items per page
  const navigate = useNavigate(); // React Router hook for navigation

  // Fetch data when the component is mounted or when currentPage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${itemsPerPage}&page=${currentPage}`
        );

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const realData = await response.json();
        const totalItems = 100; // Assume total items for now
        const totalPagesCalculated = Math.ceil(totalItems / itemsPerPage);
        setTotalPages(totalPagesCalculated);

        const transformedData = realData.map((coin) => ({
          id: coin.id,
          image: coin.image,
          chainName: coin.platform ? coin.platform.name : 'Ethereum', // Fallback to Ethereum if platform is not available
          rise: coin.price_change_percentage_24h,
          walletAddress: '0x' + Math.random().toString(16).slice(2, 18), // Random wallet address for demo
          tokenName: coin.name,
          tokenSymbol: coin.symbol.toUpperCase(),
          description: `${coin.name} is a popular cryptocurrency.`,
        }));

        setData(transformedData);
      } catch (error) {
        console.error('Error fetching token data:', error);
        setError(error.message);
        setData(dummyData); // Fallback to dummy data in case of failure
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Navigate to the CardPage with item data passed through state
  const handleCardClick = (item) => {
    navigate('/card-page', { state: { item } });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-14">Error: {error}</div>;
  }

  return (
    <div>
      <div className="cardbox grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="max-w-xs bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => handleCardClick(item)} // On card click, navigate to /card-page
          >
            {/* Card Image Section */}
            <div className="h-40 bg-gray-300 overflow-hidden">
              <img
                src={item.image || 'https://via.placeholder.com/400'}
                alt={item.tokenName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card Content Section */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-purple-700">{item.chainName}</span>
                <span className={`text-sm font-bold ${item.rise > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.rise.toFixed(2)}%
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Created by: </span>
                <span className="text-purple-600">{item.walletAddress}</span>
              </div>

              <div className="font-medium text-lg text-purple-700">{item.tokenName}</div>
              <div className="text-sm text-gray-500 mb-2">{item.tokenSymbol}</div>
              <p className="text-gray-600 text-xs line-clamp-3">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="pagination flex justify-center items-center py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1">{currentPage} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NonListed;
