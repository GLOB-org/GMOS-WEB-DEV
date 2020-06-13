// react
import React from 'react';

// third-party
import { Link } from 'react-router-dom';


export default function BlockBanner() {
    return (
        <div className="block block-banner">
            <div className="container">
                <Link to="/daftarproduk" className="block-banner__body">
                    <div
                        className="block-banner__image block-banner__image--desktop"
                        style={{ backgroundImage: 'url("images/slides/banner1.jpg")' }}
                    />
                    <div
                        className="block-banner__image block-banner__image--mobile"
                        style={{ backgroundImage: 'url("images/slides/banner1.jpg")' }}
                    />
                    <div className="block-banner__title">
                        {/* Hundreds
                        <br className="block-banner__mobile-br" />
                        Hand Tools */}
                        {/* <label style={{ color : 'red'}}>Raw Material Store</label> */}
                    </div>
                    <div className="block-banner__text">
                        <label>Pharmaceutical, Food and Beverages , Cosmetic and Toiletries, Veterinary</label>
                    </div>
                    <div className="block-banner__button">
                        <span className="btn btn-sm btn-primary">Belanja Sekarang</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
