import React from 'react'
import { useAccount } from 'wagmi';

const TokenInfo = ({ details, routerText, data, reserve }) => {
    const { chain } = useAccount();
    return (
        <div className="boxc bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Token Info</h2>
            <ul className="mt-4 space-y-3 text-gray-600">
                <li><strong>Name:</strong> {details.name}</li>
                <li><strong>Symbol:</strong> {details.symbol}</li>
                <li><strong>Description:</strong> {details.description}</li>
                <li><strong>Tag:</strong> {details.Tag}</li>
                <li><strong>Router:</strong> {routerText}</li>
                <li><strong>Current Reserve:</strong> {parseInt(data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) < 10 ** 15 ? parseInt(data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) + ' ' + 'wei' : parseFloat((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve).toFixed(4)) / 10 ** 18 + ' ' + chain?.nativeCurrency?.symbol || 'tBNB'}</li>
                <li><strong>Progress:</strong> <div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow={`${parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100}` }}>{parseInt((data.virtualQuoteReserve - reserve.initialVirtualQuoteReserve) / (data.maxListingQuoteAmount + data.listingFee)) ** 100} %</div>
                </div></li>
            </ul>



        </div>

    )
}

export default TokenInfo