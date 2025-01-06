import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import abi from "../../helper/ManagerFaucetAbi.json";
import { daimond } from '../../helper/Helper';
import { Link } from 'react-router-dom';

const Card = ({ id, handleCardClick }) => {

  const { isConnected, chain, address } = useAccount();

  // Ensure we have the ID available before making the contract call
  if (!id) {
    return
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
      onClick={() => handleCardClick(item)} // On card click, navigate to /card-page
    >


      {/* Card New Section */}
      <div class="cards dark">

        <div class="card-body">
          <img src="https://codingyaar.com/wp-content/uploads/chair-image.jpg" class="card-img-top" alt="..." />
          <div class="text-section">

            <h5 class="card-title">{JSON.parse(data.poolDetails).name}</h5>

            <p className='symble'> ({JSON.parse(data.poolDetails).symbol}) <span className='chainlink'><img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" class="chainimg" alt="..." /> BNB</span></p>
            <p class="card-text">{JSON.parse(data.poolDetails).description}</p>
          </div>
        </div>

        <hr></hr>
        <p>
          <span className='per'><a href='#'>0.00%</a></span>
          <span className='MCap'>MCap: $36.9K</span>
        </p>
      </div>



    </div>
  );
};

export default Card;
