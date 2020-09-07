// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import InputNumber from './InputNumberMax';
import InputNumber_sm from './InputNumber';

// application
import AsyncAction from './AsyncAction';
import Currency from './Currency';
import { cartAddItem } from '../../store/cart';
import { Quickview16Svg } from '../../svg';
import { compareAddItem } from '../../store/compare';
import { quickviewOpen } from '../../store/quickview';
import { wishlistAddItem } from '../../store/wishlist';
import NumberFormat from 'react-number-format';
import Toast from 'light-toast';
import { CartContext } from '../../context/cart';
import openSocket from "socket.io-client";
import { toast } from 'react-toastify';

class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_alamat: [],
            data_payment_listing: [],
            data_alamat_shipto: '', data_alamat_billto: '',
            opendetailbarang: false,
            opennego: false,
            openapprovednego: false,
            openresponnego: false,
            openresponnego_max: false,
            openqty: false,
            quantity_beli: parseInt(this.props.product.jumlah_min_beli),
            quantity_nego: parseInt(this.props.product.jumlah_min_nego),
            quantity: parseInt(this.props.product.berat),
            disable_qtynego: false,
            id_barang: '',
            status_selectedproduct: '',
            icon_nego1: 'fas fa-circle fa-xs',
            icon_nego2: 'fas fa-circle fa-xs',
            icon_nego3: 'fas fa-circle fa-xs',
            display_current_nego: 'none',
            currentnego_buyer: '',
            currentnego_seller: '',
            nego_auto: true,
            nego_ongoing: false,
            nego_count: 0,
            display_buttonnegolagi: 'block',
            id_history_nego: '',
            id_mastercart: '',
            get_sales_token: [],
            get_qtybarang: '', get_beratbarang: '',
            get_pricebarang: '', get_priceterendahbarang: '',
            persen_nego: '', respons_nego: '', send_nego: false,
            product_kurs_selected: '',
            disablekirimnego: false, disabletambahbarang: false,
            displaynegosuccess: false,
            count_barangnego: '',
            nego_lagi_click: false,
            query_done: ''
        }
    }

    static contextType = CartContext

    handleChangeQuantity = (quantity) => {
        this.setState({ quantity });
    };

    handleAddMouseDown = (kelipatan, source) => {
        if (source == 'beli') {
            var get_value = document.getElementById('product-quantity-beli').value.split('.').join("")
        } else {
            var get_value = document.getElementById('product-quantity_nego').value.split('.').join("")
        }
        var add_result = (Number(get_value) + Number(kelipatan))

        var reverse = add_result.toString().split('').reverse().join(''),
            input_value = reverse.match(/\d{1,3}/g);
        input_value = input_value.join('.').split('').reverse().join('');

        var input_value_edit = input_value.split('.').join("")

        if (source == 'beli') {
            document.getElementById('product-quantity-beli').value = input_value
            this.setState({ quantity_beli: input_value_edit });
        }
        else {

            if (this.state.disable_qtynego == false) {
                document.getElementById('product-quantity_nego').value = input_value
                this.setState({ quantity_nego: input_value_edit });
            }
            else {
                return;
            }
        }
    };

    handleSubMouseDown = (kelipatan, jumlah_min_beli, source) => {
        if (source == 'beli') {
            var get_value = document.getElementById('product-quantity-beli').value.split('.').join("")
        } else {
            var get_value = document.getElementById('product-quantity_nego').value.split('.').join("")
        } var add_result = (Number(get_value) - Number(kelipatan))

        var reverse = add_result.toString().split('').reverse().join(''),
            input_value = reverse.match(/\d{1,3}/g);
        input_value = input_value.join('.').split('').reverse().join('');

        var input_value_edit = input_value.split('.').join("")

        if (add_result < jumlah_min_beli) {
            return
        }
        else {
            if (source == 'beli') {
                document.getElementById('product-quantity-beli').value = input_value
                this.setState({ quantity_beli: input_value_edit });
            }
            else {
                if (this.state.disable_qtynego == false) {
                    document.getElementById('product-quantity_nego').value = input_value
                    this.setState({ quantity_nego: input_value_edit });
                }
                else {
                    return;
                }
            }
        }

    };

    handleChangeQuantityBeli = () => {

        var get_value_input = document.getElementById("product-quantity-beli").value.split('.').join("")
        var cek_kelipatan = Number(get_value_input) % Number(this.props.product.berat)

        this.setState({ quantity_beli: get_value_input });

        if (get_value_input.length == 1) {
            if (get_value_input == '0') {
                this.setState({
                    disabletambahbarang: true
                });
            }
        }

        if (Number(get_value_input) < Number(this.props.product.jumlah_min_beli) || cek_kelipatan != 0 || get_value_input.charAt(0) == 0) {
            this.setState({
                disabletambahbarang: true
            });
        } else if (Number(get_value_input) >= Number(this.props.product.jumlah_min_beli) && cek_kelipatan == 0) {
            this.setState({
                disabletambahbarang: false
            });
        }

    };

    handleValueNego = () => {
        var get_value_input = document.getElementById("inputNego").value

        if (get_value_input.charAt(0) == '0') {
            this.setState({
                disablekirimnego: true
            });
        }
        else {
            this.setState({
                disablekirimnego: false
            });
        }
    }

    handleChangeQuantityNego = () => {
        var get_value_input = document.getElementById("product-quantity_nego").value.split('.').join("")
        var cek_kelipatan = Number(get_value_input) % Number(this.props.product.berat)

        if (this.state.nego_ongoing == false) {
            // this.setState({ quantity_nego });
            this.setState({ quantity_nego: get_value_input });

        }

        if (get_value_input.length == 1) {
            if (get_value_input == '0') {
                this.setState({
                    disablekirimnego: true
                });
            }
        }

        if (Number(get_value_input) < Number(this.props.product.jumlah_min_nego) || cek_kelipatan != 0 || get_value_input.charAt(0) == 0) {
            this.setState({
                disablekirimnego: true
            });
        } else if (Number(get_value_input) >= Number(this.props.product.jumlah_min_nego) && cek_kelipatan == 0) {
            this.setState({
                disablekirimnego: false
            });
        }

    };

    approveNego_buyer = () => {
        Toast.loading('loading . . .', () => {
        });
        let update_hargafinal = encrypt("update gcm_history_nego set harga_final = " + this.state.input_nego + "   where id = '" + this.state.id_history_nego + "'")
        Axios.post(url.select, {
            query: update_hargafinal
        }).then(data => {
            Toast.hide();
            this.setState({
                openapprovednego: false
            });
            Toast.success('Proses nego berhasil dilakukan', 1500, () => {
            });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    approveNego_seller = async () => {

        Toast.loading('loading . . .', () => {
        });

        // let update_hargafinal = "with new_order as (update gcm_history_nego set harga_final = " + Math.ceil(this.state.product_kurs_selected * this.state.respons_nego) + "   where id = '" + this.state.id_history_nego + "')"
        // let update_hargakonsumen = "update gcm_master_cart set harga_konsumen = " + Math.ceil(this.state.product_kurs_selected * this.state.respons_nego ) * this.state.quantity_nego + " where id = " + this.state.id_mastercart

        let update_hargafinal = "with new_order as (update gcm_history_nego set harga_final = " + this.state.currentnego_seller + "   where id = '" + this.state.id_history_nego + "')"
        let update_hargakonsumen = "update gcm_master_cart set harga_konsumen = " + this.state.currentnego_seller * this.state.quantity_nego + " where id = " + this.state.id_mastercart

        await Axios.post(url.select, {
            query: encrypt(update_hargafinal.concat(update_hargakonsumen))
        }).then(data => {
            Toast.hide();
            this.setState({
                openresponnego: false
            });
            Toast.success('Proses nego berhasil dilakukan', 1500, () => {
            });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    cancelNego = () => {
        Toast.loading('loading . . .', () => {
        });
        let update_statuscart = encrypt("update gcm_master_cart set status = 'I' where id = " + this.state.id_mastercart)

        Axios.post(url.select, {
            query: update_statuscart
        }).then(data => {
            Toast.hide();
            this.setState({
                openresponnego: false,
                openapprovednego: false
            });
            Toast.success('Proses nego berhasil dibatalkan', 1500, () => {
            });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    kirimNego = async () => {

        Toast.loading('loading . . .', () => {
        });
        await this.responNego()
        var respons = Math.ceil(this.state.product_kurs_selected * this.state.respons_nego)
        var input_nego = document.getElementById('inputNego').value.split('.').join("")
        this.setState({
            input_nego: input_nego,
        })

        var user_id = decrypt(localStorage.getItem('UserIDLogin'))

        if (input_nego >= respons) {
            var nego2 = "with new_order as (update gcm_history_nego set harga_final = " + input_nego + ", harga_nego_2 = " + input_nego + ", harga_sales_2 = " + respons + ", updated_by_2 = " + user_id + " , updated_date_2 = now(), time_respon = now() + interval '1 hour' where id=" + this.state.id_history_nego + ")"
            var nego3 = "with new_order as (update gcm_history_nego set harga_final = " + input_nego + ", harga_nego_3 = " + input_nego + ", harga_sales_3 = " + respons + ", updated_by_3 = " + user_id + " , updated_date_3 = now(), time_respon = now() + interval '1 hour' where id=" + this.state.id_history_nego + ")"
            var update_mastercart = "update gcm_master_cart set nego_count = nego_count + 1, harga_konsumen = " + (input_nego * this.state.get_qtybarang * this.state.get_beratbarang) + ", harga_sales = harga_konsumen, update_by = " + user_id + ", update_date = now() where id = '" + this.state.id_mastercart + "'"
        }
        else {
            var nego2 = "with new_order as (update gcm_history_nego set harga_nego_2 = " + input_nego + ", harga_sales_2 = " + respons + ", updated_by_2 = " + user_id + " , updated_date_2 = now(), time_respon = now() + interval '1 hour' where id=" + this.state.id_history_nego + ")"
            var nego3 = "with new_order as (update gcm_history_nego set harga_nego_3 = " + input_nego + ", harga_sales_3 = " + respons + ", updated_by_3 = " + user_id + " , updated_date_3 = now(), time_respon = now() + interval '1 hour' where id=" + this.state.id_history_nego + ")"
            var update_mastercart = "update gcm_master_cart set nego_count = nego_count + 1, harga_konsumen = " + (input_nego * this.state.get_qtybarang * this.state.get_beratbarang) + ", harga_sales = " + (respons * this.state.get_qtybarang * this.state.get_beratbarang) + " , update_by = " + user_id + ", update_date = now() where id = '" + this.state.id_mastercart + "'"
        }

        if (this.state.nego_count == 1) {
            var nego = nego2
        }
        else if (this.state.nego_count == 2) {
            var nego = nego3
        }

        Axios.post(url.select, {
            query: encrypt(nego.concat(update_mastercart))
        }).then(data => {
            Toast.hide();
            this.setState({
                opennego: false,
                openresponnego: false
            });
            Toast.success('Berhasil mengirim nego', 1500, () => {
            });

            if (this.state.nego_count == 1) {
                this.setState({
                    icon_nego1: 'far fa-circle fa-xs',
                    icon_nego2: 'far fa-circle fa-xs'
                });
            }
            else if (this.state.nego_count == 2) {
                this.setState({
                    display_buttonnegolagi: 'none',
                    icon_nego1: 'far fa-circle fa-xs',
                    icon_nego2: 'far fa-circle fa-xs',
                    icon_nego3: 'far fa-circle fa-xs'
                });
            }

            this.forceUpdate()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    responNego() {
        var respon = ((Number(this.state.get_pricebarang) - Number(this.state.get_priceterendahbarang)) * Number(this.state.persen_nego / 100)) + Number(this.state.get_priceterendahbarang)
        this.setState({
            respons_nego: respon
        });
    }

    toggleModaldetail = () => {
        this.setState({
            opendetailbarang: !this.state.opendetailbarang
        });
    }

    toggleModalnego = () => {
        this.setState({
            opennego: !this.state.opennego,
            openresponnego: false,
            nego_lagi_click: false
        });
    }

    toggleModalresponnego = () => {
        this.setState({
            openresponnego: !this.state.openresponnego,
            nego_lagi_click: false
        });
    }

    toggleModalapprovednego = () => {
        this.setState({
            openapprovednego: !this.state.openapprovednego
        });
    }

    toggleModalqty = () => {
        this.setState({
            quantity_beli: parseInt(this.props.product.jumlah_min_beli),
            openqty: !this.state.openqty
        });

    }

    toggleModalnegomax = () => {
        this.setState({
            openresponnego_max: !this.state.openresponnego_max
        });
    }

    toggleNegoSuccess = () => {
        this.setState({
            displaynegosuccess: !this.state.displaynegosuccess
        });
    }

    runReload = () => {
        setTimeout(function () { window.location.reload() }, 10);
    }

    quickviewOpenBarang = (product, kurs) => {
        this.toggleModaldetail()
    };

    componentDidMount() {

        //const socket = openSocket("https://chats-front.herokuapp.com/");

        // socket.emit("send_data_nego_to_admin", {
        //     seller_id: 20,
        //     buyer_id: 10,
        //     room_id: "10-20"
        // })

        // socket.emit("join_room_nego", {
        //     room_id: "10-20"
        // })

        // socket.on('nego_response', data => {

        //     const options = {
        //         autoClose: false,
        //         className: 'custom-toast',
        //         position: 'bottom-right',
        //         autoClose: 5000
        //     };

        //     if (data.source != 'buyer-direct_response') {
        //         var timeout = 0
        //         if (data.source == 'buyer-hold_response') {
        //             // timeout = 3600000
        //             timeout = 10000
        //         }
        //         setTimeout(function () {
        //             toast.success('💬 Ada balasan nego dari penjual', options);
        //         }, timeout);
        //     }

        // })

        if (localStorage.getItem('CompanyIDLogin') != null) {
            let query_alamat = encrypt(" select id, shipto_active, billto_active from gcm_master_alamat where company_id = '" + decrypt(localStorage.getItem('CompanyIDLogin')) + "' and flag_active = 'A' and ( shipto_active = 'Y' or billto_active = 'Y')")
            Axios.post(url.select, {
                query: query_alamat
            }).then(data => {
                this.setState({
                    data_alamat: data.data.data
                });

                let filter_shipto
                filter_shipto = this.state.data_alamat.filter(filter => {
                    return filter.shipto_active == 'Y';
                });

                let filter_billto
                filter_billto = this.state.data_alamat.filter(filter => {
                    return filter.billto_active == 'Y';
                });

                this.setState({
                    data_alamat_shipto: filter_shipto[0].id,
                    data_alamat_billto: filter_billto[0].id
                });

            }).catch(err => {
                // console.log('error' + err);
                // console.log(err);
            })

            let query_payment = encrypt(" select a.id, c.payment_name, a.seller_id " +
                "from gcm_payment_listing a " +
                "inner join gcm_seller_payment_listing b on a.payment_id = b.id " +
                "inner join gcm_master_payment c on b.payment_id = c.id " +
                "where buyer_id = '" + decrypt(localStorage.getItem('CompanyIDLogin')) + "' and b.status = 'A' and a.status = 'A' order by c.payment_name asc")

            Axios.post(url.select, {
                query: query_payment
            }).then(data => {
                this.setState({
                    data_payment_listing: data.data.data,
                });

            }).catch(err => {
                // console.log('error' + err);
                // console.log(err);
            })
        }
    }

    render() {
        const {
            product,
            kurs,
            layout,
            status,
            shoppage_category,
            cartAddItem,
            ShopPageProduct
        } = this.props;
        const { quantity, quantity_beli, quantity_nego } = this.state;
        const { user, setUser } = this.context;

        if (shoppage_category == 'langganan') {
            var param_link = 'daftarproduklangganan'
        }
        else if (shoppage_category == 'nonlangganan') {
            var param_link = 'daftarproduknonlangganan'
        }
        else {
            var param_link = 'daftarprodukall'
        }

        const containerClasses = classNames('product-card', {
            'product-card--layout--grid product-card--size--sm': layout === 'grid-sm',
            'product-card--layout--grid product-card--size--nl': layout === 'grid-nl',
            'product-card--layout--grid product-card--size--lg': layout === 'grid-lg',
            'product-card--layout--list': layout === 'list',
            'product-card--layout--horizontal': layout === 'horizontal',
        });

        let badges = [];
        let image;
        let price;
        let features;

        badges = badges.length ? <div className="product-card__badges-list">{badges}</div> : null;

        if (product.foto && product.foto.length > 0) {
            image = (
                <div className="product-card__image">
                    <Link to={`/daftarproduklangganan/${product.id}`}>
                        <img src={product.foto} alt="" />
                    </Link>
                </div>
            );
        }

        if (product.compareAtPrice) {
            price = (
                <div className="product-card__prices">
                    <span className="product-card__new-price"><Currency value={product.price} /></span>
                    {' '}
                    <span className="product-card__old-price"><Currency value={product.compareAtPrice} /></span>
                </div>
            );
        } else {

            if (localStorage.getItem('Login') == null || shoppage_category == 'nonlangganan') {
                price = (
                    <div className="product-card__prices" style={{ display: 'none' }}></div>
                );
            }
            else {
                price = (
                    <div className="product-card__prices">
                        <NumberFormat value={Math.ceil(product.price * product.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /> / {product.satuan}
                    </div>
                );
            }

        }

        if (product.features && product.features.length) {
            features = (
                <ul className="product-card__features-list">
                    {product.features.map((feature, index) => (
                        <li key={index}>{`${feature.name}: ${feature.value}`}</li>
                    ))}
                </ul>
            );
        }


        const check_statusnego = async () => {

            Toast.loading('loading . . .', () => {
            });

            this.setState({
                product_kurs_selected: product.kurs,
                currentnego_buyer: '',
                currentnego_seller: '',
                display_current_nego: 'none'
            })

            //cek max nego
            let cek_maxnego = encrypt("select count(*) from gcm_master_cart gmc where company_id = " +
                decrypt(localStorage.getItem('CompanyIDLogin')) + " and status = 'I' and history_nego_id != 0 " +
                "and barang_id = " + product.id + " and create_date >= date_trunc('day', CURRENT_TIMESTAMP)")

            await Axios.post(url.select, {
                query: cek_maxnego
            }).then(data => {
                this.setState({
                    count_barangnego: data.data.data[0].count
                });
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })

            if (this.state.count_barangnego == 2) {
                Toast.hide();
                this.setState({
                    openresponnego_max: true
                });
            }
            else {
                this.setState({
                    quantity_nego: parseInt(product.jumlah_min_nego),
                    disablekirimnego: false
                });

                //cek nego auto
                let cek_negoauto = encrypt("select price, price_terendah, persen_nego_1, persen_nego_2, persen_nego_3 from  gcm_list_barang  where  id = " + product.id)
                Axios.post(url.select, {
                    query: cek_negoauto
                }).then(async (data) => {
                    this.setState({
                        get_pricebarang: data.data.data[0].price,
                        get_priceterendahbarang: data.data.data[0].price_terendah,
                        persen_nego: data.data.data[0].persen_nego_1
                    });

                    //get token
                    var query_token = "select distinct token, company_id from gcm_notification_token where user_id in " +
                        "(select id_sales from gcm_company_listing_sales where buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) +
                        " and seller_id = " + product.company_id + " and status = 'A')"

                    if (data.data.data[0].persen_nego_1 != '0.00' ||
                        data.data.data[0].persen_nego_2 != '0.00' ||
                        data.data.data[0].persen_nego_3 != '0.00') {
                        this.setState({
                            nego_auto: true
                        });
                        query_token = query_token + " or company_id = " + decrypt(localStorage.getItem('CompanyIDLogin'))

                    } else {
                        this.setState({
                            nego_auto: false
                        });
                    }

                    Axios.post(url.select, {
                        query: encrypt(query_token)
                    }).then(async (data) => {
                        this.setState({
                            get_sales_token: data.data.data
                        });
                    })

                })

                let cek_statuscart = encrypt("select a.id, a.history_nego_id, a.status, a.nego_count, d.harga_final, a.qty, c.berat, b.persen_nego_1, b.persen_nego_2, b.persen_nego_3 from " +
                    "gcm_master_cart a, gcm_list_barang b, gcm_master_barang c, gcm_history_nego d  where a.barang_id = b.id and c.id = b.barang_id and a.history_nego_id = d.id and a.status = 'A' and a.company_id =" + decrypt(localStorage.getItem('CompanyIDLogin')) + "  and a.barang_id = " + product.id)

                Axios.post(url.select, {
                    query: cek_statuscart
                }).then(async (data) => {
                    Toast.hide();
                    if (data.data.data.length == 0) {
                        this.setState({
                            opennego: !this.state.opennego,
                            openresponnego: false
                        });
                    }
                    else if (data.data.data.length > 0) {
                        if (data.data.data[0].nego_count > 0) {
                            if (data.data.data[0].harga_final != 0) {
                                this.setState({ nego_selesai: true })
                            }

                            this.setState({
                                nego_ongoing: true,
                                disable_qtynego: true,
                                get_qtybarang: data.data.data[0].qty,
                                get_beratbarang: data.data.data[0].berat,
                                id_mastercart: data.data.data[0].id,
                                id_history_nego: data.data.data[0].history_nego_id,
                                quantity_nego: Number(data.data.data[0].qty * data.data.data[0].berat),
                            });
                            if (data.data.data[0].persen_nego_1 != '0.00') {
                                let query_detailnego = encrypt("select harga_nego, harga_nego_2, harga_nego_3, harga_sales, harga_sales_2, harga_sales_3, harga_final, to_char(time_respon, 'yyyy-MM-dd HH24:MI:SS') as time_respon from gcm_history_nego where id = " + data.data.data[0].history_nego_id)

                                Axios.post(url.select, {
                                    query: query_detailnego
                                }).then(data_nego => {

                                    if (data_nego.data.data[0].harga_final != 0) {
                                        Toast.fail('Barang telah dimasukkan ke dalam keranjang', 1500, () => {
                                        });
                                    }
                                    else {
                                        Toast.fail('Barang dalam proses negosiasi', 1500, () => {
                                        });

                                        // if (data.data.data[0].nego_count == 1) {
                                        //     this.setState({
                                        //         nego_count: 1,
                                        //         persen_nego: data.data.data[0].persen_nego_2,
                                        //         icon_nego1: 'far fa-circle fa-xs',
                                        //         currentnego_buyer: data_nego.data.data[0].harga_nego,
                                        //         currentnego_seller: data_nego.data.data[0].harga_sales,
                                        //         //opennego: !this.state.opennego
                                        //     });
                                        // }
                                        // else if (data.data.data[0].nego_count == 2) {
                                        //     this.setState({
                                        //         nego_count: 2,
                                        //         persen_nego: data.data.data[0].persen_nego_3,
                                        //         icon_nego1: 'far fa-circle fa-xs',
                                        //         icon_nego2: 'far fa-circle fa-xs',
                                        //         currentnego_buyer: data_nego.data.data[0].harga_nego_2,
                                        //         currentnego_seller: data_nego.data.data[0].harga_sales_2,
                                        //         //opennego: !this.state.opennego
                                        //     });
                                        // }
                                        // else if (data.data.data[0].nego_count == 3) {
                                        //     this.setState({
                                        //         nego_count: 3,
                                        //         icon_nego1: 'far fa-circle fa-xs',
                                        //         icon_nego2: 'far fa-circle fa-xs',
                                        //         icon_nego3: 'far fa-circle fa-xs',
                                        //         currentnego_buyer: data_nego.data.data[0].harga_nego_3,
                                        //         currentnego_seller: data_nego.data.data[0].harga_sales_3,
                                        //         display_buttonnegolagi: 'none',
                                        //         //opennego: !this.state.opennego
                                        //         //openresponnego: true
                                        //     });
                                        //     // this.responNego()
                                        // }
                                        // this.responNego()

                                        // //cek respon time
                                        // var gettime_respon = data_nego.data.data[0].time_respon;
                                        // var timestamp_respon = new Date(gettime_respon).getTime()
                                        // var timestamp_now = new Date().getTime()
                                        // var time_to_respon = "yes";

                                        // if (timestamp_now >= timestamp_respon) {
                                        //     time_to_respon = "yes"
                                        // }
                                        // else if (timestamp_now < timestamp_respon) {
                                        //     time_to_respon = "no"
                                        // }

                                        // if (time_to_respon == "no") {
                                        //     this.setState({
                                        //         currentnego_seller: 'menunggu respon',
                                        //         disablekirimnego: true,
                                        //         opennego: true
                                        //     });
                                        // }
                                        // else {
                                        //     if (this.state.nego_lagi_click == true) {
                                        //         this.setState({
                                        //             opennego: true
                                        //         });
                                        //     }
                                        //     else {
                                        //         this.setState({
                                        //             openresponnego: true
                                        //         });
                                        //     }
                                        // }

                                        // this.setState({
                                        //     display_current_nego: 'block'
                                        // });
                                    }
                                }).catch(err => {
                                    // console.log('error');
                                    // console.log(err);
                                })
                            }

                            // nego dgn sales
                            else {
                                if (this.state.nego_selesai == true) {
                                    Toast.fail('Barang telah dimasukkan ke dalam keranjang', 1500, () => {
                                    });
                                }
                                else {
                                    Toast.fail('Barang dalam proses negosiasi', 1500, () => {
                                    });
                                }

                            }
                        }
                        else {
                            Toast.fail('Barang telah dimasukkan ke dalam keranjang', 1500, () => {
                            });
                        }
                    }

                }).catch(err => {
                    // console.log('error');
                    // console.log(err);
                })
            }

        }

        const submit_nego = async () => {

            await this.setState({
                send_nego: false
            })

            let filter_payment
            filter_payment = this.state.data_payment_listing.filter(filter => {
                return filter.seller_id == product.company_id;
            });

            var payment_id = filter_payment[0].id
            var harga_barang = Math.ceil(product.price * product.kurs)
            var input_nego = Number(document.getElementById("inputNego").value.split('.').join(""))

            if (this.state.quantity_nego == '') {
                Toast.fail('Silakan isi kuantitas barang', 1500, () => {
                });
            }
            else if (document.getElementById("inputNego").value == "") {
                Toast.fail('Silakan isi harga nego', 1500, () => {
                });
            }

            else {
                if (input_nego > harga_barang) {
                    Toast.fail('Harga nego harus kurang dari harga asli', 1500, () => {
                    });
                }
                else if (this.state.currentnego_buyer != '' && input_nego < this.state.currentnego_buyer) {
                    Toast.fail('Harga nego harus lebih besar dari penawaran terakhir Anda', 2000, () => {
                    });
                }
                else {

                    await this.setState({
                        send_nego: true
                    })

                    if (this.state.nego_ongoing == true) {
                        this.kirimNego()
                    }
                    else {
                        if (this.state.nego_auto == true) {
                            await this.responNego()
                            let query = encrypt("INSERT INTO gcm_master_cart (company_id, barang_id, qty, harga_konsumen, harga_sales, create_by, update_by, shipto_id, billto_id, payment_id) VALUES " +
                                "(" + decrypt(localStorage.getItem('CompanyIDLogin')) + "," +
                                product.id + "," +
                                (this.state.quantity_nego / product.berat) + "," +
                                (document.getElementById("inputNego").value.split('.').join("") * this.state.quantity_nego) + "," +
                                (Math.ceil(this.state.respons_nego * product.kurs) * this.state.quantity_nego) + "," +
                                decrypt(localStorage.getItem('UserIDLogin')) + "," +
                                decrypt(localStorage.getItem('UserIDLogin')) + "," +
                                this.state.data_alamat_shipto + "," +
                                this.state.data_alamat_billto + "," +
                                payment_id + ") returning id");

                            Toast.loading('loading . . .', () => {
                            });
                            await Axios.post(url.select, {
                                query: query
                            }).then(async (data) => {
                                this.setState({ id_mastercart: data.data.data[0].id })
                                let input_nego = document.getElementById("inputNego").value.split('.').join("")
                                let respon_nego = Math.ceil((this.state.respons_nego * product.kurs))
                                if (input_nego > respon_nego) {
                                    var set_harga_final = input_nego
                                    respon_nego = input_nego
                                }
                                else {
                                    var set_harga_final = 0
                                }

                                var history_nego = encrypt("insert into gcm_history_nego (harga_nego, harga_sales, notes, created_by, updated_by, updated_date, harga_nego_2, harga_sales_2, harga_nego_3, harga_sales_3, harga_final, updated_by_2, updated_by_3, updated_date_2, updated_date_3, time_respon)" +
                                    "values (" + input_nego + "," + respon_nego + ",''," + decrypt(localStorage.getItem('UserIDLogin')) + "," + decrypt(localStorage.getItem('UserIDLogin')) + ",now(), null,null,null,null," + set_harga_final + ",null,null,null,null, now() + interval '1 hour') returning id ")

                                //insert ke gcm_history_nego
                                await Axios.post(url.select, {
                                    query: history_nego
                                }).then(async (data) => {

                                    if (document.getElementById("inputNego").value.split('.').join("") >= (this.state.respons_nego * product.kurs)) {
                                        var update_mastercart = encrypt("update gcm_master_cart set nego_count = 1, harga_sales = harga_konsumen  , history_nego_id = " + data.data.data[0].id + " where id = " + this.state.id_mastercart)
                                    }
                                    else {
                                        var update_mastercart = encrypt("update gcm_master_cart set nego_count = 1, history_nego_id = " + data.data.data[0].id + " where id = " + this.state.id_mastercart)
                                    }

                                    this.setState({
                                        id_history_nego: data.data.data[0].id,
                                    })

                                    await Axios.post(url.select, {
                                        query: update_mastercart
                                    }).then((data) => {
                                        Toast.hide();
                                        document.getElementById("inputNego").value = ''
                                        this.setState({
                                            icon_nego1: 'far fa-circle fa-xs',
                                            opennego: false,
                                        })

                                        if (document.getElementById("inputNego").value.split('.').join("") >= Math.ceil(this.state.respons_nego * product.kurs)) {
                                            this.setState({
                                                input_nego: document.getElementById("inputNego").value.split('.').join(""),
                                            })
                                            Toast.success('Berhasil mengirim nego', 1500, () => {
                                            });
                                        }
                                        else {
                                            Toast.success('Berhasil mengirim nego', 1500, () => {
                                            });

                                        }
                                        this.forceUpdate()
                                    }).catch(err => {
                                        // console.log('error');
                                        // console.log(err);
                                    })
                                }).catch(err => {
                                    // console.log('error');
                                    // console.log(err);
                                })
                            }).catch(err => {
                                // console.log('error');
                                // console.log(err);
                            })
                        }

                        // nego sales 3x
                        else {

                            let query = encrypt("INSERT INTO gcm_master_cart (company_id, barang_id, qty, harga_konsumen, harga_sales, create_by, update_by, shipto_id, billto_id, payment_id) VALUES " +
                                "(" + decrypt(localStorage.getItem('CompanyIDLogin')) + "," +
                                product.id + "," +
                                (this.state.quantity_nego / product.berat) + "," +
                                (document.getElementById("inputNego").value.split('.').join("") * this.state.quantity_nego) + ",null ," +
                                decrypt(localStorage.getItem('UserIDLogin')) + "," +
                                decrypt(localStorage.getItem('UserIDLogin')) + "," +
                                this.state.data_alamat_shipto + "," +
                                this.state.data_alamat_billto + "," +
                                payment_id + ") returning id");
                            Toast.loading('loading . . .', () => {
                            });
                            await Axios.post(url.select, {
                                query: query
                            }).then(async (data) => {

                                this.setState({ id_mastercart: data.data.data[0].id })

                                if (document.getElementById("inputNego").value.split('.').join("") >= (product.price_terendah * product.kurs)) {
                                    var history_nego = encrypt("insert into gcm_history_nego (harga_nego, harga_sales, notes, created_by, updated_by, updated_date, harga_nego_2, harga_sales_2, harga_nego_3, harga_sales_3, harga_final ,updated_by_2, updated_by_3, updated_date_2, updated_date_3, time_respon)" +
                                        "values (" + document.getElementById("inputNego").value.split('.').join("") + "," + document.getElementById("inputNego").value.split('.').join("") + ",''," + decrypt(localStorage.getItem('UserIDLogin')) + "," + decrypt(localStorage.getItem('UserIDLogin')) + ",now(), null,null,null,null," + document.getElementById("inputNego").value.split('.').join("") + ",null,null,null,null,null) returning id ")
                                }

                                else {
                                    // var history_nego = encrypt("insert into gcm_history_nego (harga_nego, harga_sales, notes, created_by, updated_by, updated_date, harga_nego_2, harga_sales_2, harga_nego_3, harga_sales_3, updated_by_2, updated_by_3, updated_date_2, updated_date_3)" +
                                    //     "values (" + document.getElementById("inputNego").value.split('.').join("") + "," + Math.ceil((product.price_terendah * kurs)) + ",''," + decrypt(localStorage.getItem('UserIDLogin')) + "," + decrypt(localStorage.getItem('UserIDLogin')) + ",now(), null,null,null,null,null,null,null,null) returning id ")
                                    var history_nego = encrypt("insert into gcm_history_nego (harga_nego, harga_sales, notes, created_by, updated_by, updated_date, harga_nego_2, harga_sales_2, harga_nego_3, harga_sales_3, updated_by_2, updated_by_3, updated_date_2, updated_date_3)" +
                                        "values (" + document.getElementById("inputNego").value.split('.').join("") + "," + Math.ceil((product.price * product.kurs)) + ",''," + decrypt(localStorage.getItem('UserIDLogin')) + "," + decrypt(localStorage.getItem('UserIDLogin')) + ",now(), null,null,null,null,null,null,null,null) returning id ")

                                }


                                // var history_nego = encrypt("insert into gcm_history_nego (harga_nego, harga_sales, notes, created_by, updated_by, updated_date, harga_nego_2, harga_sales_2, harga_nego_3, harga_sales_3, updated_by_2, updated_by_3, updated_date_2, updated_date_3)" +
                                //     "values (" + document.getElementById("inputNego").value.split('.').join("") + "," + Math.ceil((product.price * kurs)) + ",''," + decrypt(localStorage.getItem('UserIDLogin')) + "," + decrypt(localStorage.getItem('UserIDLogin')) + ",now(), null,null,null,null,null,null,null,null) returning id ")

                                //insert ke gcm_history_nego
                                await Axios.post(url.select, {
                                    query: history_nego
                                }).then(async (data) => {

                                    if (document.getElementById("inputNego").value.split('.').join("") >= (product.price_terendah * product.kurs)) {
                                        var update_mastercart = encrypt("update gcm_master_cart set nego_count = 1, harga_sales = harga_konsumen  , history_nego_id = " + data.data.data[0].id + " where id = " + this.state.id_mastercart)
                                    }
                                    else {
                                        var update_mastercart = encrypt("update gcm_master_cart set nego_count = 1, history_nego_id = " + data.data.data[0].id + " where id = " + this.state.id_mastercart)
                                    }

                                    await Axios.post(url.select, {
                                        query: update_mastercart
                                    }).then(async (data) => {
                                        Toast.hide();
                                        if (this.state.nego_auto == false) {

                                            if (document.getElementById("inputNego").value.split('.').join("") >= (product.price_terendah * product.kurs)) {
                                                await this.setState({ displaynegosuccess: true })
                                                // Toast.success('Berhasil mengirim nego', 2000, () => {
                                                // });
                                            }
                                            else {
                                                Toast.success('Berhasil mengirim nego', 2000, () => {
                                                });
                                            }
                                        }
                                        this.toggleModalnego();
                                        document.getElementById("inputNego").value = ''
                                        this.setState({ quantity_nego: product.berat })
                                        this.forceUpdate()
                                    }).catch(err => {
                                        // console.log('error');
                                        // console.log(err);
                                    })
                                }).catch(err => {
                                    // console.log('error');
                                    // console.log(err);
                                })
                            }).catch(err => {
                                // console.log('error');
                                // console.log(err);
                            })
                        }

                    }
                }
            };
        }

        const submit_tocart = async () => {

            let filter_payment
            filter_payment = this.state.data_payment_listing.filter(filter => {
                return filter.seller_id == product.company_id;
            });

            var payment_id = filter_payment[0].id

            let cek_statuscart = encrypt("select status, nego_count from gcm_master_cart gmc where status = 'A' and company_id =" + decrypt(localStorage.getItem('CompanyIDLogin')) + "  and barang_id = " + product.id);
            Toast.loading('loading . . .', () => {
            });
            await Axios.post(url.select, {
                query: cek_statuscart
            }).then(async (data) => {
                if (data.data.data.length == 0) {
                    let query = encrypt("INSERT INTO gcm_master_cart (company_id, barang_id, qty, create_by, update_by, shipto_id, billto_id, payment_id) VALUES " +
                        "(" + decrypt(localStorage.getItem('CompanyIDLogin')) + "," +
                        product.id + "," +
                        (this.state.quantity_beli / product.berat) + "," +
                        decrypt(localStorage.getItem('UserIDLogin')) + "," +
                        decrypt(localStorage.getItem('UserIDLogin')) + "," +
                        this.state.data_alamat_shipto + "," +
                        this.state.data_alamat_billto + "," +
                        payment_id + ");");
                    await Axios.post(url.select, {
                        query: query
                    }).then(() => {
                        Toast.hide()
                        Toast.success('Barang berhasil ditambahkan', 2000, () => {
                        });
                        this.setState({
                            opendetailbarang: false,
                            openqty: false
                        });

                    }).catch(err => {
                        // console.log('error');
                        // console.log(err);
                    })

                }
                else if (data.data.data.length > 0) {
                    Toast.hide()
                    if (data.data.data[0].nego_count > 0) {
                        Toast.fail('Barang dalam proses negosiasi', 2500, () => {
                        });
                        this.setState({
                            openqty: false
                        });
                    }
                    else {
                        Toast.fail('Barang telah dimasukkan ke dalam keranjang', 2500, () => {
                        });
                        this.setState({
                            openqty: false
                        });
                    }
                }
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })
        }

        var get_login = localStorage.getItem('Login')
        var cek_login
        if (get_login == null) {
            cek_login = false
        }
        else {
            cek_login = true
        }

        const classes = classNames('input-number', 'product__quantity');
        const formControlClasses = classNames('form-control input-number__input', {
            'form-control-sm': 'xl' === 'sm',
            'form-control-lg': 'xl' === 'lg',
        });

        return (

            <div className={containerClasses}>

                {/* {badges}  */}

                <div className="product-card__info">
                    <div className="product-card__name" style={{ paddingTop: '18px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600' }}>{product.nama_perusahaan}</label>
                    </div>
                </div>

                {image}
                <div className="product-card__info">
                    <div className="product-card__name">

                        <AsyncAction
                            render={({ run, loading }) => (
                                <React.Fragment>
                                    {ShopPageProduct == true ?
                                        (<Link to={`/${param_link}/${product.id}${"-"}${product.kode_barang}`} onClick={this.runReload}>{product.nama}</Link>) :
                                        (<Link to={`/${param_link}/${product.id}${"-"}${product.kode_barang}`} >{product.nama}</Link>)
                                    }
                                </React.Fragment>
                            )}
                        />

                    </div>
                    {features}
                </div>
                <div className="product-card__actions">
                    {/* <div className="product-card__availability">
                        Availability:
                        <span className="text-success">In Stock</span>
                    </div> */}
                    {price}

                    {!cek_login || shoppage_category == 'nonlangganan' ? (
                        null
                    ) : (
                            <div className="product-card__buttons">
                                <AsyncAction
                                    render={({ run, loading }) => (
                                        <React.Fragment>
                                            <button
                                                type="button"
                                                onClick={this.toggleModalqty}
                                                className={classNames('btn btn-primary product-card__addtocart', {
                                                    'btn-loading': loading,
                                                })}
                                            >
                                                Tambah ke Keranjang
                                            </button>
                                            {product.negotiable == 'yes' ? (
                                                <button
                                                    type="button"
                                                    onClick={check_statusnego}
                                                    class="btn btn-secondary"
                                                >
                                                    Nego
                                                </button>
                                            ) : (null)}
                                        </React.Fragment>
                                    )}
                                />
                            </div>
                        )
                    }
                </div>

                {/* Modal detail barang */}
                <Modal isOpen={this.state.opendetailbarang} size="lg" backdrop='static' centered>
                    <ModalHeader className="modalHeaderCustom" toggle={this.toggleModaldetail}>Detail Barang</ModalHeader>
                    <ModalBody>

                        <div className="row">
                            <img src={product.foto} className="detail-foto col-md-4" />
                            <div className="col-md-8">
                                <h3>{product.nama}</h3>
                                <div className="product__description">
                                    {product.deskripsi}
                                </div>
                                <ul className="product__meta">
                                    <li className="product__meta-availability">
                                        Dijual oleh :
                                        {' '}
                                        <strong>{product.nama_perusahaan}</strong>
                                        {/* <span className="text-success">{product.nama_perusahaan}</span> */}
                                    </li>
                                </ul>

                                {/* <ul className="product__meta">
                                    <li className="product__meta-availability">
                                        Ketersediaan :
                                        {' '}
                                        <span className="text-success">In Stock</span>
                                    </li>
                                </ul> */}

                                <div className="product__prices">
                                    <label><NumberFormat value={Math.ceil(product.price * product.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /> <span style={{ fontSize: '15px', fontWeight: '600' }}>/ {product.satuan}</span></label>
                                </div>

                                <div className="form-group product__option">
                                    <label htmlFor="product-quantity" className="product__option-label">Kuantitas ({product.satuan})</label>
                                    <div className="product__actions">
                                        <div className="product__actions-item">

                                            {/* <div className="row">
                                                <div className="col-md-2">
                                                    <button onClick={this.minus} className="btn btn-white" style={{ border: '1px solid #8CC63E' }}><label style={{ fontSize: '15px', fontWeight: '750', cursor: 'pointer' }}>-</label></button>
                                                </div>
                                                <div className="col-md-5">
                                                    <NumberFormat id='inputQty' value={quantity} onChange={input => this.setState({ quantity: input.target.value })} style={{ width: '100%', textAlign: 'center', border: '1px solid #8CC63E' }} className="form-control" thousandSeparator={'.'} decimalSeparator={','} />
                                                </div>
                                                <div className="col-md-2" style={{ paddingLeft: 0 }}>
                                                    <button onClick={this.plus} className="btn btn-white" style={{ border: '1px solid #8CC63E' }}><label style={{ fontSize: '15px', fontWeight: '750', cursor: 'pointer' }}><strong>+</strong></label></button>
                                                </div>
                                            </div> */}

                                            <InputNumber_sm
                                                id="product-quantity"
                                                aria-label="Quantity"
                                                className="product__quantity"
                                                min={product.berat}
                                                value={quantity}
                                                kelipatan={product.berat}
                                                onChange={this.handleChangeQuantity}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group product__option">
                                    {/* <label htmlFor="product-quantity" className="product__option-label">Aksi</label> */}
                                    <div className="product__actions">
                                        <div className="product__actions-item">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button class="btn btn-primary btn-lg" onClick={submit_tocart}>
                                                        Tambah ke Keranjang
                                                    </button>

                                                    <button class="btn btn-secondary btn-lg" onClick={this.toggleModalnego} style={{ marginLeft: '15px' }}>
                                                        Nego
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.opennego} centered size="sm" backdrop="static">
                    <ModalHeader className="modalHeaderCustom" toggle={this.toggleModalnego}>Nego Harga </ModalHeader>
                    <div className="card-body">
                        <div className="form-group" style={{ marginBottom: '10px' }}>
                            <div className="address-card__row" style={{ margin: '0px' }}>
                                <div className="address-card__row-title">Nama Barang</div>
                                <div className="address-card__row-content"><label style={{ fontSize: '13px', fontWeight: '600' }}>{product.nama}</label></div>
                            </div>
                            <div className="address-card__row" style={{ margin: '0px' }}>
                                <div className="address-card__row-title">Harga Barang</div>
                                <div className="address-card__row-content"><span style={{ fontSize: '13px', fontWeight: '600' }}><NumberFormat value={Math.ceil(product.price * product.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span> <label style={{ fontSize: '11px', fontWeight: '500' }}> / {product.satuan}</label></div>
                            </div>
                            <div className="address-card__row" style={{ display: this.state.display_current_nego, margin: '0px' }}>
                                <hr style={{ marginTop: '2px', marginBottom: '8px' }} />
                                <div className="address-card__row-title">Penawaran terakhir Penjual</div>

                                {this.state.currentnego_seller != 'menunggu respon' ?
                                    (<div className="address-card__row-content">
                                        <span style={{ fontSize: '13px', fontWeight: '600' }}><NumberFormat value={this.state.currentnego_seller} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span> <label style={{ fontSize: '11px', fontWeight: '500' }}> / {product.satuan}</label>
                                    </div>
                                    ) :
                                    (<div className="address-card__row-content">
                                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{this.state.currentnego_seller}</span>
                                    </div>)
                                }

                            </div>
                            <div className="address-card__row" style={{ display: this.state.display_current_nego, margin: '0px' }}>
                                <div className="address-card__row-title">Penawaran terakhir Anda</div>
                                <div className="address-card__row-content"><span style={{ fontSize: '13px', fontWeight: '600' }}><NumberFormat value={this.state.currentnego_buyer} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span> <label style={{ fontSize: '11px', fontWeight: '500' }}> / {product.satuan}</label></div>
                            </div>

                            <div className="address-card__row">
                                <center>
                                    <label htmlFor="input-nego" style={{ fontSize: '13px', fontWeight: '550' }}>Kuantitas ({product.satuan}) : </label>
                                </center>
                                {/* <InputNumber
                                    id="product-quantity_nego"
                                    aria-label="Quantity"
                                    className="product__quantity"
                                    min={product.jumlah_min_nego}
                                    value={quantity_nego}
                                    kelipatan={product.berat}
                                    onChange={this.handleChangeQuantityNego}
                                    setDisabled={this.state.disable_qtynego}
                                /> */}

                                <div className={classes} style={{ width: '100%' }}>
                                    <NumberFormat id="product-quantity_nego" value={quantity_nego} onChange={() => this.handleChangeQuantityNego()} spellCheck="false" autoComplete="off" allowNegative={false} style={{ width: '100%' }}
                                        className={formControlClasses} disabled={this.state.disable_qtynego} thousandSeparator={'.'} decimalSeparator={','} />
                                    <div className="input-number__add" onMouseDown={() => this.handleAddMouseDown(product.berat, 'nego')} />
                                    <div className="input-number__sub" onMouseDown={() => this.handleSubMouseDown(product.berat, product.jumlah_min_nego, 'nego')} />
                                </div>
                            </div>

                            <div className="address-card__row">
                                <center><label htmlFor="input-nego" style={{ fontSize: '13px', fontWeight: '550' }}>Harga Nego : </label></center>
                            </div>
                            <InputGroup>
                                <InputGroupAddon addonType="append">
                                    <InputGroupText>Rp</InputGroupText>
                                </InputGroupAddon>
                                <NumberFormat id='inputNego' onChange={this.handleValueNego} spellCheck="false" autoComplete="off" disabled={this.state.disable_qtynego} allowNegative={false} style={{ width: '100%' }} className="form-control" thousandSeparator={'.'} decimalSeparator={','} />
                            </InputGroup>
                            <label style={{ fontSize: '11px', fontWeight: '550', color: 'red' }}> * Harga nego per {product.satuan} </label>
                        </div>

                        <CartContext.Consumer>
                            {(value) => (
                                <button type="submit" onClick={async () => {
                                    await submit_nego(); await value.loadDataCart(); await value.loadDataNotif();
                                    await value.sendNotifikasi(this.state.send_nego, product.id, product.nama, decrypt(localStorage.getItem('CompanyIDLogin')),
                                        product.company_id, product.nama_perusahaan, this.state.get_sales_token, this.state.nego_auto, this.state.id_mastercart)
                                }} style={{ width: '100%' }} className="btn btn-primary" disabled={this.state.disablekirimnego}>
                                    Kirim Nego
                                </button>
                            )}
                        </CartContext.Consumer>

                        <div className="address-card__row" style={{ marginTop: '10px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '500', float: 'right' }}>Sisa nego barang ini :
                                    <i class={this.state.icon_nego3} style={{ color: '#F87E45', marginLeft: '4px', marginRight: '1px' }}></i>
                                <i class={this.state.icon_nego2} style={{ color: '#F87E45', marginLeft: '1px', marginRight: '1px' }}></i>
                                <i class={this.state.icon_nego1} aria-hidden="true" style={{ color: '#F87E45', marginLeft: '1px', marginRight: '1px' }}></i>
                            </label>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={this.state.openresponnego} centered size="sm" backdrop="static">
                    <ModalHeader className="modalHeaderCustom" toggle={this.toggleModalresponnego}>Nego Harga </ModalHeader>
                    <div className="card-body">
                        <div className="address-card__row-content">
                            <center>
                                {/* <label style={{ fontSize: '13px', fontWeight: '500' }}>Penawaran penjual : {' '}
                                    <span style={{ fontSize: '15px', fontWeight: '600' }}>
                                        <NumberFormat value={Math.ceil(product.kurs * this.state.respons_nego)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                    </span>
                                    {' '}/ {product.satuan}
                                </label> */}

                                {this.state.currentnego_seller != 'menunggu respon' ?
                                    (<label style={{ fontSize: '13px', fontWeight: '500' }}>Penawaran penjual : {' '}
                                        <span style={{ fontSize: '15px', fontWeight: '600' }}>
                                            <NumberFormat value={this.state.currentnego_seller} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                        </span>
                                        {' '}/ {product.satuan}
                                    </label>
                                    ) :
                                    (<label style={{ fontSize: '13px', fontWeight: '500' }}>Penawaran penjual : {' '}
                                        <span style={{ fontSize: '15px', fontWeight: '600' }}>
                                            menunggu respon
                                        </span>
                                    </label>)
                                }

                            </center>
                        </div>
                        <div className="address-card__row-content">
                            <center><label style={{ fontSize: '13px', fontWeight: '500' }}>Setuju dengan penawaran ini ?</label></center>
                        </div>

                        {/* <button type="submit" onClick={this.approveNego_seller} style={{ width: '100%' }} className="btn btn-primary mt-3">
                            Setuju
                        </button> */}

                        <CartContext.Consumer>
                            {(value) => (
                                <button type="submit" onClick={async () => { await this.approveNego_seller(); await value.loadDataCart(); }} style={{ width: '100%' }} className="btn btn-primary mt-3 mb-1">
                                    Setuju
                                </button>
                            )}
                        </CartContext.Consumer>


                        {this.state.display_buttonnegolagi == 'none' ?
                            (<label style={{ fontSize: '11px', fontWeight: '550', color: 'red' }}> * Jika belum mencapai kesepakatan harga, silakan hubungi distributor terkait </label>
                            ) :
                            (null)
                        }

                        <button type="submit" onClick={async () => { await this.setState({ nego_lagi_click: true }); await check_statusnego(); }} style={{ width: '100%', display: this.state.display_buttonnegolagi }} className="btn btn-light mt-2">
                            Nego Lagi
                        </button>

                        <div className="address-card__row" style={{ marginTop: '10px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '500', float: 'right' }}>Sisa nego barang ini :
                                <i class={this.state.icon_nego3} style={{ color: '#F87E45', marginLeft: '4px', marginRight: '1px' }}></i>
                                <i class={this.state.icon_nego2} style={{ color: '#F87E45', marginLeft: '1px', marginRight: '1px' }}></i>
                                <i class={this.state.icon_nego1} aria-hidden="true" style={{ color: '#F87E45', marginLeft: '1px', marginRight: '1px' }}></i>
                            </label>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={this.state.openapprovednego} centered size="sm" backdrop="static">
                    <ModalHeader className="modalHeaderCustom" >Nego Harga </ModalHeader>
                    <div className="card-body">
                        <div className="address-card__row-content">
                            <center>
                                <label style={{ fontSize: '13px', fontWeight: '500' }}>Penawaran Anda : {' '}
                                    <span style={{ fontSize: '15px', fontWeight: '600' }}><NumberFormat value={this.state.input_nego} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                                    {' '}/ {product.satuan} berhasil disetujui.
                                </label>
                            </center>
                        </div>
                        <div className="address-card__row-content">
                            <center><label style={{ fontSize: '13px', fontWeight: '500' }}>Selesaikan proses negosiasi ?</label></center>
                        </div>

                        <button type="submit" onClick={this.approveNego_buyer} style={{ width: '100%' }} className="btn btn-primary mt-3">
                            Ya
                        </button>
                        <button type="submit" onClick={this.cancelNego} style={{ width: '100%' }} className="btn btn-light mt-2">
                            Batalkan Nego
                        </button>

                    </div>
                </Modal>

                <Modal isOpen={this.state.openqty} centered size="sm" backdrop="static">
                    <ModalHeader className="modalHeaderCustom" toggle={this.toggleModalqty}>Kuantitas Pesanan </ModalHeader>
                    <div className="card-body">
                        <div className="form-group">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Nama Barang</div>
                                <div className="address-card__row-content"><label style={{ fontSize: '13px', fontWeight: '600' }}>{product.nama}</label></div>
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title">Harga Barang</div>
                                <div className="address-card__row-content"><span style={{ fontSize: '13px', fontWeight: '600' }}><NumberFormat value={Math.ceil(product.price * product.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span> <label style={{ fontSize: '11px', fontWeight: '500' }}> / {product.satuan}</label></div>
                            </div>
                            <div className="address-card__row">
                                <center><label htmlFor="input-nego" style={{ fontSize: '13px', fontWeight: '550' }}>Kuantitas ({product.satuan}) : </label></center>
                                <div>

                                    {/* <InputNumber
                                        id="product-quantity-beli"
                                        aria-label="Quantity"
                                        className="product__quantity"
                                        size="xl"
                                        min={product.jumlah_min_beli}
                                        value={quantity_beli}
                                        kelipatan={product.berat}
                                        onChange={this.handleChangeQuantityBeli}
                                    /> */}

                                    <div className={classes} style={{ width: '100%' }}>
                                        <NumberFormat id="product-quantity-beli" value={quantity_beli} onChange={() => this.handleChangeQuantityBeli()} spellCheck="false" autoComplete="off" allowNegative={false} style={{ width: '100%' }}
                                            className={formControlClasses} thousandSeparator={'.'} decimalSeparator={','} />
                                        <div className="input-number__add" onMouseDown={() => this.handleAddMouseDown(product.berat, 'beli')} />
                                        <div className="input-number__sub" onMouseDown={() => this.handleSubMouseDown(product.berat, product.jumlah_min_beli, 'beli')} />
                                    </div>

                                </div>
                            </div>

                        </div>
                        <CartContext.Consumer>
                            {(value) => (
                                <button type="submit" onClick={async () => { await submit_tocart(); await value.loadDataCart(); }}
                                    style={{ width: '100%' }} className="btn btn-primary " disabled={this.state.disabletambahbarang}>
                                    Tambahkan
                                </button>
                            )}
                        </CartContext.Consumer>
                    </div>
                </Modal>

                <Dialog
                    maxWidth="xs"
                    open={this.state.openresponnego_max}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Nego Barang</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Tidak dapat melakukan nego. Nego barang hanya dapat dilakukan <strong>2x/hari</strong> untuk barang yang sama
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.toggleModalnegomax}>
                            Mengerti
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.displaynegosuccess}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Selamat! Nego Berhasil Disepakati </DialogTitle>
                    <DialogContent>
                        <center>
                            <i class="fas fa-check-circle fa-3x mb-4" style={{ color: '#8CC63E' }}></i>
                        </center>
                        <DialogContentText>
                            <center>Harga nego berlaku dalam hari yang sama. Silakan membuat pesanan sebelum pukul 24:00 untuk dapat menggunakan harga nego</center>
                        </DialogContentText>
                        <center>
                            <button type="submit" style={{ width: '30%' }} className="btn btn-primary mt-4 mb-3" onClick={this.toggleNegoSuccess}>
                                OK
                        </button>
                        </center>
                    </DialogContent>
                </Dialog>

            </div>
        );
    }
}

ProductCard.propTypes = {

    product: PropTypes.object.isRequired,

    layout: PropTypes.oneOf(['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']),
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    cartAddItem,
    wishlistAddItem,
    compareAddItem,
    quickviewOpen,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProductCard);
