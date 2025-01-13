import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CardList from '../CardList/CardList';
import { useTranslation } from 'react-i18next';

const Ranking = () => {
  // State to track which table is active
  const [activeSort, setActiveSort] = useState('all'); // Default is 'all'
  const { t } = useTranslation();

  // Function to handle the button click
  const handleSortChange = (sortType) => {
    setActiveSort(sortType);
  };

  return (
    <>
      <main className="pl-5 pr-5 top-0 overflow-hidden">
        <div className="flex flex-col pb-4 pt-[75px] xl:pt-[50px]">
          {/* Background Gradient */}
          <div className="absolute top-0 left-0 z-0 w-[90%] h-[60vw] sm:h-[43vw] md:h-[33vw] bg-gradient-to-r "></div>

          {/* Main Content */}
          <div className="relative flex flex-col gap-4 lg:gap-6 mb-8 lg:mb-10">
            {/* ConnectButton for wallet connection */}
            <div className="flex flex-col lg:flex-row lg:justify-between">
              {/* Your Contribution button */}
              <div className="createrightbtn flex mt-4 lg:mt-0 gap-4">
                <button
                  onClick={() => handleSortChange("owner")} // Fix: pass the function correctly
                  className="m-auto inline-block font-bold px-6 py-3 text-white bg-gradient-to-r bg-gold hover:bg-gray-400 rounded-full text-center shadow-lg transition-all duration-200 ease-in-out text-xs sm:text-sm lg:text-base"
                >
                  {t('Your Contribution')}
                </button>
                <Link
                  to="/create-token"
                  className="m-auto inline-block font-bold px-6 py-3 text-white bg-gradient-to-r hover:bg-gray-400  rounded-full text-center shadow-lg transition-all duration-200 ease-in-out text-xs sm:text-sm lg:text-base"
                >
                  {t('createToken')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* NonListed section */}
        <CardList activeSort={activeSort} />
      </main>
    </>
  );
};

export default Ranking;
