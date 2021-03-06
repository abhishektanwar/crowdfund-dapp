const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/campaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let camapaignAddress;
let camapaign;
// accounts[0] is the manager of crowdfund campaign
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data : '0x' + compiledFactory.bytecode  })
        .send({from:accounts[0] , gas:1000000  });
// creating instance of campaign contract though factorycampaign contract method
   await factory.methods.createCampaign('100').send({
    from:accounts[0] , gas:'1000000 ' 
   }); 
//    returns the addresses of deployed campaign contracts
   [camapaignAddress] = await factory.methods.getdeployedCampaigns().call();
//    CamapaignAddress = address[0]
// accessing / deploying a contract at address:camapignAddress
   camapaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface),
   camapaignAddress
   );

});

describe('Camapigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        console.log(factory.options.address);
        console.log(accounts[0]);
        assert.ok(camapaign.options.address);
        console.log(camapaign.options.address)
    });
// caller of createCampaign function in factorycapaign is manager of camapign contract
    it('marks caller as campaign manager' , async () =>{
        const manager_address = await camapaign.methods.manager().call();
        assert.equal(accounts[0],manager_address);
    });    
    
    it('allows people to contribute money and marks them as approver' , async () => {
        await camapaign.methods.contribute().send({
            value:'200',
            from : accounts[1]
        });
        const isContributor = await camapaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution ',async () => {
        try {
            await camapaign.methods.contribute().send({
                value:'5',
                from:accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('allows a manager to make payment request', async () => {
        await camapaign.methods
            .createRequest('buy battries' , '100',accounts[1]).send({
                from:accounts[0],
                gas:'1000000'
            });
        const request = await camapaign.methods.requests(0).call();
        assert.equal('buy battries',request.description)    ; 
    });

    it('processes request',async () => {
        await camapaign.methods.contribute().send({
            from : accounts[0],
            value : web3.utils.toWei('10','ether')
        });

        await camapaign.methods
            .createRequest('but casing',web3.utils.toWei('5','ether'),accounts[1])
            .send({from:accounts[0],gas:'1000000'});

        await camapaign.methods.approveRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        });
        
        await camapaign.methods.finalizeRequest(0).send({
            from:accounts[0],
            gas : '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104)
    });
});