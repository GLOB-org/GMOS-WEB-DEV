import React, { Component } from 'react';
import { decrypt, encrypt, url } from '../lib';
import Axios from 'axios';

export const CartContext = React.createContext({
    cart: {
        data_cart: [],
        count_data_cart: 0,
        check_load: 'no'
    },
    loadDataCart: () => { },
});

export default class CartContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cart: {
                data_cart: [],
                count_data_cart: 0,
                check_load: 'no'
            },
            loadDataCart: this.loadDataCart,
        };
    }

    loadDataCart = async () => {

        // let query = encrypt("SELECT a.id, a.history_nego_id, e.harga_final, d.nama_perusahaan, c.nama, c.berat, f.alias as satuan, a.barang_id, b.price, b.foto, c.category_id, b.company_id as seller_id, d.nama_perusahaan as nama_seller, qty, harga_konsumen, a.harga_sales, nego_count, time_respon, g.nominal as kurs " +
        //     "FROM  gcm_listing_kurs g, gcm_master_satuan f, gcm_master_cart a inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id inner join gcm_master_company d " +
        //     "on b.company_id=d.id left join gcm_history_nego e on a.history_nego_id = e.id  where f.id = c.satuan and g.company_id = b.company_id and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and a.status='A' and now() between g.tgl_start and g.tgl_end order by a.create_date asc")

        let query = encrypt("SELECT a.id, a.history_nego_id, e.harga_final, d.nama_perusahaan, c.nama, c.berat, f.alias as satuan," +
            "a.barang_id, b.price, b.foto, c.category_id, b.company_id as seller_id, d.nama_perusahaan as nama_seller, qty, harga_konsumen, a.harga_sales, nego_count, time_respon, " +
            "case when now() < time_respon then 'no' end as status_time_respon, g.nominal as kurs " +
            "FROM  gcm_listing_kurs g, gcm_master_satuan f, gcm_master_cart a inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id inner join gcm_master_company d " +
            "on b.company_id=d.id left join gcm_history_nego e on a.history_nego_id = e.id  where f.id = c.satuan and g.company_id = b.company_id and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) +
            " and a.status='A' and now() between g.tgl_start and g.tgl_end order by a.create_date asc")

        await Axios.post(url.select, {
            query: query
        }).then(data => {
            this.setState({
                cart: {
                    data_cart: data.data.data,
                    count_data_cart: data.data.data.length,
                    check_load: 'yes'
                },
            });
        }).catch(err => {
            console.log('error' + err);
            console.log(err);
        })

    };

    render() {
        const { children } = this.props;

        return (
            <CartContext.Provider value={this.state} >
                {children}
            </CartContext.Provider >
        );
    }
}