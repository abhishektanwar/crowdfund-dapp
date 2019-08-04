const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const CompiledFactory = require('./build/CampaignFactory.json');
const provider = new HDWalletProvider(
    'picture west maple inmate govern basket provide absurd tomorrow service exchange situate',
    'https://rinkeby.infura.io/v3/bb040abf2e0140bb9885ae3d83c37238'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy from account' ,accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(CompiledFactory.interface))
        .deploy({data : '0x' + CompiledFactory.bytecode})
        .send({ from : accounts[0] });
    console.log('contract deployed to ' ,result.options.address);
    
};

deploy();