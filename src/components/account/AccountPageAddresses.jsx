// react
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { decrypt, encrypt, url } from '../../lib';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// data stubs
import dataAddresses from '../../data/accountAddresses';
import theme from '../../data/theme';

export default function AccountPageAddresses() {
    
    const [dataAddresses, setDataAddresses] = useState([]);

    useEffect(() => {
        let queryAddress = "select .....from data_adresses"
        const source = Axios.CancelToken.source();

        Axios.post(url.select, {
            query: queryAddress,
        }).then(function (response) {
            setDataAddresses(response.addresses);
        });

        return () => {
            source.cancel();
        };
    }, []);

    const addresses = dataAddresses.map((address) => (
        <React.Fragment key={address.id}>
            <div className="addresses-list__item card address-card">
                {address.default && <div className="address-card__badge">Default</div>}

                <div className="address-card__body">
                    <div className="address-card__name">{`${address.firstName} ${address.lastName}`}</div>
                    <div className="address-card__row">
                        {address.country}
                        <br />
                        {address.postcode}
                        ,
                        {address.city}
                        <br />
                        {address.address}
                    </div>
                    <div className="address-card__row">
                        <div className="address-card__row-title">Phone Number</div>
                        <div className="address-card__row-content">{address.phone}</div>
                    </div>
                    <div className="address-card__row">
                        <div className="address-card__row-title">Email Address</div>
                        <div className="address-card__row-content">{address.email}</div>
                    </div>
                    <div className="address-card__footer">
                        <Link to="/">Edit</Link>
                        &nbsp;&nbsp;
                        <Link to="/">Remove</Link>
                    </div>
                </div>
            </div>
            <div className="addresses-list__divider" />
        </React.Fragment>
    ));

    return (
        <div className="addresses-list">
            <Helmet>
                <title>{`Address List — ${theme.name}`}</title>
            </Helmet>

            <Link to="/" className="addresses-list__item addresses-list__item--new">
                <div className="addresses-list__plus" />
                <div className="btn btn-secondary btn-sm">Add New</div>
            </Link>
            <div className="addresses-list__divider" />
            {addresses}
        </div>
    );
}
