// react
import React, { Component } from 'react';

// third-party
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// application
import Pagination from '../shared/Pagination';

// data stubs
import dataOrders from '../../data/accountOrders';
import theme from '../../data/theme';


export default class AccountPageOrders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orders: dataOrders,
            page: 1,
        };
    }

    handlePageChange = (page) => {
        this.setState(() => ({ page }));
    };

    render() {
        const { page, orders } = this.state;

        const ordersList = orders.map((order) => (
            <tr key={order.id}>
                <td><Link to="/">{`#${order.id}`}</Link></td>
                <td>{order.date}</td>
                <td>{order.status}</td>
                <td>{order.total}</td>
            </tr>
        ));

        return (
            <div className="card">
                <Helmet>
                    <title>{`Order History — ${theme.name}`}</title>
                </Helmet>

                <div className="card-header">
                    <div className="row">
                        <div className="col-md-8" >
                            <h5>Order History</h5>
                        </div>
                        <div className="col-md-4" >
                            <div className="input-group" >
                                <input id="searchBarTransaction" type="text" class="form-control" placeholder="Search data here..." />
                                <div className="input-group-append">
                                    <span id="searchBarTransaction" className="input-group-text"><i className="fa fa-search"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-divider" />
                <div className="card-table">
                    <div className="table-responsive-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tanggal</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersList}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-divider" />
                <div className="card-footer">
                    <Pagination current={page} total={3} onPageChange={this.handlePageChange} />
                </div>
            </div>
        );
    }
}
