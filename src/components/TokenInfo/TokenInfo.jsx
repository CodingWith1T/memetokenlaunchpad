import React from 'react'
import { useAccount } from 'wagmi';
import { routers } from '../../helper/Helper';

const getRouter = (value, chain = '97') => {
    const router = routers[chain] || [];
    return Object.keys(router).find(key => router[key].toLowerCase() === value.toLowerCase())
}

const TokenInfo = ({ details, data, reserve }) => {

    const { chain } = useAccount();

    return (
        <div className="boxc bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Token Info</h2>
            <ul className="mt-4 space-y-3 text-gray-600">
                <li><strong>Name:</strong>&nbsp;{details.name}</li>
                <li><strong>Symbol:</strong>&nbsp;{details.symbol}</li>
                <li><strong>Description:</strong>&nbsp;{details.description}</li>
                <li><strong>Tag:</strong>&nbsp;{details.Tag}</li>
                <li><strong>Router:</strong>&nbsp;{getRouter(data.router)}</li>
                <li>
                    <strong>Current Reserve:</strong>&nbsp;
                    {parseInt(data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) < 10 ** 15
                        ? parseInt(data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) + ' wei'
                        : (parseFloat(data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / 10 ** 18).toFixed(4) + ' ' + (chain?.nativeCurrency?.symbol || 'Currency')
                    }
                </li>
                <li><strong>Progress:</strong> <div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow={`${parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100}` }}>{parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100} %</div>
                </div></li>
            </ul>



        </div>

    )
}

export default TokenInfo