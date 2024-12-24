import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CreateToken = () => {
  const [tokenName, setTokenName] = useState('');
  const [tickerSymbol, setTickerSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [raisedToken, setRaisedToken] = useState('BNB');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [selectedTag, setSelectedTag] = useState(null); // Only one tag can be selected

  // Extra Options State
  const [showExtraOptions, setShowExtraOptions] = useState(false);

  // Extra fields states
  const [totalSupply, setTotalSupply] = useState(1000000000);
  const [raisedAmount, setRaisedAmount] = useState(24);
  const [salesRatio, setSalesRatio] = useState(80);
  const [reservedRatio, setReservedRatio] = useState(0);
  const [liquidityPoolRatio, setLiquidityPoolRatio] = useState(20);
  const [startTime, setStartTime] = useState(''); // Start Time field state
  const [maxPerUser, setMaxPerUser] = useState(0); // Maximum Per User field state

  const tags = ['Meme', 'AI', 'DeFi', 'Games', 'Infra', 'De-Sci', 'Social', 'Depin', 'Charity', 'Others'];

  const { t, i18n } = useTranslation();

  const handleTagClick = (tag) => {
    // If the same tag is clicked again, deselect it; otherwise, select the new tag
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleRatioChange = (type, value) => {
    const total = salesRatio + reservedRatio + liquidityPoolRatio;
    const newValue = parseFloat(value);

    // Ensure that the sum of the ratios does not exceed 100
    if (total - (type === 'sales' ? salesRatio : type === 'reserved' ? reservedRatio : liquidityPoolRatio) + newValue <= 100) {
      if (type === 'sales') {
        setSalesRatio(newValue);
      } else if (type === 'reserved') {
        setReservedRatio(newValue);
      } else if (type === 'liquidity') {
        setLiquidityPoolRatio(newValue);
      }
    } else {
      alert('The sum of Sales, Reserved, and Liquidity Pool ratios must not exceed 100');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      tokenName,
      tickerSymbol,
      description,
      raisedToken,
      website,
      twitter,
      telegram,
      selectedTag,
      showExtraOptions,
      totalSupply,
      raisedAmount,
      salesRatio,
      reservedRatio,
      liquidityPoolRatio,
      startTime,
      maxPerUser,
    });
  };

  return (
    <main className="formmain mainbox relative top-0 min-h-[calc(100vh_-_182px)]">
      <div className="w-full relative">
        <div className="formbox absolute w-full top-0 left-0 gradient-default dark:gradient-default-dark  border-bottom border-[#E7E3EB] dark:border-[#383241] z-0"></div>
        <form className="tokenform ant-form ant-form-horizontal css-en40gs" onSubmit={handleSubmit}>
          <div className="forminbox lg:mx-auto px-[4.8%] lg:px-0 py-8 lg:py-[20px] w-full lg:w-[800px] min-w-0">
            <div className="flex flex-col items-center gap-6 lg:gap-6 w-full">
              {/* Token Name Input Section */}
              <div className="w-full flex flex-col gap-4">
                <label htmlFor="tokenName" className="text-lg font-bold text-purple-900">
                  {t('tokenName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tokenName"
                  name="tokenName"
                  className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder={t('tokenName')}
                  required
                />
              </div>

              {/* Ticker Symbol Input Section */}
              <div className="w-full flex flex-col gap-4">
                <label htmlFor="tickerSymbol" className="text-lg font-bold text-purple-900">
                  {t('tickerSymbol')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tickerSymbol"
                  name="tickerSymbol"
                  className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                  value={tickerSymbol}
                  onChange={(e) => setTickerSymbol(e.target.value)}
                  placeholder={t('tickerSymbol')}
                  required
                />
              </div>

              {/* Description Input Section */}
              <div className="w-full flex flex-col gap-4">
                <label htmlFor="description" className="text-lg font-bold text-purple-900">
                  {t('description')}<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('description')}
                  rows="4"
                  required
                />
              </div>

              {/* Raised Token Selection */}
              <div className="w-full flex flex-col gap-4">
                <label htmlFor="raisedToken" className="text-lg font-bold text-purple-900">
                  {t('raisedToken')}<span className="text-red-500">*</span>
                </label>
                <select
                  id="raisedToken"
                  name="raisedToken"
                  className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                  value={raisedToken}
                  onChange={(e) => setRaisedToken(e.target.value)}
                  required
                >
                  <option value="BNB">BNB</option>
                  <option value="CAKE">CAKE</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>

              {/* Website, Twitter, and Telegram Links */}
              <div className="w-full flex flex-col gap-4">
                <label htmlFor="website" className="text-lg font-bold text-purple-900">{t('website')}</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder={t('website')}
                />
              </div>

              <div className="w-full flex flex-col gap-4">
                <label htmlFor="twitter" className="text-lg font-bold text-purple-900">{t('twitter')}</label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder={t('twitter')}
                />
              </div>

              <div className="w-full flex flex-col gap-4">
                <label htmlFor="telegram" className="text-lg font-bold text-purple-900">{t('telegram')}</label>
                <input
                  type="url"
                  id="telegram"
                  name="telegram"
                  className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder={t('telegram')}
                />
              </div>

              {/* Tag Label Section */}
              <div className="w-full flex flex-col gap-2 mt-6">
                <label className="text-lg font-bold text-purple-900">{t('selectTag')}</label>
                <p className="text-sm text-gray-600">
                  {t('chooseCategory')}
                </p>
              </div>

              {/* Tags Selection - Button Grid */}
              <div className="tags-selection w-full grid grid-cols-4 gap-4 mt-2">
                {tags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-2 rounded-lg border-2 ${selectedTag === tag
                        ? 'bg-purple-400 text-white border-purple-400'
                        : 'bg-purple-100 text-purple-900 border-purple-400'
                      }`}
                  >
                    {t(tag.toLowerCase())}
                  </button>
                ))}
              </div>

              {/* Extra Options Toggle - Switch Design */}
              <div className="w-full flex items-center gap-4 mt-6">
                <label htmlFor="extraOptions" className="text-lg font-bold text-purple-900">{t('extraOptions')}</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="extraOptions"
                    checked={showExtraOptions}
                    onChange={() => setShowExtraOptions(!showExtraOptions)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Extra Options Fields */}
              {showExtraOptions && (
                <div className="extraoptions gap-4 mt-4">
                  <div className='col-md-6'>
                    <label htmlFor="totalSupply" className="text-lg font-bold text-purple-900">
                      {t('totalSupply')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="totalSupply"
                      value={totalSupply}
                      onChange={(e) => setTotalSupply(e.target.value)}
                      className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>

                  <div className='col-md-6 lastdiv'>
                    <label htmlFor="raisedAmount" className="text-lg font-bold text-purple-900">
                      {t('raisedAmount')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="raisedAmount"
                      value={raisedAmount}
                      onChange={(e) => setRaisedAmount(e.target.value)}
                      className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>

                  <div className='col-md-4'>
                    <label htmlFor="salesRatio" className="text-lg font-bold text-purple-900">
                      {t('salesRatio')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="salesRatio"
                      value={salesRatio}
                      onChange={(e) => handleRatioChange('sales', e.target.value)}
                      className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>

                  <div className='col-md-4'>
                    <label htmlFor="reservedRatio" className="text-lg font-bold text-purple-900">
                      {t('reservedRatio')}
                    </label>
                    <input
                      type="number"
                      id="reservedRatio"
                      value={reservedRatio}
                      onChange={(e) => handleRatioChange('reserved', e.target.value)}
                      className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>

                  <div className='col-md-4 liquiditydiv'>
                    <label htmlFor="liquidityPoolRatio" className="text-lg font-bold text-purple-900">
                      {t('liquidityPoolRatio')}
                    </label>
                    <input
                      type="number"
                      id="liquidityPoolRatio"
                      value={liquidityPoolRatio}
                      onChange={(e) => handleRatioChange('liquidity', e.target.value)}
                      className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>

                  {/* Start Time and Maximum Per User */}
                  <div className='col-md-6'>
                    <label htmlFor="startTime" className="text-lg font-bold text-purple-900">
                      {t('startTime')}
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>

                  <div className='col-md-6 lastdiv'>
                    <label htmlFor="maxPerUser" className="text-lg font-bold text-purple-900">
                      {t('maximumPerUser')}
                    </label>
                    <input
                      type="number"
                      id="maxPerUser"
                      value={maxPerUser}
                      onChange={(e) => setMaxPerUser(e.target.value)}
                      className="rounded p-4 ant-input ant-input-outlined border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg mt-6"
              >
                {t('createToken')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateToken;
