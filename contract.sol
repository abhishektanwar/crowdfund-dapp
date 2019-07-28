pragma solidity ^0.4.17;

contract Campaign {
    
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        
        
    }
    
    Request[] public requests;
    
    address public manager;
    address[] public approvers;
    uint public minimumContribution;    
    
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
    function Campaign(uint minimum) public {
        manager = msg.sender;
        minimumContribution = minimum;
    }
    
    function contribute() public payable{
        require (msg.value > minimumContribution);
        approvers.push(msg.sender);
    }
    
    function createRequest(string _description , uint _value, address _recipient) 
        public restricted {
           Request newRequest = Request({
                description : _description ,
                value : _value ,
                recipient : _recipient ,
                complete : false
            });
            requests.push(newRequest);
    }
    
}
