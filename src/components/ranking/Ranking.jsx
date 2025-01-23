import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressRanking from './progess-ranking/ProgessRanking'; // Import the ProgressRanking component
import GainersRanking from './gainers-ranking/GainersRanking';
import CardList from '../CardList/CardList';
import { useTranslation } from 'react-i18next';
import MarketCap from './marketCap-ranking/MarketCap';
import TradingVolume from './trading-volume/TradingVolume';
import Marquee from '../marquee/Marquee';

const Ranking = () => {
  // State to track which table is active
  const [activeTable, setActiveTable] = useState('progress'); // 'progress' is the default
  const { t, i18n } = useTranslation();
  // Function to handle the button clicks
  const handleButtonClick = (table) => {
    setActiveTable(table);
  };

  return (
    <>


    <section className='slidermain'>
      <div className='container'>
      <div className='row'>
          <div className='col-md-7 slcontent'>
          
              <h1>Discover the power of <br></br>Howpump</h1>
              <h2>like never before</h2>
              <p>At Howpump we connect marketing and market making with results that transform projects into success stories. We design precise soluctions that generate natural attraction for investors, ensuring solid and sustainable growth for our clients.</p>

              <p>Trust the experience that makes the difference. Howpump, where your vision becomes reality.</p>
             
             
          </div>
          <div className='col-md-5 slcontent'>
          <img src='./images/sliderimg.png' alt="logo" className="sliderimg w-13 h-13 object-contain" />
          </div>
          </div>
      </div>
    </section>

    <main className="pl-5 pr-5 top-0 overflow-hidden">
     
      <div className="flex flex-col pb-4 pt-[75px] xl:pt-[50px]">
    
        <div className="absolute top-0 left-0 z-0 w-90 h-[60vw] sm:h-[43vw] md:h-[33vw] "></div>

        <div className="relative flex flex-col gap-4 lg:gap-6 mb-8 lg:mb-10">
     
          <div className="flex flex-col lg:flex-row lg:justify-between">

          
            <div className="buttonbox relative flex flex-wrap lg:flex-nowrap space-x-2 lg:space-x-4 h-10 border border-base dark:border-[#55496E] rounded-full shadow-md mb-4 lg:mb-0">

              <button
                type="button"
                className={`flex-1 flex items-center justify-center h-10 px-4 text-center font-medium rounded-full overflow-hidden whitespace-nowrap text-ellipsis text-xs sm:text-sm lg:text-base ${activeTable === 'all' ? 'bg-white text-black' : 'text-[#fff] dark:text-purple-500 hover:bg-gray-400'}`}
                onClick={() => handleButtonClick('all')}
              >
                {t('All ')}
              </button>

             
              <button
                type="button"
                className={`items-center justify-center h-10 px-9 text-center font-medium rounded-full overflow-hidden whitespace-nowrap  lg:text-base ${activeTable === 'owner' ? 'bg-white' : 'text-[#fff] dark:text-purple-500 hover:bg-gray-400'}`}
                onClick={() => handleButtonClick('owner')}
              >
                {t('Your Contributions')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NonListed section */}
      <CardList activeTable={activeTable}/>
    </main>
    </>
  );
};

export default Ranking;
