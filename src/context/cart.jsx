import React, { Component } from 'react';
import { decrypt, encrypt, url } from '../lib';
import Axios from 'axios';
import openSocket from "socket.io-client";
import {db} from "../components/firebase/index";
import firebase from 'firebase';

export const CartContext = React.createContext(
    {
        cart: {
            data_cart: [],
            count_data_cart: 0,
            check_load: 'no',
        },
        notif: {
            data_notif: [],
            count_data_notif: 0,
            check_load_notif: 'no'
        },
        loadDataCart: () => { },
        loadDataNotif: () => { },
        sendNotif: () => { },
    }
);

export default class CartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: {
                data_cart: [],
                count_data_cart: 0,
                check_load: 'no',
            },
            notif: {
                data_notif: [],
                count_data_notif: 0,
                check_load_notif: 'no'
            },
            room_id: '',
            setRoomID: this.setRoomID,
            loadDataCart: this.loadDataCart,
            loadDataNotif: this.loadDataNotif,
            sendNotif: this.sendNotif
        };
    }

    componentDidMount() {

        db.collection('message').where("buyerId", "==", "10").onSnapshot(snapshot => {
            snapshot.docs.map(doc => {
                console.log(doc.data())
            })
        })

        // db.collection('message').add({
        //     content: msg,
        //     buyerId: buyer_id,
        //     sellerId: sender_id,
        //     timestamp: firebase.firestore.FieldValue.serverTimestamp()
        // })

        // db.collection('message').onSnapshot(snapshot => {
        //     snapshot.docs.map(doc => {
        //         console.log(doc.data())
        //         alert('response')
        //     })
        // })

        // const socket = openSocket("https://chats-front.herokuapp.com/");

        // socket.emit("send_data_nego_to_admin", {
        //     seller_id: 20,
        //     buyer_id: 10,
        //     room_id: "10-20"
        // })

        // socket.emit("join_room_nego", {
        //     room_id: "10-20"
        // })

        // socket.on('nego_response', data => {
        //     console.log(data)
        //     // const options = {
        //     //     autoClose: false,
        //     //     className: 'custom-toast',
        //     //     position: 'bottom-right',
        //     //     autoClose: 5000
        //     // };
        //     // setTimeout(function () {
        //     // // toast.success('💬 Ada balasan nego dari penjual', options);
        //     // alert('nego balas')
        //     // }, timeout);

        //     if (data.source != 'buyer-direct_response') {
        //         var timeout = 0
        //         if (data.source == 'buyer-hold_response') {
        //             // timeout = 3600000
        //             timeout = 20000
        //         }
        //         setTimeout(() => {
        //             this.loadDataNotif()
        //         }, timeout);
        //     }
        // })
    }

    loadDataCart = async () => {

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

    loadDataNotif = async () => {

        // alert('load data notif')

        let query = encrypt("select barang_id, barang_nama, buyer_id, buyer_nama, " +
            "seller_id, seller_nama from gcm_notification_nego where read_flag = 'N' and source = 'seller' " +
            "and buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " order by date desc")

        await Axios.post(url.select, {
            query: query
        }).then(data => {
            this.setState({
                notif: {
                    data_notif: data.data.data,
                    count_data_notif: data.data.data.length,
                    check_load_notif: 'yes'
                },
            });
        }).catch(err => {
            console.log('error' + err);
            console.log(err);
        })
    }

    sendNotif = (get_seller_id, get_harga_nego, get_check_nego_auto) => {

        db.collection('message').add({
            content: 'test',
            buyerId: '10',
            sellerId: '99',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        //const socket = openSocket("https://chats-front.herokuapp.com/");

        // console.log('send notif')

        // socket.emit("send_data_nego_to_admin", {
        //     seller_id: 20,
        //     buyer_id: 10,
        //     room_id: "10-20"
        // })

        // socket.emit("join_room_nego", {
        //     room_id: "10-20"
        // })

        // socket.on('nego_response', data => {

        //     if (data.source != 'buyer-direct_response') {
        //         var timeout = 0
        //         if (data.source == 'buyer-hold_response') {
        //             // timeout = 3600000
        //             timeout = 20000
        //         }
        //         setTimeout(() => {
        //             this.loadDataNotif()
        //         }, timeout);
        //     }
        // })

        // setTimeout(() => {
        //     // socket.emit('nego', {
        //     //     room_id: "10-20",
        //     //     harga_nego: "send nego",
        //     //     source: "buyer-hold_response"
        //     // })
        //     alert('timeout 10 s')
        // }, 10000);

        // socket.emit('nego', {
        //     room_id: "10-20",
        //     harga_nego: "send nego",
        //     source: "buyer-hold_response"
        // })

    }

    setRoomID = (get_room) => {
        this.setState({
            room_id: get_room
        });
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