import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { readContract } from 'wagmi/actions';
import abi from "../../helper/ManagerFaucetAbi.json";
import DegenFacetabi from "../../helper/DegenFacetAbi.json";
import { daimond } from '../../helper/Helper';
import TokenAbi from '../../helper/TokenAbi.json';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import logo from "../../assets/logo/logo.png";
import TradeEventList from '../../components/Statistics/TradeEventList';
import { config } from '../../wagmiClient';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import BuySell from '../../components/BuySell/BuySell';
import { useEffect } from 'react';
import TokenInfo from '../../components/TokenInfo/TokenInfo';
const CardPage = () => {
  const { token } = useParams();

  if (!token) {
    return <div className="flex justify-center items-center h-screen">Card not found</div>;
  }

  const { data, error, isLoading } = useReadContracts({
    contracts: [{
      abi,
      address: daimond,
      functionName: 'getPoolInfo',
      args: [token],
    }, {
      abi,
      address: daimond,
      functionName: 'getPoolConfig',
      args: [20],

    }]
  });
  console.log({ data })
  const { chain, address } = useAccount();
  const [txDone, setTxDone] = useState(0);
  const [tokenBalance, setTokenBalace] = useState(0);

  const fetchBalaceOf = async () => {
    try {
      const result = address ? await readContract(config, {
        abi: TokenAbi,
        address: token,
        functionName: 'balanceOf',
        chainId: 97,
        args: [
          address,
        ],
      }) : 0;
      setTokenBalace(result)
    } catch (error) {
      console.error('Error fetching balance:', error);
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

  const poolDetailsParsed = data[0].result.poolDetails ? JSON.parse(data[0].result.poolDetails) : {};
  const baseReserve = Number(data[0].result.virtualBaseReserve) / (10 ** 18);
  const quoteReserve = Number(data[0].result.virtualQuoteReserve) / (10 ** 18);
  const maxSupply = Number(data[0].result.maxListingBaseAmount) / (10 ** 18);

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
        <TokenInfo details={poolDetailsParsed} data={data[0].result} reserve={data[1].result}/>

        {/* Contract Information Card */}
        <div className="boxc bg-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">Contract Info</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li>
              <strong>Token Address:
                <a
                  href={`https://testnet.bscscan.com/token/${data[0].result.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-gray-500 hover:underline hover:text-gold"
                >
                  {data[0].result.token ? `${data[0].result.token.slice(0, 10)}...${data[0].result.token.slice(-9)}` : ''}
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
            <li><strong>Start Time:</strong> {data[0].result.startTime ? new Date(Number(data[0].result.startTime) * 1000).toLocaleString() : 'N/A'}</li>
          </ul>
        </div>

        {/* Buy/Sell Section or Countdown */}
        <div className="boxc bg-white p-6 rounded-lg">
          <BuySell data={data[0].result} token={token} setTxDone={setTxDone} tokenBalance={tokenBalance} reserve={data[1].result}/>
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
