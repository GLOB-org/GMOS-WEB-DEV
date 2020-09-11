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

        await Axios.post(url.select, {
            query: query
        }).then(data => {

        }).catch(err => {
            console.log('error' + err);
            console.log(err);
        })
    }

    async loadDataNotif() {

        let query = encrypt("select a.*, b.nama_perusahaan as seller_nama from "+
        "(select a.barang_id, c.nama as barang_nama, a.buyer_id, d.nama_perusahaan as buyer_nama, a.seller_id, "+
            "to_char(a.date, 'dd-MM-yyyy / HH24:MI') as date, a.status from gcm_notification_nego a "+
	        "inner join gcm_list_barang b on a.barang_id = b.id "+
	        "inner join gcm_master_barang c on b.barang_id = c.id "+
	        "inner join gcm_master_company d on a.buyer_id = d.id "+
	        "where a.read_flag = 'N' and a.source = 'seller' "+
	        "and now() >= a.date and a.buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) +
            ") a "+
            "inner join gcm_master_company b on a.seller_id = b.id order by a.date desc")

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
            let text_nego = "Balasan negosiasi ";
            let text_approved = "Negosiasi berhasil disepakati"

            return (
                <div>
                    <label style={{ fontSize: '12px' }}><strong> {item.status === "nego" ? text_nego : text_approved } </strong></label>
                    <div className="address-card__row-title" ><label><strong>{item.seller_nama}</strong></label></div>
                    <div className="dropcart__product-name">
                        <label style={{ fontSize: '13px', fontWeight: '550' }}>{item.barang_nama}</label>
                    </div>
                    <div className="address-card__row-title mt-2">
                        <img src={"/images/schedule-black-15dp.png"} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                        <span style={{ verticalAlign: 'middle' }}>
                            {item.date}
                        </span>
                    </div>
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
                            let text_nego = "Balasan negosiasi ";
                            let text_approved = "Negosiasi berhasil disepakati"

                            return (
                                <div>
                                    <label style={{ fontSize: '12px' }}><strong>{item.status === "nego" ? text_nego : text_approved }</strong></label>
                                    <div className="address-card__row-title" ><label><strong>{item.seller_nama}</strong></label></div>
                                    <div className="dropcart__product-name">
                                        <label style={{ fontSize: '13px', fontWeight: '550' }}>{item.barang_nama}</label>
                                    </div>
                                    <div className="address-card__row-title mt-2">
                                        <img src={"/images/schedule-black-15dp.png"} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                                        <span style={{ verticalAlign: 'middle' }}>{item.date}</span>
                                    </div>
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
