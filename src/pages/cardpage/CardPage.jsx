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
import Video from '../../components/Video/Video';
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

  console.log({ poolDetailsParsed })

  return (

    <div className="slidersection">
      <div className="container">
        <div className='row'>

          <div className='col-md-3'>
            {/* Token Info */}
            <div className='boxc'>
              <span class="socialicon">
                <a href={poolDetailsParsed.Website} target='_blank'><i class="fa fa-globe"></i></a>
                <a href={poolDetailsParsed.Twitter} target='_blank'><i class="fa fa-twitter"></i></a>
                <a href={poolDetailsParsed.Telegram} target='_blank'><i class="fa fa-telegram"></i></a>
              </span>
              <p>{poolDetailsParsed.description}</p>
              <hr className='separetar'></hr>
              <div className="tokeninfo">
                <h3 className="text-xl font-semibold text-gray-800">Token Info</h3>
                <TokenInfo details={poolDetailsParsed} data={data[0].result} reserve={data[1].result} />
              </div>
              <hr className='separetar'></hr>
              <div className='tokenomic'>
                <h3 className="text-xl font-semibold text-gray-800">Tokenomic</h3>
                <img className="h-50 rounded" src="/images/chart.png" alt="Token image" />

              </div>
            </div>
          </div>

          <div className='col-md-6'>

            <div className='boxc tpllogo'>
              <div className='row detaillogo'>
                <div className='col-md-3'>
                  <img className="w-20 h-50 rounded" src={poolDetailsParsed?.image} alt="Token image" />
                </div>
                <div className='col-md-9 lgs'>
                  <h1 className='tokenname'>Bullforce Token</h1>
                </div>
              </div>
            </div>
            {poolDetailsParsed?.video && (
              <Video link={poolDetailsParsed?.video }/>
            )}
            <div className='boxc AllTransactions'>
              <TradeEventList contractAddress={token} tx={txDone} />
            </div>
          </div>

          <div className='col-md-3'>
            <div className='boxc'>

              <p>Bonding Curve Progress (0.32%)</p>
              <div class="progress">
                <div class="progress-bar" role="progressbar" style={{ width: '25%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
              </div>
              <p>When the market cap hits $79.4K, All liquidity from the bonding curve will be deposited into Pancake Swap and burned. The progression accelerates as the price rises</p>

              <BuySell data={data[0].result} token={token} setTxDone={setTxDone} tokenBalance={tokenBalance} reserve={data[1].result} />
            </div>
            <div className='chartbox' style={{ width: '100%' }}>
              <Line data={chartData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
