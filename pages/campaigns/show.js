import React,{ Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card,Grid,Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class campaignShow extends Component {
    // fetching the summary first
    static async getInitialProps(props) {
        // getting address out of url
        const campaign = Campaign(props.query.address);
        // console.log(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        // console.log(summary);
        return { 
            address:props.query.address,
            minimumContribution: summary[0],            
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
         };
    }

    renderCards() {
        const {
            
            balance,
            manager,
            requestsCount,
            minimumContribution,
            approversCount
        }= this.props;
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                style: { overflowWrap: 'break-word' },
                description:'Manager created this campaign and can create requests to withdraw funds'
            },
            {
                header:minimumContribution,
                meta:'Minimum Contribution(wei)',
                description:'You must contribute atleast this much to become an approver'
            },
            {
                header:requestsCount,
                meta:'Number of Request',
                description:'A request is created by manager to withdraw funds from contract.Requests must be approved by withdrawers'
            },
            {
                header:approversCount,
                meta:'NUmber of approvers',
                description:'Number of people who have already donated to this campaign/contract'
            },
            {
                header:web3.utils.fromWei(balance,'ether'),
                meta:'Campaign balance (ether)',
                description:'The balance is how much money this campaign has left to spend'
            }
            
            
            
        ];
        return <Card.Group items={items} />;
    }
    
    
    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>

                    
                    <Grid.Column width={10}>
                    {this.renderCards()}
                    <Grid.Row>
                        <Grid.Column>
                        <Link route={`/campaigns/${this.props.address}/requests`}>
                            <a>
                                <Button primary>
                                    View Requests
                                </Button>
                            </a>
                        </Link>
                        </Grid.Column>
                    </Grid.Row>
                    
                    </Grid.Column>
                    <Grid.Column width={6}>
                    <ContributeForm address={this.props.address} />        
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
                
                
            </Layout>
            
        );
    }
}
export default campaignShow;