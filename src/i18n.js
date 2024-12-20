import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(LanguageDetector)  // Detect language from the browser settings
  .use(Backend)  // Load translations from the server (optional in your case)
  .use(initReactI18next)  // Initialize React i18next
  .init({
    resources: {
      en: {
        translation: {
          board: 'Board', // Added for Board page
          createToken: 'Create Token', // Added for CreateToken page
          tokenName: 'Token Name',
          tickerSymbol: 'Ticker Symbol',
          description: 'Description',
          raisedToken: 'Raised Token',
          website: 'Website',
          twitter: 'Twitter',
          telegram: 'Telegram',
          selectTag: 'Select Tag',
          chooseCategory: 'Choose a category for your token. You can only select one.',
          connectWallet: 'Connect Wallet',
          walletConnected: 'Wallet Connected',
          meme: 'Meme',
          ai: 'AI',
          defi: 'DeFi',
          games: 'Games',
          infra: 'Infra',
          deSci: 'De-Sci',
          social: 'Social',
          depin: 'Depin',
          charity: 'Charity',
          others: 'Others',
          progressRanking: 'Progress Ranking', // Added for Progress Ranking
          gainersRanking: '24 Hours Gainers Ranking', // Added for Gainers Ranking
          marketCapRanking: 'MarketCap Ranking', // Added for MarketCap Ranking
          tradingVolume: '24 Hours Trading Volume', // Added for Trading Volume
        },
      },
      zh: {
        translation: {
          board: '板块', // Translation for Board page
          createToken: '创建代币', // Translation for CreateToken page
          tokenName: '代币名称',
          tickerSymbol: '代币符号',
          description: '描述',
          raisedToken: '募资代币',
          website: '网站',
          twitter: 'Twitter',
          telegram: 'Telegram',
          selectTag: '选择标签',
          chooseCategory: '选择您的代币类别，您只能选择一个。',
          connectWallet: '连接钱包',
          walletConnected: '钱包已连接',
          meme: '表情包',
          ai: '人工智能',
          defi: '去中心化金融',
          games: '游戏',
          infra: '基础设施',
          deSci: '去中心化科学',
          social: '社交',
          depin: '去中心化基础设施',
          charity: '慈善',
          others: '其他',
          progressRanking: '进度排名', // Translation for Progress Ranking
          gainersRanking: '24小时涨幅排名', // Translation for Gainers Ranking
          marketCapRanking: '市值排名', // Translation for MarketCap Ranking
          tradingVolume: '24小时交易量', // Translation for Trading Volume
        },
      },
    },
    fallbackLng: 'en',  // Fallback language
    debug: true,  // Enable debug logs
  });

export default i18n;
