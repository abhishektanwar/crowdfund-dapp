import web3 from './web3';
// we need to tell web3 about the deployed contract
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0xA6634b1EC384E99913a6B4B7256f7554E192c910'
);

export default instance;