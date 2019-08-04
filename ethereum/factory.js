import web3 from './web3';
// we need to tell web3 about the deployed contract
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0x3583D0392415b76049F4C31C72eFc7528Be7B514'
);

export default instance;