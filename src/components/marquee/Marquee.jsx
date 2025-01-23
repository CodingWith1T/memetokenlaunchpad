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
     

      
    </div>
  );
};

export default Marquee;
