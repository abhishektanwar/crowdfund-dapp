import Web3 from 'web3';

// const web3 = new Web3(window.web3.currentProvider);
// const web3 = new Web3('https://rinkeby.infura.io/v3/bb040abf2e0140bb9885ae3d83c37238');
// provider provided by metamast,as of now only users 
// who have metamask can access this application

let web3;
// if typeof window is defined it means we are in browser
// if typeof window.web3 is defined => metamast is installed
// else we are on server or metamask is not installed
//  web3 is provided by us through infura 
if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined' ){
     web3 = new Web3(window.web3.currentProvider);
}
else{
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/bb040abf2e0140bb9885ae3d83c37238');
    web3 = new Web3(provider);

}
export default web3;
