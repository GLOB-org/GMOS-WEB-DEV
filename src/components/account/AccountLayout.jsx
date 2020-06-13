// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import {
    Link,
    matchPath,
    Redirect,
    Switch,
    Route,
} from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';

// pages
import AccountPageDashboard from './AccountPageDashboard';
import AccountPageDistributor from './AccountPageDistributor';
import AccountPageVerification from './AccountPageVerification';


export default class AccountLayout extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { match, location } = this.props;

        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Akun', url: '' },
        ];

        const links = [
            { title: 'Profile', url: 'profile' },
            { title: 'Distributor', url: 'distributor' },
            // { title: 'Verifikasi Akun', url: 'verifikasi' },
        ].map((link) => {
            const url = `${match.url}/${link.url}`;
            const isActive = matchPath(location.pathname, { path: url });
            const classes = classNames('account-nav__item', {
                'account-nav__item--active': isActive,
            });

            return (
                <li key={link.url} className={classes}>
                    <Link to={url}>{link.title}</Link>
                </li>
            );
        });
        return (
            <React.Fragment>
                <PageHeader header="Akun" breadcrumb={breadcrumb} />

                <div className="block">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-lg-3 d-flex">
                                <div className="account-nav flex-grow-1">
                                    <h4 className="account-nav__title">Menu</h4>
                                    <ul>{links}</ul>
                                </div>
                            </div>
                            <div className="col-12 col-lg-9 mt-4 mt-lg-0">
                                <Switch>
                                    <Redirect exact from={match.path} to={`${match.path}/profile`} />
                                    <Route exact path={`${match.path}/profile`} component={AccountPageDashboard} />
                                    <Route exact path={`${match.path}/distributor`} component={AccountPageDistributor} />
                                    {/* <Route exact path={`${match.path}/verifikasi`} component={AccountPageVerification} /> */}
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
