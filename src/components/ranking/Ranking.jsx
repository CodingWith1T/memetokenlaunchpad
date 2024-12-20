import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressRanking from './progess-ranking/ProgessRanking'; // Import the ProgressRanking component
import GainersRanking from './gainers-ranking/GainersRanking';
import NonListed from '../card/NonListed/NonListed';
import { useTranslation } from 'react-i18next';

const Ranking = () => {
  // State to track which table is active
  const [activeTable, setActiveTable] = useState('progress'); // 'progress' is the default
  const { t, i18n } = useTranslation();
  // Function to handle the button clicks
  const handleButtonClick = (table) => {
    setActiveTable(table);
  };

  return (
    <main className="pl-5 pr-5 top-0 overflow-hidden">
      <div className="flex flex-col pb-4 pt-[75px] xl:pt-[98px]">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 z-0 w-90 h-[60vw] sm:h-[43vw] md:h-[33vw] "></div>

        {/* Main Content */}
        <div className="relative flex flex-col gap-4 lg:gap-6 mb-8 lg:mb-10">
          {/* ConnectButton from RainbowKit */}
          <div className="flex flex-col lg:flex-row lg:justify-between">

            {/* Ranking Button Container */}
            <div className="relative flex flex-wrap lg:flex-nowrap space-x-2 lg:space-x-4 h-10 border border-base dark:border-[#55496E] rounded-full shadow-md mb-4 lg:mb-0">

              {/* Button 1: Progress Ranking */}
              <button
                type="button"
                className="flex-1 flex items-center justify-center h-10 px-4 text-center font-medium text-[#7A6EAA] dark:text-purple-500 rounded-full hover:bg-purple-300 overflow-hidden whitespace-nowrap text-ellipsis text-xs sm:text-sm lg:text-base"
                onClick={() => handleButtonClick('progress')}
              >
                {t('progressRanking')}
              </button>

              {/* Button 2: 24 Hours Gainers Ranking */}
              <button
                type="button"
                className="flex-1 flex items-center justify-center h-10 px-4 text-center font-medium text-[#7A6EAA] dark:text-purple-500 rounded-full hover:bg-purple-300 overflow-hidden whitespace-nowrap text-ellipsis text-xs sm:text-sm lg:text-base"
                onClick={() => handleButtonClick('gainers')}
              >
                {t('gainersRanking')}
              </button>

              {/* Button 3: MarketCap Ranking */}
              <button
                type="button"
                className="flex-1 flex items-center justify-center h-10 px-4 text-center font-medium text-[#7A6EAA] dark:text-purple-500 rounded-full hover:bg-purple-300 overflow-hidden whitespace-nowrap text-ellipsis text-xs sm:text-sm lg:text-base"
                onClick={() => handleButtonClick('marketcap')}
              >
                {t('marketCapRanking')}
              </button>

              {/* Button 4: 24 Hours Trading Volume */}
              <button
                type="button"
                className="flex-1 flex items-center justify-center h-10 px-4 text-center font-medium text-[#7A6EAA] dark:text-purple-500 rounded-full hover:bg-purple-300 overflow-hidden whitespace-nowrap text-ellipsis text-xs sm:text-sm lg:text-base"
                onClick={() => handleButtonClick('volume')}
              >
                {t('tradingVolume')}
              </button>
            </div>

            {/* ConnectButton for wallet connection */}
            <div className="mt-4 lg:mt-0">
              <Link
                to="/create-token"
                className="inline-block px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full text-center shadow-lg transition-all duration-200 ease-in-out text-xs sm:text-sm lg:text-base"
              >
                {t('createToken')} 
              </Link>
            </div>
          </div>

          {/* Conditionally Render Tables Based on Active Table */}
          <div className="mt-6">
            {activeTable === 'progress' && <ProgressRanking />}
            {activeTable === 'gainers' && <GainersRanking />}
            {activeTable === 'marketcap' && <div>MarketCap Ranking Table</div>}
            {activeTable === 'volume' && <div>24 Hours Trading Volume Table</div>}
          </div>
        </div>
      </div>

      {/* NonListed section */}
      <NonListed />
    </main>
  );
};

export default Ranking;
