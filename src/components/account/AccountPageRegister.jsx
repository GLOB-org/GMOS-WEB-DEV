// react
import React, { Component } from 'react';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import { storage } from "../firebase";
import { Link } from 'react-router-dom';

// third-party
import { Helmet } from 'react-helmet-async';
import { Button, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalBody, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// application
import PageHeader from '../shared/PageHeader';
import { Check9x7Svg } from '../../svg';
import Toast from 'light-toast';
import InputMask from 'react-input-mask';

// data stubs
import theme from '../../data/theme';

function buildFileSelector() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    return fileSelector;
}

export default class AccountPageRegister extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listProvince: [],
            listCity: [],
            listCityfilter: [],
            listKecamatan: [],
            listKelurahan: [],
            listPenjual: [],
            listPenjuallength: '',
            data_username: [],
            selectedPenjual: [],
            listTipeBisnis: [],
            openListPenjual: false, openConfirmationUpload: false, openInfoBerkas: false,
            inputTipeRegister: '', empty_tiperegister: false,
            inputNamaPerusahaan: '', empty_namaperusahaan: false, KetTextNamaPerusahaan: '',
            inputTipeBisnis: '', empty_tipebisnis: false,
            inputTipeBisnis_label: '',
            inputNomorNPWP: '', empty_npwp: false, KetTextNPWP: '',
            inputNomorSIUP: '', empty_siup: false, KetTextSIUP: '',
            inputAlamat: '', empty_alamat: false, KetTextAlamat: '',
            inputProvinsi: '', empty_provinsi: false,
            inputKota: '', empty_kota: false,
            inputKecamatan: '', empty_kecamatan: false, KetTextKecamatan: '', disable_kecamatan_ket: '',
            inputKelurahan: '', empty_kelurahan: false, KetTextKelurahan: '', disable_kelurahan_ket: '',
            inputKodePOS: '', empty_kodepos: false, KetTextKodePos: '',
            inputEmail: '', empty_email: false, KetTextEmail: '',
            inputNoTelp: '', empty_notelp: false, KetTextNoTelp: '',
            inputCheckPPN: '',
            inputNamaLengkap: '', empty_namalengkap: false, KetTextNamaLengkap: '',
            inputNoKTP: '', empty_ktp: false, KetTextKTP: '',
            inputEmailAkun: '', empty_emailakun: false, KetEmailAkun: '',
            inputNoHP: '', empty_nohp: false, KetNoHP: '',
            inputUsername: '', empty_username: false, KetTextUsername: '',
            inputPassword: '', empty_password: false, KetTextPassword: '',
            inputRepassword: '', empty_repassword: false, KetTextRePassword: '',
            icon_pass: 'fa fa-eye-slash',
            icon_repass: 'fa fa-eye-slash',
            inputUrl: '',
            selectedFile: '',
            inputStatus: 'I', inputRole: 'admin',
            isSuksesRegister: false,
            display_alert: 'none', display_ppn_seller: 'none',
            file_upload: '',
            status_upload: ''
        };
        this.handleTempDocument = this.handleTempDocument.bind(this);
    }

    clearState = () => {
        // this.setState({
        //     openListPenjual: false,
        //     inputTipeRegister: '',
        //     inputNamaPerusahaan: '', empty_namaperusahaan: false, KetTextNamaPerusahaan: '',
        //     inputTipeBisnis: '',
        //     inputNomorNPWP: '', empty_npwp: false, KetTextNPWP: '',
        //     inputNomorSIUP: '', empty_siup: false, KetTextSIUP: '',
        //     inputAlamat: '', empty_alamat: false, KetTextAlamat: '',
        //     inputProvinsi: '',
        //     inputKota: '',
        //     inputKecamatan: '', empty_kecamatan: false, KetTextKecamatan: '',
        //     inputKelurahan: '', empty_kelurahan: false, KetTextKelurahan: '',
        //     inputKodePOS: '', empty_kodepos: false, KetTextKodePos: '',
        //     inputEmail: '', empty_email: false, KetTextEmail: '',
        //     inputNoTelp: '', empty_notelp: false, KetTextNoTelp: '',
        //     inputNamaLengkap: '', emptynamalengkap: false, KetTextNamaLengkap: '',
        //     inputNoKTP: '', empty_ktp: false, KetTextKTP: '',
        //     inputEmailAkun: '', empty_emailakun: false, KetEmailAkun: '',
        //     inputNoHP: '', empty_nohp: false, KetNoHP: '',
        //     inputUsername: '', empty_username: false, KetTextUsername: '',
        //     inputPassword: '', empty_password: false, KetTextPassword: '',
        //     inputRepassword: '', empty_repassword: false, KetTextRePassword: '',
        //     icon_pass: 'fa fa-eye-slash',
        //     icon_repass: 'fa fa-eye-slash',
        //     inputUrl: '',
        //     selectedFile: '',
        // });
        // document.getElementById('registrasi-tipe').selectedIndex = "0";
        // document.getElementById("perusahaan-tipe").selectedIndex = "0";
        // document.getElementById("perusahaan-provinsi").selectedIndex = "0";
        // document.getElementById("perusahaan-kota").selectedIndex = "0";
        // document.getElementById("labelpilihfile").style.display = 'none';
        // document.getElementById("account-repassword").value = '';

        // this.forceUpdate();
        window.location.reload()
    }

    checkPPN = () => {
        if (this.state.inputTipeRegister == 'S') {
            if (document.getElementById("checkbox-ppn").checked == true) {
                this.setState({ inputCheckPPN: '10' });
            }
            else {
                this.setState({ inputCheckPPN: '0' });
            }
        }
    }

    controlListPenjual = () => {
        this.setState({ openListPenjual: !this.state.openListPenjual });
    }

    getListCity = (event) => {
        let get_idprovinsi = event.target.value

        let get_daftarkota = this.state.listCity.filter(input_provinsi => {
            return input_provinsi.province_id === get_idprovinsi;
        });

        // let daftarKota = encrypt("select id, province_id, name from gcm_location_city glc where province_id = '" + get_idprovinsi + "' order by name");

        // Axios.post(url.select, {
        //     query: daftarKota
        // }).then(data => {
        this.setState({
            listCityfilter: get_daftarkota,
            inputProvinsi: get_idprovinsi,
            inputKota: '',
            inputKecamatan: '',
            inputKelurahan: '',
            empty_provinsi: false
        });

        if (this.state.inputProvinsi != get_idprovinsi) {
            this.setState({
                listKecamatan: [],
                listKelurahan: []
            });
        }

        this.forceUpdate()
    }

    // getSelectCity = (event) => {
    //     this.setState({
    //         inputKota: event.target.value
    //     });
    // }

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
                disable_kecamatan_ket: ''
            });
        }).catch(err => {
            // this.setState({
            //     displaycatch: true,
            // });
            // console.log('error' + err);
            // console.log(err);
        })

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

    getSelectKelurahan = (event) => {
        this.setState({
            inputKelurahan: event.target.value,
            empty_kelurahan: false,
            KetTextKelurahan: ''
        });
        this.forceUpdate()
    }

    getSelectTipeBisnis = (event) => {
        var get_id = event.target.value

        let check_tipebisnis = this.state.listTipeBisnis.filter(input => {
            return input.id == get_id;
        });

        this.setState({
            inputTipeBisnis: event.target.value,
            inputTipeBisnis_label: check_tipebisnis[0].nama,
            empty_tipebisnis: false
        });
    }

    getSelectTipeRegistrasi = (event) => {
        this.setState({
            inputTipeRegister: event.target.value,
            empty_tiperegister: false
        });

        if (event.target.value == 'B') {
            this.setState({
                display_ppn_seller: 'none'
            });
        }
        else if (event.target.value == 'S') {
            this.setState({
                display_ppn_seller: 'block'
            });
        }

    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }

    fungsiPendaftaran = () => {

        // Toast.loading('loading . . .', () => {
        // });

        if (this.state.inputTipeRegister == 'S') {
            var seller_status = 'I'
            var sa_role = 'admin'
            var sa_divisi = this.state.inputTipeBisnis

            var registrasi_perusahaan = "with new_insert1 as (insert into gcm_master_company " +
                "(nama_perusahaan, no_npwp, no_siup, email, no_telp, tipe_bisnis, dokumen_pendukung, " +
                "listing_id, type, seller_status, blacklist_by, notes_blacklist, payment_id, ppn_seller) " +
                "values( " +
                "'" + this.state.inputNamaPerusahaan + "'," +
                "'" + this.state.inputNomorNPWP + "'," +
                "'" + this.state.inputNomorSIUP + "'," +
                "'" + this.state.inputEmail + "'," +
                "'" + this.state.inputNoTelp + "'," +
                "'" + this.state.inputTipeBisnis + "'," +
                "'" + this.state.inputUrl + "'," +
                "0, " +
                "'" + this.state.inputTipeRegister + "','I'," +
                "null,'', null, " + this.state.inputCheckPPN + ") RETURNING id as id_company ), "
        }
        else {
            var seller_status = null
            var sa_role = null
            var sa_divisi = null

            var registrasi_perusahaan = "with new_insert1 as (insert into gcm_master_company " +
                "(nama_perusahaan, no_npwp, no_siup, email, no_telp, tipe_bisnis, dokumen_pendukung, " +
                "listing_id, type, seller_status, blacklist_by, notes_blacklist, payment_id) " +
                "values( " +
                "'" + this.state.inputNamaPerusahaan + "'," +
                "'" + this.state.inputNomorNPWP + "'," +
                "'" + this.state.inputNomorSIUP + "'," +
                "'" + this.state.inputEmail + "'," +
                "'" + this.state.inputNoTelp + "'," +
                "'" + this.state.inputTipeBisnis + "'," +
                "'" + this.state.inputUrl + "'," +
                "0, " +
                "'" + this.state.inputTipeRegister + "'," +
                + seller_status + "," +
                "null,'', null ) RETURNING id as id_company ), "

        }

        // var registrasi_perusahaan = "with new_insert1 as (insert into gcm_master_company " +
        //     "(nama_perusahaan, no_npwp, no_siup, email, no_telp, tipe_bisnis, dokumen_pendukung, " +
        //     "listing_id, type, seller_status, blacklist_by, notes_blacklist, payment_id) " +
        //     "values( " +
        //     "'" + this.state.inputNamaPerusahaan + "'," +
        //     "'" + this.state.inputNomorNPWP + "'," +
        //     "'" + this.state.inputNomorSIUP + "'," +
        //     "'" + this.state.inputEmail + "'," +
        //     "'" + this.state.inputNoTelp + "'," +
        //     "'" + this.state.inputTipeBisnis + "'," +
        //     "'" + this.state.inputUrl + "'," +
        //     "0, " +
        //     "'" + this.state.inputTipeRegister + "'," +
        //     + seller_status + "," +
        //     "null," +
        //     "'', null) RETURNING id as id_company ), "

        let alamat_perusahaan = "new_insert2 as (insert into gcm_master_alamat (kelurahan, kecamatan, kota, provinsi, " +
            "kodepos, no_telp, shipto_active, billto_active, company_id, alamat, flag_active) " +
            "values( " +
            "'" + this.state.inputKelurahan + "'," +
            "'" + this.state.inputKecamatan + "'," +
            "'" + this.state.inputKota + "'," +
            "'" + this.state.inputProvinsi + "'," +
            "'" + this.state.inputKodePOS + "'," +
            "'" + this.state.inputNoTelp + "'," +
            "'Y','Y', (select id_company from new_insert1)," +
            "'" + this.state.inputAlamat + "'," +
            "'A') returning id ) "

        // let listing_alamat = "new_insert3 as (insert into gcm_listing_alamat (id_master_alamat, id_buyer, kode_alamat_customer)" +
        //     "values((select id from new_insert2), (select id_company from new_insert1), null)), "

        let registrasi_akun_buyer = "new_insert4 as (INSERT INTO gcm_master_user " +
            "(nama, no_ktp, email, no_hp, username, password, status, role, company_id, create_by, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, blacklist_by, id_blacklist, is_blacklist, notes_blacklist) " +
            "VALUES ('" + this.state.inputNamaLengkap + "'," +
            "'" + this.state.inputNoKTP + "'," +
            "'" + this.state.inputEmailAkun + "'," +
            "'" + this.state.inputNoHP + "'," +
            "'" + this.state.inputUsername + "'," +
            "'" + encrypt(this.state.inputPassword) + "'," +
            "'" + this.state.inputStatus + "'," +
            "'" + this.state.inputRole + "'," +
            "(select id_company from new_insert1)" +
            ",0,0, null, null, null, false, false,null,0,false,'')),"

        let registrasi_akun_seller = "INSERT INTO gcm_master_user " +
            "(nama, no_ktp, email, no_hp, username, password, status, role, company_id, create_by, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, blacklist_by, id_blacklist, is_blacklist, notes_blacklist) " +
            "VALUES ('" + this.state.inputNamaLengkap + "'," +
            "'" + this.state.inputNoKTP + "'," +
            "'" + this.state.inputEmailAkun + "'," +
            "'" + this.state.inputNoHP + "'," +
            "'" + this.state.inputUsername + "'," +
            "'" + encrypt(this.state.inputPassword) + "'," +
            "'" + this.state.inputStatus + "'," +
            "'" + this.state.inputRole + "'," +
            "(select id_company from new_insert1)" +
            ",0,0,now() ,'" + sa_role + "', " + sa_divisi + ", false, false,null,0,false,'')"

        if (this.state.inputTipeRegister == 'B') {
            let listing_company = "new_insert5 as (INSERT INTO gcm_company_listing (buyer_id, seller_id, buyer_number_mapping, seller_number_mapping, blacklist_by, notes_blacklist) VALUES "
            let listing_alamat = "INSERT INTO gcm_listing_alamat (id_master_alamat, id_buyer, id_seller, kode_alamat_customer) VALUES "
            let loop_company = ""
            let loop_alamat = ""
            let length = this.state.selectedPenjual.length;
            for (var i = 0; i < length; i++) {
                loop_company = loop_company + "((select id_company from new_insert1) ," + this.state.selectedPenjual[i].id + ", null, null, null, '')"
                if (i < length - 1) {
                    loop_company = loop_company.concat(",")
                }
                if (i == length - 1) {
                    loop_company = loop_company.concat(")")
                }

                loop_alamat = loop_alamat + "((select id from new_insert2), (select id_company from new_insert1)," + this.state.selectedPenjual[i].id + ", null )"
                if (i < length - 1) {
                    loop_alamat = loop_alamat.concat(",")
                }
            }
            var insert_company = encrypt(registrasi_perusahaan.concat(alamat_perusahaan).concat(',').concat(registrasi_akun_buyer).concat(listing_company.concat(loop_company).concat(listing_alamat).concat(loop_alamat)))
        }
        else {
            var insert_company = encrypt(registrasi_perusahaan.concat(alamat_perusahaan).concat(registrasi_akun_seller))
        }

        Axios.post(url.select, {
            query: insert_company
        }).then(data => {

            Toast.hide()
            this.setState({
                openListPenjual: false,
                isSuksesRegister: true
            });

            // if (this.state.inputTipeRegister == 'B') {

            //     let listing_company = "INSERT INTO gcm_company_listing (buyer_id, seller_id, buyer_number_mapping, seller_number_mapping, blacklist_by, notes_blacklist) VALUES "
            //     let loop = ""
            //     let length = this.state.selectedPenjual.length;
            //     for (var i = 0; i < length; i++) {

            //         loop = loop + "(" + data.data.data[0].id + "," + this.state.selectedPenjual[i].id + ", null, null, null, '')"
            //         if (i < length - 1) {
            //             loop = loop.concat(",")
            //         }
            //         else {
            //             loop = loop.concat(" returning buyer_id ;")
            //         }
            //     }

            //     var queryListingCompany = encrypt(listing_company.concat(loop))

            //     Axios.post(url.select, {
            //         query: queryListingCompany
            //     }).then(data => {
            //         let registrasi_akun = encrypt("INSERT INTO gcm_master_user " +
            //             "(nama, no_ktp, email, no_hp, username, password, status, role, company_id, create_by, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, blacklist_by, id_blacklist, is_blacklist, notes_blacklist) " +
            //             "VALUES ('" + this.state.inputNamaLengkap + "'," +
            //             "'" + this.state.inputNoKTP + "'," +
            //             "'" + this.state.inputEmailAkun + "'," +
            //             "'" + this.state.inputNoHP + "'," +
            //             "'" + this.state.inputUsername + "'," +
            //             "'" + encrypt(this.state.inputPassword) + "'," +
            //             "'" + this.state.inputStatus + "'," +
            //             "'" + this.state.inputRole + "'," +
            //             + data.data.data[0].buyer_id +
            //             ",0,0, null, null, null, false, true,null,0,false,'')")
            //         console.log(decrypt(registrasi_akun))

            //         // insert akun
            //         Axios.post(url.select, {
            //             query: registrasi_akun
            //         }).then(data => {
            //             this.alert_success()
            //         }).catch(err => {
            //             console.log(err);
            //         })
            //     }).catch(err => {
            //         console.log(err);
            //     })

            // }

            // else {
            //     let registrasi_akun = encrypt("INSERT INTO gcm_master_user " +
            //         "(nama, no_ktp, email, no_hp, username, password, status, role, company_id, create_by, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, blacklist_by, id_blacklist, is_blacklist, notes_blacklist) " +
            //         "VALUES ('" + this.state.inputNamaLengkap + "'," +
            //         "'" + this.state.inputNoKTP + "'," +
            //         "'" + this.state.inputEmailAkun + "'," +
            //         "'" + this.state.inputNoHP + "'," +
            //         "'" + this.state.inputUsername + "'," +
            //         "'" + encrypt(this.state.inputPassword) + "'," +
            //         "'" + this.state.inputStatus + "'," +
            //         "'" + this.state.inputRole + "'," +
            //         + data.data.data[0].id +
            //         ",0,0, null, null, null, false, true,null,0,false,'')")
            //     console.log(decrypt(registrasi_akun))
            //     Axios.post(url.select, {
            //         query: registrasi_akun
            //     }).then(data => {
            //         this.alert_success()
            //     }).catch(err => {
            //         console.log(err);
            //     })
            // }

        }).catch(err => {
            // console.log(err);
        })
    }

    handleDaftar = () => {

        if (this.state.inputTipeRegister == '' ||
            this.state.inputNamaPerusahaan == '' ||
            this.state.inputTipeBisnis == '' ||
            this.state.inputNomorNPWP == '' ||
            this.state.inputNomorSIUP == '' ||
            this.state.inputAlamat == '' ||
            this.state.inputProvinsi == '' ||
            this.state.inputKota == '' ||
            this.state.inputKecamatan == '' ||
            this.state.inputKelurahan == '' ||
            this.state.inputKodePOS == '' ||
            this.state.inputEmail == '' ||
            this.state.inputNoTelp == '' ||
            this.state.inputNamaLengkap == '' ||
            this.state.inputNoKTP == '' ||
            this.state.inputEmailAkun == '' ||
            this.state.inputNoHP == '' ||
            this.state.inputUsername == '' ||
            this.state.inputPassword == ''
        ) {

            Toast.info('Silakan isi data yang masih kosong !', 2500, () => {
            });

            if (this.state.inputTipeRegister == '') {
                this.setState({
                    empty_tiperegister: true
                })
            }
            if (this.state.inputNamaPerusahaan == '') {
                this.setState({
                    empty_namaperusahaan: true
                })
            }
            if (this.state.inputTipeBisnis == '') {
                this.setState({
                    empty_tipebisnis: true
                })
            }
            if (this.state.inputNomorNPWP == '') {
                this.setState({
                    empty_npwp: true
                })
            }
            if (this.state.inputNomorSIUP == '') {
                this.setState({
                    empty_siup: true
                })
            }
            if (this.state.inputAlamat == '') {
                this.setState({
                    empty_alamat: true
                })
            }
            if (this.state.inputProvinsi == '') {
                this.setState({
                    empty_provinsi: true
                })
            }
            if (this.state.inputKota == '') {
                this.setState({
                    empty_kota: true
                })
            }
            if (this.state.inputKecamatan == '') {
                this.setState({
                    empty_kecamatan: true
                })
            }
            if (this.state.inputKelurahan == '') {
                this.setState({
                    empty_kelurahan: true
                })
            }
            if (this.state.inputKodePOS == '') {
                this.setState({
                    empty_kodepos: true
                })
            }
            if (this.state.inputEmail == '') {
                this.setState({
                    empty_email: true
                })
            }
            if (this.state.inputNoTelp == '') {
                this.setState({
                    empty_notelp: true
                })
            }

            if (this.state.inputNamaLengkap == '') {
                this.setState({
                    empty_namalengkap: true
                })
            }
            if (this.state.inputNoKTP == '') {
                this.setState({
                    empty_ktp: true
                })
            }
            if (this.state.inputEmailAkun == '') {
                this.setState({
                    empty_emailakun: true
                })
            }
            if (this.state.inputNoHP == '') {
                this.setState({
                    empty_nohp: true
                })
            }
            if (this.state.inputUsername == '') {
                this.setState({
                    empty_username: true
                })
            }
            if (this.state.inputPassword == '') {
                this.setState({
                    empty_password: true
                })
            }
            if (document.getElementById("account-repassword").value == '') {
                this.setState({
                    empty_repassword: true
                })
            }
        }

        else if (this.state.inputUrl == '') {
            Toast.info('Silakan unggah kelengkapan berkas !', 2500, () => {
            });
        }

        else if (this.state.empty_tiperegister == true ||
            this.state.empty_namaperusahaan == true ||
            this.state.empty_tipebisnis == true ||
            this.state.empty_npwp == true ||
            this.state.empty_siup == true ||
            this.state.empty_alamat == true ||
            this.state.empty_provinsi == true ||
            this.state.empty_kota == true ||
            this.state.empty_kecamatan == true ||
            this.state.empty_kelurahan == true ||
            this.state.empty_kodepos == true ||
            this.state.empty_email == true ||
            this.state.empty_notelp == true ||
            this.state.empty_namalengkap == true ||
            this.state.empty_ktp == true ||
            this.state.empty_emailakun == true ||
            this.state.empty_nohp == true ||
            this.state.empty_username == true ||
            this.state.empty_password == true ||
            this.state.empty_repassword == true
        ) {
            Toast.info('Silakan isi data dengan benar !', 2500, () => {
            });
        }

        else {

            Toast.loading('loading . . .', () => {
            });

            if (this.state.inputTipeRegister == 'B') {
                var listPenjual = ''
                if (this.state.inputTipeBisnis != '1') {
                    listPenjual = encrypt(" select id, nama_perusahaan from gcm_master_company where type = 'S' and seller_status='A' and tipe_bisnis='" + this.state.inputTipeBisnis + "' order by nama_perusahaan");
                }
                else {
                    listPenjual = encrypt(" select id, nama_perusahaan from gcm_master_company where type = 'S' and seller_status='A' order by nama_perusahaan");
                }
                Axios.post(url.select, {
                    query: listPenjual
                }).then(data => {
                    this.setState({
                        listPenjual: data.data.data,
                        listPenjuallength: data.data.data.length
                    });
                    Toast.hide()
                    this.controlListPenjual()
                }).catch(err => {
                    // console.log('error');
                    // console.log(err);
                })
            }
            else {
                this.fungsiPendaftaran()
            }
        }
    }

    handleDaftarBuyerLanjutan = () => {
        this.fungsiPendaftaran()
    }

    fungsi = () => {
        console.log(this.state.selectedPenjual)
    }

    handleWhitespace = (event) => {
        if (event.which === 32) {
            event.preventDefault();
        }
    }

    handleUpload = () => {

        Toast.loading('loading . . .', () => {
        });
        const temp = this.state.inputUrl
        // const tempName = encrypt(temp.name)
        const tempName = temp.name
        const storageRef = storage.ref(`documents/` + tempName);
        const uploadTask = storageRef.put(temp)

        let x = this
        uploadTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
        }, (error) => {
            // Handle unsuccessful uploads
            Toast.fail('Gagal mengunggah berkas !', 2500, () => {
            });
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                x.setState({
                    inputUrl: downloadURL,
                    status_upload: 'done',
                    openConfirmationUpload: false
                })
                Toast.hide()
            });
        })
    }

    inputNamaPerusahaan = (event) => {
        this.setState({
            inputNamaPerusahaan: event.target.value,
            empty_namaperusahaan: false
        });
    }

    inputNPWP = (event) => {
        this.setState({
            inputNomorNPWP: event.target.value
        });

        const get_input = event.target.value

        if (get_input == "__.___.___._-___.___") {
            this.setState({ empty_npwp: false });
            this.setState({ KetTextNPWP: "" });
        }
        else if (get_input.includes("_")) {
            this.setState({ empty_npwp: true });
            this.setState({ KetTextNPWP: "Tidak valid" });
        }
        else {
            this.setState({ empty_npwp: false });
            this.setState({ KetTextNPWP: "" });
        }

    }

    inputSIUP = (event) => {
        this.setState({
            inputNomorSIUP: event.target.value,
            empty_siup: false
        });
    }

    inputAlamat = (event) => {
        this.setState({
            inputAlamat: event.target.value,
            empty_alamat: false
        });
    }

    inputKecamatan = (event) => {
        this.setState({
            inputKecamatan: event.target.value,
            empty_kecamatan: false
        });
    }

    inputKelurahan = (event) => {
        this.setState({
            inputKelurahan: event.target.value,
            empty_kelurahan: false
        });
    }

    inputNamaLkp = (event) => {
        if (event.target.value.match("^[a-zA-Z ]*$") !== null) {
            this.setState({
                inputNamaLengkap: event.target.value,
                empty_namalengkap: false
            });
        } else {
            return;
        }
    }

    Email_validation = async (event, get_email) => {
        //this.handleChange(event);
        var get_input = event.target.value;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (get_email == 'emailperusahaan') {
            this.setState({ inputEmail: get_input });
            if (get_input.match(mailformat) || get_input.length == 0) {
                this.setState({ empty_email: false });
                this.setState({ KetTextEmail: "" });
            }
            else {
                this.setState({ empty_email: true });
                this.setState({ KetTextEmail: "Tidak valid" });
            }
        }
        else if (get_email == 'emailakun') {
            this.setState({ inputEmailAkun: get_input });
            if (get_input.match(mailformat) || get_input.length == 0) {
                this.setState({ empty_emailakun: false });
                this.setState({ KetText: "" });
            }
            else {
                this.setState({ empty_emailakun: true });
                this.setState({ KetEmailAkun: "Tidak valid" });
            }
        }

    }

    KTP_validation = async (event) => {
        if (isNaN(Number(event.target.value))) {
            return;
        } else {
            this.setState({ inputNoKTP: event.target.value });
        }
        const get_input = event.target.value

        if (get_input.length < 16 && get_input.length > 0) {
            this.setState({ empty_ktp: true });
            this.setState({ KetTextKTP: "Tidak valid (" + get_input.length + "/16)" });
        }
        else if (get_input.length == 16 || get_input.length == 0) {
            this.setState({ empty_ktp: false });
            this.setState({ KetTextKTP: "" });
        }
    }

    alphabet_validation = (event) => {
        // let get_input = event.target.value
        // var key = event.keyCode;
        // return ((key >= 65 && key <= 90) || key == 8);

        // if(event.target.value.match("^[a-zA-Z ]*$") === null) {
        //     return;
        // } 
    }

    numeric_validation = (event, get_id) => {
        let get_input = event.target.value
        if (isNaN(Number(get_input))) {
            return;
        } else {
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
                this.setState({
                    inputNoTelp: event.target.value
                });

                if (get_input.length > 0) {
                    if (get_input.substring(0, 1) != '0') {
                        this.setState({
                            empty_notelp: true
                        });
                        this.setState({
                            KetTextNoTelp: "Tidak valid"
                        });
                    }

                    else {
                        this.setState({
                            empty_notelp: false
                        });
                        this.setState({
                            KetTextNoTelp: ""
                        });
                    }
                }
                else {
                    this.setState({
                        empty_notelp: false
                    });
                    this.setState({
                        KetTextNoTelp: ""
                    });
                }

            }
            else if (get_id == 'noktp') {
                this.setState({
                    inputNoKTP: event.target.value,
                    empty_ktp: false
                });
            }
            else if (get_id == 'nohp') {
                this.setState({
                    inputNoHP: event.target.value
                });

                if (get_input.length > 0) {
                    // get_input.substring(0,2) != '08' && get_input.length > 0 ) || 
                    if (get_input.substring(0, 1) != '0') {
                        this.setState({
                            empty_nohp: true
                        });
                        this.setState({
                            KetNoHP: "Tidak valid"
                        });
                    }

                    else if (get_input.substring(0, 1) == '0' && get_input.length < 10) {
                        this.setState({
                            empty_nohp: true,
                        });
                        this.setState({
                            KetNoHP: "Tidak valid",
                        });
                    }

                    else if ((get_input.substring(0, 1) == '0' && get_input.length >= 10)) {
                        this.setState({
                            empty_nohp: false
                        });
                        this.setState({
                            KetNoHP: ""
                        });
                    }
                }

                else {
                    this.setState({
                        empty_nohp: false
                    });
                    this.setState({
                        KetNoHP: ""
                    });
                }


            }
        }
    }

    pilihDistributor(id) {
        let id_get;
        id_get = this.state.listPenjual[id].id;
        var checkCB = 'n'
        if (document.getElementById(id).checked == true) {
            this.setState(prevState => ({
                selectedPenjual: [...prevState.selectedPenjual, { id: id_get }]
            }))
        }
        else {
            this.setState({
                selectedPenjual: this.state.selectedPenjual.filter((_, i) => i !== id)
            });
        }
        for (var i = 0; i < this.state.listPenjuallength; i++) {
            if (document.getElementById(i).checked == true) {
                checkCB = 'y';
                document.getElementById('lanjutdaftar').disabled = false
                break;
            }
        }
        if (checkCB == 'n') {
            document.getElementById('lanjutdaftar').disabled = true
        }
    }

    Password_validation = async (event) => {
        this.Repassword_validation(event);
        const get_input = event.target.value;
        var contain_LowerCase = 'n';
        var contain_UpperCase = 'n';
        var contain_Number = 'n';
        if (get_input.toUpperCase() != get_input) {
            contain_LowerCase = 'y';
        }

        if (get_input.toLowerCase() != get_input) {
            contain_UpperCase = 'y';
        }

        if (/\d/.test(get_input)) {
            contain_Number = 'y';
        }

        if ((contain_UpperCase == 'y' && contain_LowerCase == 'y' && contain_Number == 'y' && get_input.length >= 8) || get_input.length == 0) {
            this.setState({ empty_password: false });
            this.setState({ KetTextPassword: "" });
        }
        else if (contain_UpperCase == 'n' || contain_LowerCase == 'n' || contain_Number == 'n' || (get_input.length > 0 && get_input.length < 8)) {
            this.setState({ empty_password: true });
            this.setState({ KetTextPassword: "Minimal 8 karakter dan harus terdiri dari A-Z, a-z, dan 0-9" });
        }
    }

    Repassword_validation = async (event) => {
        this.handleChange(event);

        if (this.state.inputPassword != event.target.value &&
            document.getElementById("account-repassword").value != '') {
            this.setState({ empty_repassword: true });
            this.setState({ KetTextRePassword: 'Password tidak cocok' });
        }
        else if (this.state.inputRePassword == event.target.value ||
            this.state.inputPassword == event.target.value) {
            this.setState({
                empty_repassword: false
            });
            this.state.KetTextRePassword = ''
        }

        else if (event.target.value.length == 0) {
            this.setState({ empty_repassword: false });
            this.state.KetTextRePassword = ''
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
        this.forceUpdate()
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
        this.forceUpdate()
    }

    username_validation = async (event) => {
        const get_input = event.target.value
        this.setState({ inputUsername: event.target.value });

        if (get_input.length < 8 && get_input.length > 0) {
            this.setState({ empty_username: true });
            this.setState({ KetTextUsername: "Tidak valid (Minimal 8 karakter)" });
        }
        else if (get_input.length >= 8 || get_input.length == 0) {
            this.setState({ empty_username: false });
            this.setState({ KetTextUsername: "" });
            let check_username = this.state.data_username.filter(input_username => {
                return input_username.username === event.target.value;
            });
            if (check_username != '') {
                this.setState({ empty_username: true });
                this.setState({ KetTextUsername: "Username sudah digunakan" });
            }
            else {
                this.setState({ empty_username: false });
                this.setState({ KetTextUsername: "" });
            }
        }
    }

    handleTempDocument(e) {
        const media_file = e.target.files[0]
        const filename = media_file.name
        let last_dot = filename.lastIndexOf('.')
        let ext = filename.slice(last_dot + 1)

        if (ext == 'zip' || ext == 'rar') {
            this.setState({ inputUrl: e.target.files[0] })
            var name = document.getElementById('pilihfile');
            this.setState({
                file_upload: name.files.item(0).name,
                openConfirmationUpload: true,
                openInfoBerkas: false
            });
        }

        else {
            Toast.info('Silakan pilih berkas bertipe rar / zip !', 2500, () => {
            });
        }
        // alert(document.getElementById('pilihfile').files.item(0).type)
    }

    handleFileSelect = (e) => {
        e.preventDefault();
        this.fileSelector.click();
    }

    componentDidMount() {
        //get daftar provinsi & kota
        let daftarProvinsi = encrypt("select id, name from gcm_location_province order by name");
        let daftarKota = encrypt("select id, province_id, name from gcm_location_city glc order by name");

        Axios.post(url.select, {
            query: daftarProvinsi
        }).then(data => {
            this.setState({ listProvince: data.data.data });
        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })

        Axios.post(url.select, {
            query: daftarKota
        }).then(data => {
            this.setState({
                listCity: data.data.data,
                //listCityfilter: data.data.data
            });
        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })

        //get daftar username
        let query_username = encrypt("select username from gcm_master_user")

        Axios.post(url.select, {
            query: query_username
        }).then(data => {
            this.setState({ data_username: data.data.data });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })

        //get tipe bisnis
        let query_tipebisnis = encrypt("select id, nama from gcm_master_category where id != 5 order by id")

        Axios.post(url.select, {
            query: query_tipebisnis
        }).then(data => {
            this.setState({ listTipeBisnis: data.data.data });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })

        this.fileSelector = buildFileSelector();
    }

    render() {
        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Daftar', url: '' },
        ];

        {/* {this.state.listPenjual.map((item, index) => (
                                <div className="row" style={{ marginBottom: '10px' }}>
                                    <div className="col-md-1">
                                        <FormControlLabel
                                            control={
                                                <Checkbox id={index} style={{ color: '#8CC63E' }} onClick={() => this.pilihDistributor(index)} />
                                            }
                                        />
                                    </div>

                                    <div className="col-md-11" style={{ paddingTop: '9px' }} >
                                        <label style={{ fontSize: '15px', fontWeight: '600', position: 'absolute' }}>{item.nama_perusahaan}</label>
                                    </div>
                                </div>

                            ))} */}

        const itemsList = this.state.listPenjual.map((item, index) => {
            return (
                <label
                    key={item.id}
                    className={classNames('filter-list__item', {
                        'filter-list__item--disabled': item.disabled,
                    })}
                >
                    <span className="filter-list__input input-check">
                        <span className="input-check__body">
                            <input id={index} className="input-check__input" type="checkbox" defaultChecked={false} disabled={false} onClick={() => this.pilihDistributor(index)} />
                            <span className="input-check__box" />
                            <Check9x7Svg className="input-check__icon" />
                        </span>
                    </span>
                    <label className="filter-list__title">{item.nama_perusahaan}</label>
                </label>
            );
        });

        return (
            <React.Fragment>
                <Helmet>
                    <title>{`Pendaftaran — ${theme.name}`}</title>
                </Helmet>

                <PageHeader header="Pendaftaran Akun" breadcrumb={breadcrumb} />

                <div className="block">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 d-flex">
                                <div className="card flex-grow-1 mb-md-0">
                                    <div className="card-body">
                                        <h3 className="card-title">Data Perusahaan</h3>

                                        <div className="form-group">
                                            <label htmlFor="alamat-kota">Tipe Registrasi</label>
                                            <InputGroup>
                                                <Input
                                                    id="registrasi-tipe"
                                                    type="select"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    invalid={this.state.empty_tiperegister}
                                                    onChange={this.getSelectTipeRegistrasi}
                                                    value={this.state.inputTipeRegister}
                                                >
                                                    <option value="" disabled selected hidden></option>
                                                    <option value="S">Penjual</option>
                                                    <option value="B">Pembeli</option>
                                                </Input>
                                                <FormFeedback>{this.state.KetTextKota}</FormFeedback>
                                            </InputGroup>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="perusahaan-nama">Nama Perusahaan</label>
                                            <InputGroup>
                                                <Input
                                                    id="perusahaan-nama"
                                                    type="text"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    invalid={this.state.empty_namaperusahaan}
                                                    onChange={event => this.inputNamaPerusahaan(event)}
                                                    value={this.state.inputNamaPerusahaan}
                                                />
                                                <FormFeedback>{this.state.KetTextNamaPerusahaan}</FormFeedback>
                                            </InputGroup>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="perusahaan-tipe">Tipe Bisnis</label>
                                            <InputGroup>
                                                <Input
                                                    id="perusahaan-tipe"
                                                    type="select"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    invalid={this.state.empty_tipebisnis}
                                                    onChange={this.getSelectTipeBisnis}
                                                    value={this.state.inputTipeBisnis}
                                                >
                                                    <option value="" disabled selected hidden></option>
                                                    {this.state.listTipeBisnis.map(option => (
                                                        <option key={option.value} value={option.id} name={option.nama}>
                                                            {option.nama}
                                                        </option>
                                                    ))}
                                                </Input>
                                                <FormFeedback>{this.state.KetTextKota}</FormFeedback>
                                            </InputGroup>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group">
                                                    <label htmlFor="perusahaan-NPWP">Nomor NPWP</label>
                                                    <InputGroup>
                                                        <Input
                                                            spellCheck="false"
                                                            id="perusahaan-NPWP"
                                                            type="text"
                                                            className="form-control"
                                                            autoComplete="off"
                                                            invalid={this.state.empty_npwp}
                                                            onChange={event => this.inputNPWP(event)}
                                                            value={this.state.inputNomorNPWP}
                                                            mask="99.999.999.9-999.999"
                                                            maskplaceholder="_"
                                                            tag={InputMask}
                                                        />
                                                        <FormFeedback>{this.state.KetTextNPWP}</FormFeedback>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group">
                                                    <label htmlFor="perusahaan-SIUP">Nomor SIUP</label>
                                                    <InputGroup>
                                                        <Input
                                                            id="perusahaan-SIUP"
                                                            type="text"
                                                            className="form-control"
                                                            spellCheck="false"
                                                            autoComplete="off"
                                                            invalid={this.state.empty_siup}
                                                            onKeyPress={event => this.handleWhitespace(event)}
                                                            onChange={event => this.inputSIUP(event)}
                                                            value={this.state.inputNomorSIUP}
                                                        />
                                                        <FormFeedback>{this.state.KetTextSIUP}</FormFeedback>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="perusahaan-alamat">Alamat</label>
                                            <InputGroup>
                                                <Input
                                                    id="perusahaan-alamat"
                                                    type="text"
                                                    className="form-control"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    invalid={this.state.empty_alamat}
                                                    onChange={event => this.inputAlamat(event)}
                                                    value={this.state.inputAlamat}
                                                />
                                                <FormFeedback>{this.state.KetTextAlamat}</FormFeedback>
                                            </InputGroup>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group">
                                                    <label htmlFor="perusahaan-provinsi">Provinsi</label>
                                                    <InputGroup>
                                                        <Input
                                                            id="perusahaan-provinsi"
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
                                                        <FormFeedback>{this.state.KetTextKota}</FormFeedback>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
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
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 col-sm-4 col-xs-12">
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
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
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
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
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
                                                            onChange={event => this.numeric_validation(event, 'kodepos')}
                                                            value={this.state.inputKodePOS}
                                                        />
                                                        <FormFeedback>{this.state.KetTextKodePos}</FormFeedback>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group">
                                                    <label htmlFor="perusahaan-email">E-mail</label>
                                                    <InputGroup>
                                                        <Input
                                                            id="perusahaan-email"
                                                            name="inputEmail"
                                                            type="text"
                                                            spellCheck="false"
                                                            autoComplete="off"
                                                            className="form-control"
                                                            invalid={this.state.empty_email}
                                                            onKeyPress={event => this.handleWhitespace(event)}
                                                            onChange={event => this.Email_validation(event, 'emailperusahaan')}
                                                            value={this.state.inputEmail}
                                                        />
                                                        <FormFeedback>{this.state.KetTextEmail}</FormFeedback>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group">
                                                    <label htmlFor="perusahaan-telp">Nomor Telepon</label>
                                                    <InputGroup>
                                                        <Input
                                                            id="perusahaan-telp"
                                                            type="text"
                                                            spellCheck="false"
                                                            autoComplete="off"
                                                            className="form-control"
                                                            maxLength="14"
                                                            invalid={this.state.empty_notelp}
                                                            onKeyPress={event => this.handleWhitespace(event)}
                                                            onChange={event => this.numeric_validation(event, 'notelp')}
                                                            value={this.state.inputNoTelp}
                                                        />
                                                        <FormFeedback>{this.state.KetTextNoTelp}</FormFeedback>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="check-ppn-seller" className="row" style={{ display: this.state.display_ppn_seller }}>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <label
                                                    className={classNames('filter-list__item',
                                                        // {
                                                        //     'filter-list__item--disabled': item.disabled,
                                                        // }
                                                    )}
                                                >
                                                    <span className="filter-list__input input-check">
                                                        <span className="input-check__body">
                                                            <input id="checkbox-ppn" className="input-check__input" type="checkbox" onClick={() => this.checkPPN()} defaultChecked={false} disabled={false} />
                                                            <span className="input-check__box" />
                                                            <Check9x7Svg className="input-check__icon" />
                                                        </span>
                                                    </span>
                                                    <label className="filter-list__title" >Tetapkan PPN dalam transaksi</label>
                                                </label>
                                            </div>
                                        </div>

                                        {this.state.status_upload == '' ?
                                            (<div>
                                                <label style={{ fontSize: '13px', fontWeight: '500', color: 'red' }}>* Unggah kelengkapan berkas (bertipe rar/zip) </label><br />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={10}>
                                                        <label class="btn btn-primary btn-sm mt-1" onClick={() => this.setState({ openInfoBerkas: !this.state.openInfoBerkas })}>Pilih Berkas</label>
                                                        {/* <label for="pilihfile" class="btn btn-primary btn-sm mt-1" >Pilih Berkas</label>
                                                        <input type="file" id="pilihfile" accept=".zip, .rar" style={{ display: 'none' }} onChange={this.handleTempDocument}></input> */}
                                                    </Grid>
                                                </Grid>
                                            </div>) :
                                            (<div className="alert alert-success mt-3">
                                                <span style={{ color: '#3d464d', fontSize: '14px', fontWeight: '500' }}>
                                                    Berkas yang diunggah : {' '}<strong>{this.state.file_upload}</strong>
                                                </span>
                                            </div>)
                                        }

                                        {/* <div>
                                            <label style={{ fontSize: '13px', fontWeight: '400' }}>* Unggah kelengkapan berkas (berekstensi rar/zip) </label><br />
                                            <Grid container spacing={5}>
                                                <Grid item xs={10}>
                                                    <label for="pilihfile" class="btn btn-primary ">Pilih Berkas</label>
                                                    <input type="file" id="pilihfile" accept=".zip, .rar" style={{ display: 'none' }} onChange={this.handleTempDocument}></input>
                                                </Grid>
                                            </Grid>
                                        </div> */}

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row" style={{ marginBottom: "30px" }}>

                        </div>

                        <div className="row">
                            <div className="col-md-6 d-flex">
                                <div className="card flex-grow-1 mb-md-0">
                                    <div className="card-body" >
                                        <h3 className="card-title">Data Pengguna</h3>
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="pengguna-nama">Nama Lengkap</label>
                                                <InputGroup>
                                                    <Input
                                                        id="pengguna-nama"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_namalengkap}
                                                        // onKeyPress={event => this.alphabet_validation(event)}
                                                        onChange={event => this.inputNamaLkp(event)}
                                                        value={this.state.inputNamaLengkap}
                                                    />
                                                    <FormFeedback>{this.state.KetTextNamaLengkap}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="pengguna-KTP">Nomor KTP</label>
                                                <InputGroup>
                                                    <Input
                                                        id="pengguna-KTP"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        maxLength={16}
                                                        invalid={this.state.empty_ktp}
                                                        onChange={event => this.KTP_validation(event)}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        value={this.state.inputNoKTP}
                                                    />
                                                    <FormFeedback>{this.state.KetTextKTP}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="pengguna-email">E-mail </label>
                                                <InputGroup>
                                                    <Input
                                                        id="pengguna-email"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        name="inputEmail"
                                                        invalid={this.state.empty_emailakun}
                                                        onChange={event => this.Email_validation(event, 'emailakun')}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        value={this.state.inputEmailAkun}
                                                        name="inputEmail"
                                                    />
                                                    <FormFeedback>{this.state.KetEmailAkun}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="pengguna-hp">Nomor Handphone</label>
                                                <InputGroup>
                                                    <Input
                                                        id="pengguna-hp"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        maxLength="14"
                                                        invalid={this.state.empty_nohp}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.numeric_validation(event, 'nohp')}
                                                        value={this.state.inputNoHP}
                                                    />
                                                    <FormFeedback>{this.state.KetNoHP}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex mt-4 mt-md-0">
                                <div className="card flex-grow-1 mb-0">
                                    <div className="card-body">
                                        <h3 className="card-title">Data Akun</h3>
                                        <form>

                                            <div className="form-group">
                                                <label htmlFor="account-username">Username </label>
                                                <InputGroup>
                                                    <Input
                                                        id="account-username"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_username}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.username_validation(event)}
                                                        value={this.state.inputUsername}
                                                    />
                                                    <FormFeedback>{this.state.KetTextUsername}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="account-password">Password </label>
                                                <InputGroup>
                                                    <Input
                                                        id="account-password"
                                                        name="inputPassword"
                                                        type="password"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_password}
                                                        value={this.state.inputPassword}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.Password_validation(event)}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText style={{ cursor: 'pointer' }} onClick={this.Password_appear}><i class={this.state.icon_pass} aria-hidden="true" ></i></InputGroupText>
                                                    </InputGroupAddon>
                                                    <FormFeedback>{this.state.KetTextPassword}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="account-repassword">Konfirmasi Password</label>
                                                <InputGroup>
                                                    <Input
                                                        id="account-repassword"
                                                        name="inputRePassword"
                                                        type="password"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_repassword}
                                                        value={this.state.inputRePassword}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.Repassword_validation(event)}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText style={{ cursor: 'pointer' }} onClick={this.RePassword_appear}><i class={this.state.icon_repass} aria-hidden="true" ></i></InputGroupText>
                                                    </InputGroupAddon>
                                                    <FormFeedback>{this.state.KetTextRePassword}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ display: this.state.display_alert }}>
                            <div className="col-md-12 d-flex">
                                <div className="alert alert-danger mt-3" style={{ width: '100%' }}>
                                    <center>Silakan isi data yang masih kosong !</center>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 d-flex" >
                                <button id="btnRegister" type="submit" onClick={this.handleDaftar} block className="btn btn-primary mt-md-2 mt-lg-3">
                                    Daftar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Modal pilih distributor */}
                    <Modal isOpen={this.state.openListPenjual} size="md" centered>
                        <ModalHeader className="modalHeaderCustom" toggle={this.controlListPenjual.bind(this)}>Daftar Distributor</ModalHeader>
                        <ModalBody>
                            {itemsList.length > 0 ?
                                (<label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '15px' }}>Pilih distributor di bawah ini :</label>
                                ) :
                                (null)
                            }

                            <div className="filter-list">
                                <div className="filter-list__list">
                                    {itemsList.length > 0 ?
                                        (itemsList
                                        ) :
                                        (<label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '15px' }}>
                                            Maaf, belum ada distributor dengan tipe bisnis {''} <strong>{this.state.inputTipeBisnis_label}</strong>.
                                            Memilih <strong>Lanjut</strong> berarti membuat akun tanpa berlangganan dengan distributor.
                                        </label>)
                                    }
                                </div>
                            </div>

                            <div style={{ float: 'right' }} >

                                <button id='lanjutdaftar' onClick={() => this.handleDaftarBuyerLanjutan()}
                                    className="btn btn-primary mt-2 mt-md-3 mt-lg-4" type="submit" style={{ marginTop: '15px', marginRight: '5px' }} >Lanjut
                                </button>
                                <button id='lanjutdaftar' onClick={this.controlListPenjual.bind(this)}
                                    className="btn btn-light mt-2 mt-md-3 mt-lg-4" type="submit" style={{ marginTop: '15px' }} >Batal
                                </button>

                            </div>

                        </ModalBody>
                    </Modal>

                    <Modal isOpen={this.state.openInfoBerkas} size="md" centered>
                        <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={()=> this.setState({openInfoBerkas: !this.state.openInfoBerkas})}>Informasi Kelengkapan Berkas</ModalHeader>
                        <ModalBody>
                            <div className="address-card__row-content" style={{ fontSize: '13px', fontWeight: '600'}}>Pelanggan Perorangan</div>
                            <ul style={{ fontSize: '13px'}}>
                                <li>E-KTP</li>
                                <li>NPWP</li>
                            </ul>
                            <div className="address-card__row-content" style={{ fontSize: '13px', fontWeight: '600'}}>Pelanggan Perusahaan Pharma</div>
                            <ul style={{ fontSize: '13px'}}>
                                <li>NPWP atau SPPKP</li>
                                <li>SIUP atau SIUI Farmasi yang masih berlaku</li>
                                <li>Sertifikat GXP (jika disyaratkan)</li>
                                <li>Note untuk pelanggan trader : dilengkapi juga data Surat Izin PBF yang masih berlaku</li>
                            </ul>
                            <div className="address-card__row-content" style={{ fontSize: '13px', fontWeight: '600'}}>Pelanggan Perusahaan non Pharma</div>
                            <ul style={{ fontSize: '13px'}}>
                                <li>NPWP atau SPPKP</li>
                                <li>SIUP atau SIUI Farmasi yang masih berlaku</li>
                            </ul>

                        </ModalBody>
                        <ModalBody>
                            <div style={{ float: 'right' }} >
                                <label for="pilihfile" class="btn btn-primary btn-sm mt-1" >Lanjut pilih Berkas</label>
                                <input type="file" id="pilihfile" accept=".zip, .rar" style={{ display: 'none' }} onChange={this.handleTempDocument}></input>
                            </div>
                        </ModalBody>
                    </Modal>

                    <Dialog
                        open={this.state.openConfirmationUpload}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">Unggah Berkas</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Berkas yang Anda pilih :  <strong>{this.state.file_upload}</strong>.
                                Unggah sekarang ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={() => this.handleUpload()}>
                                Ya
                        </Button>
                            <Button color="light" onClick={() => this.setState({ openConfirmationUpload: false, file_upload: '' })}>
                                Batal
                        </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={this.state.isSuksesRegister}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">Proses Registrasi Berhasil </DialogTitle>

                        {this.state.inputTipeRegister == 'B' ?
                            (<DialogContent>
                                <center>
                                    <i class="fas fa-check-circle fa-3x mb-4" style={{ color: '#8CC63E' }}></i>
                                </center>
                                <DialogContentText>
                                    <center>Silakan masuk untuk melakukan proses aktivasi akun Anda.</center>
                                </DialogContentText>
                                <center>
                                    <Link to="/masuk" className="btn btn-primary mt-4 mb-3" >menuju Halaman Masuk</Link>
                                </center>
                            </DialogContent>) :
                            (<DialogContent>
                                <center>
                                    <i class="fas fa-check-circle fa-3x mb-4" style={{ color: '#8CC63E' }}></i>
                                </center>
                                <DialogContentText>
                                    <center>Harap menunggu proses aktivasi oleh admin</center>
                                </DialogContentText>
                                <center>
                                    <Link to="/" className="btn btn-primary mt-4 mb-3" >ok</Link>
                                </center>
                            </DialogContent>)
                        }
                    </Dialog>

                </div>
            </React.Fragment >
        );
    }
}
