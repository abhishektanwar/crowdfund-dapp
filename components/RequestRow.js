import React,{ Component } from 'react';
import { Table, Tab , Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import {Router} from '../routes';
import { timingSafeEqual } from 'crypto';
import { request } from 'https';
class RequestRow extends Component {

    state={loading:false,loading_finalize:false};

    onApprove = async (event) =>{
        event.preventDefault();
        this.setState({loading:true});
        try {
            
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            await campaign.methods.approveRequest(this.props.id).send({
                from:accounts[0]
        });
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (error) {
            
        }
        this.setState({loading:false});
        
    };

    onFinalize = async (event) =>{
        event.preventDefault();
        this.setState({loading_finalize:true});
        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            await campaign.methods.finalizeRequest(this.props.id).send({
                from:accounts[0]
            });
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (error) {
            
        }
        this.setState({loading_finalize:false});
    };

    render(){
        const { Row,Cell } = Table;
        const ready_to_finalize= this.props.request.approvalcount > this.props.request.approversCount/2;
        
        return(
            <Row disabled={ this.props.request.complete } positive={ ready_to_finalize && !this.props.request.complete }>
                <Cell>{this.props.id}</Cell>
                <Cell>{this.props.request.description}</Cell>
                <Cell>{web3.utils.fromWei(this.props.request.value,'ether')}</Cell>
                <Cell>{this.props.request.recipient}</Cell>
                <Cell>{this.props.request.approvalcount}/{this.props.approversCount}</Cell>
                { this.props.request.complete ? null : (
                    <Cell><Button loading={this.state.loading} onClick={this.onApprove}>Approve</Button></Cell>
                )
                    
                }
                
                
                <Cell><Button loading_finalize={this.state.loading_finalize} onClick={this.onFinalize} >Finalize Request</Button></Cell>
            
            </Row>
        );
    }
}

export default RequestRow;