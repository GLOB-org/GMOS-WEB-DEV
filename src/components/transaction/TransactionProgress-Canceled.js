import React, { Component } from 'react';
import Axios from 'axios';
import {encrypt, url, decrypt} from '../../lib';
import NumberFormat from 'react-number-format';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Toast from 'light-toast';

export default class InfoCompanyCard extends Component{
    constructor(props){
        super(props);
        this.state={
            temp: [],
            ship_to_id:'',bill_to_id:'', payment_id: '', payment_name: '',
            shipto_alamat: '', billto_alamat: '', ppn_seller: '',
            shipto_kelurahan: '', billto_kelurahan: '',
            shipto_kecamatan: '', billto_kecamatan: '',
            shipto_kota: '', billto_kota: '',
            shipto_provinsi: '', billto_provinsi: '',
            shipto_kodepos: '', billto_kodepos: '',
            shipto_notelp: '', billto_notelp: '',
            isOpen: false,
            penjual: '', cancel_reason: ''
        }
    }

    controlModal() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    detailCanceled = async(id)=>{

        Toast.loading('loading . . .', () => {
        }); 

        // let queryDetailCanceled=encrypt("select a.id, a.transaction_id, c.nama, b.foto, a.qty, a.harga, b.id, c.berat, d.alias as satuan, b.company_id as penjual, gmc.nama_perusahaan as nama_penjual from gcm_master_satuan d, gcm_master_company gmc ,gcm_transaction_detail a inner join "+
        // "gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id where gmc.id = b.company_id and c.satuan = d.id and transaction_id='"+id+"' order by c.category_id asc, c.nama asc")

        let queryDetailCanceled = encrypt("select a.id, a.transaction_id, c.nama, b.foto, a.qty, a.harga, b.id, c.berat, d.alias as satuan, b.company_id as penjual, "+
        "gmc.nama_perusahaan as nama_penjual, case when e.tgl_permintaan_kirim is not null then to_char(e.tgl_permintaan_kirim, 'dd-MM-yyyy') else '-' end as tgl_permintaan_kirim "+
        ", e.ppn_seller, case when a.note is null then '-' else a.note end as note from gcm_master_satuan d, gcm_master_company gmc ,gcm_transaction_detail a inner join "+
        "gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id inner join gcm_master_transaction e on "+
        "e.id_transaction = a.transaction_id where gmc.id = b.company_id and c.satuan = d.id and transaction_id='" + id +"' order by c.category_id asc, c.nama asc")

        await Axios.post(url.select,{
            query: queryDetailCanceled
        }).then(data=>{
          this.setState({
            temp: data.data.data,
            penjual: data.data.data[0].nama_penjual,
            ppn_seller: data.data.data[0].ppn_seller
        });
        }).catch(err=>{
            console.log('error');
            console.log(err);
        })

        let getaddress = encrypt("select shipto_id, billto_id, payment_id, cancel_reason from gcm_master_transaction gmt where id_transaction = '"+id+"'")
        await Axios.post(url.select,{
            query: getaddress
        }).then(data=>{
            this.setState({
                ship_to_id: data.data.data[0].shipto_id,
                bill_to_id: data.data.data[0].billto_id,
                payment_id: data.data.data[0].payment_id,
                cancel_reason: data.data.data[0].cancel_reason
            });
        }).catch(err=>{
            console.log('error');
            console.log(err);
        })

        let queryPayment=encrypt("select c.payment_name "+
        "from gcm_payment_listing a "+
        "inner join gcm_seller_payment_listing b on a.payment_id = b.id "+
        "inner join gcm_master_payment c on b.payment_id = c.id where a.id = " + this.state.payment_id)

        await Axios.post(url.select,{
            query: queryPayment
        }).then(data=>{
          this.setState({
            payment_name: data.data.data[0].payment_name
        });
        }).catch(err=>{
            console.log('error');
            console.log(err);
        })

        let queryBillto=encrypt("select gcm_master_alamat.alamat, initcap(gcm_master_kelurahan.nama) as kelurahan, initcap(gcm_master_kecamatan.nama) as kecamatan,"+
        "initcap(gcm_master_city.nama) as kota, initcap(gcm_master_provinsi.nama) as provinsi, gcm_master_alamat.kodepos,"+
        "gcm_master_alamat.no_telp "+
        "from gcm_master_alamat "+
        "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id "+
        "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id "+
        "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id "+
        "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id "+
        "inner join gcm_master_transaction on gcm_master_transaction.billto_id = gcm_master_alamat.id "+
        "where gcm_master_transaction.billto_id = "+this.state.bill_to_id+" and gcm_master_transaction.id_transaction = '"+id+"'")

        await Axios.post(url.select,{
            query: queryBillto
        }).then(data=>{
          this.setState({
            billto_alamat: data.data.data[0].alamat,
            billto_provinsi: data.data.data[0].provinsi,
            billto_kota: data.data.data[0].kota,
            billto_kecamatan: data.data.data[0].kecamatan,
            billto_kelurahan: data.data.data[0].kelurahan,
            billto_kodepos: data.data.data[0].kodepos,
            billto_notelp: data.data.data[0].no_telp
        });
        }).catch(err=>{
            console.log('error');
            console.log(err);
        })

        let queryShipto=encrypt("select gcm_master_alamat.alamat, initcap(gcm_master_kelurahan.nama) as kelurahan, initcap(gcm_master_kecamatan.nama) as kecamatan,"+
        "initcap(gcm_master_city.nama) as kota, initcap(gcm_master_provinsi.nama) as provinsi, gcm_master_alamat.kodepos,"+
        "gcm_master_alamat.no_telp "+
        "from gcm_master_alamat "+
        "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id "+
        "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id "+
        "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id "+
        "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id "+
        "inner join gcm_master_transaction on gcm_master_transaction.shipto_id = gcm_master_alamat.id "+
        "where gcm_master_transaction.shipto_id = "+this.state.ship_to_id+" and gcm_master_transaction.id_transaction = '"+id+"'")

        await Axios.post(url.select,{
            query: queryShipto
        }).then(data=>{
          this.setState({
            shipto_alamat: data.data.data[0].alamat,
            shipto_provinsi: data.data.data[0].provinsi,
            shipto_kota: data.data.data[0].kota,
            shipto_kecamatan: data.data.data[0].kecamatan,
            shipto_kelurahan: data.data.data[0].kelurahan,
            shipto_kodepos: data.data.data[0].kodepos,
            shipto_notelp: data.data.data[0].no_telp
        });
        Toast.hide()
        }).catch(err=>{
            console.log('error');
            console.log(err);
        })

        this.controlModal();
    }

    render(){
    return(

        <div style={{display:'contents'}}>
        <tr id='rowTransactionCanceled' style={{fontSize:'13px', color:'#3D464D'}}>
            <td style={{textAlign: 'center'}}><strong><label id='idTransaction' onClick={()=>this.detailCanceled(this.props.data.id_transaction)}>{this.props.data.id_transaction}</label></strong></td>
            <td style={{textAlign: 'center'}}>{this.props.data.create_date_edit}</td>
            <td style={{textAlign: 'center'}}>{this.props.data.date_canceled}</td>
            <td style={{textAlign: 'right'}}><NumberFormat value={Number(this.props.data.totaltrx_tax)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
        </tr> 
        
            <Modal isOpen={this.state.isOpen} size="lg">
                <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.controlModal.bind(this)}>Detail Transaksi</ModalHeader>
                <ModalBody style={{padding:'30px'}}>

                    {/* <div className="row">
                        <div className="col-md-6">
                            <div className="address-card__row">
                                <div className="address-card__row-title">ID Transaksi</div>
                                <div className="address-card__row-content"><strong>{this.props.data.id_transaction}</strong></div>
                            </div> 
                            <div className="address-card__row">
                                <div className="address-card__row-title">Alamat Pengiriman</div>
                                <span style={{fontSize: '13px', fontWeight: '500'}}>
                                    <div className="address-card__row-content">{this.state.shipto_alamat}</div>
                                    <div className="address-card__row-content">{'Kel. '}{this.state.shipto_kelurahan}{', Kec. '}{this.state.shipto_kecamatan}</div>
                                    <div className="address-card__row-content">{this.state.shipto_kota}</div>
                                    <div className="address-card__row-content">{this.state.shipto_provinsi}{', '}{this.state.shipto_kodepos}</div>
                                    <div className="address-card__row-content">{'Telepon : '}{this.state.shipto_notelp}</div>
                                </span>    
                            </div> 
                        </div>

                        <div className="col-md-6">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Penjual</div>
                                <div className="address-card__row-content"><strong>{this.state.penjual}</strong></div>
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title">Alamat Penagihan</div>
                                <span style={{fontSize: '13px', fontWeight: '500'}}>
                                    <div className="address-card__row-content">{this.state.billto_alamat}</div>
                                    <div className="address-card__row-content">{'Kel. '}{this.state.billto_kelurahan}{', Kec. '}{this.state.billto_kecamatan}</div>
                                    <div className="address-card__row-content">{this.state.billto_kota}</div>
                                    <div className="address-card__row-content">{this.state.billto_provinsi}{', '}{this.state.billto_kodepos}</div>
                                    <div className="address-card__row-content">{'Telepon : '}{this.state.billto_notelp}</div>
                                </span>   
                            </div> 
                        </div>
                    </div> */}
                    
                    <div className="row">
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <div className="address-card__row-title">ID Transaksi</div>
                                <span style={{fontSize: '14px', fontWeight: '500'}}>
                                    <div className="address-card__row-content"><strong>{this.props.data.id_transaction}</strong></div>
                                </span>
                            </div> 
                        </div>
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Status</div>
                                <span style={{fontSize: '14px', fontWeight: '500'}}>
                                    <div className="address-card__row-content"><strong>Dibatalkan</strong></div>
                                </span>
                                <span style={{fontSize: '12px', fontWeight: '500'}}>
                            <div className="address-card__row-content">Keterangan : {this.state.cancel_reason}</div>
                                </span>
                            </div> 
                        </div>
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Penjual</div>
                                <span style={{fontSize: '14px', fontWeight: '500'}}>
                                    <div className="address-card__row-content"><strong>{this.state.penjual}</strong></div>
                                </span>
                            </div> 
                        </div>
                    </div>
                    <hr style={{ borderWidth: '1px'}}/>       
                    <div className="row" style={{marginTop: '5px'}}>
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Metode Pembayaran</div>
                                    <span style={{fontSize: '12px', fontWeight: '500'}}>
                                        <div className="address-card__row-content">{this.state.payment_name}</div>
                                    </span>    
                                </div> 
                            </div>
                            <div className="col-md-4 mt-2 mt-sm-2 mt-md-0 mt-lg-0 mt-xl-0">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Alamat Pengiriman</div>
                                    <span style={{fontSize: '12px', fontWeight: '500'}}>
                                        <div className="address-card__row-content">{this.state.shipto_alamat}</div>
                                        <div className="address-card__row-content">{'Kel. '}{this.state.shipto_kelurahan}{', Kec. '}{this.state.shipto_kecamatan}</div>
                                        <div className="address-card__row-content">{this.state.shipto_kota}</div>
                                        <div className="address-card__row-content">{this.state.shipto_provinsi}{', '}{this.state.shipto_kodepos}</div>
                                        <div className="address-card__row-content">{'Telepon : '}{this.state.shipto_notelp}</div>
                                    </span>    
                                </div> 
                            </div>
                        <div className="col-md-4 mt-2 mt-sm-2 mt-md-0 mt-lg-0 mt-xl-0">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Alamat Penagihan</div>
                                    <span style={{fontSize: '12px', fontWeight: '500'}}>
                                    <div className="address-card__row-content">{this.state.billto_alamat}</div>
                                    <div className="address-card__row-content">{'Kel. '}{this.state.billto_kelurahan}{', Kec. '}{this.state.billto_kecamatan}</div>
                                    <div className="address-card__row-content">{this.state.billto_kota}</div>
                                    <div className="address-card__row-content">{this.state.billto_provinsi}{', '}{this.state.billto_kodepos}</div>
                                    <div className="address-card__row-content">{'Telepon : '}{this.state.billto_notelp}</div>
                                    </span>   
                            </div>  
                        </div>
                    </div>                  

                    <hr style={{ borderWidth: '1px'}}/>  
                    <div className="address-card__row-title">Daftar Pesanan</div>
                    <table className="cart__table cart-table mt-2" >
                        <thead className="cart-table__head">
                            <tr className="cart-table__row" style= {{fontSize: '12px'}}>
                                    <th className="cart-table__column cart-table__column--image"></th>
                                    <th className="cart-table__column cart-table__column--product"><strong>Nama Produk</strong></th>
                                    <th className="cart-table__column cart-table__column--quantity"><strong>Kuantitas</strong></th>
                                    <th className="cart-table__column cart-table__column--total"><strong>Total Harga</strong></th>
                            </tr>
                        </thead>
                        <tbody className="cart-table__body">
                        {this.state.temp.map(item => (
                            <tr key={item.id} className="cart-table__row" style= {{fontSize: '12px'}}>
                                <td className="cart-table__column cart-table__column--image">
                                    <img src={item.foto} alt="" />
                                </td>
                                <td className="cart-table__column cart-table__column--product">
                                    {item.nama}
                                    <div className="address-card__row-content mt-2 notes_transaction"><strong>catatan</strong> : {item.note} </div>
                                </td>
                                <td className="cart-table__column cart-table__column--quantity" data-title="Kuantitas">
                                    <center>
                                    {' '}
                                    <NumberFormat value={item.qty * item.berat} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} />
                                    {' '}{item.satuan}
                                    </center>
                                </td>
                                <td className="cart-table__column cart-table__column--total" data-title="Total Harga">
                                    <NumberFormat value={item.harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                </td>
            
                                {/* {item.nego_count > 0 && item.harga_final != null && item.harga_final != 0 && item.history_nego_id != 0 ?
                                    (<td className="cart-table__column cart-table__column--price" data-title="Price">
                                        <NumberFormat value={Math.round(item.harga_final)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                    </td>) :
                                    (<td className="cart-table__column cart-table__column--price" data-title="Price">
                                        <NumberFormat value={Math.round(item.price * this.state.kurs)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                    </td>)
                                }
            
                                <td className="cart-table__column cart-table__column--quantity" data-title="Quantity">
                                    <div className="row" style={{ float: 'right' }}>
                                        {item.qty * item.berat}{' '}{item.satuan}
                                        <span data-toggle="tooltip" title="Ubah kuantitas" style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={() => this.toggleKuantitas(item.id, index)}>
                                            <i class="fas fa-pencil-alt fa-xs"></i>
                                        </span>
                                    </div>
                                </td>
            
                                {item.nego_count > 0 && item.harga_final != null && item.harga_final != 0 && item.history_nego_id != 0 ?
                                    (<td className="cart-table__column cart-table__column--total" data-title="Total">
                                        <NumberFormat value={Math.round(item.harga_final * item.qty * item.berat)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                    </td>) :
                                    (<td className="cart-table__column cart-table__column--total" data-title="Total">
                                        <NumberFormat value={Math.round(item.price * this.state.kurs * item.qty * item.berat)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                    </td>)
                                }
                                 */}
                            </tr>
                        ))} 
                        </tbody>
                    </table>
                    <div className="row justify-content-end pt-3 pt-md-3">
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <button type="button" className="btn btn-primary btn-sm d-print-none mb-3" onClick={()=>this.props.printInvoice("modal-transaksi", this.props.data.id_transaction)}>
                                <i class="fas fa-print" style={{ marginRight: '5px' }}></i>
                                Cetak Invoice
                            </button>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <div >
                                <div style={{ padding : '0px' }}>
                                    <div className="row" style={{fontSize: '12px', fontWeight: '500'}}>
                                        <div className="col-6 col-sm-6 col-xs-6" style={{ display: 'flex', alignItems: 'center' }}>
                                            <span >Sub Total{' '}
                                            </span>
                                        </div>
                                        <div className="col-6 col-sm-6 col-xs-6" style={{ display:'flex',  justifyContent: 'flex-end', padding: '0px', paddingRight: '15px' }}>
                                           <strong>
                                                <NumberFormat value={Number(this.props.data.total)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                           </strong>
                                        </div>
                                    </div>
                                    <div className="row" style={{fontSize: '12px', fontWeight: '500'}}>
                                        <div className="col-6 col-sm-6 col-xs-6" style={{ display: 'flex', alignItems: 'center' }}>
                                            <span>PPN {Number(this.state.ppn_seller)}%{' '}
                                            </span>
                                        </div>
                                        <div className="col-6 col-sm-6 col-xs-6" style={{ display:'flex',  justifyContent: 'flex-end', padding: '0px', paddingRight: '15px' }}>
                                           <strong>
                                                <NumberFormat value={ Math.ceil(Number(this.props.data.total) * (Number(this.state.ppn_seller/100)) )} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                           </strong>
                                        </div>
                                    </div>
                                    <div className="row" style={{fontSize: '12px', fontWeight: '500'}}>
                                        <div className="col-6 col-sm-6 col-xs-6" style={{ display: 'flex', alignItems: 'center' }}>
                                            <span >Ongkos Kirim{' '}
                                            </span>
                                        </div>
                                        <div className="col-6 col-sm-6 col-xs-6" style={{ display:'flex',  justifyContent: 'flex-end', padding: '0px', paddingRight: '15px' }}>
                                           <strong>
                                                {this.props.data.ongkos_kirim == null ?
                                                    (<span style ={{color: '#ed0909'}}>belum ditentukan</span>) :
                                                    (<NumberFormat value={Number(this.props.data.ongkos_kirim)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                                    )
                                                }                                     
                                            </strong>
                                        </div>
                                    </div>
                                    <hr style={{ borderWidth: '1px', margin:'5px 0px'}}/>  
                                    <div className="row" style={{fontSize: '12px', fontWeight: '500'}}>
                                        <div className="col-6 col-sm-6 col-xs-6" style={{ display: 'flex', alignItems: 'center' }}>
                                            <span >Total Transaksi{' '}
                                            </span>
                                        </div>
                                        <div className="col-6 col-sm-6 col-xs-6" style={{ display:'flex',  justifyContent: 'flex-end', padding: '0px', paddingRight: '15px'}}>
                                           <strong>
                                           <NumberFormat value={Number(this.props.data.totaltrx) + (Math.ceil(Number(this.props.data.total) * (Number(this.state.ppn_seller/100)))) } displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                           </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>    
    )
   } 
}