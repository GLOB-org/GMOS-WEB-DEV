// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardBody, Input } from 'reactstrap';
import TextField from '@material-ui/core/TextField';

// application
import AsyncAction from '../shared/AsyncAction';
import Currency from '../shared/Currency';
import InputNumber from '../shared/InputNumberMax';
import PageHeader from '../shared/PageHeader';
import { cartRemoveItem, cartUpdateQuantities } from '../../store/cart';
import { Cross12Svg } from '../../svg';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import NumberFormat from 'react-number-format';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'reactstrap';
import Toast from 'light-toast';
import DialogCatch from '../shared/DialogCatch';
import { CartContext } from '../../context/cart';

// data stubs
import theme from '../../data/theme';


class ShopPageCart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quantities: [],
            data_cart: [],
            data_cartgrouping: [],
            data_penjual: [],
            array_groupbarang: [],
            array: [],
            kurs: '',
            statusCB: true,
            qty_cart: 1,
            quantity: '',
            jumlah_min_beli: '',
            kelipatan: '',
            total_harga: 0, total_harga_nego: 0, total_harga_asli: 0,
            openConfirmation: false, openQty: false,
            selected_delete: '', selected_qty: '',
            disablesimpanqty: false,
            checked: 'true',
            load_datacart: ''
        };
    }

    checkBarang(id, id_penjual) {
        let loop = this.state.array_groupbarang[id_penjual]
        if (document.getElementById(id).checked == true) {
            document.getElementById(id).checked = true
            let all_checked = 'y'
            for (var i = 0; i < loop; i++) {
                if (document.getElementById(id_penjual.toString().concat(i.toString())).checked != true) {
                    all_checked = 'n'
                    break;
                }
            }
            if (all_checked == 'y') {
                document.getElementById(id_penjual).checked = true
            }
            else {
                document.getElementById(id_penjual).checked = false
            }
        }
        else if (document.getElementById(id).checked == false) {
            document.getElementById(id).checked = false
            document.getElementById(id_penjual).checked = false
        }
    }

    checkPenjual(id) {
        let loop = this.state.array_groupbarang[id]

        if (document.getElementById(id).checked == true) {
            for (var i = 0; i < loop; i++) {
                document.getElementById(id.toString().concat(i.toString())).checked = true
            }
        }
        else if (document.getElementById(id).checked == false) {
            for (var i = 0; i < loop; i++) {
                document.getElementById(id.toString().concat(i.toString())).checked = false
            }
        }
    }

    deletebarang = async (get_param) => {

        let query = encrypt("UPDATE gcm_master_cart SET status='I', update_date=now(), " +
            "update_by=" + decrypt(localStorage.getItem('UserIDLogin')) +
            " where company_id=" + decrypt(localStorage.getItem('CompanyIDLogin')) +
            " and barang_id=" + get_param
        )

        await Axios.post(url.select, {
            query: query
        }).then(async (data) => {
            await this.setState({ openConfirmation: !this.state.openConfirmation })
            this.loadDataCart()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    updateqty = async (get_param) => {

        Toast.loading('loading . . .', () => {
        });

        let query = encrypt("update gcm_master_cart set qty = " + this.state.quantity / this.state.kelipatan + " where id = '" + get_param + "'")

        await Axios.post(url.select, {
            query: query
        }).then(async (data) => {
            Toast.hide()
            await this.setState({ openQty: !this.state.openQty })
            await this.loadDataCart()
        }).catch(err => {
            Toast.fail('Gagal mengubah kuantitas barang', 1500, () => {
            });
            // console.log('error' + err);
            // console.log(err);
        })
    }

    setCheck = (id) => {
        if (document.getElementById(id).checked == true) {
            this.setState({
                statusCB: !this.state.statusCB
            });
            // this.setState(prevState => ({ statusCB: !prevState.isChecked }));
        }
        else {
            this.setState({
                statusCB: !this.state.statusCB
            });
            // this.setState(prevState => ({ statusCB: !prevState.isChecked }));

        }
    }

    getItemQuantity(item) {
        const { quantities } = this.state;
        const quantity = quantities.find((x) => x.itemId === item.id);

        return quantity ? quantity.value : item.quantity;
    }

    handleChangeQuantity = (quantity) => {
        this.setState({ quantity });
        var get_value_input = document.getElementById('product-quantity').value
        var cek_kelipatan = Number(get_value_input) % Number(this.state.kelipatan)

        if (get_value_input.length == 1) {
            if (get_value_input == '0') {
                this.setState({
                    disablesimpanqty: true
                });
            }
        }

        if (Number(get_value_input) < Number(this.state.jumlah_min_beli) || cek_kelipatan != 0 || get_value_input.charAt(0) == 0) {
            this.setState({
                disablesimpanqty: true
            });
        } else if (Number(get_value_input) >= Number(this.state.jumlah_min_beli) && cek_kelipatan == 0) {
            this.setState({
                disablesimpanqty: false
            });
        }

    };

    cartNeedUpdate() {
        const { quantities } = this.state;
        const { cart } = this.props;

        return quantities.filter((x) => {
            const item = cart.items.find((item) => item.id === x.itemId);

            //return item && item.quantity !== x.value;
            return item && item.quantity !== x.value && x.value !== '';

        }).length > 0;
    }

    toggleConfirmation = (get_param) => {
        this.setState({
            openConfirmation: !this.state.openConfirmation,
            selected_delete: get_param
        });
    }

    toggleKuantitas = async (get_param, index, jum_min_beli, berat, qty) => {
        if (this.state.openQty == false) {
            await this.setState({
                selected_qty: get_param,
                quantity: qty * berat,
                jumlah_min_beli: jum_min_beli,
                kelipatan: berat
            });
        }

        this.setState({
            disablesimpanqty: false,
            openQty: !this.state.openQty
        });
    }

    async loadDataCart() {
        let get_penjual = encrypt("SELECT distinct(d.id), d.nama_perusahaan " +
            "FROM gcm_master_cart a inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id inner join gcm_master_company d " +
            "on b.company_id=d.id where a.company_id= " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and a.status='A'")

        // let query = encrypt("SELECT a.id, a.history_nego_id, e.harga_final, d.nama_perusahaan, c.nama, c.berat, f.alias as satuan, a.barang_id, b.price, b.foto, c.category_id, b.jumlah_min_beli, b.company_id as seller_id, d.nama_perusahaan as nama_seller, qty, harga_konsumen, a.harga_sales, nego_count, time_respon, g.nominal as kurs " +
        //     "FROM  gcm_listing_kurs g, gcm_master_satuan f, gcm_master_cart a inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id inner join gcm_master_company d " +
        //     "on b.company_id=d.id left join gcm_history_nego e on a.history_nego_id = e.id  where f.id = c.satuan and g.company_id = b.company_id and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and a.status='A' and now() between g.tgl_start and g.tgl_end order by a.create_date asc")

        let query = encrypt("SELECT a.id, a.history_nego_id, e.harga_final, d.nama_perusahaan, c.nama, c.berat, f.alias as satuan," +
            "a.barang_id, b.price, b.foto, b.jumlah_min_beli, c.category_id, b.company_id as seller_id, d.nama_perusahaan as nama_seller, qty, harga_konsumen, a.harga_sales, nego_count, time_respon, " +
            "case when now() < time_respon then 'no' end as status_time_respon, g.nominal as kurs " +
            "FROM  gcm_listing_kurs g, gcm_master_satuan f, gcm_master_cart a inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id inner join gcm_master_company d " +
            "on b.company_id=d.id left join gcm_history_nego e on a.history_nego_id = e.id  where f.id = c.satuan and g.company_id = b.company_id and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) +
            " and a.status='A' and now() between g.tgl_start and g.tgl_end order by a.create_date asc")

        Axios.post(url.select, {
            query: query
        }).then(data => {
            this.setState({
                data_cart: data.data.data,
                data_cartgrouping: data.data.data,
                load_datacart: 'done'
            });


            let data_harganego
            data_harganego = data.data.data.filter(input => {
                return input.nego_count > 0 && input.harga_final != null && input.history_nego_id != 0 && input.status_time_respon != 'no';
            });

            let data_hargaasli
            data_hargaasli = data.data.data.filter(input => {
                return input.nego_count == 0 || (input.nego_count > 0 && input.harga_final == 0) || input.status_time_respon == 'no';
            });

            this.setState({
                total_harga_nego: data_harganego.reduce((x, y) => x + (Math.ceil(y.harga_final) * y.qty * y.berat), 0),
                total_harga_asli: data_hargaasli.reduce((x, y) => x + (Math.ceil(y.price * y.kurs) * y.qty * y.berat), 0)
            });

            // this.setState({
            //     total_harga: this.state.data_cart.reduce((x, y) => x + (Math.ceil(y.price * y.kurs) * y.qty * y.berat), 0)
            // });

        }).catch(err => {
            this.setState({
                displaycatch: true,
            });
            // console.log('error' + err);
            // console.log(err);
        })

        Axios.post(url.select, {
            query: get_penjual
        }).then(data => {
            this.setState({
                data_penjual: data.data.data,
            });

        }).catch(err => {
            this.setState({
                displaycatch: true,
            });
            // console.log('error' + err);
            // console.log(err);
        })

    }

    async componentDidMount() {
        this.loadDataCart()
    }

    rendergroup(get_param, get_indexpenjual) {

        let grouping;
        grouping = this.state.data_cart.filter(filter => {
            return filter.nama_perusahaan == get_param;
        });

        if (this.state.array_groupbarang.length < this.state.data_penjual.length) {
            this.state.array_groupbarang.push(grouping.length)
        }

        for (var i = 0; i < this.state.array_groupbarang.length; i++) {
            if (this.state.array_groupbarang[i] === 0) this.state.array_groupbarang.splice(i, 1);
        }

        return grouping.map((data, index) => {
            var id_cb = get_indexpenjual.toString().concat(index.toString())
            var get_qty = data.qty
            var get_berat = data.berat
            return (
                <div style={{ display: 'contents' }}>
                    <tr className="cart-table__row">
                        <td className="cart-table__column cart-table__column--remove" aria-label="Remove" style={{ border: 'none' }}>
                            <input type="checkbox" id={id_cb} onClick={() => this.checkBarang(id_cb, get_indexpenjual)} defaultChecked={this.state.checked} />
                        </td>
                        <td className="cart-table__column cart-table__column--image" style={{ border: 'none' }}>
                            <img src={data.foto} className="detail-foto" />
                        </td>
                        <td className="cart-table__column cart-table__column--product" style={{ border: 'none' }}>
                            {data.nama}
                        </td>
                        <td className="cart-table__column cart-table__column--price" style={{ border: 'none' }}>
                            <NumberFormat value={Math.ceil(data.price * data.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                        </td>
                        <td className="cart-table__column cart-table__column--quantity" style={{ border: 'none' }}>
                            {/* 
                            <TextField
                                style={{ width: "40px" }}
                                inputProps={{ style: { textAlign: 'center' } }}
                                value={get_qty}
                                onChange={input => get_qty = input.target.value}
                            /> */}

                            <InputNumber
                                id={"qty-cart" + id_cb + index}
                                //onClick={() => this.tesklik("qty-cart" + id_cb + index)}
                                onChange={() => this.handleChangeQuantity("qty-cart" + id_cb + index)}
                                value={get_qty * get_berat}
                                min={get_berat}
                                //value={this.state.quantity}
                                kelipatan={get_berat}
                            />

                            {/* <input type="text" className="form-control"
                                onChange={this.handleChangeQuantity}
                                value={data.qty}
                                min={1}
                                // value={this.state.qty}
                                // onChange={input => this.setState({ qty: input.target.value })}
                            /> */}
                        </td>
                        <td className="cart-table__column cart-table__column--total" style={{ border: 'none' }}>
                            <NumberFormat value={Math.ceil(data.price * data.kurs * data.qty * data.berat)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                        </td>
                        <td className="cart-table__column cart-table__column--remove" aria-label="Remove" style={{ border: 'none' }}>
                            <span data-toggle="tooltip" title="Hapus dari keranjang">
                                <i class="far fa-trash-alt" onClick={() => this.toggleConfirmation(data.barang_id)} style={{ cursor: 'pointer' }}></i>
                            </span>
                        </td>
                    </tr>

                    <Dialog
                        open={this.state.openConfirmation}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">Konfirmasi Hapus</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Hapus barang dari keranjang ?
                             </DialogContentText>
                        </DialogContent>
                        <DialogActions>

                            <CartContext.Consumer>
                                {(value) => (
                                    <Button color="primary" onClick={async () => { await this.deletebarang(this.state.selected_delete); await value.loadDataCart() }}>
                                        Ya
                                    </Button>
                                )}
                            </CartContext.Consumer>

                            <Button color="light" onClick={this.toggleConfirmation}>
                                Batal
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <DialogCatch isOpen={this.state.displaycatch} />

                </div>
            )
        })
    }

    // --- flow marketplace ---
    // renderItems() {
    //     const { cart, cartRemoveItem } = this.props;

    //     return this.state.data_penjual.map((data, index) => {
    //         let image;
    //         let options;

    //         return (
    //             <Card style={{ marginTop: '0.5rem', paddingLeft: '0', paddingRight: '0' }}>
    //                 <CardBody style={{ padding: '10px 0 0 0' }}>

    //                     <table className="cart__table cart-table">
    //                         <tr>
    //                             <td className="cart-table__column cart-table__column--remove" aria-label="Remove" style={{ border: 'none' }}>
    //                                 <input type="checkbox" id={index} onClick={() => this.checkPenjual(index)} defaultChecked={this.state.checked} />
    //                             </td>
    //                             <td colSpan="5">
    //                                 <label>Distributor : <strong>{data.nama_perusahaan}</strong></label>
    //                             </td>
    //                         </tr>
    //                         <tbody>
    //                             {this.rendergroup(data.nama_perusahaan, index)}
    //                         </tbody>
    //                     </table>

    //                 </CardBody>
    //             </Card>
    //         );
    //     });
    // }


    // --- flow tunggal gcm ---
    renderItems() {

        return this.state.data_penjual.map((item, index) => {

            let grouping;
            grouping = this.state.data_cart.filter(filter => {
                return filter.seller_id == this.state.data_penjual[index].id;
            });

            return grouping.map((item, index) => {

                if (index == 0) {
                    var displaydist = "inset"
                }
                else if (index > 0) {
                    var displaydist = "none"
                }

                return (
                    <div style={{ display: 'contents' }}>
                        <tr className="cart-table__row" style={{ display: displaydist }}>
                            <td colSpan="6" style={{ padding: '10px' }}>
                                Distributor : <strong>{grouping[index].nama_perusahaan}</strong>
                            </td>
                        </tr>
                        <tr key={item.id} className="cart-table__row">
                            <td className="cart-table__column cart-table__column--image" style={{ border: 'none' }}>
                                <img src={item.foto} alt="" />
                            </td>
                            <td className="cart-table__column cart-table__column--product" style={{ border: 'none' }}>
                                {item.nama}
                            </td>

                            {item.nego_count > 0 && item.harga_final != null && item.harga_final != 0 && item.history_nego_id != 0 && item.status_time_respon != 'no' ?
                                (<td className="cart-table__column cart-table__column--price" data-title="Harga" style={{ border: 'none' }}>
                                    <NumberFormat value={Math.ceil(item.harga_final)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                </td>) :
                                (<td className="cart-table__column cart-table__column--price" data-title="Harga" style={{ border: 'none' }}>
                                    <NumberFormat value={Math.ceil(item.price * item.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                </td>)
                            }

                            <td className="cart-table__column cart-table__column--total" data-title="Kuantitas" style={{ border: 'none' }}>
                                {/* <div className="row" style={{ float: 'right' }}> */}
                                {item.qty * item.berat}{' '}{item.satuan}
                                <span data-toggle="tooltip" title="Ubah kuantitas" style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={() => this.toggleKuantitas(item.id, index, item.jumlah_min_beli, item.berat, item.qty)}>
                                    <i class="fas fa-pencil-alt fa-xs"></i>
                                </span>
                                {/* </div> */}
                            </td>

                            {item.nego_count > 0 && item.harga_final != null && item.harga_final != 0 && item.history_nego_id != 0 && item.status_time_respon != 'no' ?
                                (<td className="cart-table__column cart-table__column--total" data-title="Total" style={{ border: 'none' }}>
                                    <NumberFormat value={(Math.ceil(item.harga_final) * item.qty * item.berat)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                </td>) :
                                (<td className="cart-table__column cart-table__column--total" data-title="Total" style={{ border: 'none' }}>
                                    <NumberFormat value={(Math.ceil(item.price * item.kurs) * item.qty * item.berat)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                </td>)
                            }
                            <td className="cart-table__column cart-table__column--remove" style={{ border: 'none' }}>
                                <span data-toggle="tooltip" title="Hapus dari keranjang">
                                    <button type="button" onClick={() => this.toggleConfirmation(item.barang_id)} className='btn btn-light btn-xs btn-svg-icon'>
                                        <Cross12Svg />
                                    </button>
                                </span>
                            </td>
                        </tr>
                    </div>
                );
            });
        });
    }

    renderTotals() {
        const { cart } = this.props;

        if (cart.extraLines.length <= 0) {
            return null;
        }

        const extraLines = cart.extraLines.map((extraLine, index) => {
            let calcShippingLink;

            if (extraLine.type === 'shipping') {
                // calcShippingLink = <div className="cart__calc-shipping"><Link to="/">Calculate Shipping</Link></div>;
            }

            return (
                <tr key={index}>
                    <th>{extraLine.title}</th>
                    <td>
                        <Currency value={extraLine.price} />
                        {calcShippingLink}
                    </td>
                </tr>
            );
        });

        return (
            <React.Fragment>
                <thead className="cart__totals-header">
                    <tr>
                        <th>Subtotal</th>
                        <td><Currency value={cart.subtotal} /></td>
                    </tr>
                </thead>
                <tbody className="cart__totals-body">
                    {extraLines}
                </tbody>
            </React.Fragment>
        );
    }

    renderCart() {
        const { cart, cartUpdateQuantities } = this.props;
        const { quantities } = this.state;

        const updateCartButton = (
            <AsyncAction
                action={() => cartUpdateQuantities(quantities)}
                render={({ run, loading }) => {
                    const classes = classNames('btn btn-primary cart__update-button', {
                        'btn-loading': loading,
                    });

                    return (
                        <button type="button" onClick={run} className={classes} disabled={!this.cartNeedUpdate()}>
                            Perbarui Keranjang
                        </button>

                    );
                }}
            />
        );

        return (

            // --- flow marketplace ---

            // <div className="cart block">
            //     <div className="container">
            //         <table className="cart__table cart-table">
            //             <thead className="cart-table__head">
            //                 <tr className="cart-table__row">
            //                     <td className="cart-table__column cart-table__column--remove" aria-label="Remove" > </td>
            //                     <td colSpan="2" className="cart-table__column cart-table__column--product" style={{ paddingRight: '80px' }}>Produk</td>
            //                     <td >Harga</td>
            //                     <td ><center>Jumlah</center></td>
            //                     <td >Total</td>
            //                     <td className="cart-table__column cart-table__column--remove" aria-label="Remove" ></td>
            //                 </tr>
            //             </thead>
            //         </table>
            //         {this.renderItems()}

            //         <div className="row justify-content-end pt-md-5 pt-4">
            //             <div className="col-12 col-md-7 col-lg-6 col-xl-5">
            //                 <div className="card">
            //                     <div className="card-body">
            //                         <h5 className="card-title">Total Belanja</h5>
            //                         <hr />
            //                         <table className="cart__totals" style={{ marginBottom: '10px' }}>
            //                             {/* {this.renderTotals()} */}
            //                             <tfoot className="cart__totals-footer">
            //                                 <tr>
            //                                     <td style={{ fontSize: '17px', fontWeight: '500' }}>
            //                                         Total
            //                                     </td>
            //                                     <td style={{ fontSize: '17px', fontWeight: '700' }}>
            //                                         <NumberFormat value={this.state.total_harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
            //                                     </td>
            //                                 </tr>
            //                             </tfoot>
            //                         </table>
            //                         <Link to="/checkout" className="btn btn-primary btn-md btn-block ">
            //                             Lanjut Checkout
            //                         </Link>
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>

            //     </div>
            // </div>


            //  --- flow tunggal gcm ---

            <div className="cart block">
                <div className="container">
                    <table className="cart__table cart-table">
                        <thead className="cart-table__head">
                            <tr className="cart-table__row">
                                <th className="cart-table__column cart-table__column--image"></th>
                                <th className="cart-table__column cart-table__column--product"><strong>Produk</strong></th>
                                <th className="cart-table__column cart-table__column--price"><strong>Harga</strong></th>
                                <th className="cart-table__column cart-table__column--total"><strong>Kuantitas</strong></th>
                                <th className="cart-table__column cart-table__column--total"><strong>Total</strong></th>
                                <th className="cart-table__column cart-table__column--remove" aria-label="Remove" />
                            </tr>
                        </thead>
                        <tbody className="cart-table__body">
                            {this.renderItems()}
                        </tbody>
                    </table>

                    <div className="row justify-content-end pt-md-5 pt-2 stickybottom">
                        <div className="col-12 col-md-12 col-lg-12 col-xl-12 ">
                            <div className="card ">
                                <div id="stickybottom_shadow" className="card-body" style={{ padding: '15px' }}>
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-12  col-md-12 col-lg-8 " style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ margin: '0px' }}>Total Belanja : {' '}
                                                <strong>
                                                    <NumberFormat value={this.state.total_harga_asli + this.state.total_harga_nego} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                                </strong>
                                            </span>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4" >
                                            <Link to="/checkout" className="btn btn-primary btn-md btn-block " style={{ float: 'right' }}>
                                                Lanjut Checkout
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="row justify-content-end pt-md-5 pt-2 stickybottom">
                        <div className="col-12 col-md-12 col-lg-12 col-xl-12 ">
                            <div className="card ">
                                <div className="card-body ">
                                    <h5 className="card-title">Total Belanja</h5>
                                    <hr />
                                    <table className="cart__totals" style={{ marginBottom: '10px' }}>
                                        <tfoot className="cart__totals-footer">
                                            <tr>
                                                <td style={{ fontSize: '17px', fontWeight: '500' }}>
                                                    Total
                                                 </td>
                                                <td style={{ fontSize: '17px', fontWeight: '700' }}>
                                                    <NumberFormat value={this.state.total_harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <Link to="/checkout" className="btn btn-primary btn-md btn-block ">
                                        Lanjut Checkout
                                     </Link>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                <Dialog
                    open={this.state.openConfirmation}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Konfirmasi Hapus</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Hapus barang dari keranjang ?
                             </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <CartContext.Consumer>
                            {(value) => (
                                <Button color="primary" onClick={async () => { await this.deletebarang(this.state.selected_delete); await value.loadDataCart() }}>
                                    Ya
                                </Button>
                            )}
                        </CartContext.Consumer>
                        <Button color="light" onClick={this.toggleConfirmation}>
                            Batal
                            </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.openQty}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Ubah Kuantitas</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ubah kuantitas barang di bawah ini :
                        </DialogContentText>
                        <InputNumber
                            id="product-quantity"
                            aria-label="Quantity"
                            className="product__quantity"
                            size="xl"
                            min={this.state.jumlah_min_beli}
                            value={this.state.quantity}
                            kelipatan={this.state.kelipatan}
                            onChange={this.handleChangeQuantity}
                        />
                    </DialogContent>
                    <DialogActions>
                        <CartContext.Consumer>
                            {(value) => (
                                <Button color="primary" onClick={async () => { await this.updateqty(this.state.selected_qty); await value.loadDataCart() }} disabled={this.state.disablesimpanqty}>
                                    Simpan
                                </Button>
                            )}
                        </CartContext.Consumer>
                        <Button color="light" onClick={this.toggleKuantitas}>
                            Batal
                        </Button>
                    </DialogActions>
                </Dialog>

                <DialogCatch isOpen={this.state.displaycatch} />
            </div >
        );
    }

    render() {
        const { cart } = this.props;
        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Keranjang Belanja', url: '' },
        ];

        let content;

        if (this.state.load_datacart == 'done') {
            if (this.state.data_cart.length > 0) {
                content = this.renderCart();
            } else {
                content = (
                    <div className="block block-empty">
                        <div className="container">
                            <div className="block-empty__body">
                                <div className="block-empty__message">Keranjang belanja Anda kosong!</div>
                                <div className="block-empty__actions">
                                    <Link to="/daftarproduklangganan" className="btn btn-primary btn-sm">Belanja Sekarang</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        else {
            content = (
                <div className="block block-empty">
                    <div className="container">
                        <div className="block-empty__body">
                            <div className="block-empty__message">Sedang memuat keranjang belanja...</div>
                        </div>
                    </div>
                </div>
            );
        }


        return (
            <React.Fragment>
                <Helmet>
                    <title>{`Keranjang Belanja — ${theme.name}`}</title>
                </Helmet>

                <PageHeader header="Keranjang Belanja" breadcrumb={breadcrumb} />

                {content}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
});

const mapDispatchToProps = {
    cartRemoveItem,
    cartUpdateQuantities,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCart);
