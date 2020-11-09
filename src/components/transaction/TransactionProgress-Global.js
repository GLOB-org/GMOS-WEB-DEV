import React, { Component } from 'react';
import Axios from 'axios';
import {encrypt, url, decrypt} from '../../lib';
import NumberFormat from 'react-number-format';
import { storage } from "../firebase";
import { Button, FormFeedback, Input, InputGroup, InputGroupText, InputGroupAddon, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Toast from 'light-toast';
import Resizer from '../../resizer-image';
    
const fieldEmpty = 'isi data yang kosong'

export default class InfoCompanyCard extends Component{

    constructor(props){
        super(props);
        this.state={
            temp: [],
            listBank: [],
            ship_to_id:'',bill_to_id:'',
            payment_id: '', payment_name: '', payment_status: '',
            tgl_permintaan_kirim:'', ppn_seller: '',
            shipto_alamat: '', billto_alamat: '',
            shipto_kelurahan: '', billto_kelurahan: '',
            shipto_kecamatan: '', billto_kecamatan: '',
            shipto_kota: '', billto_kota: '',
            shipto_provinsi: '', billto_provinsi: '',
            shipto_kodepos: '', billto_kodepos: '',
            shipto_notelp: '', billto_notelp: '',
            isOpen: false,
            penjual: '',
            openUnggahPO: false, openConfirmationUnggahPO: false,
            openUnggahBuktiBayar: false, openInfoPembayaran: false, 
            openConfirmationUnggah: false,
            fotoUpload: '', namafotoUpload: '', imgfotoUpload: '',
            inputUrl: '',previewFoto: 'none',
            inputNama: '', emptyNama: false, KetTextNama: '',
            inputBank: '', emptyBank: false, KetTextBank: '',
            inputTanggalBayar: '', emptyTanggalBayar: false, KetTextTanggalBayar: '',
            inputPO: '', emptyPO: false, KetTextPO: '', 
            PO_reference : '', imgPO_reference: '',
            emptyFoto: false, KetTextFoto: '',
            displayBtnKonfirmasiBayar: 'block', 
            displayImagePO: 'none'
        }
    }

    clearForm(){
        this.setState({ 
            inputUrl: '', previewFoto: 'none',
            inputNama: '', emptyNama: false, KetTextNama: '',
            inputBank: '', emptyBank: false, KetTextBank: '',
            inputTanggalBayar: '', emptyTanggalBayar: false, KetTextTanggalBayar: ''
        });
    }

    clearFormPO(){
        this.setState({ 
            inputUrl: '', previewFoto: 'none',
            inputPO: '', emptyPO: false, KetTextPO: '',
            emptyFoto: false, KetTextFoto: ''
        });
    }

    controlModal() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    detailStatus = async(id) => {

        Toast.loading('loading . . .', () => {
        }); 

        let queryDetail = encrypt("select a.id, a.transaction_id, c.nama, a.qty, a.harga, b.id, c.berat, d.alias as satuan, b.company_id as penjual, "+
        "case when b.flag_foto = 'Y' then "+
        "(select concat('https://www.glob.co.id/admin/assets/images/product/', b.company_id,'/',b.kode_barang,'.png')) "+
        "else 'https://glob.co.id/admin/assets/images/no_image.png' end as foto, " +
        "gmc.nama_perusahaan as nama_penjual, case when e.tgl_permintaan_kirim is not null then to_char(e.tgl_permintaan_kirim, 'dd-MM-yyyy') else '-' end as tgl_permintaan_kirim "+
        ", e.ppn_seller, case when a.note is null or a.note = '' then '-' else a.note end as note, case when status_payment = 'UNPAID' then case when id_list_bank is null "+
        "then 'menunggu pembayaran' else 'menunggu verifikasi' end else 'pembayaran selesai' end as payment_status, e.id_transaction_ref, e.foto_transaction_ref " +
        "from gcm_master_satuan d, gcm_master_company gmc ,gcm_transaction_detail a inner join "+
        "gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id inner join gcm_master_transaction e on "+
        "e.id_transaction = a.transaction_id where gmc.id = b.company_id and c.satuan = d.id and transaction_id='" + id +"' order by c.category_id asc, c.nama asc")

        await Axios.post(url.select,{
            query: queryDetail
        }).then(data=>{
          this.setState({
            temp: data.data.data,
            penjual: data.data.data[0].nama_penjual,
            tgl_permintaan_kirim: data.data.data[0].tgl_permintaan_kirim,
            payment_status: data.data.data[0].payment_status,
            PO_reference: data.data.data[0].id_transaction_ref,
            imgPO_reference: data.data.data[0].foto_transaction_ref,
            ppn_seller: data.data.data[0].ppn_seller
        });
        }).catch(err=>{
            console.log('error');
            console.log(err);
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

    getInputForm = (event) => {
        var get_value = event.target.value
        this.setState({
            [event.target.name]: get_value
        })

        if(event.target.name === 'inputNama'){
            this.setState({
                emptyNama: false,
                KetTextNama: ''
            })   
        }
        else if(event.target.name === 'inputBank'){
            this.setState({
                emptyBank: false,
                KetTextBank: ''
            })   
        }
        else if(event.target.name === 'inputTanggalBayar'){
            this.setState({
                emptyTanggalBayar: false,
                KetTextTanggalBayar: ''
            })   
        }

        // form input No PO
        else if(event.target.name === 'inputPO'){
            this.setState({
                emptyPO: false,
                KetTextPO: ''
            })
        }
    }

    handleDeleteFoto = (e) => {
        this.setState({
            fotoUpload : '',
            previewFoto: 'none'
        })
        document.getElementById('pilihfile').value = null
    }

    handleInsertFoto = (e) => {
        const max_size = 500000

        if (e.target.value !== '') {
            if (Number(e.target.files[0].size) > max_size){
                this.resizeImage(e.target.files[0])
            }
            else {
                this.setState({
                    namafotoUpload: new Date().getTime() + "-" + e.target.files[0].name,
                    fotoUpload: URL.createObjectURL(e.target.files[0]),
                    imgfotoUpload: e.target.files[0],
                    previewFoto: 'block',
                    emptyFoto: false, KetTextFoto: ''
                })
                this.props.upload_image(e.target.files[0].name, URL.createObjectURL(e.target.files[0]))    
            }
        
        } else if (e.target.value === '') {
            this.setState({
                fotoUpload : '',
            })
        }
    }

    handleConfirmationUnggah = () =>{
        var contain_data_all = true

        if(this.state.inputNama == ''){
            contain_data_all = false
            this.setState({
                emptyNama: true,
                KetTextNama: 'isi data yang kosong'
            })    
        }

        if(this.state.inputBank == ''){
            contain_data_all = false
            this.setState({
                emptyBank: true,
                KetTextBank: 'isi data yang kosong'
            })    
        }

        if(this.state.inputTanggalBayar == ''){
            contain_data_all = false
            this.setState({
                emptyTanggalBayar: true,
                KetTextTanggalBayar: 'isi data yang kosong'
            })    
        }

        if(contain_data_all){
            this.setState({
                openConfirmationUnggah: !this.state.openConfirmationUnggah
            })
        }

    }

    handleConfirmationUnggahPO = () =>{
        var contain_data_all = true

        if(this.state.inputPO == ''){
            contain_data_all = false
            this.setState({
                emptyPO: true,
                KetTextPO: 'isi data yang kosong'
            })    
        }

        if(this.state.fotoUpload == ''){
            contain_data_all = false
            this.setState({
                emptyFoto: true,
                KetTextFoto: 'silakan pilih file'
            })    
        }

        if(contain_data_all){
            this.setState({
                openConfirmationUnggahPO: !this.state.openConfirmationUnggahPO
            })
        }
    }

    handleUnggah = () =>{

        Toast.loading('loading . . .', () => {
        }); 

        if(this.state.imgfotoUpload != ''){
            const temp = this.state.imgfotoUpload
            const tempName = this.state.namafotoUpload
            const storageRef = storage.ref(`bukti_bayar/` + tempName);
            const uploadTask = storageRef.put(temp)

            let x = this
            var progress = 0
            var progress_round = 0

            uploadTask.on('state_changed', (snapshot) => {
                progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progress_round = Math.ceil(Number(progress))

                if (progress == 100) {
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) { 
                        //berhasil upload
                        x.updateBuktiBayar(downloadURL)
                    });

                }
            }, (error) => {
                // Handle unsuccessful uploads
                Toast.fail('Gagal melakukan konfirmasi pembayaran !', 3500, () => {
                });
                this.setState({ openConfirmationUnggah: !this.state.openConfirmationUnggah })
            })
        }
        else {
            this.updateBuktiBayar('')
        }

    }

    handleUnggahPO = () =>{

        const temp = this.state.imgfotoUpload
        const tempName = this.state.namafotoUpload
        const storageRef = storage.ref(`po_reference/` + tempName);
        const uploadTask = storageRef.put(temp)

        let x = this
        var progress = 0
        var progress_round = 0

        Toast.loading('loading . . .', () => {
        }); 

        uploadTask.on('state_changed', (snapshot) => {
            progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress_round = Math.ceil(Number(progress))

            if (progress == 100) {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) { 
                    //berhasil upload
                    x.updatePO(downloadURL)
                });

            }
        }, (error) => {
            // Handle unsuccessful uploads
            Toast.fail('Gagal menyimpan data PO Pembeli !', 3500, () => {
            });
            this.setState({ openConfirmationUnggahPO: !this.state.openConfirmationUnggahPO })
        })

    }

    handleWhitespace = (event) => {
        if (event.which === 32) {
            event.preventDefault();
        }
    }


    toggleImagePO = () => {
        if(this.state.displayImagePO == 'none'){    
            this.setState({
                displayImagePO: 'block'
            })
        }
        else {
            this.setState({
                displayImagePO: 'none'
            })
        }
    }

    toggleInfoPembayaran = () => {

        if(this.state.openInfoPembayaran == false){

            Toast.loading('loading . . .', () => {
            }); 

            let query = encrypt(" SELECT a.id, a.no_rekening, a.pemilik_rekening, b.nama "+
            "FROM gcm_listing_bank a "+
            "left join gcm_master_bank b on a.id_bank = b.id "+
            "WHERE a.status = 'A' and b.status = 'A' and a.company_id =" + this.state.temp[0].penjual +
            " ORDER BY b.nama" )
    
            Axios.post(url.select,{
                query: query
            }).then(data=>{
                Toast.hide()
                if(this.state.payment_status == 'menunggu verifikasi'){
                    this.setState({
                        displayBtnKonfirmasiBayar: 'none'
                    });    
                }

                this.setState({
                    listBank: data.data.data,
                    openInfoPembayaran: !this.state.openInfoPembayaran
                });
            }).catch(err=>{
                Toast.hide()
                Toast.fail('Gagal mengambil data', 2000, () => {
                });
            })
           
        }
        else {
            this.setState({
                openInfoPembayaran: !this.state.openInfoPembayaran
            })
        }

    }

    toggleUnggahBuktiBayar = () => {
        this.clearForm()
        this.setState({
            openInfoPembayaran: false,
            openUnggahBuktiBayar: !this.state.openUnggahBuktiBayar
        })
        this.props.upload_image('', '')
    }

    toggleUnggahPO = () => {
        this.clearFormPO()
        this.setState({
            openUnggahPO: !this.state.openUnggahPO
        })
        this.props.upload_image('', '')
    }
     
    resizeImage = (imgData) => {
        const fileName = imgData.name
        var arraySplit = fileName.split(".")
        var fileExtension = arraySplit[arraySplit.length - 1]
        if (imgData) {
            Resizer.imageFileResizer(
                imgData,
                300,
                300,
                fileExtension,
                100,
                0,
                uri => {
                    let randNum = Math.round(Math.random() * 10000000) + 1
                    randNum = randNum * (Math.round(Math.random() * 10000000) + 1)
                    uri.blobImg.name = randNum.toString() + "." + fileExtension
                    this.setState({
                        namafotoUpload: new Date().getTime() + fileName,
                        fotoUpload: uri.base64Img,
                        imgfotoUpload: uri.blobImg,
                        previewFoto: 'block',
                        emptyFoto: false, KetTextFoto: ''
                    })

                    this.props.upload_image(fileName, uri.base64Img)
                }
                ,
                'base64'
            );
        }
    }

    updateBuktiBayar = (urlBuktiBayar) => {

        if(urlBuktiBayar == ''){
            var query = encrypt("update gcm_master_transaction set update_by = " + decrypt(localStorage.getItem('UserIDLogin')) + 
            " , update_date = now(), tanggal_bayar = '" + this.state.inputTanggalBayar + "',"+
            "id_list_bank = " + this.state.inputBank + " , pemilik_rekening = '" + this.state.inputNama + "' "+
            "where status = 'WAITING' and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and id_transaction = '" + this.props.data.id_transaction + "'" )
        }
        else {
            var query = encrypt("update gcm_master_transaction set update_by = " + decrypt(localStorage.getItem('UserIDLogin')) + 
            " , update_date = now(), bukti_bayar = '" + urlBuktiBayar + "', tanggal_bayar = '" + this.state.inputTanggalBayar + "',"+
            "id_list_bank = " + this.state.inputBank + " , pemilik_rekening = '" + this.state.inputNama + "' "+
            "where status = 'WAITING' and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and id_transaction = '" + this.props.data.id_transaction + "'" )
        }

        Axios.post(url.select,{
            query: query
        }).then(data=>{
            Toast.hide()
            Toast.success('Berhasil melakukan konfirmasi pembayaran', 3000, () => {
            });
            this.setState({
                payment_status: 'menunggu verifikasi',
                openConfirmationUnggah: !this.state.openConfirmationUnggah,
                openUnggahBuktiBayar: !this.state.openUnggahBuktiBayar
            })
        }).catch(err=>{
            Toast.hide()
            Toast.fail('Gagal melakukan konfirmasi pembayaran !', 3500, () => {
            });
        })
    }

    updatePO = (urlPO) => {
        
        let query = encrypt("update gcm_master_transaction set update_by = " + decrypt(localStorage.getItem('UserIDLogin')) + 
        " , update_date = now(), id_transaction_ref = '" + this.state.inputPO + "' ,foto_transaction_ref = '" + urlPO + "'" +
        "where status = 'WAITING' and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and id_transaction = '" + this.props.data.id_transaction + "'" )

        Axios.post(url.select,{
            query: query
        }).then(data=>{
            Toast.hide()
            Toast.success('Berhasil menyimpan data PO', 3000, () => {
            });
            this.setState({
                PO_reference: this.state.inputPO,
                imgPO_reference: urlPO,
                openConfirmationUnggahPO: !this.state.openConfirmationUnggahPO,
                openUnggahPO: !this.state.openUnggahPO
            })
        }).catch(err=>{
            Toast.hide()
            Toast.fail('Gagal menyimpan data PO !', 3500, () => {
            });
        })
    }

    render(){

    const listBank = this.state.listBank.map((item, index) => {
        return (
            <div style={{fontSize: '12px', fontWeight: '500'}}>
                <div><strong>{item.nama}</strong></div>
                <div>No Rek : {item.no_rekening}</div>
                <div>Nama Rek : {item.pemilik_rekening}</div>
                {index < (this.state.listBank.length - 1) ?
                    (<hr style={{ borderWidth: '1px', borderColor: '#abb4bb', margin:'7px 0px'}}/>) : (null)
                }  
            </div>   
        );
    });

    return(

        <div style={{display:'contents'}}>
        <tr id='rowTransactionWaiting' style={{fontSize:'13px', color:'#3D464D'}}>
            <td style={{textAlign: 'center'}}><strong><label id='idTransaction' onClick={()=>this.detailStatus(this.props.data.id_transaction)}>{this.props.data.id_transaction}</label></strong></td>
            <td style={{textAlign: 'center'}}>{this.props.data.create_date_edit}</td>
            <td style={{textAlign: 'right'}}><NumberFormat value={Number(this.props.data.totaltrx_tax)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
        </tr> 
        
            <Modal isOpen={this.state.isOpen} size="xl">
                <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.controlModal.bind(this)}>Detail Transaksi</ModalHeader>
                <ModalBody id="modal-transaksi" style={{padding:'30px'}}>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <div className="address-card__row-title">ID Transaksi</div>
                                <span style={{fontSize: '14px', fontWeight: '500'}}>
                                    <div className="address-card__row-content"><strong>{this.props.data.id_transaction}</strong></div>
                                </span>
                            </div> 
                        </div>
                        <div className="col-md-4 d-print-none">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Status</div>
                                <span style={{fontSize: '14px', fontWeight: '500'}}>
                                    <div className="address-card__row-content"><strong>Menunggu</strong></div>
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
                    <div className="row mt-2">   
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Nomor PO Pembeli</div>
                                <span style={{fontWeight: '500'}}>
                                {this.state.PO_reference === null ?
                                    (<div className="address-card__row-content" onClick={this.toggleUnggahPO} style={{color: 'red', cursor: 'pointer', textDecoration: 'underline'}}>
                                        <span style={{fontSize: '12px'}}>
                                            ubah di sini
                                        </span>
                                    </div>) :
                                    (<div className="address-card__row-content" >
                                        <span style={{fontSize: '14px'}}><strong>{this.state.PO_reference}</strong></span>
                                        <span data-toggle="tooltip" title="Lihat file PO" onClick={this.toggleImagePO} style={{cursor: 'pointer'}}>
                                            <i class="far fa-file-image fa-md ml-2"></i>
                                        </span>
                                    </div>)
                                }
                                </span>
                            </div> 
                        </div>
                    </div>
                    <hr style={{ borderWidth: '1px'}}/>  

                    <div className="row">
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Metode Pembayaran</div>
                                <span style={{fontSize: '12px', fontWeight: '500'}}>
                                    <div className="address-card__row-content">{this.state.payment_name}</div>
                                </span>    
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Status Pembayaran</div>
                                <span style={{fontSize: '12px', fontWeight: '500'}}>
                                    <div className="address-card__row-content">{this.state.payment_status}</div>
                                </span>    
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <button type="button" className="btn btn-primary btn-xs d-print-none" 
                                    onClick={this.toggleInfoPembayaran}>
                                    <i class="fas fa-receipt mr-2"></i>
                                    info pembayaran
                                </button>
                            </div> 
                        </div>
                    </div>

                    <hr style={{ borderWidth: '1px'}}/> 

                    <div className="row">
                        <div className="col-md-4">
                            <div className="address-card__row">
                                <div className="address-card__row-title">Permintaan Kirim</div>
                                <span style={{fontSize: '12px', fontWeight: '500'}}>
                                    <div className="address-card__row-content">{this.state.tgl_permintaan_kirim}</div>
                                </span>    
                            </div> 
                        </div>
                        <div className="col-md-4 d-print-none">
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
                        <div className="col-md-4">
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
                                    {' '}
                                    <NumberFormat value={item.qty * item.berat} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} />
                                    {' '}{item.satuan}
                                </td>
                                <td className="cart-table__column cart-table__column--total" data-title="Total Harga">
                                    <NumberFormat value={item.harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                </td>
                            </tr>
                        ))} 
                        </tbody>
                    </table>
                    <div className="row justify-content-end pt-3 pt-md-3">
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <button type="button" className="btn btn-light btn-xs d-print-none mb-3" onClick={()=>this.props.printInvoice("modal-transaksi", this.props.data.id_transaction)}>
                                <i class="fas fa-print" style={{ marginRight: '5px' }}></i>
                                Cetak Invoice
                            </button>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div style={{ padding : '0px' }}>
                                    <div className="row" style={{fontSize: '12px', fontWeight: '500'}}>
                                        <div className="col-6 col-sm-6 col-xs-6" style={{ display: 'flex', alignItems: 'center' }}>
                                            <span >Total Harga{' '}
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
                </ModalBody>
            </Modal>

            <Modal isOpen={this.state.openInfoPembayaran} centered size="sm" backdrop="static" >
                <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleInfoPembayaran}>Info Pembayaran</ModalHeader>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 d-flex" style={{fontSize: '12px', fontWeight: '500'}}>
                            <ol style={{padding: '0 0 0 10px'}}>
                                <li>Silakan lakukan transfer ke rekening bank berikut ini :</li>
                                <div style={{border: '1px solid #f5f5f5', backgroundColor: '#f5f5f5', borderRadius: '5px', padding:'10px', margin: '5px 0px'}}>
                                    {listBank}
                                </div>         
                                <li>Lakukan konfirmasi pembayaran</li>
                                <li>Tunggu proses verifikasi pembayaran</li>
                            </ol>
                        </div>
                    </div>
                    <div className="row" style={{display: this.state.displayBtnKonfirmasiBayar}}>
                        <div className="col-md-12 d-flex">
                            <button id="btnRegister" type="submit" onClick={this.toggleUnggahBuktiBayar} block className="btn btn-primary mt-12 mt-md-2 mt-lg-3">
                                Konfirmasi Pembayaran
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={this.state.openUnggahPO} centered size="sm" backdrop="static" >
                <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleUnggahPO}>PO Pembeli</ModalHeader>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 ">
                            <form>
                                <div className="form-group">
                                    <label >Nomor PO</label>
                                    <InputGroup>
                                        <Input
                                            name="inputPO"
                                            type="text"
                                            spellCheck="false"
                                            autoComplete="off"
                                            className="form-control"
                                            invalid={this.state.emptyPO}
                                            onChange={this.getInputForm}
                                            onKeyPress={event => this.handleWhitespace(event)}
                                            value={this.state.inputPO}
                                        />
                                        <FormFeedback>{this.state.KetTextPO}</FormFeedback>
                                    </InputGroup>
                                </div>
                                
                                <div className="form-group">
                                    <label>
                                        File PO
                                    </label>
                                    <InputGroup>
                                        <Input  
                                            id="pilihfile"
                                            className="form-control" 
                                            type="file"  
                                            accept="image/*" 
                                            invalid={this.state.emptyFoto}
                                            onChange={this.handleInsertFoto} 
                                            style={{ cursor: 'pointer', fontSize:'12px', paddingTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        </Input>
                                        <FormFeedback>{this.state.KetTextFoto}</FormFeedback>
                                    </InputGroup>
                                </div>

                                <div className="form-group" style={{display: this.state.previewFoto}}>
                                    <center>
                                        <InputGroup>
                                            <div className="innerdiv-upload center-side">
                                                <img src={(this.props.foto_upload == '') ? "images/default_image_not_found.jpg" : this.props.foto_upload} alt="" height="110" width="110" />
                                            </div>    
                                        </InputGroup>
                                        <InputGroup>
                                            <label class="btn btn-light btn-xs mt-2 center-side" onClick={this.handleDeleteFoto} style={{width: '120px'}}>
                                                <i class="fas fa-trash fa-xs mr-2"></i>
                                                hapus
                                            </label>
                                        </InputGroup>
                                    </center>
                                </div>

                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 d-flex">
                            <button id="btnRegister" type="submit" onClick={this.handleConfirmationUnggahPO} block className="btn btn-primary mt-12 mt-md-2 mt-lg-3">
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={this.state.openUnggahBuktiBayar} centered size="sm" backdrop="static" >
                <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleUnggahBuktiBayar}>Konfirmasi Pembayaran</ModalHeader>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 ">
                            <form>
                                <div className="form-group">
                                    <label>ID Transaksi</label>
                                    <InputGroup>
                                        <Input
                                            type="text"
                                            spellCheck="false"
                                            autoComplete="off"
                                            className="form-control"
                                            maxLength={100}
                                            disabled="true"
                                            value={this.props.data.id_transaction}
                                        />
                                    </InputGroup>
                                </div>
                                <div className="form-group">
                                    <label >Nama Pemilik Rekening</label>
                                    <InputGroup>
                                        <Input
                                            name="inputNama"
                                            type="text"
                                            spellCheck="false"
                                            autoComplete="off"
                                            className="form-control"
                                            invalid={this.state.emptyNama}
                                            onChange={this.getInputForm}
                                            value={this.state.inputNama}
                                        />
                                        <FormFeedback>{this.state.KetTextNama}</FormFeedback>
                                    </InputGroup>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="alamat-provinsi">Bank Tujuan</label>
                                    <InputGroup>
                                        <Input
                                            name="inputBank"
                                            type="select"
                                            spellCheck="false"
                                            autoComplete="off"
                                            className="form-control"
                                            invalid={this.state.emptyBank}
                                            onChange={this.getInputForm}
                                            value={this.state.inputBank}
                                        >
                                            <option value="" disabled selected hidden></option>
                                            {this.state.listBank.map(option => (
                                                <option value={option.id}>
                                                    {option.nama} - {option.no_rekening} - {option.pemilik_rekening} 
                                                </option>
                                            ))}
                                        </Input>
                                        <FormFeedback>{this.state.KetTextBank}</FormFeedback>
                                    </InputGroup>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="alamat-provinsi">Tanggal Pembayaran</label>
                                    <InputGroup>
                                        <Input
                                            name="inputTanggalBayar"
                                            type="date"
                                            spellCheck="false"
                                            autoComplete="off"
                                            className="form-control"
                                            invalid={this.state.emptyTanggalBayar}
                                            onChange={this.getInputForm}
                                            value={this.state.inputTanggalBayar}
                                        />
                                        <FormFeedback>{this.state.KetTextTanggalBayar}</FormFeedback>
                                    </InputGroup>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="alamat">
                                        Bukti Pembayaran
                                            <span style={{fontSize: '10px'}}>{' '}(opsional)</span>
                                    </label>
                                    <InputGroup>
                                        <Input  className="form-control" type="file" id="pilihfile" accept="image/*" onChange={this.handleInsertFoto} 
                                                style={{ cursor: 'pointer', fontSize:'12px', paddingTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        </Input>
                                    </InputGroup>
                                </div>

                                <div className="form-group" style={{display: this.state.previewFoto}}>
                                    <center>
                                        <InputGroup>
                                            <div className="innerdiv-upload center-side">
                                                <img src={(this.props.foto_upload == '') ? "images/default_image_not_found.jpg" : this.props.foto_upload} alt="" height="110" width="110" />
                                            </div>    
                                        </InputGroup>
                                        <InputGroup>
                                            <label class="btn btn-light btn-sm mt-2 center-side" onClick={this.handleDeleteFoto} style={{width: '120px'}}>
                                                <i class="fas fa-trash fa-xs mr-2"></i>
                                                hapus foto
                                            </label>
                                        </InputGroup>
                                    </center>
                                </div>

                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 d-flex">
                            <button id="btnRegister" type="submit" onClick={this.handleConfirmationUnggah} block className="btn btn-primary mt-12 mt-md-2 mt-lg-3">
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Dialog
                open={this.state.openConfirmationUnggahPO}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">Konfirmasi PO Pembeli</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin akan menyimpan data PO ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => this.handleUnggahPO()}>
                        Ya
                </Button>
                    <Button color="light" onClick={() => this.setState({ openConfirmationUnggahPO: false, file_upload: '' })}>
                        Batal
                </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={this.state.openConfirmationUnggah}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">Konfirmasi Pembayaran</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin akan melakukan konfirmasi pembayaran ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => this.handleUnggah()}>
                        Ya
                </Button>
                    <Button color="light" onClick={() => this.setState({ openConfirmationUnggah: false, file_upload: '' })}>
                        Batal
                </Button>
                </DialogActions>
            </Dialog>

            {/* Modal file PO */}
            <div id="myModalPO" class="modalPO" style={{display : this.state.displayImagePO}}>
                <span class="close-modalPO" onClick={this.toggleImagePO}>&times;</span>
                <img class="modalPO-content" id="img01" src={this.state.imgPO_reference}/>
                <div id="modalPO-caption"></div>
            </div>

        </div>    
    )
   } 
}