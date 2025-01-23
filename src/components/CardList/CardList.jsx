import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { readContract } from 'wagmi/actions';
import { config } from '../../wagmiClient';
import Card from '../Card/Card';
import abi from "../../helper/ManagerFaucetAbi.json";
import { daimond } from '../../helper/Helper';

// Dummy fallback data in case the API fails
const dummyData = [
  // Dummy data remains unchanged...
];

const NonListed = ({activeTable}) => {
  const [data, setData] = useState([]); // Data state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [totalTokens, setTotalTokens] = useState(null); // Total tokens count state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const navigate = useNavigate(); // React Router hook for navigation

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Navigate to the CardPage with item data passed through state

  useEffect(() => {
    const fetchPoolCount = async () => {
      try {
        // console.log("Fetching pool count...");
        const result = await readContract(config, {
          address: daimond,
          abi,
          functionName: 'getPoolCount',
          chainId: 97
        });

        // console.log("Pool count fetched:", result);
        setTotalTokens(result.toString()); // Save the result in state
      } catch (error) {
        // console.error("Error fetching pool count:", error);
        setError(error.message); // Set the error state
      }
    };

    fetchPoolCount();
  }, []); // This runs only once, when the component mounts

  // Fetch coin data for the current page
  // if (loading) {
  //   return <div className="flex justify-center items-center h-screen">Loading...</div>;
  // }

  if (error) {
    return <div className="flex justify-center items-center h-14">Error: {error}</div>;
  }

  return (
    <div>
      <div className="cardbox grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {
          Array.from({ length: totalTokens }, (_, index) => (
            <Card key={index} id={index} activeTable={activeTable}/>
          )).reverse()
        }
      </div>
    </div>
  );
};

export default NonListed;