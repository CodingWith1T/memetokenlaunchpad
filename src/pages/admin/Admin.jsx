import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../wagmiClient';
import { readContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { daimond } from '../../helper/Helper';
import MangerAbi from "../../helper/ManagerFaucetAbi.json";
import { useReadContract } from 'wagmi';

const Admin = () => {
    const [routerName, setRouterName] = useState('');
    const [routerId, setRouterId] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [totalToken, setTotalTokens] = useState();
    const [routers, setrouters] = useState([]);
    const [masterConfig, setMasterConfig] = useState({});
    const [updatedMasterConfig, setUpdatedMasterConfig] = useState({
        'weth': '',
        'feeReceiver': '',
        'feeBps': '',
        'refBps': ''
    });

    const handleChange = (field, value) => {
        setUpdatedMasterConfig(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    // State to control modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddRouter = async () => {
        try {
            // Check if routerName is valid before using length
            if (routerName?.length !== 42) {
                alert("Address must be 42 characters (including 0x prefix).");
                return;
            }
            if (!/^0x[a-fA-F0-9]{40}$/.test(routerName)) {
                alert("Address must be a valid hex value of 40 bytes.");
                return;
            }

            const addRouter = await writeContract(config, {
                address: daimond[56],
                abi: MangerAbi,
                functionName: 'setWhitelistedRouters',
                chainId: 56,
                args: [
                    [routerName],
                    true,
                ],
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveRouter = async () => {
        try {
            // Check if routerId is valid before using length
            if (routerId?.length !== 42) {
                alert("Address must be 42 characters (including 0x prefix).");
                return;
            }
            if (!/^0x[a-fA-F0-9]{40}$/.test(routerId)) {
                alert("Address must be a valid hex value of 40 bytes.");
                return;
            }

            const removeRouter = await writeContract(config, {
                address: daimond[56],
                abi: MangerAbi,
                functionName: 'setWhitelistedRouters',
                chainId: 56,
                args: [
                    [routerId],
                    false,
                ],
            });

        } catch (error) {
            console.log(error);
        }
    };

    const Running = async () => {
        try {
            // Start the contract call to setPaused
            const removeRouter = await writeContract(config, {
                address: daimond[56],
                abi: MangerAbi,
                functionName: 'setPaused',
                chainId: 56,
                args: [!data],
            });

            // Wait for the transaction receipt to confirm it was mined
            const receipt = await waitForTransactionReceipt(config, {
                hash: removeRouter,
            });

            // Check if the receipt is successful before reloading
            if (receipt && receipt.status === 'success') {
                window.location.reload();
            } else {
                alert("Transaction failed!");
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };

    const handleMasterConfig = async () => {
        try {
            // Multiply feeBps and refBps by 100 before sending to the contract
            const updatedConfigs = {
                ...updatedMasterConfig,
                feeBps: updatedMasterConfig.feeBps * 100,
                refBps: updatedMasterConfig.refBps * 100
            };

            // Start the contract call to setMasterConfig
            const removeRouter = await writeContract(config, {
                address: daimond[56],
                abi: MangerAbi,
                functionName: 'setMasterConfig',
                chainId: 56,
                args: [updatedConfigs],
            });

            // Wait for the transaction receipt to confirm it was mined
            const receipt = await waitForTransactionReceipt(config, {
                hash: removeRouter,
            });
            console.log(receipt.status);

            // Check if the receipt is successful before reloading
            if (receipt && receipt.status === 'success') {
                window.location.reload();
            } else {
                alert("Transaction failed!");
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };

    const { data, error, isLoading } = useReadContract({
        abi: MangerAbi,
        address: daimond[56],
        functionName: 'isPaused',
        chainId: 56
    });

    useEffect(() => {
        const fetchRouters = async () => {
            try {
                const totalrouters = await readContract(config, {
                    address: daimond[56],
                    abi: MangerAbi,
                    functionName: 'getRouters',
                    chainId: 56,
                });
                console.log({totalrouters})
                // Ensure `totalrouters` is an array before updating state
                if (Array.isArray(totalrouters)) {
                    setrouters(totalrouters);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const fetchPoolCount = async () => {
            try {
                // console.log("Fetching pool count...");
                const result = await readContract(config, {
                    address: daimond[56],
                    abi: MangerAbi,
                    functionName: 'getPoolCount',
                    chainId: 56
                });
                setTotalTokens(result.toString());
            } catch (error) {
                console.log(error)
            }
        };
        const fetchConfig = async () => {
            try {
                // console.log("Fetching pool count...");
                const result = await readContract(config, {
                    address: daimond[56],
                    abi: MangerAbi,
                    functionName: 'getMasterConfig',
                    chainId: 56
                });
                setMasterConfig(result);
            } catch (error) {
                console.log(error)
            }
        };

        fetchRouters();
        fetchPoolCount();
        fetchConfig();
    }, []);

    // Function to open the modal
    const openModal = async () => {
        try {
            const data = await readContract(config, {
                abi: MangerAbi,
                address: daimond[56],
                functionName: 'getPoolInfo',
                args: [tokenAddress],
                chainId: 56
            });
            setTokenAddress(data)
        } catch (error) {
            console.log(error);
        }
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setTokenAddress()
    };

    function camelToReadable(text) {
        return text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, str => str.toUpperCase());
    }

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            

            {/* Main content */}
            <div className="flex-1 p-6 bg-gray-200 rightbox adminpanel">
                <div className='container'>
                {/* Header */}
                <h1 className="dtitle text-3xl font-semibold">Welcome to the <span>Admin Panel</span></h1>
                <p className="subtext">Manage your website and users from here.</p>
                {/* Dashboard Content */}
                <div className="Dashboard bg-white p-6 rounded-lg shadow-lg min-h-50">
                    <h2 className="text-3xl font-semibold mb-2">Dashboard</h2>
                    <p>Here you can find key statistics and actions to manage the platform.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-gray-200 p-4 rounded-lg shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-semibold">
                                Total Token Meme : <span>{isNaN(totalToken) ? 'Loading...' : totalToken}</span>
                            </h3>
                        </div>
                        <div className="bg-gray-200 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold">Plateform Status : &nbsp;
                                {
                                    // Convert 'data' to boolean based on its string value
                                    !data ? (
                                        <span><button className='Running rounded-md transition-colors text-white' onClick={Running}>Running</button></span>
                                    ) : (
                                        <span><button className='rounded-md transition-colors bg-red-500 text-white' onClick={Running}>Paused</button></span>
                                    )
                                }</h3>
                        </div>
                    </div>
                    {/* Grid of Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                        {/* Card 1 */}
                        <div className="bsbox bg-gray-200 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Add Router</h3>
                            <p className="text-sm text-gray-600 mb-4">Enter router details to add a new router.</p>

                            {/* Input field for adding router */}
                            <input
                                type="text"
                                placeholder="Enter Router Address"
                                className="w-full p-2 mb-4 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                value={routerName}
                                onChange={(e) => setRouterName(e.target.value)}
                            />
                            <button
                                onClick={handleAddRouter}
                                className={`w-full p-2 rounded-md transition-colors ${routerName ? 'bg-blue-600 gbutton text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                                disabled={!routerName}
                            >
                                Add Router
                            </button>
                        </div>
                        {/* Card 2 */}
                        <div className="bsbox bg-gray-200 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Remove Router</h3>
                            <p className="text-sm text-gray-600 mb-4">Enter router details to remove an existing router.</p>

                            {/* Input field for removing router */}
                            <input
                                type="text"
                                placeholder="Enter Router Address"
                                className="w-full p-2 mb-4 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                value={routerId}
                                onChange={(e) => setRouterId(e.target.value)}
                            />
                            <button
                                onClick={handleRemoveRouter}
                                className={`w-full p-2 rounded-md transition-colors ${routerId ? 'bg-red-600 gbutton text-white hover:bg-red-700' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                                disabled={!routerId}
                            >
                                Remove Router
                            </button>
                        </div>
                        {/* Card 3 */}
                        <div className="bsbox bg-gray-200 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Total Router</h3>
                            <ul className="text-sm text-black">
                                {routers.length > 0 ? (
                                    routers.map((route, index) => (
                                        <li key={index}>{route}</li>
                                    ))
                                ) : (
                                    <p>No routers available.</p>
                                )}
                            </ul>
                        </div>
                        {/* Card 4 */}
                        <div className="bsbox bg-gray-200 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Token Info</h3>
                            <input
                                type="text"
                                placeholder="Enter Token Address"
                                className="w-full p-2 mb-4 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                value={tokenAddress}
                                onChange={(e) => setTokenAddress(e.target.value)}
                            />
                            <button
                                onClick={openModal} // Open the modal
                                className={`w-full p-2 rounded-md transition-colors ${tokenAddress ? 'bg-gold gbutton text-white hover:bg-gold' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                                disabled={!tokenAddress}
                            >
                                Search
                            </button>
                        </div>
                        {/* Card 5 */}
                        <div className="bsbox bg-gray-200 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Platform details</h3>
                            <ul className="text-sm text-black">
                                {Object.entries(masterConfig).map(([key, value], index) => (
                                    <li key={index}>
                                        {camelToReadable(key)}: {
                                            typeof value === 'bigint' ? (value / 100n).toString() : value != null ? value.toString() : 'N/A'
                                        }
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Card 6 */}
                        <div className="bsbox bg-gray-200 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Set Master Config</h3>
                            <input
                                type="text"
                                placeholder="Enter Weth Address"
                                className="w-full p-2 mb-4 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                value={updatedMasterConfig.weth}
                                onChange={(e) => handleChange('weth', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Enter Fee Receiver Address"
                                className="w-full p-2 mb-4 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                value={updatedMasterConfig.feeReceiver}
                                onChange={(e) => handleChange('feeReceiver', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Enter Platform fee Percentage"
                                className="w-full p-2 mb-4 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                value={updatedMasterConfig.feeBps}
                                onChange={(e) => handleChange('feeBps', e.target.value)}
                                max={30}
                                min={0}
                            />
                            <input
                                type="number"
                                placeholder="Enter Referral fee Percentage"
                                className="w-full p-2 mb-4 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                value={updatedMasterConfig.refBps}
                                onChange={(e) => handleChange('refBps', e.target.value)}
                                max={30}
                                min={0}
                            />
                            <button
                                onClick={handleMasterConfig}
                                className={`w-full p-2 rounded-md transition-colors ${updatedMasterConfig.weth && updatedMasterConfig.feeReceiver && updatedMasterConfig.feeBps && updatedMasterConfig.refBps ? 'bg-gold gbutton text-white hover:bg-gold' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                                disabled={!updatedMasterConfig.weth || !updatedMasterConfig.feeReceiver || !updatedMasterConfig.feeBps || !updatedMasterConfig.refBps}
                            >
                                Set Config
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 sm:w-4/5 lg:w-1/3 text-center">
                            {/* Image above the title */}
                            {tokenAddress.poolDetails && (
                                <img
                                    src={JSON.parse(tokenAddress.poolDetails).image}
                                    alt="Modal Image"
                                    className="w-full h-30 object-cover mb-4" // Full width, height 30% of modal
                                />
                            )}

                            <h2 className="text-lg font-semibold mb-4">Token Search Results</h2>

                            {/* Name and Symbol Inline */}
                            <div className="flex justify-between mb-4">
                                <p className="text-sm font-semibold">Name: {JSON.parse(tokenAddress.poolDetails).name}</p>
                                <p className="text-sm font-semibold">Symbol: {JSON.parse(tokenAddress.poolDetails).symbol}</p>
                                <p className="text-sm font-semibold">Tag: {JSON.parse(tokenAddress.poolDetails).Tag}</p>
                            </div>

                            {/* Description, Website, Twitter, Telegram, Tag displayed line by line */}
                            <p className="mt-2 text-sm">Description: {JSON.parse(tokenAddress.poolDetails).description}</p>
                            <p className="mt-2 text-sm">Website: <a href={JSON.parse(tokenAddress.poolDetails).Website} target="_blank" rel="noopener noreferrer" className="text-blue-500">{JSON.parse(tokenAddress.poolDetails).Website}</a></p>
                            <p className="mt-2 text-sm">Twitter: <a href={JSON.parse(tokenAddress.poolDetails).Twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500">{JSON.parse(tokenAddress.poolDetails).Twitter}</a></p>
                            <p className="mt-2 text-sm">Telegram: <a href={JSON.parse(tokenAddress.poolDetails).Telegram} target="_blank" rel="noopener noreferrer" className="text-blue-500">{JSON.parse(tokenAddress.poolDetails).Telegram}</a></p>
                            <button
                                onClick={closeModal} // Close the modal
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className='Clearfix'></div>
            </div>
        </div>
    );
};

export default Admin;
