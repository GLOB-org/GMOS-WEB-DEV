import React, { Component } from 'react';
import classNames from 'classnames';
import Axios from 'axios';
import {decrypt, encrypt, url} from '../../lib';
import NumberFormat from 'react-number-format';
import { FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControlLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Toast from 'light-toast';

export default class InfoCompanyCard extends Component{
    constructor(props){
        super(props);
        this.state={
            temp: [],
            temp_length: '',
            data_complain: [],
            openListBarang: false,
            openListComplain: false,
            ship_to_id:'',bill_to_id:'', payment_id: '', payment_name: '',
            shipto_alamat: '', billto_alamat: '',
            shipto_kelurahan: '', billto_kelurahan: '',
            shipto_kecamatan: '', billto_kecamatan: '',
            shipto_kota: '', billto_kota: '',
            shipto_provinsi: '', billto_provinsi: '',
            shipto_kodepos: '', billto_kodepos: '',
            shipto_notelp: '', billto_notelp: '',
            isOpen: false, total_trx_final: '', display_timeline: 'none',
            penjual: '',  ppn_seller: ''
        }
    }

    checkBarang = async(id) =>{
        let id_get, nama_get, foto_get;
        id_get = this.state.temp[id].id;
        nama_get = this.state.temp[id].nama;
        foto_get = this.state.temp[id].foto;
        var checkCB = 'n'
        if (document.getElementById(id).checked == true){
          await this.setState( prevState => ({
              data_complain: [...prevState.data_complain, {id: id_get, nama: nama_get, foto: foto_get}]
          }))
        }
        else {
            let unchecked_complain = this.state.data_complain.filter(input => {
                return input.id != id_get;
            });

            await this.setState({
              data_complain: unchecked_complain
            });
        }
        for (var i = 0; i < this.state.temp_length; i++ ){
            if (document.getElementById(i).checked == true){
                checkCB = 'y';
                document.getElementById('lanjutkomplain').disabled = false
                break;
            }
        }
        if (checkCB == 'n'){
            document.getElementById('lanjutkomplain').disabled = true
        }

    }  

    controlDialogBarang() {
        this.setState({ openListBarang: !this.state.openListBarang });
        document.getElementById('lanjutkomplain').disabled = true
    }

    controlDialogComplain() {
        this.setState({ openListComplain: !this.state.openListComplain,
                          openListBarang: false,
                    });
        if (this.state.openListComplain == true){
            this.setState({
                data_complain: []
            })
        }                  
    }

    controlModal() {
        this.setState({ 
            isOpen: !this.state.isOpen,
            display_timeline: 'none'
         });
    }

    detailComplain = async(id)=>{
        Toast.loading('loading . . .', () => {
        }); 

        let queryTimeLimitComplain = await encrypt("select 1 as check_limit "+
        "from  gcm_master_company gmc ,gcm_transaction_detail a inner join "+
        "gcm_list_barang b on a.barang_id=b.id "+
        "inner join gcm_master_transaction e on e.id_transaction = a.transaction_id "+
        "inner join gcm_limit_complain f on b.company_id = f.company_id "+
        "where gmc.id = b.company_id and transaction_id='" + id + "' "+ 
        "and e.status = 'RECEIVED' and now() > e.date_received + ( f.limit_hari || ' days')::interval")

        let queryDetailReceived = encrypt("select a.id, a.transaction_id, c.nama, b.foto, a.qty, a.harga from gcm_transaction_detail a inner join "+
        "gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id where transaction_id='"+id+"' order by c.category_id asc, c.nama asc");

        Axios.post(url.select,{
            query: queryTimeLimitComplain
        }).then(data=>{

            if( data.data.data.length > 0 && data.data.data[0].check_limit == 1){
                Toast.hide()
                this.props.handleTimeLimitComplain()
            }
            else {
                Axios.post(url.select,{
                        query: queryDetailReceived
                    }).then((data)=>{
                    this.setState({
                        temp: data.data.data,
                        temp_length: data.data.data.length
                    });
                    Toast.hide()
                    this.controlDialogBarang();

                }).catch(err=>{
                    console.log('error');
                    console.log(err);
                })
            }

        }).catch(err=>{
            // console.log('error');
            // console.log(err);
        })
    }

    detailReceived= async(id)=>{
       
        Toast.loading('loading . . .', () => {
        }); 

        // let queryDetailReceived = encrypt("select a.id, a.transaction_id, c.nama, b.foto, a.qty, a.qty_dipenuhi, a.harga, a.batch_number, a.harga_final, to_char(to_date(exp_date,'yyyy-MM-dd'), 'dd-MM-yyyy') as exp_date , b.id, c.berat, d.alias as satuan, b.company_id as penjual, gmc.nama_perusahaan as nama_penjual from gcm_master_satuan d, gcm_master_company gmc ,gcm_transaction_detail a inner join "+
        // "gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id where gmc.id = b.company_id and c.satuan = d.id and transaction_id='"+id+"' order by c.category_id asc, c.nama asc")

        let queryDetailReceived = encrypt("select a.id, a.transaction_id, c.nama, b.foto, a.qty, a.qty_dipenuhi, a.harga, a.batch_number, "+
        "a.harga_final,case when exp_date != '-' and exp_date is not null then to_char(to_date(exp_date,'yyyy-MM-dd'), 'dd-MM-yyyy') else '-' end as exp_date , b.id, c.berat, d.alias as satuan, b.company_id as penjual, gmc.nama_perusahaan as nama_penjual, "+
        "case when e.tgl_permintaan_kirim is not null then to_char(e.tgl_permintaan_kirim, 'dd-MM-yyyy') else '-' end as tgl_permintaan_kirim, "+
        "e.ppn_seller  from gcm_master_satuan d, gcm_master_company gmc ,gcm_transaction_detail a inner join "+
        "gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id "+
        "inner join gcm_master_transaction e on e.id_transaction = a.transaction_id "+
        "where gmc.id = b.company_id and c.satuan = d.id and transaction_id='" + id + "' order by c.category_id asc, c.nama asc")

        await Axios.post(url.select,{
            query: queryDetailReceived
        }).then(data=>{
          this.setState({
            temp: data.data.data,
            penjual: data.data.data[0].nama_penjual,
            ppn_seller: data.data.data[0].ppn_seller
        });
          //hitung total trx final
          var hitung = 0;
          for (var i = 0; i<data.data.data.length; i++ ){
              hitung = hitung + Number(data.data.data[i].harga_final)
          }
 
          this.setState({
             total_trx_final : hitung
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

    clickRadBtnBarang =(id) =>{
        document.getElementById(id).name = 'BARANG'
    }

    clickRadBtnQty =(id) =>{
        document.getElementById(id).name = 'QTY'
    }

    setQueryComplain(){

        let query = "with new_insert as (INSERT INTO gcm_transaction_complain (detail_transaction_id, jenis_complain, notes_complain, create_by, update_by) VALUES "
        let loop = ""
        let length = this.state.data_complain.length;
        var input_kosong = 'n'
        for (var i = 0; i < length; i++ ){
        var jenis_complain = ''

            if (document.getElementById("RadBtnBarang"+i).name != 'BARANG' && document.getElementById("RadBtnQty"+i).name != 'QTY' || document.getElementById("TxtKomplain"+i).value == ''){
                Toast.fail('Silakan isi data yang kosong', 1500, () => {
                });
                input_kosong = 'y'
                break;
            }
            else {
                if (document.getElementById("RadBtnBarang"+i).name == 'BARANG'){
                    jenis_complain = document.getElementById("RadBtnBarang"+i).name
                }
                else if (document.getElementById("RadBtnQty"+i).name == 'QTY'){
                    jenis_complain = document.getElementById("RadBtnQty"+i).name
                }  
                loop = loop + "("  + this.state.data_complain[i].id + "," + "'" + jenis_complain + "', '" +document.getElementById("TxtKomplain"+i).value +"', "+decrypt(localStorage.getItem('UserIDLogin')) +", "+ decrypt(localStorage.getItem('UserIDLogin'))+ ")"
                if(i< length-1){
                    loop = loop.concat(",") 
                }
                else if(i < length){
                    loop = loop.concat(")") 
                }
            }
        }

        var insert_complain = query.concat(loop)

        var update_status = " update gcm_master_transaction set status = 'COMPLAINED', update_by = " + 
            decrypt(localStorage.getItem('UserIDLogin')) + ", date_complained=now() where id_transaction = '" + this.props.data.id_transaction + "'"

        if(input_kosong == 'n'){
            this.props.handleSubmitComplain(this.props.data.id_transaction, encrypt(insert_complain.concat(update_status)))
        }
  
      }

    render(){
    return(
        
        <div style={{display:'contents'}}>
            <tr  id='rowTransactionReceived' style={{fontSize:'13px', color:'#3D464D'}}>
                <td style={{textAlign: 'center'}}><strong><label id='idTransaction' onClick={()=>this.detailReceived(this.props.data.id_transaction)}>{this.props.data.id_transaction}</label></strong></td>
                <td style={{textAlign: 'center'}}>{this.props.data.create_date_edit}</td>
                <td style={{textAlign: 'center'}}>{this.props.data.date_received}</td>
                <td style={{textAlign: 'right'}}><NumberFormat value={Number(this.props.data.totaltrx_tax_final)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
                <td>
                    <div className="buttonAction">
                        <center>
                            <button type="button" className="btn btn-primary btn-xs mt-1 mr-1"  onClick={()=>this.props.handleSelesaikanPesanan(this.props.data.id_transaction)}>Selesaikan</button>
                            <button type="button" className="btn btn-secondary btn-xs mt-1 ml-1" onClick={()=>this.detailComplain(this.props.data.id_transaction)}> Komplain </button>
                        </center>
                    </div>
                </td>
            </tr>  

            <Modal isOpen={this.state.isOpen} size="xl">
                <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.controlModal.bind(this)}>Detail Transaksi</ModalHeader>
                <ModalBody style={{padding:'30px', paddingTop: '10px'}}>
                    <div className="row">
                        <div className="col-md-12">
                            <button type="button" style={{float: 'right'}} className="btn btn-secondary btn-xs" onClick={()=>this.setState({display_timeline: 'block'})}>Timeline Transaksi</button>
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
                                    <div className="address-card__row-content"><strong>Diterima</strong></div>
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
                                </ul>
                            </div>
                        </div>
                    </div>   

                    <hr style={{ borderWidth: '1px'}}/>  
                    <div className="address-card__row-title">Daftar Pesanan</div>
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
                                    {' '}{item.satuan}                                    </center>
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

            <Modal isOpen={this.state.openListBarang} size="md" centered>
            <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.controlDialogBarang.bind(this)}>Komplain Pesanan</ModalHeader>
            <ModalBody>
              <label style={{fontSize:'14px',  fontWeight: '500', marginBottom: '15px'}}>Pilih barang yang ingin dikomplain :</label>
                   
                {this.state.temp.map((item, index) => (
                
                <div className="row" style={{marginBottom: '10px'}}>
                    <div className="col-md-1">
                    <FormControlLabel 
                        control={
                          <Checkbox id={index} style={{color:'#8CC63E', paddingTop: '0px'}} onClick={() => this.checkBarang(index)}/>
                        }
                    />            
                    </div>
                    <img src={item.foto} className="detail-foto col-md-3"/>
                    <div className="col-md-8">
                    <label style={{fontSize:'13px',  fontWeight: '500'}}>{item.nama}</label>
                    </div>
                </div> 
            
                ))} 
                
                <button id='lanjutkomplain' className="btn btn-primary mt-2 mt-md-3 mt-lg-4" type="submit" onClick={this.controlDialogComplain.bind(this)} style={{float:'right', marginTop: '15px'}} >Lanjut</button>                           
            </ModalBody>
            </Modal>

            {/* MODAL ISI KOMPLAIN */}
            <Modal toggle={this.toggle} isOpen={this.state.openListComplain} size="lg" centered>
            <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.controlDialogComplain.bind(this)}>Komplain Pesanan</ModalHeader>
            <ModalBody>
                {this.state.data_complain.map((item, index) => (
                
                <div className="row" style={{marginBottom: '20px'}}>
                    <img src={item.foto} className="detail-foto col-3"/>
                    <div className="col-md-9 col-sm-12 col-xs-12">
                        <label style={{fontSize:'13px',  fontWeight: '500'}}>{item.nama}</label>
                        <hr/>
                        <label style={{fontSize:'13px',  fontWeight: '500'}}>Jenis Komplain : </label>
                        
                        <div className="filter-list">
                            <div className="filter-list__list">
                                <label
                                    id={"RadBtnBarang" + index}
                                    className={classNames('filter-list__item', {
                                    })}
                                >
                                    <span className="filter-list__input input-radio">
                                        <span className="input-radio__body">
                                            <input className="input-radio__input" type="radio" name="rad"  
                                            onClick={()=>this.clickRadBtnBarang("RadBtnBarang" + index)} />
                                            <span className="input-radio__circle" />
                                        </span>
                                    </span>
                                    <label className="filter-list__title">Barang tidak sesuai</label>
                                </label>
                            </div>
                            <div className="filter-list__list">
                                <label
                                    id={"RadBtnQty" + index}
                                    className={classNames('filter-list__item', {
                                    })}
                                >
                                    <span className="filter-list__input input-radio">
                                        <span className="input-radio__body">
                                            <input className="input-radio__input" type="radio" name="rad" 
                                            onClick={()=>this.clickRadBtnQty("RadBtnQty" + index)}/>
                                            <span className="input-radio__circle" />
                                        </span>
                                    </span>
                                    <label className="filter-list__title">Kuantitas tidak sesuai</label>
                                </label>
                            </div>
                        </div>

                        {/* <RadioGroup aria-label="position" name="position" >
                            <FormControlLabel
                                value="barangunchecked"
                                control={<Radio id={"RadBtnBarang" + index} style={{color:'#8CC63E'}} />}
                                label="Barang tidak sesuai"
                                labelPlacement="end"
                                onClick={()=>this.clickRadBtnBarang("RadBtnBarang" + index)}
                            />
                            <FormControlLabel
                                value="qtyunchecked"
                                control={<Radio id={"RadBtnQty" + index} style={{color:'#8CC63E'}} />}
                                label="Kuantitas tidak sesuai"
                                labelPlacement="end" 
                                onClick={()=>this.clickRadBtnQty("RadBtnQty" + index)}
                            /> 
                        </RadioGroup> */}

                        <label style={{fontSize:'13px',  fontWeight: '500', marginTop: '10px'}}>Jelaskan komplain Anda : </label>
                        <div className="form-group">
                            <textarea
                                id={"TxtKomplain" + index}
                                type="textarea"
                                spellCheck="false"
                                autoComplete="off"
                                className="form-control"
                            />                     
                        </div>  

                        {/* <InputGroup>
                            <Input
                                id="alamat"
                                type="textarea"
                                spellCheck="false"
                                autoComplete="off"
                                className="form-control"
                                maxLength={100}
                                invalid={this.state.empty_alamat}
                                onChange={event => this.Alamat_validation(event)}
                                value={this.state.inputAlamat}
                            />
                            <FormFeedback>{this.state.KetTextAlamat}</FormFeedback>
                        </InputGroup> */}

                    </div>
                </div> 
                
                ))} 
                                                                                             
                <button className="btn btn-primary mt-1" type="submit" onClick={async () => {await this.setQueryComplain()}} style={{float:'right'}}>Kirim Komplain</button>                                                   
            </ModalBody>
            </Modal>            
        </div>    
    )
   } 
}