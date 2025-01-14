import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import abi from "../../helper/ManagerFaucetAbi.json";
import TokenABi from "../../helper/TokenAbi.json";
import DegenFacetabi from "../../helper/DegenFacetAbi.json";
import { daimond } from '../../helper/Helper';
import { useAccount, useReadContract } from 'wagmi';
import logo from "../../assets/logo/logo.png";
import TradeEventList from '../../components/Statistics/TradeEventList';
import { config } from '../../wagmiClient';
import { formatUnits } from 'ethers';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
const CardPage = () => {
  const { token } = useParams();

  if (!token) {
    return <div className="flex justify-center items-center h-screen">Card not found</div>;
  }

  const { data, error, isLoading } = useReadContract({
    abi,
    address: daimond,
    functionName: 'getPoolInfo',
    args: [token],
    chainId: 97,
  });

  const { chain } = useAccount();

  const [amount, setAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSaleAvailable, setIsSaleAvailable] = useState(false);
  const [approve, setApprove] = useState(0);
  const [amountOut, setAmountOut] = useState([0n, 0n, 0n, 0n, 0n]);
  const [isBuy, setIsBuy] = useState(true);
  const [txDone, setTxDone] = useState(0);

  const startTime = data?.startTime ? Math.floor(Number(data.startTime) / 1000) : 0;

  // ** Hook 1: Calculate timeLeft for sale countdown **
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const difference = startTime - currentTime;

      if (difference <= 0) {
        setIsSaleAvailable(true);
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (24 * 3600));
        const hours = Math.floor((difference % (24 * 3600)) / 3600);
        const minutes = Math.floor((difference % 3600) / 60);
        const seconds = Math.floor(difference % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // ** Hook 2: Fetch amountOut value based on amount and isBuy **
  useEffect(() => {
    if (amount <= 0 || !token) return; // Prevent fetching if amount is invalid
    fetchAmountOut(amount);
  }, [amount, isBuy, token]);

  const fetchAmountOut = async (inputAmount) => {
    try {
      const result = await readContract(config, {
        abi: DegenFacetabi,
        address: daimond,
        functionName: 'getAmountOut',
        chainId: 97,
        args: [
          token,
          BigInt(inputAmount * 10 ** 18),
          isBuy,
        ],
      });
      setAmountOut(result);
    } catch (error) {
      console.error('Error fetching amountOut:', error);
      setAmountOut([0n, 0n, 0n, 0n, 0n]);
    }
  };

  const handleBuy = async () => {
    if (!token || !amount) return;

    try {
      const data = await writeContract(config, {
        address: daimond,
        abi: DegenFacetabi,
        functionName: 'buy',
        chainId: 97,
        args: [
          token,
          "0x0000000000000000000000000000000000000000",
          BigInt(amount * 10 ** 18),
          amountOut[0],
          [],
        ],
        value: BigInt(amount * 10 ** 18),
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: data,
      })
      setTxDone((prev) => prev + 1);
    } catch (error) {
      console.error('Error during buy:', error);
    }
  };

  const handleApprove = async () => {
    if (!token || !amount) return;

    try {
      const data = await writeContract(config, {
        address: token,
        abi: TokenABi,
        functionName: 'approve',
        chainId: 97,
        args: [
          daimond,
          BigInt(amount * 10 ** 18),
        ],
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: data,
      })
      setApprove(amount);
    } catch (error) {
      console.log('Error during approve:', error);
    }
  };

  const handleSell = async () => {
    if (!token || !approve) return;

    try {
      const data = await writeContract(config, {
        address: daimond,
        abi: DegenFacetabi,
        functionName: 'sell',
        chainId: 97,
        args: [
          token,
          "0x0000000000000000000000000000000000000000",
          BigInt(approve * 10 ** 18),
          amountOut[0],
        ],
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: data,
      })
      setApprove(0);
      setTxDone((prev) => prev + 1);
    } catch (error) {
      console.error('Error during sell:', error);
    }
  };

  if (isLoading) {
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
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <span className="text-lg text-red-600 font-semibold">Error fetching data: {error.message}</span>
      </div>
    );
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen">Data not available</div>;
  }
  console.log({ data })

  const poolDetailsParsed = data?.poolDetails ? JSON.parse(data.poolDetails) : {};
  const baseReserve = Number(data.virtualBaseReserve) / (10 ** 18);
  const quoteReserve = Number(data.virtualQuoteReserve) / (10 ** 18);
  const maxSupply = Number(data.maxListingBaseAmount) / (10 ** 18);

  const prices = [];
  const supplies = [];

  // Generate price points based on bonding curve
  for (let supply = 1; supply <= maxSupply; supply += maxSupply / 1000) {
    const adjustedBaseReserve = baseReserve + supply;
    const price = quoteReserve / adjustedBaseReserve;
    prices.push(price * (10 ** 9));
    supplies.push(supply);
  }
  console.log({ prices, supplies })
  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
  const chartData = {
    labels: supplies,
    datasets: [
      {
        label: 'Price vs. Supply',
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Bonding Curve',
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: `Supply in ${chain?.nativeCurrency?.symbol ?? 'BNB'}`,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price in Gwei',
        },
      },
    },
  };


  return (
    <div className="container px-4 px-lg-5 mx-auto">
      <div className="flex justify-center items-center py-5 border-b">
        <div className="flex items-center">
          <img className="w-20 h-50 rounded" src={poolDetailsParsed?.image} alt="Token image" />
        </div>
      </div>

      {/* Token Info */}
      <div className="buybox grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        {/* Token Information Card */}
        <div className="boxc bg-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">Token Info</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li><strong>Name:</strong> {poolDetailsParsed.name}</li>
            <li><strong>Symbol:</strong> {poolDetailsParsed.symbol}</li>
            <li><strong>Description:</strong> {poolDetailsParsed.description}</li>
            <li><strong>Tag:</strong> {poolDetailsParsed.Tag}</li>
          </ul>
        </div>

        {/* Contract Information Card */}
        <div className="boxc bg-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">Contract Info</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li>
              <strong>Token Address:
                <a
                  href={`https://testnet.bscscan.com/token/${data?.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-gray-500 hover:underline hover:text-gold"
                >
                  {data?.token ? `${data.token.slice(0, 10)}...${data.token.slice(-9)}` : ''}
                </a>
              </strong>
            </li>
            <li><strong>Start Time:</strong> {data?.startTime ? new Date(Number(data.startTime) * 1000).toLocaleString() : 'N/A'}</li>
          </ul>
        </div>

        {/* Buy/Sell Section or Countdown */}
        <div className="boxc bg-white p-6 rounded-lg">
          <div className="mt-4 buysell">
            {isSaleAvailable ? (
              <>
                <div className="btngroup flex mb-6">
                  <button
                    className={`buy px-6 py-3 text-white text-md font-semibold rounded-lg transition duration-300 w-full ${!isBuy ? '' : 'bg-gold'}`}
                    onClick={() => setIsBuy(true)}>
                    <h2>Buy Token</h2>
                  </button>
                  <button
                    className={`sell px-6 py-3 text-white text-md font-semibold rounded-lg  transition duration-300 w-full ${isBuy ? '' : 'bg-gold'}`}
                    onClick={() => setIsBuy(false)}>
                    <h2>Sell Token</h2>
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600">
                    Amount of {isBuy ? (chain?.nativeCurrency?.symbol || "Currency") : poolDetailsParsed.symbol}
                  </label>

                  <input
                    type="number"
                    className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter amount in ${poolDetailsParsed.symbol}`}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="0"
                  />
                </div>

                <div className="text-black">
                  {isBuy ? (
                    <p>Buy Tax: <span className='receivedvalu'>{parseInt(data?.buyFeeRate)}%</span></p>
                  ) : (
                    <p>Sell Tax: <span className='receivedvalu'>{parseInt(data?.sellFeeRate)}%</span></p>
                  )}
                  <p> Received : <span className='receivedvalu'>{formatUnits(amountOut[0], 18)} </span></p>
                  <p> Min Received : <span className='receivedvalu'>
                    {isBuy ?
                      formatUnits(amountOut[1], 18) * (1 - parseInt(data?.buyFeeRate) / 100) :
                      formatUnits(amountOut[1], 18) * (1 - parseInt(data?.sellFeeRate) / 100)
                    }
                  </span></p>
                </div>
                <div className="flex justify-between space-x-4">
                  {isBuy ? (
                    <button
                      className="lasstbutton w-full bg-gold text-white py-3 rounded-lg hover:bg-gold transition duration-300"
                      onClick={handleBuy}
                    >
                      Buy Token
                    </button>
                  ) : (
                    <>
                      {approve === 0 && (
                        <button
                          className="lasstbutton w-full bg-gray-500 text-white py-3 rounded-lg transition duration-300"
                          onClick={handleApprove}
                        >
                          Approve
                        </button>
                      )}
                      {approve > 0 && (
                        <button
                          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
                          onClick={handleSell}
                        >
                          Sell {approve}
                        </button>
                      )}
                    </>
                  )}
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
                <div className="w-full bg-white rounded-lg py-3 px-6 text-center text-black">
                  <p className="text-lg font-semibold">Sale will begin soon!</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <div className="buybox grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 mt-8">
        <TradeEventList contractAddress={token} tx={txDone} />
        <div style={{ width: '100%', height: '400px' }}>
          <Line data={chartData} options={options} />
        </div>
      </div>

    </div>
  );
};

export default CardPage;
