import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests
import './Marquee.css';

const Marquee = () => {
  // Set up state to store prices
  const [prices, setPrices] = useState({
    bitcoin: null,
    ethereum: null,
    dogecoin: null,
    litecoin: null,
    polkadot: null,
    chainlink: null
  });
  const [error, setError] = useState(null); // To track any errors

  // Fetch updated prices from CoinGecko API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: 'bitcoin,ethereum,dogecoin,litecoin,polkadot,chainlink',
            vs_currencies: 'usd'
          }
        });

        // Log the response to check its structure
        // console.log(response.data);

        // Check if the response contains the expected data
        if (response.data) {
          setPrices({
            bitcoin: response.data.bitcoin?.usd,
            ethereum: response.data.ethereum?.usd,
            dogecoin: response.data.dogecoin?.usd,
            litecoin: response.data.litecoin?.usd,
            polkadot: response.data.polkadot?.usd,
            chainlink: response.data.chainlink?.usd
          });
          setError(null); // Reset error if data is fetched successfully
        } else {
          setError('No data available');
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
        setError('Failed to fetch prices'); // Set error message if fetch fails
      }
    };

    // Call the function to fetch prices
    fetchPrices();

    // Optionally, you could refresh every minute or so:
    const interval = setInterval(fetchPrices, 60000); // Refresh every 60 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="marquee-container">
      {error && <div className="error-message">{error}</div>} {/* Display error message */}

      <div className="marquee-content">
        {prices.bitcoin && (
          <a href="https://www.coingecko.com/en" target="_blank" rel="noopener noreferrer" className="marquee-link">
            Bitcoin Price: ${prices.bitcoin} 
          </a>
        )}
        <span className="spacer"> | </span>

        {prices.ethereum && (
          <a href="https://www.coingecko.com/en" target="_blank" rel="noopener noreferrer" className="marquee-link">
            Ethereum Price: ${prices.ethereum} 
          </a>
        )}
        <span className="spacer"> | </span>

        {prices.dogecoin && (
          <a href="https://www.coingecko.com/en" target="_blank" rel="noopener noreferrer" className="marquee-link">
            Dogecoin Price: ${prices.dogecoin} 
          </a>
        )}
        <span className="spacer"> | </span>

        {prices.litecoin && (
          <a href="https://www.coingecko.com/en" target="_blank" rel="noopener noreferrer" className="marquee-link">
            Litecoin Price: ${prices.litecoin} 
          </a>
        )}
        <span className="spacer"> | </span>

        {prices.polkadot && (
          <a href="https://www.coingecko.com/en" target="_blank" rel="noopener noreferrer" className="marquee-link">
            Polkadot Price: ${prices.polkadot}
          </a>
        )}
        <span className="spacer"> | </span>

        {prices.chainlink && (
          <a href="https://www.coingecko.com/en" target="_blank" rel="noopener noreferrer" className="marquee-link">
            Chainlink Price: ${prices.chainlink}
          </a>
        )}
      </div>
    </div>
  );
};

export default Marquee;
