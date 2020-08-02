// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';

// application
import Indicator from '../header/Indicator';
import {
    Menu18x14Svg,
    Heart20Svg,
    Cart20Svg,
    Cross20Svg,
    LogoGLoBMobile,
    LogoSmallSvg
} from '../../svg';
import { mobileMenuOpen } from '../../store/mobile-menu';
import { CartContext } from '../../context/cart';

class MobileHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchOpen: false,
            data_cart_count: '0'
        };
        this.searchInput = React.createRef();
    }

    async componentDidMount() {
        if (localStorage.getItem('Login') != null) {
            let query = encrypt("select count(*) as count_cart from gcm_master_cart " +
                "where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status = 'A'");
            await Axios.post(url.select, {
                query: query
            }).then(async (data)  => {
                await this.setState({
                    data_cart_count: data.data.data[0].count_cart
                });
            }).catch(err => {
                console.log('error' + err);
                console.log(err);
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { searchOpen } = this.state;

        if (searchOpen && searchOpen !== prevState.searchOpen && this.searchInput.current) {
            this.searchInput.current.focus();
        }
    }

    handleOpenSearch = () => {
        this.setState(() => ({ searchOpen: true }));
    };

    handleCloseSearch = () => {
        this.setState(() => ({ searchOpen: false }));
    };

    render() {
        const { openMobileMenu, wishlist, cart } = this.props;
        const { searchOpen } = this.state;
        const searchClasses = classNames('mobile-header__search', {
            'mobile-header__search--open': searchOpen,
        });
        const checkLogin = localStorage.getItem('Login');

        return (
            <div className="mobile-header">
                <div className="mobile-header__panel">
                    <div className="container">
                        <div className="mobile-header__body">
                            <button type="button" className="mobile-header__menu-button" onClick={openMobileMenu}>
                                <Menu18x14Svg />
                            </button>
                            <Link to="/" className="mobile-header__logo"><LogoGLoBMobile /></Link>

                            <div className="mobile-header__indicators">
                                {checkLogin ?
                                    (
                                        <CartContext.Consumer>
                                            {value => {
                                                const load = value.cart.check_load
                                                var value_cart_count = 0
                                                if (load == 'no') {
                                                    value_cart_count = this.state.data_cart_count
                                                }
                                                else if (load == 'yes') {
                                                    value_cart_count = value.cart.count_data_cart
                                                }

                                                return (
                                                    <Indicator
                                                        className="indicator--mobile"
                                                        url="/keranjang"
                                                        //value={value.cart.count_data_cart}
                                                        value={value_cart_count}
                                                        icon={<Cart20Svg />}
                                                    />
                                                )
                                            }}
                                        </CartContext.Consumer>
                                    ) :
                                    (
                                        <NavLink to="/masuk">
                                            <button type="submit" id="btnLoginHeader" className="btn" >
                                                Masuk
                                            </button>
                                        </NavLink>
                                    )
                                }

                                {!checkLogin ? (
                                    <NavLink to="/daftar">
                                        <button type="submit" id="btnRegisterHeader" className="btn">
                                            Daftar
                                        </button>
                                    </NavLink>) : (
                                        null
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    wishlist: state.wishlist,
});

const mapDispatchToProps = {
    openMobileMenu: mobileMenuOpen,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MobileHeader);
