import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { readContract } from 'wagmi/actions';
import abi from "../../helper/ManagerFaucetAbi.json";
import DegenFacetabi from "../../helper/DegenFacetAbi.json";
import { daimond } from '../../helper/Helper';
import TokenAbi from '../../helper/TokenAbi.json';
import { useAccount, useReadContract } from 'wagmi';
import logo from "../../assets/logo/logo.png";
import TradeEventList from '../../components/Statistics/TradeEventList';
import { config } from '../../wagmiClient';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import BuySell from '../../components/BuySell/BuySell';
import { useEffect } from 'react';
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

  const { chain, address } = useAccount();

  const [amountOut, setAmountOut] = useState([0n, 0n, 0n, 0n, 0n]);
  const [isBuy, setIsBuy] = useState(true);
  const [txDone, setTxDone] = useState(0);
  const [balanceOf, setBalaceOf] = useState(0);

  const startTime = data?.startTime ? Math.floor(Number(data.startTime) / 1000) : 0;

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
    } catch (error) {
      console.error('Error fetching amountOut:', error);
      setAmountOut([0n, 0n, 0n, 0n, 0n]);
    }
  };

  const fetchBalaceOf = async () => {
    try {
      const result = await readContract(config, {
        abi: TokenAbi,
        address: token,
        functionName: 'balanceOf',
        chainId: 97,
        args: [
          address,
        ],
      });
      setBalaceOf(result)
    } catch (error) {
      console.error('Error fetching amountOut:', error);
      setAmountOut([0n, 0n, 0n, 0n, 0n]);
    }
  };


  useEffect(() => {
    fetchBalaceOf();
  }, [address]);

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

  let routerText = '';
  if (data?.router === '0xD99D1c33F9fC3444f8101754aBC46c52416550D1') {
    routerText = 'Pancake Swap';
  } else if (data?.router === '0xda8e9632c013c9d6a5fbabac9e2ecdf69706a306') {
    routerText = 'How Swap';
  }

  console.log({data})

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
            <li><strong>Router:</strong> {routerText}</li>
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
            <li>
              <strong>Website :
                <a
                  href={poolDetailsParsed.Website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-gray-500 hover:underline hover:text-gold"
                >
                  {poolDetailsParsed.Website}
                </a>
              </strong>
            </li>
            <li>
              <strong>Twitter :
                <a
                  href={poolDetailsParsed.Twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-gray-500 hover:underline hover:text-gold"
                >
                  {poolDetailsParsed.Twitter}
                </a>
              </strong>
            </li>
            <li>
              <strong>Telegram :
                <a
                  href={poolDetailsParsed.Telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-gray-500 hover:underline hover:text-gold"
                >
                  {poolDetailsParsed.Telegram}
                </a>
              </strong>
            </li>
            <li><strong>Start Time:</strong> {data?.startTime ? new Date(Number(data.startTime) * 1000).toLocaleString() : 'N/A'}</li>
          </ul>
        </div>

        {/* Buy/Sell Section or Countdown */}
        <div className="boxc bg-white p-6 rounded-lg">
          <BuySell data={data} token={token} balanceOf={balanceOf}/>
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
