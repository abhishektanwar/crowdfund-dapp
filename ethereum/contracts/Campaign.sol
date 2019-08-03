pragma solidity ^0.4.25;

contract campaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum,msg.sender);
        deployedCampaigns.push(newCampaign);
        
    }
    function getdeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalcount;
        mapping (address => bool) approvals;
        
        
    }
    
    Request[] public requests;
    
    address public manager;
    mapping (address => bool) public approvers;
    uint public approversCount ;
    uint public minimumContribution;    
    
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
    constructor(uint minimum,address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable{
        require (msg.value > minimumContribution);
        approvers[msg.sender]=true;
        approversCount++;
    }
    
    function createRequest(string memory _description , uint _value, address _recipient) 
        public restricted {
           Request memory newRequest = Request({
                description : _description ,
                value : _value ,
                recipient : _recipient ,
                complete : false ,
                approvalcount : 0
                
            });
            requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender]=true;
        request.approvalcount++;
        
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalcount > (approversCount/2));
        request.recipient.transfer(request.value);
        request.complete = true ;
    }    
    
                
    
}
