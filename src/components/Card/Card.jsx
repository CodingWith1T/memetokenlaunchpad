import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import abi from "../../helper/ManagerFaucetAbi.json";
import { daimond } from '../../helper/Helper';
import { Link, useNavigate } from 'react-router-dom';

const Card = ({ id, handleCardClick }) => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const { isConnected, chain, address } = useAccount();

  // Ensure we have the ID available before making the contract call
  if (!id) {
    return null;
  }

  // Use the wagmi hook to read the contract
  const { data, error, isLoading } = useReadContract({
    abi,
    address: daimond,
    functionName: 'getPoolAt',
    args: [id.toString()], // Passing `id` as argument to the contract function
    chainId: 97
  });

  console.log({data})


  // Display loading, error, or contract data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Destructuring the fetched data from the contract
  const { id: poolId, owner, token, router, poolDetails } = data || {};

  // Parse the poolDetails JSON string
  const poolDetailsParsed = poolDetails ? JSON.parse(poolDetails) : {};

  return (
    <div
      key={data.id}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => navigate(`/token/bsc/${data.token}`)} // Navigate to /card-page with poolId as query param
    >
      {/* Card New Section */}
      <div className="cards dark">
        <div className="card-body">
          <img
            src={JSON.parse(data.poolDetails).image || 'https://codingyaar.com/wp-content/uploads/chair-image.jpg'}
            className="card-img-top"
            alt="..."
          />
          <div className="text-section">
            <h5 className="card-title">{JSON.parse(data.poolDetails).name}</h5>
            <p className="symble">
              ({JSON.parse(data.poolDetails).symbol})
              <span className="chainlink">
                <img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" className="chainimg" alt="..." /> BNB
              </span>
            </p>
            <p className="card-text">{JSON.parse(data.poolDetails).description}</p>
          </div>
        </div>
        <hr />
        <p>
          <span className="per"><a href="#">0.00%</a></span>
          <span className="MCap">MCap: $36.9K</span>
        </p>
      </div>
    </div>
  );
};

export default Card;
