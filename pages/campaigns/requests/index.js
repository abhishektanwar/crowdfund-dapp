import React,{ Component } from 'react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Button,Table } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
import { request } from 'https';

class RequestIndexsd extends Component{
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        console.log(approversCount);
        const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element,index)=> {
            return campaign.methods.requests(index).call();
            }));
        return { address,requests,approversCount };
    }

    renderRow() {
        return this.props.requests.map((request,index)=>{
            return <RequestRow 
                
                key={index}
                id={index}
                request={request}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />
        })
    }

    render() {
        const { Header,Row,HeaderCell,Body } = Table;
        return(
            <Layout>
                <h3>Request List</h3>
                
                {this.props.address}
                {/* <Link route={`/campaigns/${this.props.address}/requests/new`}> 
                    <a>
                        <Button primary>
                            Add Request
                        </Button>
                    </a>
                    
                </Link> */}
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button
                            primary
                            floated="right"
                            style={{ marginBottom: '10px' }}
                        >
                            Add Request
                        </Button>
                    </a>
                </Link>

                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRow()}
                    </Body>

                </Table>

            </Layout>
            
        );
    }
}

export default RequestIndexsd;

