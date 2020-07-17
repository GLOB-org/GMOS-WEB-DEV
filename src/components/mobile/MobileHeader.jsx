// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

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
        };
        this.searchInput = React.createRef();
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
                            {/* <h5 className="mobile-header__logo">GLOB</h5> */}
                            {/* <Link to="/" className="mobile-header__logo"><LogoSmallSvg /></Link> */}
                            <Link to="/" className="mobile-header__logo"><LogoGLoBMobile /></Link>
                            
                            {/* <Search
                                context="mobile-header"
                                className={searchClasses}
                                inputRef={this.searchInput}
                                onClose={this.handleCloseSearch}ss
                            /> */}
                            <div className="mobile-header__indicators">
                                {/* <Indicator
                                    className="indicator--mobile indicator--mobile-search d-md-none"
                                    onClick={this.handleOpenSearch}
                                    icon={<Search20Svg />}
                                />
                                <Indicator
                                    className="indicator--mobile d-sm-flex d-none"
                                    url="/shop/wishlist"
                                    value={wishlist.length}
                                    icon={<Heart20Svg />}
                                /> */}
                                {/* <Indicator
                                    className="indicator--mobile"
                                    url="/keranjang"
                                    // value={cart.quantity}
                                    icon={<Cart20Svg />}
                                /> */}

                                {checkLogin ?
                                    (

                                        <CartContext.Consumer>
                                            {value => {
                                                return (
                                                    <Indicator
                                                        className="indicator--mobile"
                                                        url="/keranjang"
                                                        value={value.cart.count_data_cart}
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
