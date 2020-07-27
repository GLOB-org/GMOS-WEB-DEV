// react
import React, { Component } from 'react';
import { useEffect } from 'react';

// third-party
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import Toast from 'light-toast';

// application
import Indicator from './Indicator';
import { Cart20Svg, Cross10Svg } from '../../svg';
import { cartRemoveItem } from '../../store/cart';
import NumberFormat from 'react-number-format';

import { CartContext } from '../../context/cart';

class IndicatorCart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data_cart: [],
            kurs: '',
            total_harga_konsumen: '',
            total_harga_asli: '',
            count_barangnego: '',
            open_alertcheckout: false,
            openConfirmation: false,
            selected_delete: '',
            updateload: ''
        }
    }

    alertCheckout = () => {
        this.setState({
            open_alertcheckout: !this.state.open_alertcheckout
        });
    }

    async loadDataCart() {
     
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
                data_cart: data.data.data,
                updateload: 'yes'
            });

            let nego_ongoing
            nego_ongoing = data.data.data.filter(input => {
                return (input.nego_count > 0 && input.harga_final == 0) || (input.nego_count > 0 && input.harga_final != 0 && input.status_time_respon == 'no');
            });

            let data_hargakonsumen
            data_hargakonsumen = data.data.data.filter(input => {
                return input.nego_count > 0 && input.harga_final != 0 && input.status_time_respon != 'no';
            });

            let data_hargaasli
            data_hargaasli = data.data.data.filter(input => {
                return input.nego_count == 0 || (input.nego_count > 0 && input.harga_final == 0) || input.status_time_respon == 'no';
            });

            this.setState({
                count_barangnego: nego_ongoing.length,
                total_harga_konsumen: data_hargakonsumen.reduce((x, y) => x + (Math.ceil(y.harga_final) * y.qty * y.berat), 0),
                total_harga_asli: data_hargaasli.reduce((x, y) => x + (Math.ceil(y.price * y.kurs) * y.qty * y.berat), 0)
            });

        }).catch(err => {
            console.log('error' + err);
            console.log(err);
        })
    }

    async componentDidMount() {
        await this.loadDataCart()
    }

    render() {
        let dropdown;
        let dropdown_first;
        let dropdown_null;
        let totals;

        const items = this.state.data_cart.map((item, index) => {
            let options;
            let image;

            if (item.options) {
                options = (
                    <ul className="dropcart__product-options">
                        {item.options.map((option, index) => (
                            <li key={index}>{`${option.optionTitle}: ${option.valueTitle}`}</li>
                        ))}
                    </ul>
                );
            }

            const deletebarang = () => {
                Toast.loading('loading . . .', () => {
                });

                let query = encrypt("UPDATE gcm_master_cart SET status='I', update_date=now(), " +
                    "update_by=" + decrypt(localStorage.getItem('UserIDLogin')) +
                    " where company_id=" + decrypt(localStorage.getItem('CompanyIDLogin')) +
                    " and barang_id=" + this.state.selected_delete
                )
                Axios.post(url.select, {
                    query: query
                }).then(data => {
                    Toast.hide()
                    this.loadDataCart()
                    if (window.location.pathname == '/keranjang' || window.location.pathname == '/checkout' || window.location.pathname == '/transaksi/nego') {
                        window.location.reload()
                    }
                    deletebarang_confirm()
                }).catch(err => {
                    console.log('error' + err);
                    console.log(err);
                })
            }

            const deletebarang_confirm = async () => {
                if (this.state.openConfirmation == false) {
                    await this.setState({
                        selected_delete: item.barang_id
                    });
                }
                this.setState({
                    openConfirmation: !this.state.openConfirmation
                });
            }

            const on_nego1 = this.state.data_cart[index].nego_count
            const on_nego2 = this.state.data_cart[index].harga_sales
            const on_nego3 = this.state.data_cart[index].harga_final
            const time_respon = this.state.data_cart[index].status_time_respon

            return (
                <div key={item.id} className="dropcart__product">
                    <div className="dropcart__product-image">
                        <img src={item.foto} alt="" />
                    </div>

                    <div className="dropcart__product-info">
                        <div className="dropcart__product-name">
                            <label style={{ fontSize: '13px', fontWeight: '550' }}> {item.nama}</label>
                        </div>
                        {options}

                        {(on_nego1 > 0 && on_nego3 == 0) || on_nego1 == 0 || time_respon == 'no' ?
                            (<div className="dropcart__product-meta">
                                <span className="dropcart__product-quantity"><NumberFormat value={item.qty * item.berat} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} /></span>
                                {' '}{item.satuan}{' x '}
                                <span className="dropcart__product-price"><NumberFormat value={Math.ceil(item.price * item.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                            </div>) :
                            (<div className="dropcart__product-meta">
                                <span className="dropcart__product-quantity"><NumberFormat value={item.qty * item.berat} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} /></span>
                                {' '}{item.satuan}{' x '}
                                <span className="dropcart__product-price"><NumberFormat value={Math.ceil(item.harga_final)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                            </div>)
                        }

                        {(on_nego1 > 0 && on_nego3 == 0) || time_respon == 'no' ?
                            (<div className="dropcart__product-meta">
                                <span className="dropcart__product-quantity" style={{ fontStyle: 'italic' }}>(Nego : <span className="dropcart__product-price"><NumberFormat value={Math.ceil(item.harga_konsumen / (item.berat * item.qty))} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>/{item.satuan})</span>
                            </div>) :
                            (<div></div>)
                        }
                    </div>
                    {/* {removeButton} */}

                    <span data-toggle="tooltip" title="Hapus dari keranjang">
                        <button type="button" onClick={() => deletebarang_confirm()} className='dropcart__product-remove btn btn-light btn-sm btn-svg-icon'>
                            <Cross10Svg />
                        </button>
                    </span>

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
                            <Button color="primary" onClick={() => deletebarang(this.state.selected_delete)}>
                                Ya
                            </Button>
                            <Button color="light" onClick={() => deletebarang_confirm()}>
                                Batal
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        });

        dropdown_first = (
            <div className="dropcart" >
                <div className="dropcart__products-list" style={{ overflowY: 'auto', maxHeight: '300px' }}>
                    {items}
                </div>
                <div className="dropcart__totals">
                    <table>
                        <tbody>
                            {totals}
                            <tr>
                                <th>Total</th>
                                <td><NumberFormat value={this.state.total_harga_asli + this.state.total_harga_konsumen} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="dropcart__buttons">
                    <Link className="btn btn-primary" to="/keranjang">Lihat Keranjang</Link>
                    {this.state.count_barangnego == 0 ?
                        (<Link className="btn btn-secondary" to="/checkout">Checkout</Link>) :
                        (<div className="btn btn-secondary" onClick={this.alertCheckout}>Checkout</div>)
                    }
                </div>

                <Dialog
                    maxWidth="xs"
                    open={this.state.open_alertcheckout}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Barang dalam Proses Negosiasi</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Anda memiliki <strong>{this.state.count_barangnego}</strong> barang yang masih dalam
                            proses negosiasi. Melanjutkan ke Checkout berarti menyetujui harga terakhir yang kami berikan.
                            Apakah Anda yakin ingin melanjutkan ke Checkout ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Link className="btn btn-primary" to="/checkout" onClick={this.alertCheckout}>Ya</Link>
                        <Button color="light" onClick={this.alertCheckout}>
                            Batal
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        );

        dropdown = (
            <div className="dropcart" >
                <div className="dropcart__products-list" style={{ overflowY: 'auto', maxHeight: '300px' }}>
                    {/* {items} */}

                    <CartContext.Consumer>
                        {value => {
                            const load = value.cart.check_load;

                            const items_update = value.cart.data_cart.map((item, index) => {
                                let options;
                                let image;

                                if (item.options) {
                                    options = (
                                        <ul className="dropcart__product-options">
                                            {item.options.map((option, index) => (
                                                <li key={index}>{`${option.optionTitle}: ${option.valueTitle}`}</li>
                                            ))}
                                        </ul>
                                    );
                                }

                                const deletebarang = async () => {
                                    Toast.loading('loading . . .', () => {
                                    });

                                    let query = encrypt("UPDATE gcm_master_cart SET status='I', update_date=now(), " +
                                        "update_by=" + decrypt(localStorage.getItem('UserIDLogin')) +
                                        " where company_id=" + decrypt(localStorage.getItem('CompanyIDLogin')) +
                                        " and barang_id=" + this.state.selected_delete
                                    )
                                    await Axios.post(url.select, {
                                        query: query
                                    }).then(data => {
                                        Toast.hide()
                                        if (window.location.pathname == '/keranjang' || window.location.pathname == '/checkout' || window.location.pathname == '/transaksi/nego') {
                                            window.location.reload()
                                        }
                                        deletebarang_confirm()
                                    }).catch(err => {
                                        console.log('error' + err);
                                        console.log(err);
                                    })
                                }

                                const deletebarang_confirm = async () => {
                                    if (this.state.openConfirmation == false) {
                                        await this.setState({
                                            selected_delete: item.barang_id
                                        });
                                    }
                                    this.setState({
                                        openConfirmation: !this.state.openConfirmation
                                    });
                                }

                                const on_nego1 = value.cart.data_cart[index].nego_count
                                const on_nego2 = value.cart.data_cart[index].harga_sales
                                const on_nego3 = value.cart.data_cart[index].harga_final
                                const time_respon = value.cart.data_cart[index].status_time_respon

                                return (
                                    <div key={item.id} className="dropcart__product">
                                        <div className="dropcart__product-image">
                                            <img src={item.foto} alt="" />
                                        </div>

                                        <div className="dropcart__product-info">
                                            <div className="dropcart__product-name">
                                                <label style={{ fontSize: '13px', fontWeight: '550' }}> {item.nama}</label>
                                            </div>
                                            {options}

                                            {(on_nego1 > 0 && on_nego3 == 0) || on_nego1 == 0 || time_respon == 'no' ?
                                                (<div className="dropcart__product-meta">
                                                    <span className="dropcart__product-quantity"><NumberFormat value={item.qty * item.berat} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} /></span>
                                                    {' '}{item.satuan}{' x '}
                                                    <span className="dropcart__product-price"><NumberFormat value={Math.ceil(item.price * item.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                                                </div>) :
                                                (<div className="dropcart__product-meta">
                                                    <span className="dropcart__product-quantity"><NumberFormat value={item.qty * item.berat} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} /></span>
                                                    {' '}{item.satuan}{' x '}
                                                    <span className="dropcart__product-price"><NumberFormat value={Math.ceil(item.harga_final)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                                                </div>)
                                            }

                                            {(on_nego1 > 0 && on_nego3 == 0) || time_respon == 'no' ?
                                                (<div className="dropcart__product-meta">
                                                    <span className="dropcart__product-quantity" style={{ fontStyle: 'italic' }}>(Nego : <span className="dropcart__product-price"><NumberFormat value={Math.ceil(item.harga_konsumen / (item.berat * item.qty))} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>/{item.satuan})</span>
                                                </div>) :
                                                (<div></div>)
                                            }
                                        </div>

                                        <span data-toggle="tooltip" title="Hapus dari keranjang">
                                            <button type="button" onClick={() => deletebarang_confirm()} className='dropcart__product-remove btn btn-light btn-sm btn-svg-icon'>
                                                <Cross10Svg />
                                            </button>
                                        </span>

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
                                                        <Button color="primary" onClick={async () => { await deletebarang(this.state.selected_delete); await value.loadDataCart() }}>
                                                            Ya
                                                        </Button>
                                                    )}
                                                </CartContext.Consumer>

                                                <Button color="light" onClick={() => deletebarang_confirm()}>
                                                    Batal
                                                    </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
                                );
                            });

                            return load == 'yes' ? (
                                <div>{items_update}</div>
                            ) : (
                                    <div>{items}</div>
                                );

                        }}
                    </CartContext.Consumer>
                </div>


                <CartContext.Consumer>
                    {value => {

                        let nego_ongoing
                        nego_ongoing = value.cart.data_cart.filter(input => {
                            return (input.nego_count > 0 && input.harga_final == 0) || (input.nego_count > 0 && input.harga_final != 0 && input.status_time_respon == 'no');
                        });

                        let data_hargakonsumen
                        data_hargakonsumen = value.cart.data_cart.filter(input => {
                            return input.nego_count > 0 && input.harga_final != 0 && input.status_time_respon != 'no';
                        });

                        let data_hargaasli
                        data_hargaasli = value.cart.data_cart.filter(input => {
                            return input.nego_count == 0 || (input.nego_count > 0 && input.harga_final == 0) || input.status_time_respon == 'no';
                        });

                        let total_harga_konsumen = data_hargakonsumen.reduce((x, y) => x + (Math.ceil(y.harga_final) * y.qty * y.berat), 0)
                        let total_harga_asli = data_hargaasli.reduce((x, y) => x + (Math.ceil(y.price * y.kurs) * y.qty * y.berat), 0)

                        return (
                            <div>
                                <div className="dropcart__totals">
                                    <table>
                                        <tbody>
                                            {totals}
                                            <tr>
                                                <th>Total</th>
                                                <td><NumberFormat value={total_harga_asli + total_harga_konsumen} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="dropcart__buttons">
                                    <Link className="btn btn-primary" to="/keranjang">Lihat Keranjang</Link>
                                    {nego_ongoing.length == 0 ?
                                        (<Link className="btn btn-secondary" to="/checkout">Checkout</Link>) :
                                        (<div className="btn btn-secondary" onClick={this.alertCheckout}>Checkout</div>)
                                    }
                                </div>
                                <Dialog
                                    maxWidth="xs"
                                    open={this.state.open_alertcheckout}
                                    aria-labelledby="responsive-dialog-title">
                                    <DialogTitle id="responsive-dialog-title">Barang dalam Proses Negosiasi</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Anda memiliki <strong>{nego_ongoing.length}</strong> barang yang masih dalam
                                proses negosiasi. Melanjutkan ke Checkout berarti menyetujui harga terakhir yang kami berikan.
                                Apakah Anda yakin ingin melanjutkan ke Checkout ?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Link className="btn btn-primary" to="/checkout" onClick={this.alertCheckout}>Ya</Link>
                                        <Button color="light" onClick={this.alertCheckout}>
                                            Batal
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        )
                    }}
                </CartContext.Consumer>
            </div >
        );

        dropdown_null = (
            <div className="dropcart">
                <div className="dropcart__empty">
                    Keranjang belanja Anda kosong
                    </div>
            </div>
        )

        return (
            <CartContext.Consumer>
                {value => {
                    const load = value.cart.check_load;
                    const count_cart = value.cart.count_data_cart;

                    if (count_cart > 0) {
                        return load == 'yes' ? (
                            <Indicator url="/shop / cart" dropdown={dropdown} value={value.cart.count_data_cart} icon={<Cart20Svg />} />
                        ) : (
                                <Indicator url="/shop/cart" dropdown={dropdown} value={this.state.data_cart.length} icon={<Cart20Svg />} />
                            );
                    }
                    else if (load == "no" && count_cart == 0 && this.state.data_cart.length == 0) {
                        return (
                            <Indicator url="/shop / cart" dropdown={dropdown_null} value={value.cart.count_data_cart} icon={<Cart20Svg />} />
                        )
                    }
                    else {
                        return load == 'yes' ? (
                            <Indicator url="/shop / cart" dropdown={dropdown_null} value={value.cart.count_data_cart} icon={<Cart20Svg />} />
                        ) : (
                                <Indicator url="/shop/cart" dropdown={dropdown_first} value={this.state.data_cart.length} icon={<Cart20Svg />} />
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

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorCart);
