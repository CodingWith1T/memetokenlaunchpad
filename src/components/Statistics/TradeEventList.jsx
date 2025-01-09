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
    <div>
      <div className="btn">
        <button onClick={() => setAllYour(false)}>
          <h2>All Transactions</h2>
        </button>
        <button onClick={() => setAllYour(true)}>
          <h2>Your Transactions</h2>
        </button>
      </div>

      {!allYour ? (
        <div>
          <ul>
            {tradeEvents.map((event, index) => (
              <li key={index}>
                <strong>Token:</strong> {event.token} <br />
                <strong>Is Buy:</strong> {event.isBuy ? 'Buy' : 'Sell'} <br />
                <strong>Age:</strong> {Math.floor((new Date() - event.timestamp )/(1000 * 60 * 60 * 24))} Days<br />
                <Link to={`/transaction/${event.transactionHash}`}>
                  <strong>Transaction Hash:</strong> {event.transactionHash}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <ul>
            {tradeEvents
              .filter(event => event.user === address)  // Filter events by the user's address
              .map((event, index) => (
                <li key={index}>
                  <strong>Token:</strong> {event.token} <br />
                  <strong>Is Buy:</strong> {event.isBuy ? 'Buy' : 'Sell'} <br />
                  <strong>Age:</strong> {Math.floor((new Date() - event.timestamp )/(1000 * 60 * 60 * 24))} Days <br />
                  <Link to={`/transaction/${event.transactionHash}`}>
                    <strong>Transaction Hash:</strong> {event.transactionHash}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TradeEventList;
