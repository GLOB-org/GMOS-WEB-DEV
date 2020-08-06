// react
import React, { Component } from 'react';

// third-party
import { connect } from 'react-redux';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';

// application
import Indicator from './Indicator';
import { Notif20Svg } from '../../svg';
import { cartRemoveItem } from '../../store/cart';
import { CartContext } from '../../context/cart';

class IndicatorNotification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data_notif: [],
        }
    }

    async componentDidMount() {
        this.loadDataNotif()
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

    async loadDataNotif() {

        let query = encrypt("select barang_id, barang_nama, buyer_id, buyer_nama, " +
            "seller_id, seller_nama from gcm_notification_nego where read_flag = 'N' and source = 'seller' " +
            "and buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " order by date desc")

        await Axios.post(url.select, {
            query: query
        }).then(data => {
            this.setState({
                data_notif: data.data.data
            });
        }).catch(err => {
            console.log('error' + err);
            console.log(err);
        })
    }

    render() {
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
                            <button type="submit" onClick={async () => { await this.readNotif(); await value.loadDataNotif() }} className="btn btn-primary btn-xs " style={{ width: '100%' }}>
                                Tandai telah dibaca ({this.state.data_notif.length})
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
            <CartContext.Consumer>
                {value => {
                    const load = value.notif.check_load_notif;
                    const count_notif = value.notif.count_data_notif;

                    if (count_notif > 0) {
                        return load == 'yes' ? (
                            //sblmnya dropdown_null
                            <Indicator type={'notification'} dropdown={dropdown} value={count_notif} icon={<Notif20Svg />} />
                        ) : (
                                <Indicator type={'notification'} dropdown={dropdown} value={this.state.data_notif.length} icon={<Notif20Svg />} />
                            );
                    }
                    else if (load == "no" && count_notif == 0 && this.state.data_notif.length == 0) {
                        return (
                            //sblmnya dropdown_null
                            <Indicator type={'notification'} dropdown={dropdown_null} value={count_notif} icon={<Notif20Svg />} />
                        )
                    }
                    else {
                        return load == 'yes' ? (
                            //sblmnya dropdown_null
                            <Indicator type={'notification'} dropdown={dropdown_null} value={count_notif} icon={<Notif20Svg />} />
                        ) : (
                                //sblmnya dropdown_null
                                <Indicator type={'notification'} dropdown={dropdown_first} value={this.state.data_notif.length} icon={<Notif20Svg />} />
                                // <Indicator url="/shop/cart" dropdown={dropdown_first} value={this.state.data_cart.length} icon={<Heart20Svg />} />
                            );
                    }
                }}
            </CartContext.Consumer>
        )
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
});

const mapDispatchToProps = {
    cartRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorNotification);
