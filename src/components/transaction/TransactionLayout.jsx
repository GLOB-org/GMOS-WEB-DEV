// react
import React from 'react';

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
import TransactionProgress from './TransactionProgress';
import TransactionNego from './TransactionNego';

export default function TransactionLayout(props) {
    const { match, location } = props;

    const breadcrumb = [
        { title: 'Beranda', url: '' },
        { title: 'Transaksi', url: '' },
    ];

    const links = [
        { title: 'Daftar Transaksi', url: 'daftartransaksi' },
        { title: 'Nego', url: 'nego' },
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
            <PageHeader header="Transaksi" breadcrumb={breadcrumb} />

            <div className="block">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-2 d-flex">
                            <div className="account-nav flex-grow-1">
                                <h4 className="account-nav__title">Menu</h4>
                                <ul>{links}</ul>
                            </div>
                        </div>
                        <div className="col-12 col-lg-10 mt-4 mt-lg-0">
                            <Switch>
                                <Redirect exact from={match.path} to={`${match.path}/daftartransaksi`} />
                                <Route exact path={`${match.path}/daftartransaksi`} component={TransactionProgress} />
                                <Route exact path={`${match.path}/nego`} component={TransactionNego} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
