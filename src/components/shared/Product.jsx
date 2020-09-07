// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Toast from 'light-toast';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';

// application
import AsyncAction from './AsyncAction';
import Currency from './Currency';
import InputNumber from './InputNumber';
import ProductGallery from './ProductGallery';
import { cartAddItem } from '../../store/cart';
import { compareAddItem } from '../../store/compare';
import { Wishlist16Svg, Compare16Svg } from '../../svg';
import { wishlistAddItem } from '../../store/wishlist';
import Messenger from '../chat/Messenger';
import NumberFormat from 'react-number-format';
import { CartContext } from '../../context/cart';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: parseInt(this.props.product.jumlah_min_beli),
            quantity_nego: parseInt(this.props.product.jumlah_min_nego),
            modalOpen: false,
            disable_button: false,
            disable_button_nego: false,
            data_alamat_shipto: '',
            data_alamat_billto: '',
            payment_id: '', product_id: '',
            seller_id: this.props.product.company_id,
            status_cart: this.props.cart,
            openresponnego_max: false,
            get_pricebarang: '',
            get_priceterendahbarang: '',
            get_sales_token: [],
            nego_auto: true,
            persen_nego: '',
            displayformnego: 'block',
            openresponlangganan: '',
            modalChat_isOpen: false,
            count_barangnego: '',
            respons_nego: '',
            send_nego: false,
            displaynegosuccess: false,
            icon_nego1: 'fas fa-circle fa-xs',
            icon_nego2: 'fas fa-circle fa-xs',
            icon_nego3: 'fas fa-circle fa-xs',
        };
    }

    handleAddMouseDown = async (kelipatan, source) => {
        if (source == 'beli') {
            var get_value = document.getElementById('product-quantity-beli').value.split('.').join("")
        } else {
            var get_value = document.getElementById('product-quantity-nego').value.split('.').join("")
        }
        var add_result = (Number(get_value) + Number(kelipatan))

        var reverse = add_result.toString().split('').reverse().join(''),
            input_value = reverse.match(/\d{1,3}/g);
        input_value = input_value.join('.').split('').reverse().join('');

        var input_value_edit = input_value.split('.').join("")

        if (source == 'beli') {
            document.getElementById('product-quantity-beli').value = input_value
            await this.setState({ quantity: input_value_edit });
        }
        else {
            document.getElementById('product-quantity-nego').value = input_value
            await this.setState({ quantity_nego: input_value_edit });
        }
    };

    handleSubMouseDown = (kelipatan, jumlah_min_beli, source) => {
        if (source == 'beli') {
            var get_value = document.getElementById('product-quantity-beli').value.split('.').join("")
        } else {
            var get_value = document.getElementById('product-quantity-nego').value.split('.').join("")
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
                this.setState({ quantity: input_value_edit });
            }
            else {
                document.getElementById('product-quantity-nego').value = input_value
                this.setState({ quantity_nego: input_value_edit });
            }
        }

    };

    handleChangeQuantity = () => {
        var get_value_input = document.getElementById("product-quantity-beli").value.split('.').join("")
        var cek_kelipatan = Number(get_value_input) % Number(this.props.product.berat)

        this.setState({ quantity: get_value_input });

        if (get_value_input.length == 1) {
            if (get_value_input == '0') {
                this.setState({
                    disable_button: true
                });
            }
        }

        if (Number(get_value_input) < Number(this.props.product.jumlah_min_beli) || cek_kelipatan != 0 || get_value_input.charAt(0) == 0) {
            this.setState({
                disable_button: true
            });
        } else if (Number(get_value_input) >= Number(this.props.product.jumlah_min_beli) && cek_kelipatan == 0) {
            this.setState({
                disable_button: false
            });
        }
    };

    handleValueNego = () => {
        var get_value_input = document.getElementById("inputNego").value

        if (get_value_input.charAt(0) == '0') {
            this.setState({
                disable_button_nego: true
            });
        }
        else {
            this.setState({
                disable_button_nego: false
            });
        }
    }

    handleChangeQuantityNego = (quantity_nego) => {
        this.setState({ quantity_nego });

        // if (event.target.value == undefined) {
        //     this.setState({
        //         disable_button_nego: false
        //     });
        // }

        // if (event.target.value != undefined) {
        //     var cek_kelipatan = Number(event.target.value) % Number(this.props.product.berat)

        //     if (Number(event.target.value) < Number(this.props.product.jumlah_min_nego) || cek_kelipatan != 0 || event.target.value.charAt(0) == 0) {
        //         this.setState({
        //             disable_button_nego: true
        //         });
        //     } else if (Number(event.target.value) >= Number(this.props.product.jumlah_min_nego) && cek_kelipatan == 0) {
        //         this.setState({
        //             disable_button_nego: false
        //         });
        //     }
        // }

        if (quantity_nego == undefined) {
            this.setState({
                disable_button_nego: false
            });
        }

        var get_value_input = document.getElementById("product-quantity-nego").value.split('.').join("")
        var cek_kelipatan = Number(get_value_input) % Number(this.props.product.berat)

        if (get_value_input.length == 1) {
            if (get_value_input == '0') {
                this.setState({
                    disable_button_nego: true
                });
            }
        }

        if (Number(get_value_input) < Number(this.props.product.jumlah_min_nego) || cek_kelipatan != 0 || get_value_input.charAt(0) == 0) {
            this.setState({
                disable_button_nego: true
            });
        } else if (Number(get_value_input) >= Number(this.props.product.jumlah_min_nego) && cek_kelipatan == 0) {
            this.setState({
                disable_button_nego: false
            });
        }
    }

    responNego() {
        var respon = ((Number(this.state.get_pricebarang) - Number(this.state.get_priceterendahbarang)) * Number(this.state.persen_nego / 100)) + Number(this.state.get_priceterendahbarang)
        this.setState({
            respons_nego: respon
        });
    }

    toggle = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    }

    toggleModalChat = () => {
        const cek_login = localStorage.getItem('Login')
        if (this.props.hide_harga == true || cek_login == null) {
            this.setState({ openresponlangganan: true })
        }
        else {
            this.setState({
                modalChat_isOpen: !this.state.modalChat_isOpen
            })
        }

    }

    toggleModalnegomax = () => {
        this.setState({
            openresponnego_max: !this.state.openresponnego_max
        });
    }

    statusbarang_cart = async () => {
        let cek_statuscart = encrypt("select status, nego_count from gcm_master_cart gmc where status = 'A' and company_id =" + decrypt(localStorage.getItem('CompanyIDLogin')) + "  and barang_id = " + this.state.product_id);

        await Axios.post(url.select, {
            query: cek_statuscart
        }).then(async (data) => {

            if (data.data.data.length == 0) {
                this.setState({ status_cart: 'cart_no' });
            }
            else if (data.data.data.length > 0) {
                if (data.data.data[0].nego_count > 0) {
                    this.setState({ status_cart: 'nego_yes' });
                }
                else {
                    this.setState({ status_cart: 'buy_yes' });
                }
            }
        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })
    }

    componentDidMount() {
        if (localStorage.getItem('CompanyIDLogin') != null) {
            let query_alamat = encrypt(" select id, shipto_active, billto_active from gcm_master_alamat where company_id = '" + decrypt(localStorage.getItem('CompanyIDLogin')) + "' and flag_active = 'A' and ( shipto_active = 'Y' or billto_active = 'Y')")
            Axios.post(url.select, {
                query: query_alamat
            }).then(data => {

                let filter_shipto
                filter_shipto = data.data.data.filter(filter => {
                    return filter.shipto_active == 'Y';
                });

                let filter_billto
                filter_billto = data.data.data.filter(filter => {
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

            let query_payment = encrypt("select a.id, c.payment_name, a.seller_id " +
                "from gcm_payment_listing a " +
                "inner join gcm_seller_payment_listing b on a.payment_id = b.id " +
                "inner join gcm_master_payment c on b.payment_id = c.id " +
                "where buyer_id = '" + decrypt(localStorage.getItem('CompanyIDLogin')) + "' and b.status = 'A' and a.status = 'A' order by c.payment_name asc")

            Axios.post(url.select, {
                query: query_payment
            }).then(data => {
                let filter_payment
                filter_payment = data.data.data.filter(filter => {
                    return filter.seller_id == this.state.seller_id;
                });

                this.setState({
                    payment_id: filter_payment[0].id
                });

            }).catch(err => {
                // console.log('error' + err);
                // console.log(err);
            })

            this.setState({
                product_id: this.props.product.id
            });
        }
    }

    render() {
        const {
            product,
            kurs,
            cart,
            layout,
            wishlistAddItem,
            compareAddItem,
            cartAddItem,
            hide_harga,
        } = this.props;
        const { quantity } = this.state;
        let prices;

        if (product.compareAtPrice) {
            prices = (
                <React.Fragment>
                    <span className="product__new-price"><Currency value={product.price} /></span>
                    {' '}
                    <span className="product__old-price"><Currency value={product.compareAtPrice} /></span>
                </React.Fragment>
            );
        } else {
            prices = <Currency value={product.price} />;
        }

        const submit_tocart = async () => {

            Toast.loading('loading . . .', () => {
            });

            let query = encrypt("INSERT INTO gcm_master_cart (company_id, barang_id, qty, create_by, update_by, shipto_id, billto_id, payment_id) VALUES " +
                "(" + decrypt(localStorage.getItem('CompanyIDLogin')) + "," +
                product.id + "," +
                (this.state.quantity / product.berat) + "," +
                decrypt(localStorage.getItem('UserIDLogin')) + "," +
                decrypt(localStorage.getItem('UserIDLogin')) + "," +
                this.state.data_alamat_shipto + "," +
                this.state.data_alamat_billto + "," +
                this.state.payment_id + ");");

            await Axios.post(url.select, {
                query: query
            }).then(() => {
                Toast.hide();
                Toast.success('Barang berhasil ditambahkan', 2000, () => {
                });
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })
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
            let cek_maxnego = encrypt("select count(*) from gcm_master_cart gmc where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status = 'I' and history_nego_id != 0  and barang_id = " + product.id + " and create_date >= date_trunc('day', CURRENT_TIMESTAMP)")

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
                    if (data.data.data[0].persen_nego_1 != '0.00' ||
                        data.data.data[0].persen_nego_2 != '0.00' ||
                        data.data.data[0].persen_nego_3 != '0.00') {
                        this.setState({
                            nego_auto: true
                        });
                    } else {
                        this.setState({
                            nego_auto: false
                        });
                    }
                    this.setState({
                        get_pricebarang: data.data.data[0].price,
                        get_priceterendahbarang: data.data.data[0].price_terendah,
                        persen_nego: data.data.data[0].persen_nego_1
                    });

                })

                //get token
                var query_token = "select distinct token, company_id from gcm_notification_token where user_id in " +
                    "(select id_sales from gcm_company_listing_sales where buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) +
                    " and seller_id = " + product.company_id + " and status = 'A')"

                if (this.state.nego_auto == true) {
                    query_token = query_token + " or company_id = " + decrypt(localStorage.getItem('CompanyIDLogin'))
                }

                Axios.post(url.select, {
                    query: encrypt(query_token)
                }).then(async (data) => {
                    this.setState({
                        get_sales_token: data.data.data
                    });
                })

                let cek_statuscart = encrypt("select a.id, a.history_nego_id, a.status, a.nego_count, a.qty, c.berat, b.persen_nego_1, b.persen_nego_2, b.persen_nego_3 from " +
                    "gcm_master_cart a, gcm_list_barang b, gcm_master_barang c where a.barang_id = b.id and c.id = b.barang_id and a.status = 'A' and a.company_id =" + decrypt(localStorage.getItem('CompanyIDLogin')) + "  and a.barang_id = " + product.id)
                Axios.post(url.select, {
                    query: cek_statuscart
                }).then(async (data) => {
                    Toast.hide();
                    // Toast.info('kuantitas minimal nego : ' + product.jumlah_min_nego + ' ' + product.satuan, 2500, () => {
                    // });
                    if (data.data.data.length == 0) {
                        if (this.state.nego_auto == true) {
                            this.responNego()
                        }
                        this.setState({
                            modalOpen: !this.state.modalOpen,
                            openresponnego: false
                        });
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
                else {

                    await this.setState({
                        send_nego: true
                    })

                    if (this.state.nego_auto == true) {
                        var query = encrypt("INSERT INTO gcm_master_cart (company_id, barang_id, qty, harga_konsumen, harga_sales, create_by, update_by, shipto_id, billto_id, payment_id) VALUES " +
                            "(" + decrypt(localStorage.getItem('CompanyIDLogin')) + "," +
                            product.id + "," +
                            (this.state.quantity_nego / product.berat) + "," +
                            (document.getElementById("inputNego").value.split('.').join("") * this.state.quantity_nego) + ", " +
                            (Math.ceil(this.state.respons_nego * product.kurs) * this.state.quantity_nego) + "," +
                            decrypt(localStorage.getItem('UserIDLogin')) + "," +
                            decrypt(localStorage.getItem('UserIDLogin')) + "," +
                            this.state.data_alamat_shipto + "," +
                            this.state.data_alamat_billto + "," +
                            this.state.payment_id + ") returning id");
                    }
                    else {
                        var query = encrypt("INSERT INTO gcm_master_cart (company_id, barang_id, qty, harga_konsumen, harga_sales, create_by, update_by, shipto_id, billto_id, payment_id) VALUES " +
                            "(" + decrypt(localStorage.getItem('CompanyIDLogin')) + "," +
                            product.id + "," +
                            (this.state.quantity_nego / product.berat) + "," +
                            (document.getElementById("inputNego").value.split('.').join("") * this.state.quantity_nego) + ", null ," +
                            decrypt(localStorage.getItem('UserIDLogin')) + "," +
                            decrypt(localStorage.getItem('UserIDLogin')) + "," +
                            this.state.data_alamat_shipto + "," +
                            this.state.data_alamat_billto + "," +
                            this.state.payment_id + ") returning id");
                    }

                    Toast.loading('loading . . .', () => {
                    });
                    await Axios.post(url.select, {
                        query: query
                    }).then(async (data) => {

                        this.setState({ id_mastercart: data.data.data[0].id })

                        let input_nego = document.getElementById("inputNego").value.split('.').join("")
                        let respon_nego = Math.ceil((this.state.respons_nego * product.kurs))
                        let price_terendah = Math.ceil((product.price_terendah * product.kurs))
                        let harga_sales = Math.ceil((product.price * product.kurs))

                        if (this.state.nego_auto == true) {
                            if (input_nego > respon_nego) {
                                var set_harga_final = input_nego
                                respon_nego = input_nego
                            }
                            else {
                                var set_harga_final = 0
                            }
                            var history_nego = encrypt("insert into gcm_history_nego (harga_nego, harga_sales, notes, created_by, updated_by, updated_date, harga_nego_2, harga_sales_2, harga_nego_3, harga_sales_3, harga_final, updated_by_2, updated_by_3, updated_date_2, updated_date_3, time_respon)" +
                                "values (" + input_nego + "," + respon_nego + ",''," + decrypt(localStorage.getItem('UserIDLogin')) + "," + decrypt(localStorage.getItem('UserIDLogin')) + ",now(), null,null,null,null," + set_harga_final + ",null,null,null,null, now() + interval '1 hour') returning id ")
                        }
                        else if (this.state.nego_auto == false) {
                            if (input_nego > price_terendah) {
                                var set_harga_final = input_nego
                                respon_nego = input_nego
                            }
                            else {
                                var set_harga_final = 0
                                respon_nego = harga_sales
                            }

                            var history_nego = encrypt("insert into gcm_history_nego (harga_nego, harga_sales, notes, created_by, updated_by, updated_date, harga_nego_2, harga_sales_2, harga_nego_3, harga_sales_3, harga_final, updated_by_2, updated_by_3, updated_date_2, updated_date_3, time_respon)" +
                                "values (" + input_nego + "," + respon_nego + ",''," + decrypt(localStorage.getItem('UserIDLogin')) + "," + decrypt(localStorage.getItem('UserIDLogin')) + ",now(), null,null,null,null," + set_harga_final + ",null,null,null,null,null) returning id ")
                        }

                        //insert ke gcm_history_nego
                        await Axios.post(url.select, {
                            query: history_nego
                        }).then(async (data) => {
                            var approve_nego_auto = false
                            if (this.state.nego_auto == true) {
                                if (document.getElementById("inputNego").value.split('.').join("") >= respon_nego) {
                                    var update_mastercart = encrypt("update gcm_master_cart set nego_count = 1, harga_sales = harga_konsumen " +
                                        ", history_nego_id = " + data.data.data[0].id + " where id = " + this.state.id_mastercart)
                                }
                                else {
                                    var update_mastercart = encrypt("update gcm_master_cart set nego_count = 1, history_nego_id = " + data.data.data[0].id + " where id = " + this.state.id_mastercart)
                                }
                            }
                            else {
                                if (document.getElementById("inputNego").value.split('.').join("") >= price_terendah) {
                                    var update_mastercart = encrypt("update gcm_master_cart set nego_count = 1, harga_sales = harga_konsumen " +
                                        ", history_nego_id = " + data.data.data[0].id + " where id = " + this.state.id_mastercart)
                                    approve_nego_auto = true
                                }
                                else {
                                    var update_mastercart = encrypt("update gcm_master_cart set nego_count = 1, history_nego_id = " + data.data.data[0].id + " where id = " + this.state.id_mastercart)
                                }
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
                                    modalOpen: false
                                })

                                if (this.state.nego_auto == false) {
                                    if (approve_nego_auto == true) {
                                        this.setState({
                                            displaynegosuccess: true
                                        })
                                    }
                                    else {
                                        Toast.success('Berhasil mengirim nego', 1500, () => {
                                        });
                                    }
                                }
                                else {
                                    Toast.success('Berhasil mengirim nego', 1500, () => {
                                    });
                                }
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
            };
        }

        const cek_login = localStorage.getItem('Login');
        const get_cart = cart

        const classes = classNames('input-number', 'product__quantity');
        const formControlClasses = classNames('form-control input-number__input', {
            'form-control-sm': 'xl' === 'sm',
            'form-control-lg': 'xl' === 'lg',
        });

        if (this.state.status_cart != '') {

            return (
                <div className={`product product--layout--${layout}`}>
                    <div className="product__content">
                        <ProductGallery layout={layout} images={product.foto} ></ProductGallery>
                        <div className="product__info" style={{ marginBottom: '10px' }}>
                            <div className="product__wishlist-compare">
                                <AsyncAction
                                    action={() => wishlistAddItem(product)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            data-toggle="tooltip"
                                            data-placement="right"
                                            title="Wishlist"
                                            onClick={run}
                                            className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                                'btn-loading': loading,
                                            })}
                                        >
                                            <Wishlist16Svg />
                                        </button>
                                    )}
                                />
                                <AsyncAction
                                    action={() => compareAddItem(product)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            data-toggle="tooltip"
                                            data-placement="right"
                                            title="Compare"
                                            onClick={run}
                                            className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                                'btn-loading': loading,
                                            })}
                                        >
                                            <Compare16Svg />
                                        </button>
                                    )}
                                />
                            </div>
                            <h5 className="product__name">{product.nama}</h5>

                            {/* Deskripsi Barang */}
                            <div className="product__description">
                                {product.deskripsi}
                            </div>
                            <ul className="product__meta">
                                {/* <li className="product__meta-availability">
                                    Dijual oleh :
                                    {' '}
                                    <strong>{product.nama_perusahaan}{product.nama_perusahaan}{product.nama_perusahaan}{product.nama_perusahaan}</strong>
                                </li> */}
                            </ul>
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9">
                                    <li className="product__meta-availability">
                                        Dijual oleh :
                                            {' '}
                                        <strong>{product.nama_perusahaan}</strong>
                                    </li>
                                </div>
                                {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3">
                                    <div id="btn-chat-product" className='btn btn-xs' onClick={this.toggleModalChat}> hubungi penjual </div>
                                </div> */}
                            </div>
                        </div>

                        <div className="product__sidebar">
                            <div className="product__availability">
                                Availability:
                                {' '}
                                <span className="text-success">In Stock</span>
                            </div>

                            {cek_login == null || hide_harga == true ?
                                (null) :
                                (
                                    <div className="product__prices" style={{ marginTop: '8px' }}>
                                        <NumberFormat value={Math.ceil(product.price * product.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /> / Kg
                                    </div>)
                            }

                            {
                                (this.state.status_cart == 'cart_no' && cek_login != null) || cek_login == null ?
                                    (<form className="product__options">
                                        <div className="form-group product__option">
                                            <label htmlFor="product-quantity" >Kuantitas ({product.satuan})</label>
                                            <div className="row">
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-7 pl-lg-3">
                                                    {/* <InputNumberMax
                                                        id="product-quantity-beli"
                                                        aria-label="Quantity"
                                                        className="product__quantity"
                                                        size="md"
                                                        min={product.jumlah_min_beli}
                                                        value={quantity}
                                                        kelipatan={product.berat}
                                                        onChange={this.handleChangeQuantity}
                                                    /> */}

                                                    <div className={classes} style={{ width: '100%' }}>
                                                        <NumberFormat id="product-quantity-beli" value={quantity} onChange={() => this.handleChangeQuantity()} spellCheck="false" autoComplete="off" allowNegative={false}
                                                            className={formControlClasses} thousandSeparator={'.'} decimalSeparator={','} />
                                                        <div className="input-number__add" onMouseDown={() => this.handleAddMouseDown(product.berat, 'beli')} />
                                                        <div className="input-number__sub" onMouseDown={() => this.handleSubMouseDown(product.berat, product.jumlah_min_beli, 'beli')} />
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-7">
                                                    <div className="row">
                                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 mt-2 pr-lg-1 pl-lg-3">
                                                            {cek_login == null || hide_harga == true ?
                                                                (<AsyncAction
                                                                    render={({ run, loading }) => (
                                                                        <div>
                                                                            {hide_harga == true ?
                                                                                (<div className='btn btn-primary btn-md' style={{ width: '100%' }} onClick={() => { this.setState({ openresponlangganan: true }) }}>Tambah ke Keranjang</div>) :
                                                                                (<Link to='/masuk' className='btn btn-primary btn-md' style={{ width: '100%' }}>Tambah ke Keranjang</Link>)
                                                                            }
                                                                        </div>
                                                                    )}
                                                                />) :
                                                                (<CartContext.Consumer>
                                                                    {(value) => (
                                                                        <AsyncAction
                                                                            action={async () => { await submit_tocart(); await value.loadDataCart(); await this.statusbarang_cart(); }}
                                                                            render={({ run, loading }) => (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={run}
                                                                                    disabled={this.state.disable_button}
                                                                                    style={{ width: '100%', whiteSpace: 'nowrap' }}
                                                                                    className={classNames('btn btn-primary btn-md', {
                                                                                    })}
                                                                                >
                                                                                    Tambah ke Keranjang
                                                                                </button>

                                                                            )}
                                                                        />
                                                                    )}
                                                                </CartContext.Consumer>
                                                                )
                                                            }
                                                        </div>

                                                        {product.negotiable == 'yes' ? (
                                                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2 pl-lg-1">
                                                                {cek_login == null || hide_harga == true ?
                                                                    (<AsyncAction
                                                                        render={({ run, loading }) => (
                                                                            <div>
                                                                                {hide_harga == true ?
                                                                                    (<div className='btn btn-secondary btn-md' style={{ width: '100%' }} onClick={() => { this.setState({ openresponlangganan: true }) }}>Nego</div>) :
                                                                                    (<Link to='/masuk' className='btn btn-secondary btn-md' style={{ width: '100%' }}>Nego</Link>)
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    />) :
                                                                    (<AsyncAction
                                                                        action={() => cartAddItem(product, [], quantity)}
                                                                        render={({ run, loading }) => (
                                                                            <button
                                                                                type="button"
                                                                                disabled={this.state.disable_button}
                                                                                onClick={check_statusnego}
                                                                                style={{ width: '100%' }}
                                                                                className={classNames('btn btn-secondary btn-md', {
                                                                                    'btn-loading': loading,
                                                                                })}
                                                                            >
                                                                                Nego
                                                                            </button>
                                                                        )}
                                                                    />)
                                                                }
                                                            </div>
                                                        ) : (
                                                                null
                                                            )
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>) :
                                    (<div><label style={{ fontSize: '15px', fontWeight: '590', color: 'red' }}>Barang telah dimasukkan ke dalam keranjang</label></div>)
                            }
                        </div>
                    </div>

                    <Modal isOpen={this.state.modalOpen} centered size="sm" backdrop="static">
                        <ModalHeader className="modalHeaderCustom" toggle={this.toggle}>Nego Harga</ModalHeader>
                        <div className="card-body">
                            <div className="form-group">
                                <div className="address-card__row" style={{ margin: '0px' }}>
                                    <div className="address-card__row-title">Nama Barang</div>
                                    <div className="address-card__row-content"><label style={{ fontSize: '13px', fontWeight: '600' }}>{product.nama}</label></div>
                                </div>
                                <div className="address-card__row" style={{ margin: '0px' }}>
                                    <div className="address-card__row-title">Harga Barang</div>
                                    <div className="address-card__row-content"><span style={{ fontSize: '13px', fontWeight: '600' }}><NumberFormat value={Math.ceil(product.price * product.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span> <label style={{ fontSize: '11px', fontWeight: '500' }}> / {product.satuan}</label></div>
                                </div>

                                <div id="form-nego" style={{ display: this.state.displayformnego }}>
                                    <div className="address-card__row">
                                        <center>
                                            <label htmlFor="input-nego" style={{ fontSize: '13px', fontWeight: '550' }}>Kuantitas ({product.satuan}) : </label>
                                        </center>
                                        <div className={classes} style={{ width: '100%' }}>
                                            <NumberFormat id="product-quantity-nego" value={this.state.quantity_nego} onChange={() => this.handleChangeQuantityNego()} spellCheck="false" autoComplete="off" allowNegative={false} style={{ width: '100%' }}
                                                className={formControlClasses} disabled={this.state.disable_qtynego} thousandSeparator={'.'} decimalSeparator={','} />
                                            <div className="input-number__add" onMouseDown={() => this.handleAddMouseDown(product.berat, 'nego')} />
                                            <div className="input-number__sub" onMouseDown={() => this.handleSubMouseDown(product.berat, product.jumlah_min_nego, 'nego')} />
                                        </div>
                                        <label style={{ fontSize: '11px', fontWeight: '550', color: 'red' }}> * Kuantitas minimal nego : {product.jumlah_min_nego} {product.satuan} </label>
                                    </div>
                                </div>

                                <div className="address-card__row">
                                    <center><label htmlFor="input-nego" style={{ fontSize: '13px', fontWeight: '550' }}>Harga Nego : </label></center>
                                </div>
                                <InputGroup>
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>Rp</InputGroupText>
                                    </InputGroupAddon>
                                    <NumberFormat onChange={this.handleValueNego} spellCheck="false" autoComplete="off" id='inputNego' style={{ width: '100%' }} className="form-control" allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} />
                                </InputGroup>
                                <label style={{ fontSize: '11px', fontWeight: '550', color: 'red' }}> * Harga nego per {product.satuan} </label>
                            </div>
                            <CartContext.Consumer>
                                {(value) => (
                                    <button type="submit" onClick={async () => {
                                        await submit_nego(); await value.loadDataCart();
                                        await value.loadDataNotif();
                                        await value.sendNotifikasi(this.state.send_nego, product.barang_id, product.nama, decrypt(localStorage.getItem('CompanyIDLogin')),
                                            product.company_id, product.nama_perusahaan, this.state.get_sales_token, product.nego_auto)
                                        await this.statusbarang_cart();
                                    }} style={{ width: '100%' }} className="btn btn-primary" disabled={this.state.disable_button_nego}>
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

                    <Modal isOpen={this.state.modalChat_isOpen} size="xl" backdrop="static" >
                        <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleModalChat}>Chat</ModalHeader>
                        <div className="card-body">
                            <Messenger company_id_buyer={decrypt(localStorage.getItem('CompanyIDLogin'))} company_id_seller={product.company_id}
                                barang_id={product.id} type={"barang"} barang_image={product.foto} barang_nama={product.nama} />
                        </div>
                    </Modal>

                    <Dialog
                        maxWidth="xs"
                        open={this.state.openresponlangganan}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">Peringatan !</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Anda belum berlangganan pada distributor terkait
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={() => { this.setState({ openresponlangganan: !this.state.openresponlangganan }) }}>
                                Mengerti
                        </Button>
                        </DialogActions>
                    </Dialog>

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
                                {/* <img src={"/images/connection.png"} /> */}
                                <i class="fas fa-check-circle fa-3x mb-4" style={{ color: '#8CC63E' }}></i>
                            </center>
                            <DialogContentText>
                                <center>Harga nego berlaku dalam hari yang sama. Silakan membuat pesanan sebelum pukul 24:00 untuk dapat menggunakan harga nego</center>
                            </DialogContentText>
                            <center>
                                <button type="submit" style={{ width: '30%' }} className="btn btn-primary mt-4 mb-3" onClick={() => this.setState({ displaynegosuccess: false })}>
                                    OK
                        </button>
                            </center>
                        </DialogContent>
                    </Dialog>


                </div>
            );
        }
        else {

            return (
                <div className={`product product--layout--${layout}`}>
                    <div className="product__content">
                        <ProductGallery layout={layout} images={product.foto} ></ProductGallery>
                        <div className="product__info" style={{ marginBottom: '10px' }}>
                            <div className="product__wishlist-compare">
                                <AsyncAction
                                    action={() => wishlistAddItem(product)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            data-toggle="tooltip"
                                            data-placement="right"
                                            title="Wishlist"
                                            onClick={run}
                                            className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                                'btn-loading': loading,
                                            })}
                                        >
                                            <Wishlist16Svg />
                                        </button>
                                    )}
                                />
                                <AsyncAction
                                    action={() => compareAddItem(product)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            data-toggle="tooltip"
                                            data-placement="right"
                                            title="Compare"
                                            onClick={run}
                                            className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                                'btn-loading': loading,
                                            })}
                                        >
                                            <Compare16Svg />
                                        </button>
                                    )}
                                />
                            </div>
                            <h5 className="product__name">{product.nama}</h5>

                            {/* Deskripsi Barang */}
                            <div className="product__description">
                                {product.deskripsi}
                            </div>
                            <ul className="product__meta">
                                {/* <li className="product__meta-availability">
                                    Dijual oleh :
                                    {' '}
                                    <strong>{product.nama_perusahaan}{product.nama_perusahaan}{product.nama_perusahaan}{product.nama_perusahaan}</strong>
                                </li> */}
                            </ul>
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9">
                                    <li className="product__meta-availability">
                                        Dijual oleh :
                                            {' '}
                                        <strong>{product.nama_perusahaan}</strong>
                                    </li>
                                </div>
                                {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3">
                                    <div id="btn-chat-product" className='btn btn-xs' onClick={this.toggleModalChat}> hubungi penjual </div>
                                </div> */}
                            </div>
                        </div>

                        <div className="product__sidebar">
                            <div className="product__availability">
                                Availability:
                                {' '}
                                <span className="text-success">In Stock</span>
                            </div>

                            {cek_login == null || hide_harga == true ?
                                (null) :
                                (
                                    <div className="product__prices" style={{ marginTop: '8px' }}>
                                        <NumberFormat value={Math.ceil(product.price * product.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /> / Kg
                                    </div>)
                            }

                            {
                                (get_cart == 'cart_no' && cek_login != null) || cek_login == null ?
                                    (<form className="product__options">
                                        <div className="form-group product__option">
                                            <label htmlFor="product-quantity" >Kuantitas ({product.satuan})</label>
                                            <div className="row">
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-7">
                                                    <div className={classes} style={{ width: '100%' }}>
                                                        <NumberFormat id="product-quantity-beli" value={quantity} onChange={() => this.handleChangeQuantity()} spellCheck="false" autoComplete="off" allowNegative={false}
                                                            className={formControlClasses} thousandSeparator={'.'} decimalSeparator={','} />
                                                        <div className="input-number__add" onMouseDown={() => this.handleAddMouseDown(product.berat, 'beli')} />
                                                        <div className="input-number__sub" onMouseDown={() => this.handleSubMouseDown(product.berat, product.jumlah_min_beli, 'beli')} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-7">
                                                    <div className="row">
                                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 mt-2 pr-lg-1 pl-lg-3">
                                                            {cek_login == null || hide_harga == true ?
                                                                (<AsyncAction
                                                                    render={({ run, loading }) => (
                                                                        <div>
                                                                            {hide_harga == true ?
                                                                                (<div className='btn btn-primary btn-md' style={{ width: '100%' }} onClick={() => { this.setState({ openresponlangganan: true }) }}>Tambah ke Keranjang</div>) :
                                                                                (<Link to='/masuk' className='btn btn-primary btn-md' style={{ width: '100%' }}>Tambah ke Keranjang</Link>)
                                                                            }
                                                                        </div>
                                                                    )}
                                                                />) :
                                                                (<CartContext.Consumer>
                                                                    {(value) => (
                                                                        <AsyncAction
                                                                            action={async () => { await submit_tocart(); await value.loadDataCart(); await this.statusbarang_cart(); }}
                                                                            render={({ run, loading }) => (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={run}
                                                                                    disabled={this.state.disable_button}
                                                                                    style={{ width: '100%', whiteSpace: 'nowrap' }}
                                                                                    className={classNames('btn btn-primary btn-md', {
                                                                                    })}
                                                                                >
                                                                                    Tambah ke Keranjang
                                                                                </button>

                                                                            )}
                                                                        />
                                                                    )}
                                                                </CartContext.Consumer>
                                                                )
                                                            }
                                                        </div>

                                                        {product.negotiable == 'yes' ? (
                                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4 mt-2 pl-lg-1">
                                                                {cek_login == null || hide_harga == true ?
                                                                    (<AsyncAction
                                                                        render={({ run, loading }) => (
                                                                            <div>
                                                                                {hide_harga == true ?
                                                                                    (<div className='btn btn-secondary btn-md' style={{ width: '100%' }} onClick={() => { this.setState({ openresponlangganan: true }) }}>Nego</div>) :
                                                                                    (<Link to='/masuk' className='btn btn-secondary btn-md' style={{ width: '100%' }}>Nego</Link>)
                                                                                }
                                                                            </div>
                                                                            // <Link to='/masuk' className='btn btn-secondary btn-lg'>Nego</Link>
                                                                        )}
                                                                    />) :
                                                                    (<AsyncAction
                                                                        action={() => cartAddItem(product, [], quantity)}
                                                                        render={({ run, loading }) => (
                                                                            <button
                                                                                type="button"
                                                                                disabled={this.state.disable_button}
                                                                                onClick={check_statusnego}
                                                                                style={{ width: '100%' }}
                                                                                className={classNames('btn btn-secondary btn-md', {
                                                                                    'btn-loading': loading,
                                                                                })}
                                                                            >
                                                                                Nego
                                                                            </button>
                                                                        )}
                                                                    />)
                                                                }
                                                            </div>
                                                        ) :
                                                            (null)
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>) :
                                    (
                                        <div>
                                            <label style={{ fontSize: '15px', fontWeight: '590', color: 'red' }}>Barang telah dimasukkan ke dalam keranjang</label>
                                        </div>
                                    )
                            }
                        </div>
                    </div>

                    <Modal isOpen={this.state.modalOpen} centered size="sm" backdrop="static">
                        <ModalHeader className="modalHeaderCustom" toggle={this.toggle}>Nego Harga</ModalHeader>
                        <div className="card-body">
                            <div className="form-group">
                                <div className="address-card__row" style={{ margin: '0px' }}>
                                    <div className="address-card__row-title">Nama Barang</div>
                                    <div className="address-card__row-content"><label style={{ fontSize: '13px', fontWeight: '600' }}>{product.nama}</label></div>
                                </div>
                                <div className="address-card__row" style={{ margin: '0px' }}>
                                    <div className="address-card__row-title">Harga Barang</div>
                                    <div className="address-card__row-content"><span style={{ fontSize: '13px', fontWeight: '600' }}><NumberFormat value={Math.ceil(product.price * product.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span> <label style={{ fontSize: '11px', fontWeight: '500' }}> / {product.satuan}</label></div>
                                </div>

                                <div id="form-nego" style={{ display: this.state.displayformnego }}>

                                    <div className="address-card__row">
                                        <center>
                                            <label htmlFor="input-nego" style={{ fontSize: '13px', fontWeight: '550' }}>Kuantitas ({product.satuan}) : </label>
                                        </center>
                                        <div className={classes} style={{ width: '100%' }}>
                                            <NumberFormat id="product-quantity-nego" value={this.state.quantity_nego} onChange={() => this.handleChangeQuantityNego()} spellCheck="false" autoComplete="off" allowNegative={false}
                                                className={formControlClasses} thousandSeparator={'.'} decimalSeparator={','} />
                                            <div className="input-number__add" onMouseDown={() => this.handleAddMouseDown(product.berat, 'nego')} />
                                            <div className="input-number__sub" onMouseDown={() => this.handleSubMouseDown(product.berat, product.jumlah_min_nego, 'nego')} />
                                        </div>
                                        <label style={{ fontSize: '11px', fontWeight: '550', color: 'red' }}> * Kuantitas minimal nego : {product.jumlah_min_nego} {product.satuan} </label>
                                    </div>
                                </div>

                                <div className="address-card__row">
                                    <center><label htmlFor="input-nego" style={{ fontSize: '13px', fontWeight: '550' }}>Harga Nego : </label></center>
                                </div>
                                <InputGroup>
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>Rp</InputGroupText>
                                    </InputGroupAddon>
                                    <NumberFormat onChange={this.handleValueNego} spellCheck="false" autoComplete="off" id='inputNego' style={{ width: '100%' }} className="form-control" allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} />
                                </InputGroup>
                                <label style={{ fontSize: '11px', fontWeight: '550', color: 'red' }}> * Harga nego per {product.satuan} </label>
                            </div>
                            <CartContext.Consumer>
                                {(value) => (
                                    <button type="submit" onClick={async () => {
                                        await submit_nego(); await value.loadDataCart();
                                        await value.loadDataNotif();
                                        await value.sendNotifikasi(this.state.send_nego, product.barang_id, product.nama, decrypt(localStorage.getItem('CompanyIDLogin')),
                                            product.company_id, product.nama_perusahaan, this.state.get_sales_token, product.nego_auto)
                                        await this.statusbarang_cart();
                                    }} style={{ width: '100%' }} className="btn btn-primary" disabled={this.state.disable_button_nego}>
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

                    <Modal isOpen={this.state.modalChat_isOpen} size="xl" backdrop="static" >
                        <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleModalChat}>Chat</ModalHeader>
                        <div className="card-body">
                            <Messenger company_id_buyer={decrypt(localStorage.getItem('CompanyIDLogin'))} company_id_seller={product.company_id}
                                barang_id={product.id} type={"barang"} barang_image={product.foto} barang_nama={product.nama} />
                        </div>
                    </Modal>

                    <Dialog
                        maxWidth="xs"
                        open={this.state.openresponlangganan}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">Peringatan !</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Anda belum berlangganan pada distributor terkait
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={() => { this.setState({ openresponlangganan: false }) }}>
                                Mengerti
                        </Button>
                        </DialogActions>
                    </Dialog>

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
                                {/* <img src={"/images/connection.png"} /> */}
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

                </div >
            );
        }
    }
}

Product.propTypes = {
    /** product object */
    product: PropTypes.object.isRequired,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
};

Product.defaultProps = {
    layout: 'standard',
};

const mapDispatchToProps = {
    cartAddItem,
    wishlistAddItem,
    compareAddItem,
};

export default connect(
    () => ({}),
    mapDispatchToProps,
)(Product);
