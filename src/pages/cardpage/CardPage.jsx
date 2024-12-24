import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CardPage = () => {
  // Use location to access the passed state from the clicked card
  const location = useLocation();
  const { item } = location.state || {};  // Get the item passed via state

  // Check if item exists, and render details based on the passed item
  if (!item) {
    return <div className="flex justify-center items-center h-screen">Card not found</div>;  // Fallback if no item is passed
  }

  // Sample price data for the chart (you can replace this with actual data from an API or state)
  const priceData = {
    labels: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'], // Time or other labels
    datasets: [
      {
        label: 'Token Price',
        data: [5.0, 5.2, 4.8, 5.3, 5.1, 5.4], // Example prices
        borderColor: '#4e73df', // Line color
        backgroundColor: 'rgba(78, 115, 223, 0.2)', // Background under the line
        fill: true, // Fill the area under the line
        tension: 0.4, // Line smoothing
        borderWidth: 2, // Line thickness
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `$${context.raw}`; // Format tooltips with the price
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time', // X-Axis label
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)', // Y-Axis label
        },
        beginAtZero: false, // Y-Axis starting point
      },
    },
  };

  return (
    <div className="container px-4 px-lg-5 mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center py-5 border-b">
        <div className="flex items-center">
          <img
            className="w-20 h-20 rounded-full"
            src={item.image}
            alt={item.tokenName}
          />
          <div className="ml-4">
            <h1 className="text-3xl font-semibold text-gray-900">{item.tokenName}</h1>
            <p className="text-lg text-gray-600">{item.tokenSymbol}</p>
          </div>
        </div>

        {/* Buy Token Button */}
        <div>
          <Link
            to="/card-page/buy-token"
            className="bg-gold font-bold text-white px-6 py-3 rounded-lg hover:bg-gold-700 transition duration-300"
          >
            Buy Token / Sell Token
          </Link>
        </div>
      </div>

      {/* Token Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Token Info</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li><strong>Price:</strong> ${item.price}</li>
            <li><strong>Market Cap:</strong> ${item.marketCap}</li>
            <li><strong>24h Change:</strong> {item.rise}%</li>
            <li><strong>Total Supply:</strong> {item.totalSupply}</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Social Links</h2>
          <div className="mt-4 flex space-x-4">
            <Link to={`https://twitter.com/${item.twitter}`} className="text-blue-500 hover:underline">
              Twitter
            </Link>
            <Link to={`https://discord.com/${item.discord}`} className="text-blue-500 hover:underline">
              Discord
            </Link>
            <Link to={`https://telegram.me/${item.telegram}`} className="text-blue-500 hover:underline">
              Telegram
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Contract Info</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li>
              <Link
                to={`https://etherscan.io/address/${item.walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View on Etherscan
              </Link>
            </li>
            <li>
              <strong>Contract Address:</strong> {item.walletAddress}
            </li>
          </ul>
        </div>
      </div>

      {/* Token Chart Section */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">Token Price Chart</h2>
        <div className="mt-4" style={{ height: '400px' }}>
          <Line data={priceData} options={chartOptions} />
        </div>
      </div>

      {/* Additional Info or Activity Section */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        <div className="mt-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <span className="text-gray-800">Purchased 1000 Tokens</span>
            </div>
            <div className="text-gray-600">Dec 20, 2024</div>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <span className="text-gray-800">Staked 500 Tokens</span>
            </div>
            <div className="text-gray-600">Dec 19, 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
