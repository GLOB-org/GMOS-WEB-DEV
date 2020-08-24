// react
import React, { Component } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import Grid from '@material-ui/core/Grid';
import { Button, FormFeedback, Input, InputGroup, Modal, ModalHeader } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import Toast from 'light-toast';
import DialogCatch from '../shared/DialogCatch';

// data stubs
import addresses from '../../data/accountAddresses';
import theme from '../../data/theme';
import InfoAccountCard from './AccountPageDashboard-Account';
import InfoCompanyCard from './AccountPageDashboard-Company';
import TransactionHistory from './AccountPageDashboard-Transaction';
import { ToastType } from 'react-toastify';

class AccountPageDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data_cart: [],
            data_company_listing: [],
            list_address: [],
            listProvince: [],
            listCity: [],
            listCityfilter: [],
            listKecamatan: [],
            listKelurahan: [],
            address_length: '',
            modalStatusCompany: false,
            billToActive: false, shipToActive: false,
            checkTabPane: true,
            modalEdit: false,
            modalSetAlamat: false,
            modalTambahAlamat: false,
            modalEditAlamat: false,
            labelModalEditTambah: '',
            inputHPakun: '',
            inputEmailakun: '',
            inputPassword: '',
            inputRePassword: '',
            inputTeleponPerusahaan: '',
            inputEmailPerusahaan: '',
            inputAlamatPerusahaan: '',
            inputAlamat: '', empty_alamat: false, KetTextAlamat: '',
            inputProvinsi: '', empty_provinsi: false, KetTextProvinsi: '',
            inputKota: '', empty_kota: false, KetTextKota: '',
            inputKecamatan: '', empty_kecamatan: false, KetTextKecamatan: '',
            inputKelurahan: '', empty_kelurahan: false, KetTextKelurahan: '',
            inputNoTelp: '', empty_notelp: false, KetTextNoTelp: '',
            inputKodePOS: '', empty_kodepos: false, KetTextKodePos: '',
            icon_pass: 'fa fa-eye-slash',
            icon_repass: 'fa fa-eye-slash',
            openConfirmationSave: false,
            openConfirmationDelete: false,
            openConfirmationDeleteFalse: false,
            openConfirmationAddFalse: false,
            selected_delete: '',
            selected_update: '',
            alert_delete: '',
            sizeModal: 'lg',
            classFormEdit: 'col-md-6 d-flex',
            disable_kota: true,
            disable_kecamatan: true, disable_kecamatan_ket: '',
            disable_kelurahan: true, disable_kelurahan_ket: '',
            displaycatch: false
        };
    }

    Alamat_validation = (event) => {
        this.setState({ inputAlamat: event.target.value });
        if (event.target.value.length > 0) {
            this.setState({
                empty_alamat: false,
                KetTextAlamat: ''
            });
        }
    }

    Numeric_validation = (event, get_id) => {
        let get_input = event.target.value
        if (isNaN(Number(get_input))) {
            return;
        }
        else {
            if (get_id == 'kodepos') {
                this.setState({ inputKodePOS: event.target.value });
                if (get_input.length < 5 && get_input.length > 0) {
                    this.setState({ empty_kodepos: true });
                    this.setState({ KetTextKodePos: "Tidak valid (" + get_input.length + "/5)" });
                }
                else if (get_input.length == 5 || get_input.length == 0) {
                    this.setState({ empty_kodepos: false });
                    this.setState({ KetTextKodePos: "" });
                }
            }
            else if (get_id == 'notelp') {
                this.setState({ inputNoTelp: event.target.value });
                if (get_input > 0) {
                    this.setState({ empty_notelp: false });
                    this.setState({ KetTextNoTelp: "" });
                }
            }
        }

    }

    Password_appear = () => {
        if (document.getElementById('account-password').type == 'password') {
            document.getElementById('account-password').type = 'text'
            this.setState({ icon_pass: 'fa fa-eye' });
        }
        else {
            document.getElementById('account-password').type = 'password'
            this.setState({ icon_pass: 'fa fa-eye-slash' });
        }
    }

    RePassword_appear = () => {
        if (document.getElementById('account-repassword').type == 'password') {
            document.getElementById('account-repassword').type = 'text'
            this.setState({ icon_repass: 'fa fa-eye' });
        }
        else {
            document.getElementById('account-repassword').type = 'password'
            this.setState({ icon_repass: 'fa fa-eye-slash' });
        }
    }

    toggleCloseConfirmationAddFalse = () => {
        this.setState({ openConfirmationAddFalse: !this.state.openConfirmationAddFalse });
    }

    toggleCloseConfirmationDeleteFalse = () => {
        this.setState({ openConfirmationDeleteFalse: !this.state.openConfirmationDeleteFalse });
    }

    toggleBatalDelete = () => {
        this.setState({
            openConfirmationDelete: false
        });
    }

    toggleBatalSave = () => {
        this.setState({
            openConfirmationSave: false
        });
    }


    toggleCloseConfirmation = (id, index) => {

        if (this.state.list_address[index].shipto_active == 'Y' && this.state.list_address[index].billto_active == 'N') {
            this.setState({ alert_delete: 'Pengiriman' });
            this.toggleCloseConfirmationDeleteFalse()
        }
        else if (this.state.list_address[index].billto_active == 'Y' && this.state.list_address[index].shipto_active == 'N') {
            this.setState({ alert_delete: 'Penagihan' });
            this.toggleCloseConfirmationDeleteFalse()
        }
        else if (this.state.list_address[index].shipto_active == 'Y' && this.state.list_address[index].billto_active == 'Y') {
            this.setState({ alert_delete: 'Pengiriman dan Penagihan' });
            this.toggleCloseConfirmationDeleteFalse()
        }
        else {
            this.setState({
                openConfirmationDelete: !this.state.openConfirmationDelete,
                selected_delete: id
            });
        }
    }

    toggleModalEdit = () => {
        if (this.state.data[0].role == 'user') {
            this.setState({
                sizeModal: 'md',
                classFormEdit: 'col-md-12 d-flex',
                // displayFormEdit: 'display: block'
            });
        }

        this.setState({
            modalEdit: !this.state.modalEdit,
            inputHPakun: this.state.data[0].no_hp,
            inputEmailakun: this.state.data[0].u_email,
            inputPassword: decrypt(this.state.data[0].password),
            inputRePassword: decrypt(this.state.data[0].password),
            inputTeleponPerusahaan: this.state.data[0].no_telp,
            inputEmailPerusahaan: this.state.data[0].p_email,
            inputAlamatPerusahaan: this.state.data[0].alamat
        });
    }

    toggleModalSetALamat = (id) => {
        // if (this.state.modalSetAlamat == false) {
        //     let check_kode_alamat = encrypt("")

        //     Toast.loading('loading . . .', () => {
        //     });
        //     Axios.post(url.select, {
        //         query: check_kode_alamat
        //     }).then(data => {
        //         this.setState({
        //             data_cart: data.data.data
        //         });
        //         Toast.hide()
        //     }).catch(err => {
        //         // console.log('error' + err);
        //         // console.log(err);
        //     })
        // }
        this.setState({
            modalSetAlamat: !this.state.modalSetAlamat,
            selected_update: id
        });
    }

    toggleModalEditAlamat = (id, index, shipto_active, billto_active) => {
        if (index >= 0) {
            Toast.loading('loading . . .', () => {
            });

            if (billto_active == 'Y') {
                var billto = true
                this.getCompanyListing()
            }
            else {
                var billto = false
            }

            if (shipto_active == 'Y') {
                var shipto = true
            }
            else {
                var shipto = false
            }

            this.setState({
                selected_update: id,
                inputAlamat: this.state.list_address[index].alamat,
                inputProvinsi: this.state.list_address[index].id_provinsi,
                inputKodePOS: this.state.list_address[index].kodepos,
                inputNoTelp: this.state.list_address[index].no_telp,
                billToActive: billto,
                shipToActive: shipto
            });

            this.getListCityEdit(this.state.list_address[index].id_provinsi, this.state.list_address[index].id_kota, this.state.list_address[index].id_kecamatan, this.state.list_address[index].id_kelurahan)
        }
        if (this.state.modalEditAlamat == true) {
            this.setState({
                modalEditAlamat: false
            });
        }
    }

    getCompanyListing = async () => {
        // let company_listing = encrypt("select seller_id from gcm_company_listing where buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status = 'A'")
        let company_listing = encrypt("select seller_id from gcm_company_listing where buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')))

        await Axios.post(url.select, {
            query: company_listing
        }).then(data => {
            this.setState({
                data_company_listing: data.data.data
            });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    toggleModalTambahAlamat = async () => {
        if (this.state.address_length == 3) {
            this.setState({ openConfirmationAddFalse: !this.state.openConfirmationAddFalse });
        }
        else {

            if (this.state.modalTambahAlamat == false) {
                Toast.loading('loading . . .', () => {
                });
                await this.getCompanyListing()
                Toast.hide()
            }

            await this.setState({
                modalTambahAlamat: !this.state.modalTambahAlamat,
                inputAlamat: '', empty_alamat: false, KetTextAlamat: '',
                inputProvinsi: '', empty_provinsi: false, KetTextProvinsi: '',
                inputKota: '', empty_kota: false, KetTextKota: '',
                inputKecamatan: '', empty_kecamatan: false, KetTextKecamatan: '',
                inputKelurahan: '', empty_kelurahan: false, KetTextKelurahan: '',
                inputKodePOS: '', empty_kodepos: false, KetTextKodePos: '',
                inputNoTelp: '', empty_notelp: false, KetTextNoTelp: '',
                disable_kota: true, disable_kecamatan: true, disable_kelurahan: true
            });
        }
    }

    setAlamat = async (status) => {
        Toast.loading('loading . . .', () => {
        });

        let check_cart = encrypt("select string_agg(distinct cast(id as varchar), ',') as id, count(*) as jumlah from gcm_master_cart gmc where status = 'A' and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')))

        await Axios.post(url.select, {
            query: check_cart
        }).then(data => {
            this.setState({
                data_cart: data.data.data
            });
            Toast.hide()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })

        var count_cart = this.state.data_cart[0].jumlah
        var set_query = ""

        if (count_cart == 0) {
            if (status == 'pengiriman') {
                // var update_all = "with new_order as (update gcm_master_alamat set shipto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and flag_active = 'A')"
                // var queryUpdate = "update gcm_master_alamat set shipto_active = 'Y', billto_active = 'N' where id = " + this.state.selected_update

                var update_all = "with new_order as (update gcm_master_alamat set shipto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and flag_active = 'A')"
                var queryUpdate = "update gcm_master_alamat set shipto_active = 'Y' where id = " + this.state.selected_update
            }
            // else if (status == 'penagihan') {
            //     var update_all = "with new_order as (update gcm_master_alamat set billto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and flag_active = 'A')"
            //     var queryUpdate = "update gcm_master_alamat set shipto_active = 'N', billto_active = 'Y' where id = " + this.state.selected_update
            // }
            // else if (status == 'pengiriman_penagihan') {
            //     var update_all = "with new_order as (update gcm_master_alamat set shipto_active = 'N', billto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and flag_active = 'A')"
            //     var queryUpdate = "update gcm_master_alamat set shipto_active = 'Y', billto_active = 'Y' where id = " + this.state.selected_update
            // }
            set_query = encrypt(update_all.concat(queryUpdate))
        }
        else if (count_cart > 0) {
            if (status == 'pengiriman') {
                // var update_all = "with new_order1 as (update gcm_master_alamat set shipto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and flag_active = 'A'),"
                // var queryUpdate = " new_order2 as (update gcm_master_alamat set shipto_active = 'Y', billto_active = 'N' where id = " + this.state.selected_update + ")"
                // var update_cart = "update gcm_master_cart set shipto_id = " + this.state.selected_update + " where status = 'A' and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and id in (" + this.state.data_cart[0].id + ")"

                var update_all = "with new_order1 as (update gcm_master_alamat set shipto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and flag_active = 'A'),"
                var queryUpdate = " new_order2 as (update gcm_master_alamat set shipto_active = 'Y' where id = " + this.state.selected_update + ")"
                var update_cart = "update gcm_master_cart set shipto_id = " + this.state.selected_update + " where status = 'A' and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and id in (" + this.state.data_cart[0].id + ")"
            }
            // else if (status == 'penagihan') {
            //     var update_all = "with new_order1 as (update gcm_master_alamat set billto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and flag_active = 'A'),"
            //     var queryUpdate = " new_order2 as (update gcm_master_alamat set shipto_active = 'N', billto_active = 'Y' where id = " + this.state.selected_update + ")"
            //     var update_cart = "update gcm_master_cart set billto_id = " + this.state.selected_update + " where status = 'A' and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and id in (" + this.state.data_cart[0].id + ")"
            // }
            // else if (status == 'pengiriman_penagihan') {
            //     var update_all = "with new_order1 as (update gcm_master_alamat set shipto_active = 'N', billto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and flag_active = 'A'),"
            //     var queryUpdate = " new_order2 as (update gcm_master_alamat set shipto_active = 'Y', billto_active = 'Y' where id = " + this.state.selected_update + ")"
            //     var update_cart = "update gcm_master_cart set billto_id = " + this.state.selected_update + ", shipto_id = " + this.state.selected_update + " where status = 'A' and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and id in (" + this.state.data_cart[0].id + ")"
            // }
            set_query = encrypt(update_all.concat(queryUpdate).concat(update_cart))
        }

        Axios.post(url.select, {
            query: set_query
        }).then(data => {
            this.loadAlamat()
            this.setState({
                modalSetAlamat: false
            });
            Toast.hide();
            Toast.success('Berhasil menetapkan alamat', 1000, () => {
            });
        }).catch(err => {
            Toast.fail('Gagal menetapkan alamat', 2000, () => {
            });
            // console.log('error' + err);
            // console.log(err);
        })
        this.forceUpdate()
    }

    deleteAlamat = (id) => {
        Toast.loading('loading . . .', () => {
        });

        let checkAlamat_onCart = "with new_query as (update gcm_master_cart set shipto_id = (select id from gcm_master_alamat gma where shipto_active = 'Y'" +
            "and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and flag_active = 'A') " +
            "where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status = 'A' and shipto_id = " + id + ")"
        let queryDelete = "update gcm_master_alamat set flag_active = 'I' where id = " + id

        let final_query = encrypt(checkAlamat_onCart.concat(queryDelete))

        Axios.post(url.select, {
            query: final_query
        }).then(data => {
            this.loadAlamat()
            this.setState({
                openConfirmationDelete: false
            });
            Toast.hide();
            Toast.success('Berhasil menghapus alamat', 2000, () => {
            });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
        this.forceUpdate()
    }

    getListCity = (event) => {
        let get_idprovinsi = event.target.value

        let get_daftarkota = this.state.listCity.filter(input_provinsi => {
            return input_provinsi.province_id === get_idprovinsi;
        });

        this.setState({
            listCityfilter: get_daftarkota,
            inputProvinsi: get_idprovinsi,
            inputKota: '',
            disable_kota: false,
            empty_provinsi: false,
            KetTextProvinsi: ''
        });

        if (this.state.inputProvinsi != get_idprovinsi) {
            this.setState({
                listKecamatan: [],
                listKelurahan: []
            });
        }

        this.forceUpdate()
    }

    getListCityEdit = (get_idprovinsi, get_idkota, get_idkecamatan, get_idkelurahan) => {

        let get_daftarkota = this.state.listCity.filter(input_provinsi => {
            return input_provinsi.province_id === get_idprovinsi;
        });

        this.setState({
            listCityfilter: get_daftarkota,
            inputProvinsi: get_idprovinsi,
            inputKota: '',
            inputKota: get_idkota,
            empty_provinsi: false,
            KetTextProvinsi: ''
        });

        // if (this.state.inputProvinsi != get_idprovinsi) {
        //     this.setState({
        //         listKecamatan: [],
        //         listKelurahan: []
        //     });
        // }

        // document.getElementById("perusahaan-kota").selectedIndex = "0"

        this.getSelectCityEdit(get_idkota, get_idkecamatan, get_idkelurahan)

        this.forceUpdate()
    }

    getSelectCity = (event) => {
        var id_kota = event.target.value
        this.setState({
            inputKota: event.target.value,
            inputKecamatan: '',
            listKelurahan: [],
            empty_kota: false,
            KetTextKota: '',
            disable_kecamatan_ket: 'sedang memuat data...'
        });

        let querykecamatan = encrypt("select id, nama from gcm_master_kecamatan where id_city = '" + id_kota + "' order by nama asc")

        Axios.post(url.select, {
            query: querykecamatan
        }).then(data => {
            this.setState({
                listKecamatan: data.data.data,
                disable_kecamatan: false,
                disable_kecamatan_ket: ''
            });
        }).catch(err => {
            this.setState({
                displaycatch: true,
            });
            // console.log('error' + err);
            // console.log(err);
        })

        this.forceUpdate()
    }

    getSelectCityEdit = (id_kota, id_kecamatan, id_kelurahan) => {
        this.setState({
            listKelurahan: [],
            inputKecamatan: '',
            empty_kota: false,
            KetTextKota: ''
        });
        //query get kecamatan

        let querykecamatan = encrypt("select id, nama from gcm_master_kecamatan where id_city = '" + id_kota + "' order by nama asc")

        Axios.post(url.select, {
            query: querykecamatan
        }).then(data => {

            this.setState({
                listKecamatan: data.data.data,
                inputKecamatan: id_kecamatan
            });
        }).catch(err => {
            this.setState({
                displaycatch: true,
            });
            // console.log('error' + err);
            // console.log(err);
        })

        this.getSelectKecamatanEdit(id_kecamatan, id_kelurahan)
        this.forceUpdate()
    }

    getSelectKecamatan = (event) => {
        var id_kecamatan = event.target.value
        this.setState({
            inputKecamatan: event.target.value,
            inputKelurahan: '',
            empty_kecamatan: false,
            KetTextKelurahan: '',
            disable_kelurahan_ket: 'sedang memuat data...'
        });

        //query get kelurahan
        let querykelurahan = encrypt("select * from gcm_master_kelurahan where id_kecamatan = '" + id_kecamatan + "' order by nama asc")

        Axios.post(url.select, {
            query: querykelurahan
        }).then(data => {
            this.setState({
                listKelurahan: data.data.data,
                disable_kelurahan: false,
                disable_kelurahan_ket: ''
            });
        }).catch(err => {
            this.setState({
                displaycatch: true,
            });
            // console.log('error' + err);
            // console.log(err);
        })

        this.forceUpdate()
    }

    getSelectKecamatanEdit = (id_kecamatan, id_kelurahan) => {

        this.setState({
            inputKecamatan: id_kecamatan,
            inputKelurahan: '',
            empty_kecamatan: false,
            KetTextKelurahan: ''
        });

        //query get kelurahan
        let querykelurahan = encrypt("select * from gcm_master_kelurahan where id_kecamatan = '" + id_kecamatan + "' order by nama asc")

        Axios.post(url.select, {
            query: querykelurahan
        }).then(data => {
            this.setState({
                listKelurahan: data.data.data,
                inputKelurahan: id_kelurahan
            });
            Toast.hide();
            this.setState({
                modalEditAlamat: true
            });
        }).catch(err => {
            this.setState({
                displaycatch: true,
            });
            // console.log('error' + err);
            // console.log(err);
        })

        this.forceUpdate()
    }

    getSelectKelurahan = (event) => {
        this.setState({
            inputKelurahan: event.target.value,
            empty_kelurahan: false,
            KetTextKelurahan: ''
        });
        this.forceUpdate()
    }

    handleWhitespace = (event) => {
        if (event.which === 32) {
            event.preventDefault();
        }
    }

    loaddataAkun = () => {
        let queryprofile = encrypt("SELECT nama_perusahaan, e.nama as nama_tipe_bisnis, " +
            " a.email as p_email, no_telp," +
            "tipe_bisnis, b.nama as u_nama, no_ktp, username, b.email as u_email, no_hp, role, b.status as u_status, b.password " +
            "FROM gcm_master_company a inner join gcm_master_user b on a.id=b.company_id " +
            "inner join gcm_master_category e on a.tipe_bisnis=e.id " +
            "where a.id=" + decrypt(localStorage.getItem('CompanyIDLogin')) + " and b.id=" + decrypt(localStorage.getItem('UserIDLogin')));

        Axios.post(url.select, {
            query: queryprofile
        }).then(data => {
            this.setState({ data: data.data.data });
        }).catch(err => {
            this.setState({
                displaycatch: true,
            });
            // console.log('error' + err);
            // console.log(err);
        })
    }

    loadAlamat = () => {
        let queryaddress = encrypt("select a.id, a.alamat, e.id as id_kelurahan, initcap(e.nama) as kelurahan, d.id as id_kecamatan, initcap(d.nama) as kecamatan, b.id as id_kota, initcap(b.name) as kota, c.id as id_provinsi ,initcap(c.name) as provinsi, a.kodepos, a.no_telp, a.shipto_active, a.billto_active, a.company_id from gcm_master_alamat a, gcm_location_city b, gcm_location_province c, gcm_master_kecamatan d, gcm_master_kelurahan e  where a.company_id = " + decrypt(localStorage.getItem("CompanyIDLogin")) + " and a.kota = b.id and a.provinsi = c.id and a.kecamatan = d.id and a.kelurahan = e.id and a.flag_active = 'A' order by a.id")

        Axios.post(url.select, {
            query: queryaddress
        }).then(data => {
            this.setState({
                list_address: data.data.data,
                address_length: data.data.data.length
            });
            document.getElementById('shimmerTransaction').style.display = 'none'
            document.getElementById('contentShimmerTransaction').style.display = 'contents'
            if (data.data.data.length == 0) {
                document.getElementById('alertempty').style.display = 'table-cell'
                document.getElementById('rowTransaction').style.display = 'none'
            }
            else {
                document.getElementById('rowTransaction').style.display = 'inset'
                document.getElementById('alertempty').style.display = 'none'
            }

        }).catch(err => {
            this.setState({
                displaycatch: true,
            });
            // console.log('error' + err);
            // console.log(err);
        })
    }

    tambahAlamat = () => {

        if (this.state.inputAlamat == "") {
            this.setState({
                empty_alamat: true,
                KetTextAlamat: 'isi data yang kosong'
            });
        }
        if (this.state.inputProvinsi == "") {
            this.setState({
                empty_provinsi: true,
                KetTextProvinsi: 'isi data yang kosong'
            });
        }
        if (this.state.inputKota == "") {
            this.setState({
                empty_kota: true,
                KetTextKota: 'isi data yang kosong'
            });
        }
        if (this.state.inputKecamatan == "") {
            this.setState({
                empty_kecamatan: true,
                KetTextKecamatan: 'isi data yang kosong'
            });
        }
        if (this.state.inputKelurahan == "") {
            this.setState({
                empty_kelurahan: true,
                KetTextKelurahan: 'isi data yang kosong'
            });
        }
        if (this.state.inputKodePOS == "") {
            this.setState({
                empty_kodepos: true,
                KetTextKodePos: 'isi data yang kosong'
            });
        }
        if (this.state.inputNoTelp == "") {
            this.setState({
                empty_notelp: true,
                KetTextNoTelp: 'isi data yang kosong'
            });
        }
        if (this.state.inputAlamat != "" && this.state.inputProvinsi != "" && this.state.inputKota != "" &&
            this.state.inputKecamatan != "" && this.state.inputKelurahan != "" && this.state.inputKodePOS != "" && this.state.inputNoTelp != "" && this.state.inputKodePOS.length == 5) {
            if (this.state.modalEditAlamat == true) {
                var label = 'menyimpan pengubahan alamat'
            }
            else {
                var label = 'menambahkan alamat baru'
            }
            this.setState({
                openConfirmationSave: true,
                labelModalEditTambah: label
            });
        }
    }

    tambahAlamat_submit = () => {
        this.setState({ openConfirmationSave: false });

        Toast.loading('loading . . .', () => {
        });

        if (this.state.modalEditAlamat == false) {
            var queryalamat = "with new_insert as (insert into gcm_master_alamat (kelurahan, kecamatan, kota, provinsi, kodepos, no_telp, shipto_active, billto_active, company_id, alamat, flag_active) values (" +
                this.state.inputKelurahan + "," + this.state.inputKecamatan + "," + this.state.inputKota + "," + this.state.inputProvinsi + "," + this.state.inputKodePOS + ", '" + this.state.inputNoTelp + "', 'N', 'N', " + decrypt(localStorage.getItem('CompanyIDLogin')) + ", '" + this.state.inputAlamat + "', 'A') returning id ) "

            queryalamat = queryalamat + "insert into gcm_listing_alamat (id_master_alamat, id_buyer, id_seller, kode_shipto_customer, kode_billto_customer) values "
            var loop = ""
            for (var i = 0; i < this.state.data_company_listing.length; i++) {
                loop = loop + "((select id from new_insert)," + decrypt(localStorage.getItem('CompanyIDLogin')) + "," + this.state.data_company_listing[i].seller_id + ",null, null)"
                if (i < this.state.data_company_listing.length - 1) {
                    loop = loop.concat(",")
                }
            }
            queryalamat = queryalamat + loop
        }

        else if (this.state.modalEditAlamat == true) {
            if (this.state.billToActive == true) {
                if (this.state.shipToActive == true) {
                    var shipto = 'Y'
                    // var update_shipto_cart = ", new_update_cart_shipto as (update gcm_master_cart set shipto_id = " +
                    //     "(select id from new_insert) where billto_id = (select id from new_insert ) and status = 'A') "

                    var update_shipbill_cart = "new_update_cart as ( update gcm_master_cart set billto_id = (select id from new_insert), "+
                    "shipto_id = (select id from new_insert) where billto_id = " + this.state.selected_update + " and status = 'A' )"    
                }
                else {
                    var shipto = 'N'
                    var update_shipbill_cart = "new_update_cart as ( update gcm_master_cart set billto_id = (select id from new_insert) "+
                    "where billto_id = " + this.state.selected_update + " and status = 'A' )"    
                }

                var queryalamat = "with new_update as (update gcm_master_alamat set shipto_active = 'N', billto_active = 'N', flag_active = 'I' where id = " + this.state.selected_update + " ), " +
                    "new_insert as (insert into gcm_master_alamat (kelurahan, kecamatan, kota, provinsi, kodepos, no_telp, shipto_active, billto_active, company_id, alamat, flag_active) values (" +
                    this.state.inputKelurahan + "," + this.state.inputKecamatan + "," + this.state.inputKota + "," + this.state.inputProvinsi + "," + this.state.inputKodePOS + ", '" + this.state.inputNoTelp + "', '" + shipto +
                    "', 'Y', " + decrypt(localStorage.getItem('CompanyIDLogin')) + ", '" + this.state.inputAlamat + "', 'A') returning id ), " + update_shipbill_cart
                    // "new_update_cart_billto as ( update gcm_master_cart set billto_id = (select id from new_insert) where billto_id = " + this.state.selected_update + " and status = 'A' )" + update_shipto_cart

                queryalamat = queryalamat + "insert into gcm_listing_alamat (id_master_alamat, id_buyer, id_seller, kode_shipto_customer, kode_billto_customer) values "
                var loop = ""

                for (var i = 0; i < this.state.data_company_listing.length; i++) {
                    loop = loop + "((select id from new_insert)," + decrypt(localStorage.getItem('CompanyIDLogin')) + "," + this.state.data_company_listing[i].seller_id + ",null, null)"
                    if (i < this.state.data_company_listing.length - 1) {
                        loop = loop.concat(",")
                    }
                }

                queryalamat = queryalamat + loop

            }
            else {
                var queryalamat = "update gcm_master_alamat set alamat = '" + this.state.inputAlamat + "', kelurahan = " +
                    this.state.inputKelurahan + ", kecamatan = " + this.state.inputKecamatan + ", kota = " + this.state.inputKota +
                    ", provinsi = " + this.state.inputProvinsi + ", kodepos = " + this.state.inputKodePOS + ", no_telp = '" +
                    this.state.inputNoTelp + "' where id = " + this.state.selected_update
            }
        }

        Axios.post(url.select, {
            query: encrypt(queryalamat)
        }).then(data => {

            Toast.hide();
            if (this.state.modalEditAlamat == false) {
                Toast.success('Berhasil menambahkan alamat', 2000, () => {
                });
            }
            else if (this.state.modalEditAlamat == true) {
                Toast.success('Berhasil menyimpan alamat', 2000, () => {
                });
            }

            this.setState({
                modalTambahAlamat: !this.state.modalTambahAlamat,
                inputAlamat: '', empty_alamat: false, KetTextAlamat: '',
                inputProvinsi: '', empty_provinsi: false, KetTextProvinsi: '',
                inputKota: '', empty_kota: false, KetTextKota: '',
                inputKecamatan: '', empty_kecamatan: false, KetTextKecamatan: '',
                inputKelurahan: '', empty_kelurahan: false, KetTextKelurahan: '',
                inputKodePOS: '', empty_kodepos: false, KetTextKodePos: '',
                inputNoTelp: '', empty_notelp: false, KetTextNoTelp: '',
                disable_kota: true, disable_kecamatan: true, disable_kelurahan: true
            });
            this.setState({
                modalTambahAlamat: false,
                modalEditAlamat: false
            });
            this.loadAlamat()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    componentDidMount() {
        if (localStorage.getItem('Login') != null) {
            let queryprofile = encrypt("SELECT nama_perusahaan, e.nama as nama_tipe_bisnis, " +
                "a.no_npwp, a.no_siup, a.email as p_email, no_telp," +
                "tipe_bisnis, b.nama as u_nama, no_ktp, username, b.email as u_email, no_hp, role, b.status as u_status, b.password " +
                "FROM gcm_master_company a inner join gcm_master_user b on a.id=b.company_id " +
                "inner join gcm_master_category e on a.tipe_bisnis=e.id " +
                "where a.id=" + decrypt(localStorage.getItem('CompanyIDLogin')) + " and b.id=" + decrypt(localStorage.getItem('UserIDLogin')));

            let queryaddress = encrypt("select a.id, a.alamat, e.id as id_kelurahan, initcap(e.nama) as kelurahan, d.id as id_kecamatan, initcap(d.nama) as kecamatan, b.id as id_kota, initcap(b.name) as kota, c.id as id_provinsi ,initcap(c.name) as provinsi, a.kodepos, a.no_telp, a.shipto_active, a.billto_active, a.company_id from gcm_master_alamat a, gcm_location_city b, gcm_location_province c, gcm_master_kecamatan d, gcm_master_kelurahan e  where a.company_id = " + decrypt(localStorage.getItem("CompanyIDLogin")) + " and a.kota = b.id and a.provinsi = c.id and a.kecamatan = d.id and a.kelurahan = e.id and a.flag_active = 'A' order by a.id")

            Axios.post(url.select, {
                query: queryprofile
            }).then(data => {
                this.setState({ data: data.data.data });
                document.getElementById('shimmerAccount').style.display = 'none'
                document.getElementById('contentShimmerAccount').style.display = 'block'
                document.getElementById('shimmerCompany').style.display = 'none'
                document.getElementById('contentShimmerCompany').style.display = 'block'
            }).catch(err => {
                // console.log('error' + err);
                // console.log(err);
                this.setState({ displaycatch: true });
            })

            Axios.post(url.select, {
                query: queryaddress
            }).then(data => {
                this.setState({
                    list_address: data.data.data,
                    address_length: data.data.data.length
                });
                document.getElementById('shimmerTransaction').style.display = 'none'
                document.getElementById('contentShimmerTransaction').style.display = 'contents'
                if (data.data.data.length == 0) {
                    document.getElementById('alertempty').style.display = 'table-cell'
                    document.getElementById('rowTransaction').style.display = 'none'
                }
                else {
                    document.getElementById('rowTransaction').style.display = 'inset'
                    document.getElementById('alertempty').style.display = 'none'
                }

            }).catch(err => {
                this.setState({
                    displaycatch: true,
                });
                // console.log('error' + err);
                // console.log(err);
            })

            let daftarProvinsi = encrypt("select id, name from gcm_location_province order by name");
            let daftarKota = encrypt("select id, province_id, name from gcm_location_city glc order by name");

            Axios.post(url.select, {
                query: daftarProvinsi
            }).then(data => {
                this.setState({ listProvince: data.data.data });
            }).catch(err => {
                this.setState({
                    displaycatch: true,
                });
                // console.log('error');
                // console.log(err);
            })

            Axios.post(url.select, {
                query: daftarKota
            }).then(data => {
                this.setState({
                    listCity: data.data.data,
                });
            }).catch(err => {
                this.setState({
                    displaycatch: true,
                });
                // console.log('error');
                // console.log(err);
            })

        }
    }

    render() {
        const address = addresses[0];

        return (
            <div className="dashboard">
                <Helmet>
                    <title>{`Akun — ${theme.name}`}</title>
                </Helmet>
                {/* <div className="dashboard__orders" style={{ marginTop: '-35px', marginBottom: '7px' }}>
                    <div className="btn btn-secondary btn-sm" onClick={this.toggleModalEdit} style={{ float: 'right' }}>  <span style={{ paddingRight: '5px' }}><i class="fas fa-pencil-alt"></i></span>Edit Data</div>
                </div> */}

                <div className="dashboard__address card address-card address-card--featured">
                    {address.default && <div className="address-card__badge">Informasi Akun</div>}
                    <div className="address-card__body" >
                        <div id="shimmerAccount" style={{ display: 'block' }}>

                            {/* <div className="product-card__buttons" style={{ marginTop: '0px' }}>
                                <btnshimmer-small class="shine"></btnshimmer-small>
                            </div> */}
                            <div className="address-card__name mt-3"> <lines class="shine"></lines></div>
                            <div className="address-card__row">
                                <div className="address-card__row-title"><lines class="shine"></lines></div>
                                <div className="address-card__row-content"><lines class="shine"></lines></div>
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title"><lines class="shine"></lines></div>
                                <div className="address-card__row-content"><lines class="shine"></lines></div>
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title"><lines class="shine"></lines></div>
                                <div className="address-card__row-content"><lines class="shine"></lines></div>
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title"><lines class="shine"></lines></div>
                                <div className="address-card__row-content"><lines class="shine"></lines></div>
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title"><lines class="shine"></lines></div>
                                <div className="address-card__row-content"><lines class="shine"></lines></div>
                            </div>
                            {/* <div className="address-card__footer">
                                <btnshimmer class="shine"></btnshimmer>
                            </div> */}

                        </div>
                        <div id='contentShimmerAccount' style={{ display: 'none' }}>
                            {this.state.data.map((value) => {
                                return (<InfoAccountCard data={value} load_dataAkun={this.loaddataAkun} />)
                            })
                            }
                        </div>
                    </div>
                </div>

                <div className="dashboard__address card address-card address-card--featured">
                    {address.default && <div className="address-card__badge">Informasi Perusahaan</div>}
                    <div className="address-card__body" >
                        <div id="shimmerCompany" style={{ display: 'block' }}>
                            {/* <div className="product-card__buttons" style={{ marginTop: '0px' }}>
                                <btnshimmer-small class="shine"></btnshimmer-small>
                            </div> */}
                            <div className="address-card__name mt-3"> <lines class="shine"></lines></div>
                            <div className="address-card__row">
                                <div className="address-card__row-title"><lines class="shine"></lines></div>
                                <div className="address-card__row-content"><lines class="shine"></lines></div>
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title"><lines class="shine"></lines></div>
                                <div className="address-card__row-content"><lines class="shine"></lines></div>
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title"><lines class="shine"></lines></div>
                                <div className="address-card__row-content"><lines class="shine"></lines></div>
                            </div>

                        </div>
                        <div id='contentShimmerCompany' style={{ display: 'none' }}>
                            {this.state.data.map((value) => {
                                return (<InfoCompanyCard data={value} />)
                            })
                            }
                        </div>
                    </div>
                </div>

                <div className="dashboard__orders card">
                    <div className="card-header">
                        <div className="row" style={{ marginBottom: '10px' }}>
                            <div className="col-md-9" >
                                <h5>Daftar Alamat</h5>
                            </div>
                            <div className="col-md-3 mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0" >
                                <div className="btn btn-primary btn-sm" style={{ float: 'right', width: '100%' }} onClick={this.toggleModalTambahAlamat}>  <span style={{ paddingRight: '5px' }}><i class="fas fa-plus"></i></span>Tambah Alamat</div>
                            </div>
                        </div>
                    </div>


                    {/* <div className="card-divider" /> */}
                    <div className="card-table">
                        <div className="table-responsive-sm">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Alamat</th>
                                        <th style={{ textAlign: 'center' }}>Pengiriman</th>
                                        <th style={{ textAlign: 'center' }}>Penagihan</th>
                                        <th style={{ textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <div id="shimmerTransaction" style={{ display: 'contents' }}>
                                        <tr>
                                            <td><lines class="shine"></lines></td>
                                            <td><lines class="shine"></lines></td>
                                            <td><lines class="shine"></lines></td>
                                            <td><lines class="shine"></lines></td>
                                        </tr>
                                        <tr>
                                            <td><lines class="shine"></lines></td>
                                            <td><lines class="shine"></lines></td>
                                            <td><lines class="shine"></lines></td>
                                            <td><lines class="shine"></lines></td>
                                        </tr>
                                        <tr>
                                            <td><lines class="shine"></lines></td>
                                            <td><lines class="shine"></lines></td>
                                            <td><lines class="shine"></lines></td>
                                            <td><lines class="shine"></lines></td>
                                        </tr>
                                    </div>

                                    <div id="contentShimmerTransaction" style={{ display: 'none' }}>
                                        {this.state.list_address.map((value, index) => {
                                            return (<TransactionHistory data={value} index={index} setAlamat={this.toggleModalSetALamat} hapusAlamat={this.toggleCloseConfirmation} editAlamat={this.toggleModalEditAlamat} />)
                                        })
                                        }
                                    </div>

                                    <tr>
                                        <td id='alertempty' style={{ display: 'none' }} colspan="4"><center>- Tidak Ditemukan Data -</center></td>
                                    </tr>

                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>

                <Modal isOpen={this.state.modalSetAlamat} centered size="sm" backdrop="static" >
                    <ModalHeader className="modalHeaderCustom" toggle={this.toggleModalSetALamat}>Set Alamat</ModalHeader>
                    <div className="card-body">
                        <center>Tetapkan alamat sebagai : </center>
                        <button type="submit" style={{ width: '100%', height: '100%' }} className="btn btn-primary mt-4" onClick={() => this.setAlamat('pengiriman')}>
                            <i class="fas fa-shipping-fast"></i> <span style={{ display: 'block' }}>Alamat Pengiriman Utama</span>
                        </button>
                        {/* <button type="submit" style={{ width: '100%', height: '100%' }} className="btn btn-primary mt-4" onClick={() => this.setAlamat('penagihan')}>
                            <i class="fas fa-receipt"></i> <span style={{ display: 'block' }}>Alamat Penagihan </span>
                        </button>
                        <button type="submit" style={{ width: '100%', height: '100%' }} className="btn btn-primary mt-4" onClick={() => this.setAlamat('pengiriman_penagihan')}>
                            <span style={{ display: 'block' }}>Alamat Pengiriman dan Penagihan </span>
                        </button> */}
                    </div>
                </Modal>

                <Modal isOpen={this.state.modalEditAlamat} centered size="md" backdrop="static" >
                    <ModalHeader className="modalHeaderCustom" toggle={this.toggleModalEditAlamat}>Edit Alamat </ModalHeader>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12 ">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="alamat-provinsi">Alamat </label>
                                        <InputGroup>
                                            <Input
                                                id="alamat-provinsi"
                                                type="textarea"
                                                spellCheck="false"
                                                autoComplete="off"
                                                className="form-control"
                                                maxLength={100}
                                                // invalid={this.state.empty_hp}
                                                onChange={event => this.Alamat_validation(event)}
                                                value={this.state.inputAlamat}
                                            />
                                            {/* <FormFeedback>{this.state.KetTextHP}</FormFeedback> */}
                                        </InputGroup>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="alamat-provinsi">Provinsi</label>
                                        <InputGroup>
                                            <Input
                                                id="alamat-provinsi"
                                                type="select"
                                                spellCheck="false"
                                                autoComplete="off"
                                                className="form-control"
                                                invalid={this.state.empty_provinsi}
                                                onChange={this.getListCity}
                                                value={this.state.inputProvinsi}
                                            >
                                                <option value="" disabled selected hidden></option>
                                                {this.state.listProvince.map(option => (
                                                    <option key={option.value} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </Input>
                                            <FormFeedback>{this.state.KetTextProvinsi}</FormFeedback>
                                        </InputGroup>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="alamat-kota">Kabupaten / Kota</label>
                                        <InputGroup>
                                            <Input
                                                id="alamat-kota"
                                                type="select"
                                                spellCheck="false"
                                                autoComplete="off"
                                                className="form-control"
                                                invalid={this.state.empty_kota}
                                                onChange={this.getSelectCity}
                                                value={this.state.inputKota}
                                            >
                                                <option value="" disabled selected hidden></option>
                                                {this.state.listCityfilter.map(option => (
                                                    <option key={option.value} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </Input>
                                            <FormFeedback>{this.state.KetTextKota}</FormFeedback>
                                        </InputGroup>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="alamat-kecamatan">Kecamatan</label>
                                        <InputGroup>
                                            <Input
                                                id="alamat-kecamatan"
                                                type="select"
                                                spellCheck="false"
                                                autoComplete="off"
                                                className="form-control"
                                                invalid={this.state.empty_kecamatan}
                                                onChange={this.getSelectKecamatan}
                                                value={this.state.inputKecamatan}
                                            >
                                                <option value="" disabled selected hidden></option>
                                                {this.state.listKecamatan.map(option => (
                                                    <option key={option.value} value={option.id}>
                                                        {option.nama}
                                                    </option>
                                                ))}
                                            </Input>
                                            <FormFeedback>{this.state.KetTextKecamatan}</FormFeedback>
                                        </InputGroup>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="alamat-kelurahan">Kelurahan</label>
                                        <InputGroup>
                                            <Input
                                                id="alamat-kelurahan"
                                                type="select"
                                                spellCheck="false"
                                                autoComplete="off"
                                                className="form-control"
                                                invalid={this.state.empty_kelurahan}
                                                onChange={this.getSelectKelurahan}
                                                value={this.state.inputKelurahan}
                                            >
                                                <option value="" disabled selected hidden></option>
                                                {this.state.listKelurahan.map(option => (
                                                    <option key={option.value} value={option.id}>
                                                        {option.nama}
                                                    </option>
                                                ))}
                                            </Input>
                                            <FormFeedback>{this.state.KetTextKelurahan}</FormFeedback>
                                        </InputGroup>
                                    </div>

                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <div className="form-group">
                                                <label htmlFor="perusahaan-pos">Kode Pos</label>
                                                <InputGroup>
                                                    <Input
                                                        id="perusahaan-pos"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_kodepos}
                                                        maxLength="5"
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.Numeric_validation(event, 'kodepos')}
                                                        value={this.state.inputKodePOS}
                                                    />
                                                    <FormFeedback>{this.state.KetTextKodePos}</FormFeedback>
                                                </InputGroup>
                                            </div>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <div className="form-group">
                                                <label htmlFor="perusahaan-telp">Nomor Telepon</label>
                                                <InputGroup>
                                                    <Input
                                                        id="perusahaan-telp"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        maxLength="17"
                                                        invalid={this.state.empty_notelp}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.Numeric_validation(event, 'notelp')}
                                                        value={this.state.inputNoTelp}
                                                    />
                                                    <FormFeedback>{this.state.KetTextNoTelp}</FormFeedback>
                                                </InputGroup>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </form>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 d-flex">
                                <button id="btnRegister" type="submit" onClick={this.tambahAlamat} block className="btn btn-primary mt-12 mt-md-3 mt-lg-4">
                                    Simpan
                            </button>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Dialog
                    open={this.state.openConfirmationSave}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Konfirmasi</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Apakah Anda yakin akan {this.state.labelModalEditTambah} ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.tambahAlamat_submit}>
                            Ya
                        </Button>
                        <Button color="light" onClick={this.toggleBatalSave}>
                            Batal
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.openConfirmationDelete}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Konfirmasi</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Apakah Anda yakin akan menghapus alamat yang Anda pilih ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.deleteAlamat(this.state.selected_delete)}>
                            Ya
                        </Button>
                        <Button color="light" onClick={this.toggleBatalDelete}>
                            Batal
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    maxWidth="xs"
                    open={this.state.openConfirmationDeleteFalse}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Hapus Alamat</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Tidak dapat menghapus alamat. Saat ini alamat ditetapkan sebagai alamat {' '} <span><strong>{this.state.alert_delete}</strong></span>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.toggleCloseConfirmationDeleteFalse}>
                            Mengerti
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    maxWidth="xs"
                    open={this.state.openConfirmationAddFalse}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Tambah Alamat</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Tidak dapat menambah alamat. Jumlah alamat telah mencapai batas maksimal (3)
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.toggleCloseConfirmationAddFalse}>
                            Mengerti
                        </Button>
                    </DialogActions>
                </Dialog>

                <DialogCatch isOpen={this.state.displaycatch} />

                <Modal isOpen={this.state.modalTambahAlamat} centered size="md" backdrop="static" >
                    <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleModalTambahAlamat}>Tambah Alamat </ModalHeader>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12 ">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="alamat">Alamat </label>
                                        <InputGroup>
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
                                        </InputGroup>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="alamat-provinsi">Provinsi</label>
                                        <InputGroup>
                                            <Input
                                                id="alamat-provinsi"
                                                type="select"
                                                spellCheck="false"
                                                autoComplete="off"
                                                className="form-control"
                                                invalid={this.state.empty_provinsi}
                                                onChange={this.getListCity}
                                                value={this.state.inputProvinsi}
                                            >
                                                <option value="" disabled selected hidden></option>
                                                {this.state.listProvince.map(option => (
                                                    <option key={option.value} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </Input>
                                            <FormFeedback>{this.state.KetTextProvinsi}</FormFeedback>
                                        </InputGroup>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="alamat-kota">Kabupaten / Kota</label>
                                        <InputGroup>
                                            <Input
                                                id="alamat-kota"
                                                type="select"
                                                spellCheck="false"
                                                autoComplete="off"
                                                className="form-control"
                                                invalid={this.state.empty_kota}
                                                onChange={this.getSelectCity}
                                                disabled={this.state.disable_kota}
                                                value={this.state.inputKota}
                                            >
                                                <option value="" disabled selected hidden></option>
                                                {this.state.listCityfilter.map(option => (
                                                    <option key={option.value} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </Input>
                                            <FormFeedback>{this.state.KetTextKota}</FormFeedback>
                                        </InputGroup>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="alamat-kecamatan">Kecamatan</label>
                                        <InputGroup>
                                            <Input
                                                id="alamat-kecamatan"
                                                type="select"
                                                spellCheck="false"
                                                autoComplete="off"
                                                className="form-control"
                                                invalid={this.state.empty_kecamatan}
                                                onChange={this.getSelectKecamatan}
                                                disabled={this.state.disable_kecamatan}
                                                value={this.state.inputKecamatan}
                                            >
                                                <option value="" disabled selected hidden>{this.state.disable_kecamatan_ket}</option>
                                                {this.state.listKecamatan.map(option => (
                                                    <option key={option.value} value={option.id}>
                                                        {option.nama}
                                                    </option>
                                                ))}
                                            </Input>
                                            <FormFeedback>{this.state.KetTextKecamatan}</FormFeedback>
                                        </InputGroup>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="alamat-kelurahan">Kelurahan</label>
                                        <InputGroup>
                                            <Input
                                                id="alamat-kelurahan"
                                                type="select"
                                                spellCheck="false"
                                                autoComplete="off"
                                                className="form-control"
                                                invalid={this.state.empty_kelurahan}
                                                onChange={this.getSelectKelurahan}
                                                disabled={this.state.disable_kelurahan}
                                                value={this.state.inputKelurahan}
                                            >
                                                <option value="" disabled selected hidden>{this.state.disable_kelurahan_ket}</option>
                                                {this.state.listKelurahan.map(option => (
                                                    <option key={option.value} value={option.id}>
                                                        {option.nama}
                                                    </option>
                                                ))}
                                            </Input>
                                            <FormFeedback>{this.state.KetTextKelurahan}</FormFeedback>
                                        </InputGroup>
                                    </div>

                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <div className="form-group">
                                                <label htmlFor="alamat-pos">Kode Pos</label>
                                                <InputGroup>
                                                    <Input
                                                        id="alamat-pos"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_kodepos}
                                                        maxLength="5"
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.Numeric_validation(event, 'kodepos')}
                                                        value={this.state.inputKodePOS}
                                                    />
                                                    <FormFeedback>{this.state.KetTextKodePos}</FormFeedback>
                                                </InputGroup>
                                            </div>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <div className="form-group">
                                                <label htmlFor="alamat-telp">Nomor Telepon</label>
                                                <InputGroup>
                                                    <Input
                                                        id="alamat-telp"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        maxLength="17"
                                                        invalid={this.state.empty_notelp}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.Numeric_validation(event, 'notelp')}
                                                        value={this.state.inputNoTelp}
                                                    />
                                                    <FormFeedback>{this.state.KetTextNoTelp}</FormFeedback>
                                                </InputGroup>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </form>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 d-flex">
                                <button id="btnRegister" type="submit" onClick={this.tambahAlamat} block className="btn btn-primary mt-12 mt-md-3 mt-lg-4">
                                    Tambah
                            </button>
                            </div>
                        </div>
                    </div>
                </Modal>

            </div >
        )
    }
}

export default AccountPageDashboard;
