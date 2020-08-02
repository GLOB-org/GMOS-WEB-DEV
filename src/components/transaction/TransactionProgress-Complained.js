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
            temp: [], temp_complained: [],
            ship_to_id:'',bill_to_id:'', payment_id: '', payment_name: '',
            shipto_alamat: '', billto_alamat: '',
            shipto_kelurahan: '', billto_kelurahan: '',
            shipto_kecamatan: '', billto_kecamatan: '',
            shipto_kota: '', billto_kota: '',
            shipto_provinsi: '', billto_provinsi: '',
            shipto_kodepos: '', billto_kodepos: '',
            shipto_notelp: '', billto_notelp: '',
            isOpen: false,  total_trx_final: '', display_timeline: 'none',
            penjual: '', ppn_seller: ''
        }
    }

    controlModal() {
        this.setState({ 
            isOpen: !this.state.isOpen,
            display_timeline: 'none'
         });    
    }

    detailComplained = async(id)=>{

        Toast.loading('loading . . .', () => {
        }); 

        // let queryDetailComplained = encrypt("select a.id, a.transaction_id, c.nama, b.foto, a.qty, a.qty_dipenuhi, a.harga, a.batch_number, a.harga_final,to_char(to_date(exp_date,'yyyy-MM-dd'), 'dd-MM-yyyy') as exp_date, b.id, c.berat, d.alias as satuan, b.company_id as penjual, gmc.nama_perusahaan as nama_penjual from gcm_master_satuan d, gcm_master_company gmc ,gcm_transaction_detail a inner join "+
        // "gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id where gmc.id = b.company_id and c.satuan = d.id and transaction_id='"+id+"' order by c.category_id asc, c.nama asc")

        let queryDetailComplained = encrypt("select a.id, a.transaction_id, c.nama, b.foto, a.qty, a.qty_dipenuhi, a.harga, a.batch_number, "+
        "a.harga_final, case when exp_date != '-' and exp_date is not null then to_char(to_date(exp_date,'yyyy-MM-dd'), 'dd-MM-yyyy') else '-' end as exp_date, b.id, c.berat, "+
        "d.alias as satuan, b.company_id as penjual, gmc.nama_perusahaan as nama_penjual, e.jenis_complain, "+
        "e.notes_complain, f.ppn_seller, case when a.note is null or a.note = '' then '-' else a.note end as note from gcm_master_satuan d, gcm_master_company gmc, "+
        "gcm_transaction_detail a inner join gcm_list_barang b on a.barang_id=b.id "+
        "inner join gcm_master_barang c on b.barang_id=c.id left join gcm_transaction_complain e on a.id = e.detail_transaction_id "+
        "inner join gcm_master_transaction f on f.id_transaction = a.transaction_id "+
        "where gmc.id = b.company_id and c.satuan = d.id and transaction_id='" + id + "'" + 
        "order by c.category_id asc, c.nama asc")

        await Axios.post(url.select,{
            query: queryDetailComplained
        }).then(data=>{
          this.setState({
            temp: data.data.data,
            penjual: data.data.data[0].nama_penjual,
            ppn_seller: data.data.data[0].ppn_seller
        });

         //filter complained

         let filter_data_complained;
         filter_data_complained = data.data.data.filter(filter => {
             return filter.jenis_complain != null;
         });

         //hitung total trx final
         var hitung = 0;
         for (var i = 0; i<data.data.data.length; i++ ){
             hitung = hitung + Number(data.data.data[i].harga_final)
         }

         this.setState({
            total_trx_final : hitung,
            temp_complained: filter_data_complained
         });
        }).catch(err=>{
            // console.log('error');
            // console.log(err);
        })

        let getaddress = encrypt("select shipto_id, billto_id, payment_id from gcm_master_transaction gmt where id_transaction = '"+id+"'")
        await Axios.post(url.select,{
            query: getaddress
        }).then(data=>{
            this.setState({
                ship_to_id: data.data.data[0].shipto_id,
                bill_to_id: data.data.data[0].billto_id,
                payment_id: data.data.data[0].payment_id
            });
        }).catch(err=>{
            // console.log('error');
            // console.log(err);
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
            // console.log('error');
            // console.log(err);
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
            // console.log('error');
            // console.log(err);
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
            // console.log('error');
            // console.log(err);
        })

        this.controlModal();
    }

    render(){
    return(

        <div style={{display:'contents'}}>
        <tr id='rowTransactionComplained' style={{fontSize:'13px', color:'#3D464D'}}>
            <td style={{textAlign: 'center'}}><strong><label id='idTransaction' onClick={()=>this.detailComplained(this.props.data.id_transaction)}>{this.props.data.id_transaction}</label></strong></td>
            <td style={{textAlign: 'center'}}>{this.props.data.create_date_edit}</td>
            <td style={{textAlign: 'center'}}>{this.props.data.date_complained}</td>
            <td style={{textAlign: 'right'}}><NumberFormat value={Number(this.props.data.totaltrx_tax_final)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
            <td>
                <div className="buttonAction">
                    <center>
                        <button type="button" class="btn btn-primary btn-xs"  onClick={()=>this.props.handleSelesaikanPesanan(this.props.data.id_transaction)}>Selesaikan</button>
                    </center>
                </div>
            </td>
        </tr> 
        
            <Modal isOpen={this.state.isOpen} size="xl">
                <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.controlModal.bind(this)}>Detail Transaksi</ModalHeader>
                <ModalBody id="modal-transaksi" style={{padding:'30px', paddingTop: '10px'}}>
                    <div className="row">
                        <div className="col-md-12">
                            <button type="button" style={{float: 'right'}} className="btn btn-secondary btn-xs d-print-none" onClick={()=>this.setState({display_timeline: 'block'})}>Timeline Transaksi</button>
                        </div>
                    </div>

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
                                    <div className="address-card__row-content"><strong>Dikomplain</strong></div>
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

                    <div id="timeline_transaksi" style={{display: this.state.display_timeline}}>
                        <hr style={{ borderWidth: '1px'}}/>  
                        <div className="address-card__row-title">Timeline Transaksi</div>
                        <div className="row">
                            <div className="col-md-5">
                                <ul className="timeline">
                                    <li>
                                        <label style= {{fontSize: '13px', fontWeight: '600'}}>Transaksi</label>
                                        <label className="float-right" style= {{fontSize: '12px', fontWeight: '500'}}>{this.props.data.create_date_edit}</label>
                                    </li>
                                    <li>
                                        <label style= {{fontSize: '13px', fontWeight: '600'}}>Diproses</label>
                                        <label className="float-right" style= {{fontSize: '12px', fontWeight: '500'}}>{this.props.data.date_ongoing}</label>
                                    </li>
                                    <li>
                                        <label style= {{fontSize: '13px', fontWeight: '600'}}>Dikirim</label>
                                        <label className="float-right" style= {{fontSize: '12px', fontWeight: '500'}}>{this.props.data.date_shipped}</label>
                                    </li>
                                    <li>
                                        <label style= {{fontSize: '13px', fontWeight: '600'}}>Diterima</label>
                                        <label className="float-right" style= {{fontSize: '12px', fontWeight: '500'}}>{this.props.data.date_received}</label>
                                    </li>
                                    <li>
                                        <label style= {{fontSize: '13px', fontWeight: '600'}}>Dikomplain</label>
                                        <label className="float-right" style= {{fontSize: '12px', fontWeight: '500'}}>{this.props.data.date_complained}</label>
                                    </li>
                                    
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr style={{ borderWidth: '1px'}}/>  
                    <div className="address-card__row-title">Daftar Pesanan yang Dikomplain</div>  
                    <table className="cart__table cart-table mt-2" >
                        <thead className="cart-table__head">
                            <tr className="cart-table__row" style= {{fontSize: '12px'}}>
                                <th className="cart-table__column cart-table__column--image" style={{width: '10%'}}></th>
                                <th className="cart-table__column cart-table__column--product" style={{width: '40%'}}><strong>Nama Produk</strong></th>
                                <th className="cart-table__column cart-table__column--total" style={{width: '10%'}}><strong><center>Jenis Komplain</center></strong></th>
                                <th className="cart-table__column cart-table__column--total" style={{width: '40%'}}><strong><center>Catatan</center></strong></th>
                            </tr>
                        </thead>
                        <tbody className="cart-table__body">
                        {this.state.temp_complained.map(item => (
                            <tr key={item.id} className="cart-table__row" style= {{fontSize: '12px'}}>
                                <td className="cart-table__column cart-table__column--image">
                                    <img src={item.foto} alt="" />
                                </td>
                                <td className="cart-table__column cart-table__column--product">
                                    {item.nama}
                                </td>
                                <td className="cart-table__column cart-table__column--total" data-title="Jenis Komplain">
                                    <center>{item.jenis_complain}</center>
                                </td>
                                <td className="cart-table__column cart-table__column--total" data-title="Catatan">
                                    <center>{item.notes_complain}</center>
                                </td>
                            </tr>
                        ))}  
                        </tbody>
                    </table>

                    <div className="address-card__row-title mt-3">Daftar Pesanan</div>
                    <table className="cart__table cart-table mt-2" >
                        <thead className="cart-table__head">
                            <tr className="cart-table__row" style= {{fontSize: '12px'}}>
                                <th className="cart-table__column cart-table__column--image" style={{width: '10%'}}></th>
                                <th className="cart-table__column cart-table__column--product" style={{width: '30%'}}><strong>Nama Produk</strong></th>
                                <th className="cart-table__column cart-table__column--total" style={{width: '12%'}}><strong><center>Batch Number</center></strong></th>
                                <th className="cart-table__column cart-table__column--total" style={{width: '12%'}}><strong><center>Expired Date</center></strong></th>
                                <th className="cart-table__column cart-table__column--total" style={{width: '12%'}}><strong><center>Kuantitas</center></strong></th>
                                <th className="cart-table__column cart-table__column--total" style={{width: '12%'}}><strong><center>Kuantitas Dipenuhi</center></strong></th>
                                <th className="cart-table__column cart-table__column--total" style={{width: '12%'}}><strong>Total Harga</strong></th>
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
                                <td className="cart-table__column cart-table__column--total" data-title="Batch Number">
                                    <center>{item.batch_number}</center>
                                </td>
                                <td className="cart-table__column cart-table__column--total" data-title="Exp Date">
                                    <center>{item.exp_date}</center>
                                </td>
                                <td className="cart-table__column cart-table__column--total" data-title="Kuantitas">
                                    <center>
                                    {' '}
                                    <NumberFormat value={item.qty * item.berat} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} />
                                    {' '}{item.satuan}                                    
                                    </center>
                                </td>
                                <td className="cart-table__column cart-table__column--total" data-title="Kuantitas dipenuhi" >
                                    <center>
                                    {' '}
                                    <NumberFormat value={item.qty_dipenuhi * item.berat} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} />
                                    {' '}{item.satuan}
                                    </center>
                                </td>
                                <td className="cart-table__column cart-table__column--total" data-title="Total Harga">
                                    <NumberFormat value={item.harga_final} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                </td>
                            </tr>
                        ))}  
                        </tbody>
                    </table>
                    <div className="row justify-content-end pt-3 pt-md-3">
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <button type="button" className="btn btn-primary btn-xs d-print-none mb-3" onClick={()=>this.props.printInvoice("modal-transaksi", this.props.data.id_transaction)}>
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
                                                <NumberFormat value={Number(this.state.total_trx_final)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
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
                                                <NumberFormat value={ Math.ceil(Number(this.state.total_trx_final) * (Number(this.state.ppn_seller/100)) )} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
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
                                                <NumberFormat value={Number(this.props.data.ongkos_kirim)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
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
                                           <NumberFormat value={Number(this.props.data.totaltrx_tax_final)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
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