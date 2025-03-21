import { useAccount, usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';
import { getBlockNumber } from '@wagmi/core'

// ABI fragment for the Trade event
const tradeEventAbi = {
  "anonymous": false,
  "inputs": [
    { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
    { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
    { "indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "amountOut", "type": "uint256" },
    { "indexed": false, "internalType": "bool", "name": "isBuy", "type": "bool" },
    { "indexed": false, "internalType": "uint256", "name": "baseReserve", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "quoteReserve", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
  ],
  "name": "Trade",
  "type": "event"
};

// React hook to fetch Trade events
export function useTradeEvents(contractAddress) {
  const publicClient = usePublicClient();

  const fetchEvents = async () => {

    const blockNumber = await getBlockNumber(config)
    const logs = await publicClient.getLogs({
      address: contractAddress,
      event: tradeEventAbi, // Use the correct ABI here
      fromBlock: blockNumber - 50000n, // Starting block
      toBlock: blockNumber, // Fetch logs up to the latest block
    });

    return logs.map((log) => ({
      token: log.args.token,
      user: log.args.user,
      amountIn: log.args.amountIn.toString(),
      amountOut: log.args.amountOut.toString(),
      isBuy: log.args.isBuy,
      baseReserve: log.args.baseReserve.toString(),
      quoteReserve: log.args.quoteReserve.toString(),
      timestamp: Number(log.args.timestamp) * 1000,
      transactionHash: log.transactionHash,
    }));
  };

  return { fetchEvents };
}

// Usage Example in a Component
import React, { useEffect, useState } from 'react';
import { config } from '../../wagmiClient';
import { Link } from 'react-router-dom';

function TradeEventList({ contractAddress }) {
  const { address } = useAccount();
  const { fetchEvents } = useTradeEvents(contractAddress);
  const [tradeEvents, setTradeEvents] = useState([]);
  const [allYour, setAllYour] = useState(false)

  useEffect(() => {
    const getEvents = async () => {
      const events = await fetchEvents();
      setTradeEvents(events);
    };
    getEvents();
  }, [fetchEvents]);

  return (
    <div className='pricetabel'>
      {/* Buttons for All/Your Transactions */}
      <div className="btngroup flex mb-6 space-x-4">
        <button
          className="px-6 py-3 bg-gray-600 text-white text-md font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-300"
          onClick={() => setAllYour(false)}
        >
          <h2>All Transactions</h2>
        </button>
        <button
          className="px-6 py-3 bg-gold text-white text-md font-semibold rounded-lg shadow-md hover:bg-gold-500 transition duration-300"
          onClick={() => setAllYour(true)}
        >
          <h2>Your Transactions</h2>
        </button>
      </div>

      {/* Table to display Trade Events */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
        <table className="pricechart min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-gray-700 font-semibold">Token</th>
              <th className="py-3 px-6 text-gray-700 font-semibold">Type</th>
              <th className="py-3 px-6 text-gray-700 font-semibold">Age (Days)</th>
              <th className="py-3 px-6 text-gray-700 font-semibold">Transaction Hash</th>
            </tr>
          </thead>
          <tbody className="max-h-[300px] overflow-y-auto">
            {!allYour
              ? tradeEvents.map((event, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-6 text-gray-800">{event.token}</td>
                  <td className="py-3 px-6">{event.isBuy ? 'Buy' : 'Sell'}</td>
                  <td className="py-3 px-6">
                    {Math.floor((new Date() - event.timestamp) / (1000 * 60 * 60 * 24))}
                  </td>
                  <td className="py-3 px-6">
                    <Link
                      to={`/transaction/${event.transactionHash}`}
                      className="hover:underline"
                    >
                      {event.transactionHash}
                    </Link>
                  </td>
                </tr>
              ))
              : tradeEvents
                .filter((event) => event.user === address) // Filter events by the user's address
                .map((event, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-6 text-gray-800">{event.token}</td>
                    <td className="py-3 px-6">{event.isBuy ? 'Buy' : 'Sell'}</td>
                    <td className="py-3 px-6">
                      {Math.floor((new Date() - event.timestamp) / (1000 * 60 * 60 * 24))}
                    </td>
                    <td className="py-3 px-6">
                      <Link
                        to={`/transaction/${event.transactionHash}`}
                        className="text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        {event.transactionHash}
                      </Link>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TradeEventList;
