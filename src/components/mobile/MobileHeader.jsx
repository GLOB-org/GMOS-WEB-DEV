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
    Notif20Svg,
    Cart20Svg,
    LogoGLoBMobile
} from '../../svg';
import { mobileMenuOpen } from '../../store/mobile-menu';
import { CartContext } from '../../context/cart';

class MobileHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchOpen: false,
            data_cart_count: '0',
            data_notif: [],
            data_notif_count: '0',
        };
        this.searchInput = React.createRef();
    }

    componentDidMount() {
        this.loadDataCart()
        // this.loadDataNotif()
    }

    async readNotif() {
        let query = encrypt("update gcm_notification_nego set read_flag = 'Y' where " +
            "buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')))

        // Toast.loading('', () => {
        // });

        await Axios.post(url.select, {
            query: query
        }).then(data => {
            // Toast.hide()
        }).catch(err => {
            console.log('error' + err);
            console.log(err);
        })
    }

    async loadDataCart() {
        if (localStorage.getItem('Login') != null) {
            let query = encrypt("select count(*) as count_cart from gcm_master_cart " +
                "where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status = 'A'");
            await Axios.post(url.select, {
                query: query
            }).then(async (data) => {
                await this.setState({
                    data_cart_count: data.data.data[0].count_cart
                });
            }).catch(err => {
                console.log('error' + err);
                console.log(err);
            })
        }
    }

    async loadDataNotif() {
        if (localStorage.getItem('Login') != null) {
            let query = encrypt("select a.*, b.nama_perusahaan as seller_nama from " +
                "(select a.barang_id, c.nama as barang_nama, a.buyer_id, d.nama_perusahaan as buyer_nama, a.seller_id, " +
                "to_char(a.date, 'dd-MM-yyyy / HH24:MI') as date, a.status from gcm_notification_nego a " +
                "inner join gcm_list_barang b on a.barang_id = b.id " +
                "inner join gcm_master_barang c on b.barang_id = c.id " +
                "inner join gcm_master_company d on a.buyer_id = d.id " +
                "where a.read_flag = 'N' and a.source = 'seller' " +
                "and now() >= a.date and a.buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) +
                ") a " +
                "inner join gcm_master_company b on a.seller_id = b.id order by a.date desc")

            await Axios.post(url.select, {
                query: query
            }).then(data => {
                this.setState({
                    data_notif: data.data.data,
                    data_notif_count: data.data.data.length
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

        let dropdown;
        let dropdown_first;
        let dropdown_null;

        const items = this.state.data_notif.map((item, index) => {
            let text = "Balasan nego ";

            return (
                <div>
                    <label style={{ fontSize: '13px', fontWeight: '550', textAlign: 'justify' }}>{text}<strong>"{item.barang_nama}"</strong> ({item.seller_nama})</label>
                    <hr style={{ margin: '8px' }} />
                </div>
            );
        });

        dropdown_first = (
            <div className="dropcart">
                <div className="dropcart__products-list" style={{ paddingBottom: '0px' }}>
                    <center>Notifikasi</center>
                </div>
                <div className="dropcart__products-list" style={{ overflowY: 'auto', maxHeight: '300px' }}>
                    {items}
                </div>
                <div className="dropcart__products-list" >
                    <CartContext.Consumer>
                        {(value) => (
                            <button type="submit" onClick={async () => { await this.readNotif(); await value.loadDataNotif() }}
                                className="btn btn-primary btn-xs " style={{ width: '100%' }}>
                                Tandai telah dibaca ({this.state.data_notif_count})
                            </button>
                        )}
                    </CartContext.Consumer>
                </div>
            </div >
        );

        dropdown_null = (
            <div className="dropcart">
                <div className="dropcart__empty">
                    Tidak ada notifikasi
                </div>
            </div>
        )

        dropdown = (
            <div className="dropcart" >
                <div className="dropcart__products-list" style={{ paddingBottom: '0px' }}>
                    <center>Notifikasi</center>
                </div>
                <CartContext.Consumer>
                    {value => {
                        const load = value.notif.check_load_notif;

                        const items_update = value.notif.data_notif.map((item, index) => {
                            let text = "Balasan nego ";

                            return (
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '550' }}>{text}<strong>"{item.barang_nama}"</strong> ({item.seller_nama})</label>
                                    <hr style={{ margin: '8px' }} />
                                </div>
                            );
                        });

                        return load == 'yes' ? (
                            <div className="dropcart__products-list" style={{ overflowY: 'auto', maxHeight: '300px' }}>{items_update}</div>
                        ) : (
                                <div className="dropcart__products-list" style={{ overflowY: 'auto', maxHeight: '300px' }}>{items}</div>
                            );

                    }}

                </CartContext.Consumer>

                <div className="dropcart__products-list" >
                    <CartContext.Consumer>
                        {(value) => (
                            <button type="submit" onClick={async () => { await this.readNotif(); await value.loadDataNotif() }} className="btn btn-primary btn-xs " style={{ width: '100%' }}>
                                Tandai telah dibaca ({value.notif.count_data_notif})
                            </button>
                        )}
                    </CartContext.Consumer>
                </div>
            </div>
        );

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
                                        // <CartContext.Consumer>
                                        //     {value => {
                                        //         const load = value.cart.check_load
                                        //         var value_cart_count = 0
                                        //         if (load == 'no') {
                                        //             value_cart_count = this.state.data_cart_count
                                        //         }
                                        //         else if (load == 'yes') {
                                        //             value_cart_count = value.cart.count_data_cart
                                        //         }

                                        //         return (

                                        //             <CartContext.Consumer>
                                        //                 {value => {
                                        //                     const load = value.notif.check_load_notif;
                                        //                     const count_notif = value.notif.count_data_notif;

                                        //                     if (count_notif > 0) {
                                        //                         return load == 'yes' ? (
                                        //                             <Indicator type={'notification'} className="indicator--mobile " dropdown={dropdown} value={count_notif} icon={<Notif20Svg />} />
                                        //                         ) : (
                                        //                                 <Indicator type={'notification'} className="indicator--mobile " dropdown={dropdown} value={this.state.data_notif.length} icon={<Notif20Svg />} />
                                        //                             );
                                        //                     }
                                        //                     else if (load == "no" && count_notif == 0 && this.state.data_notif.length == 0) {
                                        //                         return (
                                        //                             <Indicator type={'notification'} className="indicator--mobile " dropdown={dropdown_null} value={count_notif} icon={<Notif20Svg />} />
                                        //                         )
                                        //                     }
                                        //                     else {
                                        //                         return load == 'yes' ? (
                                        //                             <Indicator type={'notification'} className="indicator--mobile " dropdown={dropdown_null} value={count_notif} icon={<Notif20Svg />} />
                                        //                         ) : (
                                        //                                 <Indicator type={'notification'} className="indicator--mobile " dropdown={dropdown_first} value={this.state.data_notif.length} icon={<Notif20Svg />} />
                                        //                             );
                                        //                     }
                                        //                 }}
                                        //             </CartContext.Consumer>
                                        //         )
                                        //     }}
                                        // </CartContext.Consumer>
                                        null
                                    ) :
                                    (
                                        <NavLink to="/masuk">
                                            <button type="submit" id="btnLoginHeader" className="btn" >
                                                Masuk
                                            </button>
                                        </NavLink>
                                    )
                                }

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
                                                        type="cart"
                                                        url="/keranjang"
                                                        dropdown={null}
                                                        value={value_cart_count}
                                                        icon={<Cart20Svg />}
                                                    />
                                                )
                                            }}
                                        </CartContext.Consumer>
                                    ) :
                                    (
                                        <NavLink to="/daftar">
                                            <button type="submit" id="btnRegisterHeader" className="btn">
                                                Daftar
                                        </button>
                                        </NavLink>
                                    )
                                }

                                {/* {!checkLogin ? (
                                    <NavLink to="/daftar">
                                        <button type="submit" id="btnRegisterHeader" className="btn">
                                            Daftar
                                        </button>
                                    </NavLink>) : (
                                        null
                                    )
                                } */}
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
