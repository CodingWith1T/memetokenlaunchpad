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
        <div className="boxcs">
            <h2 className="text-xl font-semibold text-gray-800">Token Info</h2>
                <ul className="mt-4 space-y-3 text-gray-600">
                <li><strong>Name:</strong> <span>{details.name}</span></li>
                <li><strong>Symbol:</strong><span>{details.symbol}</span></li>
                <li><strong>Tag:</strong><span>{details.Tag}</span></li>
                <li><strong>Router:</strong><span>{getRouter(data.router)}</span></li>
                <li><strong>Start Time :</strong><span>2/7/2025, 11:31:00 AM</span></li>
                <li>
                <strong>Current Reserve:</strong><span>
                {parseInt(data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) < 10 ** 15
                ? parseInt(data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) + ' wei'
                : (parseFloat(data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / 10 ** 18).toFixed(4) + ' ' + (chain?.nativeCurrency?.symbol || 'Currency')
                }</span>
                </li>
                {/* <li><strong>Progress:</strong> <div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow={`${parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100}` }}>{parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100} %</div>
                </div></li> */}
                </ul>



        </div>

    )
}

export default TokenInfo