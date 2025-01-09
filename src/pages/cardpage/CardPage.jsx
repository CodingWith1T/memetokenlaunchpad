import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import abi from "../../helper/ManagerFaucetAbi.json";
import TokenABi from "../../helper/TokenAbi.json"
import DegenFacetabi from "../../helper/DegenFacetAbi.json";
import { daimond } from '../../helper/Helper';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useReadContract } from 'wagmi';
import logo from "../../assets/logo/logo.png";
import { readContract, writeContract } from 'wagmi/actions';
import { config } from '../../wagmiClient';
import TradeEventList from '../../components/Statistics/TradeEventList';

// Registering necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CardPage = () => {
  const { chain, token } = useParams();  // Get the token passed via state
  // Check if token exists, and render details based on the passed token
  if (!token) {
    return <div className="flex justify-center items-center h-screen">Card not found</div>;  // Fallback if no token is passed
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

  const { data, error, isLoading } = useReadContract({
    abi,
    address: daimond,
    functionName: 'getPoolInfo',
    args: [token], // Passing `id` as argument to the contract function
    chainId: 97
  });

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

  // State for amount input and countdown
  const [amount, setAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // For countdown timer
  const [isSaleAvailable, setIsSaleAvailable] = useState(false);
  const [approve, setApprove] = useState(0);

  // Handle Buy Button Logic
  const handleBuy = async () => {

    // Ensure 'token' and 'amount' are valid
    if (!token || !amount) {
      console.error('Invalid token or amount');
      return;
    }

    try {
      const amoutOut = await readContract(config, {
        abi: DegenFacetabi,
        address: daimond,
        functionName: 'getAmountOut',
        chainId: 97,
        args: [
          token,
          amount * 10 ** 18,
          true,
        ],
      });

      const buy = await writeContract(config, {
        address: daimond,
        abi: DegenFacetabi,
        functionName: 'buy',
        chainId: 97,
        args: [
          token,
          "0x0000000000000000000000000000000000000000",
          amount * 10 ** 18,
          amoutOut[0],
          [],
        ],
        value: amount * 10 ** 18
      });

    } catch (error) {
      console.error('Error calling contract:', error);
    }
  };

  const handleApprove = async () => {
    // Ensure 'token' and 'amount' are valid
    if (!token || !amount) {
      console.error('Invalid token or amount');
      return;
    }

    try {

      const amoutOut = await readContract(config, {
        abi: DegenFacetabi,
        address: daimond,
        functionName: 'getAmountOut',
        chainId: 97,
        args: [
          token,
          amount * 10 ** 18,
          true,
        ],
      });

      const approve = await writeContract(config, {
        address: token,
        abi: TokenABi,
        functionName: 'approve',
        chainId: 97,
        args: [
          daimond,
          amount * 10 ** 18,
        ],
      });

      setApprove(amount)

    } catch (error) {
      console.log(error)
    }
  }

  // Handle Sell Button Logic
  const handleSell = async () => {

    if (!token || !amount) {
      console.error('Invalid token or amount');
      return;
    }

    try {
      const amoutOut = await readContract(config, {
        abi: DegenFacetabi,
        address: daimond,
        functionName: 'getAmountOut',
        chainId: 97,
        args: [
          token,
          approve * 10 ** 18,
          true,
        ],
      });

      console.log([
        daimond,
        approve * 10 ** 18,
      ])

      console.log([
        token,
        "0x0000000000000000000000000000000000000000",
        approve * 10 ** 18,
        amoutOut[0],
      ])

      const sell = await writeContract(config, {
        address: daimond,
        abi: DegenFacetabi,
        functionName: 'sell',
        chainId: 97,
        args: [
          token,
          "0x0000000000000000000000000000000000000000",
          approve * 10 ** 18, 
          BigInt(Math.floor(Number(approve) * 0.9)),   
        ],

        

      });

      setApprove(0)

    } catch (error) {
      console.error('Error calling contract:', error);
    }
  };

  // Destructuring the fetched data from the contract
  const { id: poolDetails, startTime: rawStartTime } = data || {};
  const poolDetailsParsed = poolDetails ? JSON.parse(poolDetails) : {};
  const startTime = rawStartTime
    ? (typeof rawStartTime === 'bigint' ? Number(rawStartTime) : Math.floor(new Date(rawStartTime).getTime() / 1000))
    : 0;

  useEffect(() => {
    // Calculate the time difference between now and the start time
    const interval = setInterval(() => {
      const currentTime = Math.floor(new Date().getTime() / 1000); // Current time in seconds
      const difference = startTime - currentTime;

      if (difference <= 0) {
        setIsSaleAvailable(true); // Show Buy/Sell buttons when the start time has passed
        clearInterval(interval); // Stop the countdown when the sale starts
      } else {
        // Calculate the time left in days, hours, minutes, seconds
        const days = Math.floor(difference / (24 * 3600)); // 1 day = 24 hours = 24 * 3600 seconds
        const hours = Math.floor((difference % (24 * 3600)) / 3600);
        const minutes = Math.floor((difference % 3600) / 60);
        const seconds = Math.floor(difference % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [startTime])

  if (isLoading) {
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
  return (
    <div className="container px-4 px-lg-5 mx-auto">
      {/* Header Section */}
      <div className="flex justify-center items-center py-5 border-b">
        <div className="flex items-center">
          <img
            className="w-20 h-50 rounded"
            src={JSON.parse(data?.poolDetails).image}
            alt="image"
          />
          <div className="ml-4">
            <h1 className="text-3xl font-semibold text-gray-900">{data?.name}</h1>
            <p className="text-lg text-gray-600">{data?.symbol}</p>
          </div>
        </div>

        {/* Buy Token Button */}
        {/* <div>
          <Link
            to="/card-page/buy-token"
            className="bg-gold font-bold text-white px-6 py-3 rounded-lg hover:bg-gold-700 transition duration-300"
          >
            Buy Token / Sell Token
          </Link>
        </div> */}
      </div>

      {/* Token Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Token Info</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li><strong>Name:</strong> {JSON.parse(data?.poolDetails).name}</li>
            <li><strong>Symbol:</strong> {JSON.parse(data?.poolDetails).symbol}</li>
            <li><strong>Description</strong>  {JSON.parse(data?.poolDetails).description}</li>
            <li><strong>Tag:</strong> {JSON.parse(data?.poolDetails)?.Tag}</li>

          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Contract Info</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            {/* <li>
              <Link
                to={`https://etherscan.io/address/${data?.walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:underline"
              >
                View on Etherscan
              </Link>
            </li> */}
            <li>
              <strong> Token Address:

                <Link
                  to={`https://testnet.bscscan.com/token/${data?.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-gray-500 hover:underline hover:text-gold"
                >{data?.token ? `${data.token.slice(0, 10)}...${data.token.slice(-9)}` : ''}
                </Link>
              </strong>

            </li>
            <li><strong>Start Time:</strong> {data?.startTime ? new Date(Number(data.startTime) * 1000).toLocaleString() : 'N/A'}</li>

          </ul>
        </div>

        {/* Buy/Sell Section or Countdown */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">{isSaleAvailable ? "Buy / Sell Token" : ""}</h2>
          <div className="mt-4">
            {isSaleAvailable ? (
              <>
                {/* Buy/Sell Buttons */}
                <div className="mb-4">
                  <label className="block text-gray-600">Amount of {JSON.parse(data?.poolDetails).symbol}</label>
                  <input
                    type="number"
                    className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter amount in ${JSON.parse(data?.poolDetails).symbol}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="flex justify-between space-x-4">
                  <button className="w-full bg-gold text-white py-3 rounded-lg hover:bg-gold transition duration-300" onClick={() => handleBuy()}>
                    Buy Token
                  </button>
                  {approve == 0 &&
                    <button className="w-full bg-gray-500 text-white py-3 rounded-lg  transition duration-300" onClick={() => handleApprove()}>
                      Approve
                    </button>}
                  {approve > 0 &&
                    <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300" onClick={() => handleSell()}>
                      Sell {approve}
                    </button>}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center bg-gold from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg w-full max-w-xs mx-auto">
                <h2 className="text-2xl font-semibold text-white mb-4">Sale Starts In</h2>
                <div className="flex space-x-4 mb-4">
                  {timeLeft && timeLeft.split(' ').length === 4 && (
                    <>
                      <div className="text-center text-white">
                        <p className="text-lg font-bold">{timeLeft.split(' ')[0]}</p>
                        <span className="text-sm">Days</span>
                      </div>
                      <div className="text-center text-white">
                        <p className="text-lg font-bold">{timeLeft.split(' ')[1]}</p>
                        <span className="text-sm">Hours</span>
                      </div>
                      <div className="text-center text-white">
                        <p className="text-lg font-bold">{timeLeft.split(' ')[2]}</p>
                        <span className="text-sm">Minutes</span>
                      </div>
                      <div className="text-center text-white">
                        <p className="text-lg font-bold">{timeLeft.split(' ')[3]}</p>
                        <span className="text-sm">Seconds</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{
                      width: `${(100 * (startTime - Math.floor(new Date().getTime() / 1000))) / startTime}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Token Chart Section */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">Token Price Chart : Recent</h2>
        <TradeEventList/>
      </div>

      {/* Additional Info or Activity Section */}
      {/* <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
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
      </div> */}
    </div>
  );
};

export default CardPage;
