import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { daimond } from '../../helper/Helper';
import degenFacetAbi from "../../helper/DegenFacetAbi.json";
import { parseUnits } from 'ethers';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '../../wagmiClient';

const CreateToken = () => {
  const { isConnected, chain, address } = useAccount();
  const { connectAsync } = useConnect();
  const { writeContractAsync, isPending, isSuccess } = useWriteContract();

  const [tokenName, setTokenName] = useState('');
  const [tickerSymbol, setTickerSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [raisedToken, setRaisedToken] = useState('BNB');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const [showExtraOptions, setShowExtraOptions] = useState(false);

  const [totalSupply, setTotalSupply] = useState(1000000000);
  const [raisedAmount, setRaisedAmount] = useState(24);
  const [salesRatio, setSalesRatio] = useState(80);
  const [reservedRatio, setReservedRatio] = useState(0);
  const [liquidityPoolRatio, setLiquidityPoolRatio] = useState(20);
  const [startTime, setStartTime] = useState('');
  const [maxPerUser, setMaxPerUser] = useState(0);
  const [hash, setHash] = useState(null);

  // Extra Amounts based on percentages
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);

  const tags = ['Meme', 'AI', 'DeFi', 'Games', 'Infra', 'De-Sci', 'Social', 'Depin', 'Charity', 'Others'];

  const { t } = useTranslation();

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleRatioChange = (type, value) => {
    const total = salesRatio + reservedRatio + liquidityPoolRatio;
    const newValue = parseFloat(value);

    if (total - (type === 'sales' ? salesRatio : type === 'reserved' ? reservedRatio : liquidityPoolRatio) + newValue <= 100) {
      if (type === 'sales') {
        setSalesRatio(newValue);
      } else if (type === 'reserved') {
        setReservedRatio(newValue);
      } else if (type === 'liquidity') {
        setLiquidityPoolRatio(newValue);
      }
    } else {
      alert(t('The sum of Sales, Reserved, and Liquidity Pool ratios must not exceed 100'));
    }
  };

  const calculateBuySellAmount = (type, value) => {
    const amount = parseFloat(value);

    // Validation for Buy Tax
    if (type === 'buy') {
      if (amount > 100) {
        alert(t('Buy Tax should be below 100.'));
        return;
      }
      setBuyAmount(amount);
    }

    // Validation for Sell Tax
    if (type === 'sell') {
      if (amount > 5) {
        alert(t('Sell Tax should be below 5.'));
        return;
      }
      setSellAmount(amount);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      if (!address) {
        await connectAsync();
      }

      const params = {
        name: tokenName,
        symbol: tickerSymbol,
        poolDetails: JSON.stringify({
          description: description,
          Website: website,
          Twitter: twitter,
          Telegram: telegram,
          Tag: selectedTag
        }),
        configIndex: 20,
        router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
        startTime: new Date(startTime).getTime() / 1000,
        buyFeeRate: buyAmount,
        sellFeeRate: sellAmount,
        maxBuyAmount: maxPerUser,
        delayBuyTime: 0,
        merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        initialBuyAmount: parseUnits((totalSupply).toString(), 0).toString()
      };
      console.log({ params })

      const data = await writeContractAsync({
        abi: degenFacetAbi,
        address: daimond,
        chainID: parseInt(chain.id, 10),
        functionName: 'createPool',
        value: totalSupply, // Add value if needed
        args: [params], // Passing the struct as an object
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: data,
      })
      setHash(receipt.transactionHash);

    } catch (exception) {
      const message = error.shortMessage;
      if (message) {
        if (message.includes('reason:')) {
          const reason = message.split('reason:')[1].trim();
          alert(reason);
        } else {
          alert(message);
        }
      }
    }
  };

  return (
    <main className="formmain mainbox relative top-0 min-h-[calc(100vh_-_182px)]">
      <div className="w-full relative">
        <form className="tokenform ant-form ant-form-horizontal" onSubmit={handleSubmit}>
          <div className="forminbox lg:mx-auto px-[4.8%] lg:px-0 py-8 lg:py-[20px] w-full lg:w-[800px]">
            <div className="flex flex-col items-center gap-6 w-full">
              {/* Token Name Input Section */}
              <div className="w-full flex flex-col gap-4">
                <label htmlFor="tokenName" className="text-lg font-bold text-purple-900">
                  {t('tokenName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tokenName"
                  name="tokenName"
                  className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
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
                  className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
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
                  className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
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
                  className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
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
                  className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
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
                  className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
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
                  className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder={t('telegram')}
                />
              </div>

              {/* Tag Selection */}
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

              {/* Extra Options Toggle */}
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
                    <label htmlFor="InitialSupply" className="text-lg font-bold text-purple-900">
                      {t('totalSupply')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="InitialSupply"
                      value={totalSupply}
                      onChange={(e) => setTotalSupply(parseInt(e.target.value))}
                      className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>
                  <div className='col-md-6'>
                    <label htmlFor="raisedAmount" className="text-lg font-bold text-purple-900">
                      {t('raisedAmount')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="raisedAmount"
                      value={raisedAmount}
                      onChange={(e) => setRaisedAmount(parseInt(e.target.value))}
                      className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="buyTax" className="text-lg font-bold text-purple-900">
                      {t('buyTax')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => calculateBuySellAmount('buy', e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="sellTax" className="text-lg font-bold text-purple-900">
                      {t('sellTax')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={sellAmount}
                      onChange={(e) => calculateBuySellAmount('sell', e.target.value)}
                    />
                  </div>

                  <div className='col-md-6'>
                    <label htmlFor="startTime" className="text-lg font-bold text-purple-900">
                      {t('startTime')}
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="rounded p-4 border-2 border-purple-400 bg-purple-100 text-purple-900 font-bold"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 mt-6">
                <button
                  type="submit" 
                  disabled = {hash}
                  className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg mt-6"
                >
                  {t('createToken')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateToken;
