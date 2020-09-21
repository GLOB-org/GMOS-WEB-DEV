import React, { Component } from 'react';
import { decrypt, encrypt, url } from '../lib';
import Axios from 'axios';
import { db } from "../components/firebase/index";
import { toast } from 'react-toastify';
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
        sendNotifikasi: () => { },
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
            sendNotifikasi: this.sendNotifikasi
        };
    }

    componentDidMount() {

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("./firebase-messaging-sw.js")
                .then(function (registration) {
                    console.log("Registration successful, scope is:", registration.scope);
                })
                .catch(function (err) {
                    console.log("Service worker registration failed, error:", err);
                });
        }

        navigator.serviceWorker.addEventListener("message", (message) => this.getNotifikasi(message));

    }

    loadDataCart = async () => {

        let query = encrypt("SELECT a.id, a.history_nego_id, e.harga_final, d.nama_perusahaan, c.nama, c.berat, f.alias as satuan," +
            "a.barang_id, b.kode_barang, b.price, b.foto, b.flag_foto, c.category_id, b.company_id as seller_id, d.kode_seller, d.nama_perusahaan as nama_seller, qty, harga_konsumen, a.harga_sales, nego_count, time_respon, " +
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

        let query = encrypt("select a.barang_id, a.nama_barang, a.buyer_id, a.buyer_nama, a.seller_id, to_char(a.date, 'dd-MM-yyyy / HH24:MI') as date, " +
            "a.status, b.nama_perusahaan as seller_nama from (select a.barang_id, c.nama as nama_barang, a.buyer_id, " +
            "d.nama_perusahaan as buyer_nama, a.seller_id, a.date, a.status " +
            "from gcm_notification_nego a " +
            "inner join gcm_list_barang b on a.barang_id = b.id " +
            "inner join gcm_master_barang c on b.barang_id = c.id " +
            "inner join gcm_master_company d on a.buyer_id = d.id " +
            "where a.read_flag = 'N' and a.source = 'seller' and now() >= a.date and a.buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " ) a " +
            "inner join gcm_master_company b on a.seller_id = b.id order by a.date desc")

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

    buildAlert = (key_notif) => {
        const timeout = 0
        const options = {
            // autoClose: false,
            className: 'custom-toast',
            position: 'bottom-right',
            autoClose: 5000
        };
        setTimeout(function () {

            if (key_notif == "nego") {
                toast.success('Ada balasan nego dari penjual', options);
            }
            else if (key_notif == "nego_approved") {
                toast.success('1 Negosiasi berhasil disepakati', options);
            }

        }, timeout);

    }

    getNotifikasi = (get_message) => {

        if (get_message.data["firebase-messaging-msg-data"]) {
            var key_notif = get_message.data["firebase-messaging-msg-data"].data.key
        }
        else {
            var key_notif = get_message.data.data.key
        }

        // try {
        //     var key_notif = get_message.data["firebase-messaging-msg-data"].data.key
        // }
        // catch (err) {
        //     console.log('error')
        //     console.log(err)
        // }

        this.loadDataNotif()
        this.buildAlert(key_notif)

        if (key_notif == "nego_approved") {
            this.loadDataCart()
        }

        if (window.location.pathname == '/transaksi/nego') {
            window.location.reload()
        }
    }

    sendNotifikasi = async (get_send_nego, get_barang_id, get_barang_nama, get_buyer_id,
        get_seller_id, get_seller_nama, get_token, get_check_nego_auto, get_id_master_cart) => {
        const data_token_buyer = []
        const data_token_seller = []

        if (get_send_nego == true) {

            if (get_check_nego_auto == true) {
                var query = encrypt("insert into gcm_notification_nego (barang_id, buyer_id, " +
                    "seller_id, source, date, status) values (" + get_barang_id + "," + get_buyer_id +
                    "," + get_seller_id + ",'seller', now() + interval '1 hour', 'nego')");

            }
            else {
                var query = encrypt("insert into gcm_notification_nego (barang_id, buyer_id, " +
                    "seller_id, source, status) values (" + get_barang_id + "," + get_buyer_id +
                    "," + get_seller_id + ",'buyer', 'nego')");

            }

            await Axios.post(url.select, {
                query: query
            }).then(data => {

                if (get_check_nego_auto == true) {
                    var nego_type = "nego_persen"
                }
                else {
                    var nego_type = "nego_sales"
                }

                const body = {
                    nego_type: nego_type,
                    timeout: 3600000,
                    id_cart: get_id_master_cart,
                    company_id_buyer: get_buyer_id,
                    company_id_seller: get_seller_id,
                }

                Axios.post("https://glob.co.id/External/sendNotification", body)
                    .then(res => {
                        console.log(res);
                    })


                // if (get_token.length > 0) {
                //     if (get_check_nego_auto == true) {
                //         for (var i = 0; i < get_token.length; i++) {
                //             if (get_token[i].company_id == Number(decrypt(localStorage.getItem('CompanyIDLogin')))) {
                //                 data_token_buyer.push(get_token[i].token)
                //             }
                //             else {
                //                 data_token_seller.push(get_token[i].token)
                //             }
                //         }

                //         const body_buyer = {
                //             token: data_token_buyer,
                //             timeout: 300000,
                //             id_cart: get_id_master_cart
                //         }

                //         const body_seller = {
                //             token: data_token_seller,
                //             timeout: 0,
                //             id_cart: get_id_master_cart
                //         }

                //         // send to buyer
                //         Axios.post("https://glob.co.id/External/sendNotification", body_buyer)
                //             .then(res => {
                //                 console.log('send to buyer')
                //                 console.log(res);
                //             })

                //         // send to seller    
                //         if (data_token_seller.length > 0) {
                //             Axios.post("https://glob.co.id/External/sendNotification", body_seller)
                //                 .then(res => {
                //                     console.log('send to seller')
                //                     console.log(res);
                //                 })
                //         }
                //     }
                //     else {
                //         for (var i = 0; i < get_token.length; i++) {
                //             data_token_seller.push(get_token[i].token)
                //         }

                // const body = {
                //     token: data_token_seller,
                //     timeout: 300000,
                //     id_cart: get_id_master_cart
                // }

                // Axios.post("https://glob.co.id/External/sendNotification", body)
                //     .then(res => {
                //         console.log(res);
                //     })
                //     }

                // }

            }).catch(err => {
                console.log('error' + err);
                console.log(err);
            })
        }

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