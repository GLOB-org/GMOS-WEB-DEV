// react
import React, { Component } from 'react';

// third-party
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link, Redirect } from 'react-router-dom';

// application
import Collapse from '../shared/Collapse';
import PageHeader from '../shared/PageHeader';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import { Button, Card, CardBody, Input, Modal, ModalHeader } from 'reactstrap';
import NumberFormat from 'react-number-format';
import Toast from 'light-toast';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { CartContext } from '../../context/cart';

// data stubs
import payments from '../../data/shopPayments';
import theme from '../../data/theme';


class ShopPageCheckout extends Component {
    payments = payments;

    constructor(props) {
        super(props);

        this.state = {
            payment: 'bank',
            data_checkout: [],
            load_datacheckout: '',
            data_checkoutgrouping: [],
            data_penjual: [],
            id_penjual_string: '',
            data_penjual_length: '',
            data_payment: [],
            data_payment_filter: [],
            data_ongkir: [],
            array_groupbarang: [],
            array_berat_seller: [],
            array_ongkir_seller: [],
            id_transaction: [],
            label_id_transaction: '',
            label_distributor: '',
            data_alamat: [],
            set_idtransaction: [],
            data_kurs_cart: [],
            hari_libur: [],
            alamat: '',
            total_harga: 0,
            kurs: '',
            shipto_id: '', billto_id: '',
            shipto_alamat: '', billto_alamat: '',
            shipto_kelurahan: '', billto_kelurahan: '',
            shipto_kecamatan: '', billto_kecamatan: '',
            shipto_kota: '', billto_kota: '',
            shipto_provinsi: '', billto_provinsi: '',
            shipto_kodepos: '', billto_kodepos: '',
            shipto_notelp: '', billto_notelp: '',
            modalDaftarAlamat: false, modalDaftarAlamat_jenis: '',
            modalDataPemesanan: false,
            openresponkurs: false, view_alert_kurs: false,
            openresponerror: false, openresponalamat: false,
            selected_alamatpengiriman: '', selected_alamatpenagihan: '',
            selected_seller: '', selected_payment: '',
            selected_pilihtglkirim: false, value_pilihtglkirim: '',
            total_harga_nego: '',
            total_harga_asli: '',
            total_ongkir: '', total_ppn: '',
            transaction_status: '',
        };
    }

    handlePaymentChange = (event) => {
        if (event.target.checked) {
            this.setState({ payment: event.target.value });
            localStorage.setItem('Payment', encrypt(event.target.value));
        }
    };

    HandlePilihTglKirim = (event, id) => {
        var d = new Date(event.target.value);

        if (d.getDay() == 0 || d.getDay() == 6) {
            Toast.fail('Silakan pilih tanggal pada hari kerja (Senin - Jumat)', 2000, () => {
            });
            document.getElementById(id).value = ""
        }
        else {

            //get today's date
            var currentTime = new Date()
            var month = currentTime.getMonth() + 1
            if (month < 10) {
                month = "0" + month
            }
            var day = currentTime.getDate()
            var year = currentTime.getFullYear()
            var today_date = year + "-" + month + "-" + day

            //check max 30 hari
            var date1 = new Date(today_date);
            var date2 = new Date(event.target.value);

            // To calculate the time difference of two dates 
            var Difference_In_Time = date2.getTime() - date1.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            if (Difference_In_Days > 30) {
                Toast.fail('Maksimal pengiriman 30 hari dari sekarang', 2000, () => {
                });
                document.getElementById(id).value = ""
            }

            else if (date2.getTime() < date1.getTime()) {
                Toast.fail('Tanggal yang dipilih sudah berlalu', 2000, () => {
                });
                document.getElementById(id).value = ""
            }

            else {
                document.getElementById(id).value = event.target.value
                this.setState({
                    selected_pilihtglkirim: true,
                    value_pilihtglkirim: event.target.value
                });
            }

        }
    }

    handlePilihAlamat = (id, tipe) => {
        if (tipe == 'shipto') {
            // if (event.target.checked) {
            this.setState({ selected_alamatpengiriman: id });
            // }
        }

        else if (tipe == 'billto') {
            // if (event.target.checked) {
            this.setState({ selected_alamatpenagihan: id });
            // }
        }

        // var id_alamat = event.target.value;
        // if (event.target.checked) {
        //     if (this.state.modalDaftarAlamat_jenis == 'Pengiriman') {
        //         var update_all = "with new_order as (update gcm_master_alamat set shipto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + ')'
        //         var queryUpdate = "update gcm_master_alamat set shipto_active = 'Y' where id = " + event.target.value
        //     }
        //     else if (this.state.modalDaftarAlamat_jenis == 'Penagihan') {
        //         var update_all = "with new_order as (update gcm_master_alamat set billto_active = 'N' where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + ')'
        //         var queryUpdate = "update gcm_master_alamat set billto_active = 'Y' where id = " + event.target.value
        //     }

        //     Toast.loading('loading . . .', () => {
        //     });

        //     let set_query = encrypt(update_all.concat(queryUpdate))
        //     console.log(decrypt(set_query))

        //     Axios.post(url.select, {
        //         query: set_query
        //     }).then(data => {
        //         this.setState({
        //             modalDaftarAlamat: !this.state.modalDaftarAlamat
        //         });

        //         if (this.state.modalDaftarAlamat_jenis == 'Pengiriman') {
        //             this.setState({
        //                 selected_alamatpengiriman: id_alamat,
        //                 shipto_alamat: this.state.data_alamat[index].alamat,
        //                 shipto_provinsi: this.state.data_alamat[index].provinsi,
        //                 shipto_kota: this.state.data_alamat[index].kota,
        //                 shipto_kecamatan: this.state.data_alamat[index].kecamatan,
        //                 shipto_kelurahan: this.state.data_alamat[index].kelurahan,
        //                 shipto_kodepos: this.state.data_alamat[index].kodepos,
        //                 shipto_notelp: this.state.data_alamat[index].no_telp
        //             });
        //             this.forceUpdate()
        //         }
        //         else if (this.state.modalDaftarAlamat_jenis == 'Penagihan') {
        //             this.setState({
        //                 selected_alamatpenagihan: id_alamat,
        //                 billto_alamat: this.state.data_alamat[index].alamat,
        //                 billto_provinsi: this.state.data_alamat[index].provinsi,
        //                 billto_kota: this.state.data_alamat[index].kota,
        //                 billto_kecamatan: this.state.data_alamat[index].kecamatan,
        //                 billto_kelurahan: this.state.data_alamat[index].kelurahan,
        //                 billto_kodepos: this.state.data_alamat[index].kodepos,
        //                 billto_notelp: this.state.data_alamat[index].no_telp
        //             });
        //             this.forceUpdate()
        //         }

        //         this.reloadStateAlamat()

        //         Toast.hide();
        //         // Toast.success('Berhasil menetapkan alamat', 500, () => {
        //         // });
        //     }).catch(err => {
        //         Toast.fail('Gagal menetapkan alamat', 1000, () => {
        //         });
        //         console.log('error' + err);
        //         console.log(err);
        //     })

        // }
        // this.forceUpdate()
    }

    submitDataPemesanan = () => {

        Toast.loading('loading . . .', () => {
        });

        var id_cart = ""
        for (var i = 0; i < this.state.data_checkout.length; i++) {
            if (this.state.data_checkout[i].seller_id == this.state.selected_seller) {
                id_cart = id_cart.concat(this.state.data_checkout[i].id)
                if (i < this.state.data_checkout.length - 1) {
                    id_cart = id_cart.concat(',')
                }
            }
        }

        if (id_cart.substr(id_cart.length - 1) == ',') {
            id_cart = id_cart.substr(0, id_cart.length - 1)
        }

        if (this.state.value_pilihtglkirim == '') {
            var get_tgl_permintaan_kirim = null
        }
        else {
            var get_tgl_permintaan_kirim = "'" + this.state.value_pilihtglkirim + "'"
        }

        let query = encrypt(" update gcm_master_cart set shipto_id = '" + this.state.selected_alamatpengiriman + "', " +
            "billto_id = ' " + this.state.selected_alamatpenagihan + " ', payment_id = ' " + this.state.payment + " ', " +
            "tgl_permintaan_kirim =  " + get_tgl_permintaan_kirim + "   where id in (" + id_cart + ")")

        Axios.post(url.select, {
            query: query
        }).then(async (data) => {
            await this.loadDataCheckout()
            await Toast.hide()
            this.setState({
                modalDataPemesanan: !this.state.modalDataPemesanan,
                selected_pilihtglkirim: false
            });
            this.forceUpdate()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    toggleDialogResponError = () => {
        this.setState({
            openresponerror: !this.state.openresponerror
        });
    }

    toggleModalDaftarAlamat = (param) => {
        if (this.state.modalDaftarAlamat == false) {
            this.setState({
                modalDaftarAlamat_jenis: param
            });
        }
        this.setState({
            modalDaftarAlamat: !this.state.modalDaftarAlamat,
        });
    }

    toggleModalDataPemesanan = async (id_seller) => {

        if (this.state.modalDataPemesanan == false) {
            Toast.loading('loading . . .', () => {
            });
            await this.loadDataPaymentFilter(id_seller)

            let filter_data_checkout;
            filter_data_checkout = this.state.data_checkout.filter(filter => {
                return filter.seller_id == id_seller;
            });

            await this.setState({
                selected_alamatpengiriman: filter_data_checkout[0].shipto_id,
                selected_alamatpenagihan: filter_data_checkout[0].billto_id,
                selected_payment: filter_data_checkout[0].payment_id,
                payment: filter_data_checkout[0].payment_id,
                selected_seller: id_seller,
                selected_pilihtglkirim: false
            });

            this.forceUpdate()
            Toast.hide()
        }

        await this.setState({
            selected_pilihtglkirim: false,
            modalDataPemesanan: !this.state.modalDataPemesanan,
        });
    }

    async componentWillMount() {
        await this.loadDataAlamat()
        await this.loadDataCheckout()
    }

    async componentDidMount() {
        // let yx = await Axios.get('https://api.exchangeratesapi.io/latest?base=USD');
        // let kurs = yx.data.rates.IDR;

        // let get_hari_libur = await Axios.get('https://libur-bi.now.sh/api/v1')   
        // console.log(get_hari_libur)

        // let get_holiday = await Axios.get('https://raw.githubusercontent.com/guangrei/Json-Indonesia-holidays/master/calendar.json');
        // await this.setState({
        //     hari_libur: get_holiday
        // })

        // console.log(get_holiday.data)
        // console.log('hari libur')
        // console.log(this.state.hari_libur)
    }

    async loadDataCheckout() {
        this.setState({
            openresponkurs: false
        });

        let get_penjual = encrypt("SELECT distinct(d.id), d.nama_perusahaan, e.nominal as kurs, d.ppn_seller " +
            "FROM gcm_master_cart a inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang c on b.barang_id=c.id inner join gcm_master_company d " +
            "on b.company_id=d.id inner join gcm_listing_kurs e on d.id = e.company_id where a.company_id= " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and a.status='A' and now() between e.tgl_start and e.tgl_end order by d.id")

        let query = encrypt("SELECT a.id, d.nama_perusahaan, c.nama, c.berat, a.barang_id, b.price, b.foto, c.category_id, b.company_id as seller_id, d.nama_perusahaan as nama_seller, qty, harga_konsumen, a.harga_sales, nego_count,  a.history_nego_id, e.harga_final, " +
            "f.alias as satuan, a.shipto_id, a.billto_id, a.payment_id, h.payment_name, j.nominal as kurs, to_char(a.tgl_permintaan_kirim, 'yyyy-MM-dd') as tgl_permintaan_kirim, initcap(to_char(a.tgl_permintaan_kirim, 'dd-mon-yyyy')) as tgl_permintaan_kirim_edit, " +
            "case when now() < e.time_respon then 'no' end as status_time_respon, d.ppn_seller FROM gcm_listing_kurs j, gcm_seller_payment_listing i, gcm_master_payment h, gcm_payment_listing g, gcm_master_satuan f, gcm_master_cart a inner join gcm_list_barang b on a.barang_id = b.id inner join " +
            "gcm_master_barang c on b.barang_id = c.id inner join gcm_master_company d on b.company_id = d.id left join gcm_history_nego e on a.history_nego_id = e.id  where f.id = c.satuan and a.payment_id = g.id and g.payment_id = i.id and i.payment_id = h.id " +
            "and j.company_id = b.company_id and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and a.status = 'A' and now() between j.tgl_start and j.tgl_end  order by a.create_date asc")

        await Axios.post(url.select, {
            query: get_penjual
        }).then(async (data) => {
            var id_penjual_string = ''
            for (var i = 0; i < data.data.data.length; i++) {
                id_penjual_string = id_penjual_string.concat(data.data.data[i].id)
                if (i < data.data.data.length - 1) {
                    id_penjual_string = id_penjual_string.concat(',')
                }
            }

            await this.setState({
                data_penjual: data.data.data,
                data_penjual_length: data.data.data.length,
                id_penjual_string: id_penjual_string
            });

            this.forceUpdate()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })

        await Axios.post(url.select, {
            query: query
        }).then(async (data) => {
            await this.setState({
                data_checkout: data.data.data,
                data_checkoutgrouping: data.data.data,
                array_berat_seller: this.state.array_berat_seller.filter(item => item.id_seller === 0)
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

            //total ppn 
            var total_ppn_harganego = 0
            var total_ppn_hargaasli = 0
            for (var j = 0; j < this.state.data_penjual.length; j++) {
                for (var k = 0; k < data.data.data.length; k++) {
                    if (this.state.data_penjual[j].id == data.data.data[k].seller_id) {
                        if (data.data.data[k].nego_count > 0 &&
                            // data.data.data[k].harga_final != 0 &&
                            data.data.data[k].history_nego_id != 0 &&
                            data.data.data[k].status_time_respon != 'no'
                        ) {
                            if (data.data.data[k].harga_final != 0) {
                                total_ppn_harganego = total_ppn_harganego + Math.ceil((Math.ceil(data.data.data[k].harga_final) * data.data.data[k].qty * data.data.data[k].berat) * Number(this.state.data_penjual[j].ppn_seller) / 100)
                            }

                            else if (data.data.data[k].harga_final == 0) {
                                total_ppn_harganego = total_ppn_harganego + Math.ceil((Math.ceil(data.data.data[k].price * data.data.data[k].kurs) * data.data.data[k].qty * data.data.data[k].berat) * Number(this.state.data_penjual[j].ppn_seller) / 100)
                            }
                        }

                        else if (data.data.data[k].nego_count == 0 ||
                            (data.data.data[k].nego_count > 0 && data.data.data[k].harga_final == 0) ||
                            data.data.data[k].status_time_respon == 'no'
                        ) {
                            total_ppn_hargaasli = total_ppn_hargaasli + Math.ceil((Math.ceil(data.data.data[k].price * data.data.data[k].kurs) * data.data.data[k].qty * data.data.data[k].berat) * Number(this.state.data_penjual[j].ppn_seller) / 100)
                        }
                    }

                }
            }

            this.setState({
                total_ppn: total_ppn_hargaasli + total_ppn_harganego
            });

            //grouping total berat per seller
            for (var j = 0; j < this.state.data_penjual.length; j++) {
                var totalberat_seller = 0;
                for (var i = 0; i < data.data.data.length; i++) {
                    if (data.data.data[i].seller_id == this.state.data_penjual[j].id) {
                        totalberat_seller = totalberat_seller + (data.data.data[i].berat * data.data.data[i].qty)
                    }
                }

                this.setState(prevState => ({
                    array_berat_seller: [...prevState.array_berat_seller, {
                        id_seller: this.state.data_penjual[j].id, total: totalberat_seller
                    }]
                }))
            }

        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })

        let get_ongkir = encrypt("select distinct b.company_id as buyer_id, a.company_id as seller_id, d.nama_perusahaan as seller_nama, a.shipto_id, b.kota, c.harga as ongkir " +
            "from (select distinct a.shipto_id, b.company_id from gcm_master_cart a inner join gcm_list_barang b on a.barang_id = b.id  where a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and a.status = 'A') as a inner join gcm_master_alamat b on  a.shipto_id = b.id " +
            "left join gcm_ongkos_kirim c on c.tujuan_kota = b.kota and a.company_id = c.id_company inner join gcm_master_company d on d.id = a.company_id")

        // let get_ongkir = encrypt("select distinct a.company_id as buyer_id, b.id_company as seller_id, c.nama_perusahaan as seller_nama, a.kota as shipto, b.harga as ongkir from gcm_master_alamat a inner join gcm_ongkos_kirim b  on a.kota::int = b.tujuan_kota " +
        //     "inner join gcm_master_company c on b.id_company = c.id where a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and b.id_company in (" + this.state.id_penjual_string + ") and a.flag_active = 'A' and a.shipto_active = 'Y' order by b.id_company")

        await Axios.post(url.select, {
            query: get_ongkir
        }).then(async (data) => {
            await this.setState({
                data_ongkir: data.data.data,
                array_ongkir_seller: this.state.array_ongkir_seller.filter(item => item.id_seller === 0)
            });

            //grouping ongkir per seller
            var ongkir_all = 0;

            for (var j = 0; j < this.state.array_berat_seller.length; j++) {
                var ongkir = 0;
                var ongkir_null = false
                for (var i = 0; i < data.data.data.length; i++) {
                    if (data.data.data[i].seller_id == this.state.array_berat_seller[j].id_seller) {
                        if (data.data.data[i].ongkir != null) {
                            ongkir = ongkir + (this.state.array_berat_seller[j].total * data.data.data[i].ongkir)
                            ongkir_all = ongkir_all + (this.state.array_berat_seller[j].total * data.data.data[i].ongkir)
                        }
                        else if (data.data.data[i].ongkir == null) {
                            ongkir_null = true
                            break
                        }
                    }
                }

                if (ongkir_null == true) {
                    ongkir = 'null'
                }
                else {
                    ongkir = ongkir
                }

                await this.setState(prevState => ({
                    array_ongkir_seller: [...prevState.array_ongkir_seller, {
                        id_seller: this.state.array_berat_seller[j].id_seller,
                        nama_seller: this.state.data_ongkir[j].seller_nama,
                        ongkir: ongkir
                    }]
                }))
            }

            this.setState({
                total_ongkir: ongkir_all,
                load_datacheckout: 'done'
            });

            this.forceUpdate()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })

    }

    async reloadStateAlamat() {
        let queryaddress = encrypt("select a.id, a.alamat, e.id as id_kelurahan, initcap(e.nama) as kelurahan, d.id as id_kecamatan, initcap(d.nama) as kecamatan, b.id as id_kota, initcap(b.name) as kota, c.id as id_provinsi ,initcap(c.name) as provinsi, a.kodepos, a.no_telp, a.shipto_active, a.billto_active, a.company_id from gcm_master_alamat a, gcm_location_city b, gcm_location_province c, gcm_master_kecamatan d, gcm_master_kelurahan e  where a.company_id = " + decrypt(localStorage.getItem("CompanyIDLogin")) + " and a.kota = b.id and a.provinsi = c.id and a.kecamatan = d.id and a.kelurahan = e.id order by a.id")
        await Axios.post(url.select, {
            query: queryaddress
        }).then(data => {
            this.setState({
                data_alamat: data.data.data,
            });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    loadDataAlamat() {
        let queryaddress = encrypt("select a.id, a.alamat, e.id as id_kelurahan, initcap(e.nama) as kelurahan, " +
            "d.id as id_kecamatan, initcap(d.nama) as kecamatan, b.id as id_kota, initcap(b.name) as kota, c.id as id_provinsi , " +
            "initcap(c.name) as provinsi, a.kodepos, a.no_telp, a.shipto_active, a.billto_active, a.company_id from gcm_master_alamat a, " +
            "gcm_location_city b, gcm_location_province c, gcm_master_kecamatan d, gcm_master_kelurahan e  where a.company_id = " + decrypt(localStorage.getItem("CompanyIDLogin")) +
            " and a.kota = b.id and a.provinsi = c.id and a.kecamatan = d.id and a.kelurahan = e.id and a.flag_active = 'A' order by a.id")

        Axios.post(url.select, {
            query: queryaddress
        }).then(data => {
            this.setState({
                data_alamat: data.data.data
            });

            const check_shipto = data.data.data.filter(get_alamat => {
                return get_alamat.shipto_active === 'Y';
            });

            const check_billto = data.data.data.filter(get_alamat => {
                return get_alamat.billto_active === 'Y';
            });

            this.setState({
                // selected_alamatpengiriman: check_shipto[0].id,
                shipto_id: check_shipto[0].id,
                shipto_alamat: check_shipto[0].alamat,
                shipto_kelurahan: check_shipto[0].kelurahan,
                shipto_kecamatan: check_shipto[0].kecamatan,
                shipto_kota: check_shipto[0].kota,
                shipto_provinsi: check_shipto[0].provinsi,
                shipto_kodepos: check_shipto[0].kodepos,
                shipto_notelp: check_shipto[0].no_telp,
                // selected_alamatpenagihan: check_billto[0].id,
                billto_id: check_billto[0].id,
                billto_alamat: check_billto[0].alamat,
                billto_kelurahan: check_billto[0].kelurahan,
                billto_kecamatan: check_billto[0].kecamatan,
                billto_kota: check_billto[0].kota,
                billto_provinsi: check_billto[0].provinsi,
                billto_kodepos: check_billto[0].kodepos,
                billto_notelp: check_billto[0].no_telp
            });

        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    async loadDataPayment() {
        let querypayment = encrypt("select id, payment_name, deskripsi from gcm_master_payment")

        await Axios.post(url.select, {
            query: querypayment
        }).then(data => {
            this.setState({
                data_payment: data.data.data,
            });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    async loadDataPaymentFilter(seller_id) {
        let querypayment = encrypt(" select a.id, c.payment_name, c.deskripsi from gcm_payment_listing a " +
            "inner join gcm_seller_payment_listing b on a.payment_id = b.id " +
            "inner join gcm_master_payment c on b.payment_id = c.id " +
            "where a.seller_id = " + seller_id + " and buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and b.status = 'A' and a.status = 'A' order by c.payment_name ")

        await Axios.post(url.select, {
            query: querypayment
        }).then(data => {
            this.setState({
                data_payment_filter: data.data.data,
            });
            this.forceUpdate()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    submitTransaksi = async () => {
        Toast.loading('loading . . .', () => {
        });

        // let check_mapping_alamat = encrypt("select a.shipto_id, b.id_seller, c.nama_perusahaan, b.kode_alamat_customer from " +
        //     "(select distinct a.shipto_id, a.company_id, b.company_id as seller_id from gcm_master_cart a " +
        //     "inner join gcm_list_barang b on a.barang_id = b.id  where a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and a.status = 'A' )" +
        //     "a inner join gcm_listing_alamat b on a.shipto_id = b.id_master_alamat " +
        //     "inner join gcm_master_company c on b.id_seller = c.id " +
        //     "and a.company_id = b.id_buyer and a.seller_id = b.id_seller")

        let check_mapping_alamat = encrypt("select string_agg(distinct ''||c.nama_perusahaan||''  , ', ') as nama_perusahaan from "+
        "(select distinct a.shipto_id, a.company_id, b.company_id as seller_id from gcm_master_cart a "+
        "inner join gcm_list_barang b on a.barang_id = b.id  where a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and a.status = 'A' )a "+ 
        "inner join gcm_listing_alamat b on a.shipto_id = b.id_master_alamat inner join gcm_master_company c "+
        "on a.seller_id = c.id where b.kode_alamat_customer is null")

        await Axios.post(url.select, {
            query: check_mapping_alamat
        }).then(data => {
            // for (var i = 0; i < data.data.data.length; i++) {
            //     if (data.data.data[i].kode_alamat_customer == null) {
            //         label_distributor = label_distributor.concat(data.data.data[i].nama_perusahaan)
            //         if (i < data.data.data.length - 1) {
            //             label_distributor = label_distributor.concat(', ')
            //         }
            //     }
            // }
            this.setState({
                label_distributor: data.data.data[0].nama_perusahaan
            });
        }).catch(err => {
            // console.log('error : ' + err);
        })

        if ( this.state.label_distributor != null) {
            Toast.hide()
            this.setState({
                openresponalamat: true
            });
        }
        else {
            let query = encrypt("select a.last_timeadd, a.seller_id, a.nama_perusahaan, a.kurs as kurs_lastadd, b.nominal as kurs_now from( " +
                "select a.last_timeadd, a.seller_id, a.nama_perusahaan, b.nominal as kurs from ( " +
                "SELECT max(a.create_date) as last_timeadd, b.company_id as seller_id, d.nama_perusahaan FROM gcm_master_cart a inner join gcm_list_barang b on a.barang_id = b.id inner join " +
                "gcm_master_barang c on b.barang_id = c.id inner join gcm_master_company d on b.company_id = d.id " +
                "where a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and a.status = 'A' group by b.company_id, d.nama_perusahaan) a inner join gcm_listing_kurs b on a.seller_id = b.company_id " +
                "where a.last_timeadd between b.tgl_start and b.tgl_end " +
                ")a inner join gcm_listing_kurs b on a.seller_id = b.company_id where now() between b.tgl_start and b.tgl_end")

            await Axios.post(url.select, {
                query: query
            }).then(async (data) => {
                var length_kurs = data.data.data.length
                for (var i = 0; i < length_kurs; i++) {
                    if (data.data.data[i].kurs_lastadd != data.data.data[i].kurs_now) {
                        await this.setState(prevState => ({
                            data_kurs_cart: [...prevState.set_idtransaction, {
                                penjual: data.data.data[i].nama_perusahaan,
                                kurs_lastadd: data.data.data[i].kurs_lastadd,
                                kurs_now: data.data.data[i].kurs_now
                            }]
                        }))
                    }
                }
            }).catch(err => {
                // console.log('error select : ' + err);
            })

            if (this.state.data_kurs_cart.length > 0 && this.state.view_alert_kurs == false) {
                Toast.hide()
                this.setState({
                    openresponkurs: !this.state.openresponkurs,
                    view_alert_kurs: true
                });
            }

            else if (this.state.data_kurs_cart.length > 0 && this.state.view_alert_kurs == true || this.state.data_kurs_cart.length == 0) {
                let query = "insert into gcm_master_transaction (id_transaction, company_id, status, create_by, create_date, update_by, update_date ,kurs_rate, shipto_id, billto_id, payment_id, id_sales, ongkos_kirim, tgl_permintaan_kirim, ppn_seller) VALUES "
                let loop = ""
                let length = this.state.data_penjual_length;
                let filter_data_checkout;
                let filter_ongkir;

                for (var i = 0; i < length; i++) {
                    filter_data_checkout = this.state.data_checkout.filter(filter => {
                        return filter.seller_id == this.state.data_penjual[i].id;
                    });

                    filter_ongkir = this.state.array_ongkir_seller.filter(filter => {
                        return filter.id_seller == this.state.data_penjual[i].id;
                    });

                    var get_tgl_permintaan_kirim = filter_data_checkout[0].tgl_permintaan_kirim

                    if (get_tgl_permintaan_kirim == null) {
                        get_tgl_permintaan_kirim = null
                    }
                    else {
                        get_tgl_permintaan_kirim = "'" + get_tgl_permintaan_kirim + "'"
                    }

                    var get_idtransaction = "(select concat('GMOS','/W/', TO_CHAR((select id from gcm_company_listing gcl " +
                        "where buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status = 'A' and seller_id = " + this.state.data_penjual[i].id + "),'fm00000'), '/', TO_CHAR(NOW() :: DATE, 'yymm'), TO_CHAR(get_count+1,'fm0000'))  " +
                        "from (select count(id_transaction) as get_count from gcm_master_transaction gmt where id_transaction like " +
                        "TO_CHAR((select id from gcm_company_listing gcl where buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status = 'A' and seller_id = " + this.state.data_penjual[i].id + "),'%/fm00000/%') " +
                        "and create_date >=  date_trunc('year', CURRENT_TIMESTAMP ) and create_date >=  date_trunc('month', CURRENT_TIMESTAMP ))as id_trx)"

                    var get_sales = "(select id_sales from gcm_company_listing_sales " +
                        "where buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and seller_id = " + this.state.data_penjual[i].id + " and status = 'A' )"

                    loop = loop + "(" + get_idtransaction + "," + decrypt(localStorage.getItem('CompanyIDLogin')) + ", 'WAITING', " + decrypt(localStorage.getItem('UserIDLogin')) + ", now()," + decrypt(localStorage.getItem('UserIDLogin')) +
                        ", now(), " + filter_data_checkout[0].kurs + ", " + filter_data_checkout[0].shipto_id + ", " + filter_data_checkout[0].billto_id + ", " + filter_data_checkout[0].payment_id + ", " + get_sales + ", " + filter_ongkir[0].ongkir + ", " + get_tgl_permintaan_kirim + ", " + filter_data_checkout[0].ppn_seller + ")"

                    await this.setState(prevState => ({
                        set_idtransaction: [...prevState.set_idtransaction, { id: get_idtransaction, penjual: this.state.data_penjual[i].id }]
                    }))

                    if (i < length - 1) {
                        loop = loop.concat(",")
                    }
                }
                var query_transaction = query.concat(loop)
                await this.submitDetailTransaksi(query_transaction)
            }
        }
    }

    submitDetailTransaksi = async (query_transaction) => {

        let query_detailtransaction = " insert into gcm_transaction_detail (transaction_id, barang_id, qty, harga, create_by, create_date ,update_by, buyer_id, harga_asli, harga_kesepakatan) values "
        let count = 0;
        let grouping;
        let grouping_idtransaksi;
        let loopquery = ""
        let length_cart = this.state.data_checkout.length;
        for (var i = 0; i < this.state.data_penjual_length; i++) {

            grouping = this.state.data_checkout.filter(filter => {
                return filter.seller_id == this.state.data_penjual[i].id;
            });

            console.log(grouping)

            grouping_idtransaksi = this.state.set_idtransaction.filter(filter => {
                return filter.penjual == this.state.data_penjual[i].id;
            });

            for (var j = 0; j < grouping.length; j++) {
                // check if nego
                if (grouping[j].nego_count > 0 && grouping[j].harga_final != 0 && grouping[j].history_nego_id != 0 && grouping[j].status_time_respon != 'no') {
                    loopquery = loopquery + "(" + this.state.set_idtransaction[i].id + "," + grouping[j].barang_id.toString() + "," + grouping[j].qty.toString() + ", " + (grouping[j].harga_final * grouping[j].qty * grouping[j].berat) + ", " + decrypt(localStorage.getItem('UserIDLogin')) + ",now() ," + decrypt(localStorage.getItem('UserIDLogin')) + ", " + decrypt(localStorage.getItem('CompanyIDLogin')) + "," + Math.ceil(grouping[j].kurs * grouping[j].price) + "," + grouping[j].harga_final + ") "
                }
                else if (grouping[j].nego_count == 0 || (grouping[j].nego_count > 0 && grouping[j].harga_final == 0) || (grouping[j].nego_count > 0 && grouping[j].harga_final != 0 && grouping[j].status_time_respon == 'no')) {
                    loopquery = loopquery + "(" + this.state.set_idtransaction[i].id + "," + grouping[j].barang_id.toString() + "," + grouping[j].qty.toString() + ", " + (Math.ceil(grouping[j].kurs * grouping[j].price) * grouping[j].qty * grouping[j].berat) + ", " + decrypt(localStorage.getItem('UserIDLogin')) + ",now() ," + decrypt(localStorage.getItem('UserIDLogin')) + ", " + decrypt(localStorage.getItem('CompanyIDLogin')) + "," + Math.ceil(grouping[j].kurs * grouping[j].price) + "," + Math.ceil(grouping[j].kurs * grouping[j].price) + ") "
                }

                if (count < length_cart - 1) {
                    loopquery = loopquery.concat(",")
                }
            }
            count++
        }

        var query_detail = query_detailtransaction.concat(loopquery)
        if (query_detail.charAt(query_detail.length - 1) == ',') {
            query_detail = query_detail.substring(0, query_detail.length - 1)
        }

        var final_query = encrypt("with new_insert1 as (" + query_transaction + "  ), new_insert2 as (" + query_detail +
            " returning transaction_id) select distinct transaction_id from new_insert2")

        await Axios.post(url.select, {
            query: final_query
        }).then(async (data) => {

            var get_id_transaction = ""
            for (var i = 0; i < data.data.data.length; i++) {
                get_id_transaction = get_id_transaction.concat(data.data.data[i].transaction_id)
                if (i < data.data.data.length - 1) {
                    get_id_transaction = get_id_transaction.concat(" - ")
                }
            }

            await this.setState({
                label_id_transaction: get_id_transaction
            });

            await Toast.hide()
            await this.setState({
                transaction_status: 'success'
            });
            window.scrollTo(0, 0);
            this.forceUpdate()
        }).catch(err => {
            Toast.hide()
            this.setState({
                openresponerror: true
            });
            // console.log(err);
        })
    }

    // rendergroup(get_param, get_indexpenjual) {

    //     let grouping;
    //     grouping = this.state.data_checkout.filter(filter => {
    //         return filter.nama_perusahaan == get_param;
    //     });

    //     let datagroup_harganego
    //     datagroup_harganego = grouping.filter(input => {
    //         return input.nego_count > 0 && input.harga_final != null && input.history_nego_id != 0;
    //     });

    //     let datagroup_hargaasli
    //     datagroup_hargaasli = grouping.filter(input => {
    //         return input.nego_count == 0 || (input.nego_count > 0 && input.harga_final == 0);
    //     });

    //     let subtotalnego = datagroup_harganego.reduce((x, y) => x + Math.ceil(y.harga_final * y.qty * y.berat), 0)
    //     let subtotalasli = datagroup_hargaasli.reduce((x, y) => x + Math.ceil(y.price * this.state.kurs * y.qty * y.berat), 0)
    //     let subtotal = subtotalasli + subtotalnego

    //     if (subtotal != 0) {
    //         this.state.array_groupbarang.push(subtotal)
    //     }

    //     return grouping.map((data, index) => {
    //         return (
    //             <div style={{ display: 'contents' }}>
    //                 <tr>
    //                     <div className="row">
    //                         <img src={data.foto} className="detail-foto col-md-2" style={{ padding: '10px 10px 10px 35px' }} />
    //                         <div className="col-md-10" style={{ padding: '5px 0px 0px 10px' }}>
    //                             <td style={{ border: 'none', fontSize: '13px', fontWeight: '500' }} >
    //                                 <div className="address-card__row-title">
    //                                     <label style={{ color: '#3d464d' }}><strong>{data.nama}</strong></label>
    //                                 </div>
    //                                 <div className="address-card__row-title">
    //                                     <label style={{ color: '#3d464d', fontSize: '12px', fontWeight: '400' }}>{data.qty * data.berat} {' '}{data.satuan}</label>
    //                                 </div>


    //                                 {data.nego_count > 0 && data.harga_final != null && data.harga_final != 0 && data.history_nego_id != 0 ?
    //                                     (<div className="address-card__row-title">
    //                                         <label style={{ color: '#3d464d' }}><NumberFormat value={Math.round(data.harga_final * data.qty * data.berat)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></label>
    //                                     </div>) :
    //                                     (<div className="address-card__row-title">
    //                                         <label style={{ color: '#3d464d' }}><NumberFormat value={Math.round(data.price * this.state.kurs * data.qty * data.berat)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></label>
    //                                     </div>)
    //                                 }
    //                             </td>
    //                         </div>
    //                     </div>
    //                 </tr>
    //             </div>
    //         )
    //     })
    // }


    // render group copy
    rendergroup(get_param, get_indexpenjual) {

        let grouping;
        grouping = this.state.data_checkout.filter(filter => {
            return filter.nama_perusahaan == get_param;
        });

        let datagroup_harganego
        datagroup_harganego = grouping.filter(input => {
            return input.nego_count > 0 && input.harga_final != null && input.history_nego_id != 0 && input.status_time_respon != 'no';
        });

        let datagroup_hargaasli
        datagroup_hargaasli = grouping.filter(input => {
            return input.nego_count == 0 || (input.nego_count > 0 && input.harga_final == 0) || input.status_time_respon == 'no';
        });

        let subtotalnego = datagroup_harganego.reduce((x, y) => x + (Math.ceil(y.harga_final) * y.qty * y.berat), 0)
        let subtotalasli = datagroup_hargaasli.reduce((x, y) => x + (Math.ceil(y.price * y.kurs) * y.qty * y.berat), 0)
        let subtotal = subtotalasli + subtotalnego

        if (subtotal != 0) {
            this.state.array_groupbarang.push(subtotal)
        }

        return grouping.map((data, index) => {
            return (
                <div style={{ display: 'contents' }}>

                    <tr className="cart-table__row" >
                        <td className="cart-table__column cart-table__column--image" style={{ border: 'none', padding: '0px', verticalAlign: 'middle' }}>
                            <img src={data.foto} alt="" />
                        </td>
                        <td className="cart-table__column cart-table__column--product" style={{ border: 'none' }}>
                            <tr><span style={{ color: '#3d464d', fontSize: '14px', fontWeight: '500' }}>{data.nama}</span></tr>
                            <tr>
                                <span style={{ color: '#3d464d', fontSize: '13px', fontWeight: '500' }}>kuantitas : {' '}
                                    <NumberFormat value={data.qty * data.berat} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} />
                                    {' '}{data.satuan}</span>
                            </tr>
                            {data.nego_count > 0 && data.harga_final != null && data.harga_final != 0 && data.history_nego_id != 0 && data.status_time_respon != 'no' ?
                                (<tr>
                                    <span style={{ color: '#3d464d', fontSize: '13px', fontWeight: '600' }}><NumberFormat value={(Math.ceil(data.harga_final) * data.qty * data.berat)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                                </tr>) :
                                (<tr>
                                    <span style={{ color: '#3d464d', fontSize: '13px', fontWeight: '600' }}><NumberFormat value={(Math.ceil(data.price * data.kurs) * data.qty * data.berat)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                                </tr>)
                            }
                        </td>
                    </tr>
                </div>
            )
        })
    }


    // --- flow marketplace ---

    // renderItems() {

    //     if (this.state.data_penjual.length == 1) {
    //         var displaylabel = 'none'
    //     }
    //     else if (this.state.data_penjual.length > 1) {
    //         var displaylabel = 'block'
    //     }

    //     if (this.state.data_penjual.length > 0) {
    //         return this.state.data_penjual.map((data, index) => {
    //             return (
    //                 <Card style={{ marginTop: '0.6rem', paddingLeft: '0', paddingRight: '0' }}>
    //                     <CardBody style={{ padding: '10px 0 0 0' }}>
    //                         <table className="cart__table cart-table">
    //                             <tr>
    //                                 <td colSpan="5">
    //                                     <label style={{ paddingLeft: '10px', fontSize: '13px', fontWeight: '500' }}>Distributor : <strong>{data.nama_perusahaan}</strong></label>
    //                                 </td>
    //                             </tr>
    //                             <tbody>
    //                                 {this.rendergroup(data.nama_perusahaan, index)}
    //                             </tbody>
    //                             <tr >
    //                                 <td colSpan='2'>
    //                                     <hr style={{ border: '1px solid #f0f0f0' }} />
    //                                     <label id={'subtotal' + index} style={{ paddingLeft: '10px', paddingBottom: '10px', fontSize: '13px', fontWeight: '500' }}>Subtotal Harga : <NumberFormat value={this.state.array_groupbarang[index]} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></label>
    //                                     <label className='labeldatapemesanan' style={{ float: 'right', paddingRight: '10px', paddingBottom: '10px', fontSize: '11px', fontWeight: '600', color: 'red', cursor: 'pointer', display: displaylabel }} onClick={() => this.toggleModalDataPemesanan(data.id)}>Lengkapi data pemesanan</label>
    //                                 </td>
    //                             </tr>
    //                         </table>

    //                     </CardBody>
    //                 </Card>
    //             );
    //         });
    //     }

    //     else {
    //         return (
    //             <Card style={{ marginTop: '0.6rem', paddingLeft: '0', paddingRight: '0' }}>
    //                 <CardBody style={{ padding: '10px 0 0 0' }}>

    //                     <table className="cart__table cart-table">
    //                         <tr>
    //                             <td colSpan="5">
    //                                 <div className="address-card__row-title" style={{ paddingLeft: '10px' }}><lines class="shine" style={{ width: '40%' }}></lines></div>
    //                             </td>
    //                         </tr>
    //                         <tbody>
    //                             <div style={{ display: 'contents' }}>
    //                                 <tr>
    //                                     <div className="row">
    //                                         {/* <img src={data.foto} className="detail-foto col-md-2" style={{ padding: '10px 10px 10px 35px' }} /> */}
    //                                         <div className="col-md-2" style={{ padding: '10px 10px 10px 35px' }}></div>
    //                                         <div className="col-md-10" style={{ padding: '5px 0px 0px 10px' }}>
    //                                             <div className="address-card__row-title">
    //                                                 <lines class="shine" style={{ width: '50%' }}></lines>
    //                                             </div>
    //                                             <div className="address-card__row-title">
    //                                                 <lines class="shine" style={{ width: '50%' }}></lines>
    //                                             </div>
    //                                             <div className="address-card__row-title">
    //                                                 <lines class="shine" style={{ width: '50%' }}></lines>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </tr>
    //                             </div>


    //                         </tbody>
    //                         <tr>
    //                             <td colSpan="5">
    //                                 <hr style={{ border: '1px solid #f0f0f0' }} />
    //                                 <div className="address-card__row-title" style={{ paddingLeft: '10px', paddingBottom: '10px' }}><lines class="shine" style={{ width: '40%' }}></lines></div>
    //                             </td>
    //                         </tr>
    //                     </table>

    //                 </CardBody>
    //             </Card>
    //         );
    //     }
    // }


    // render copy
    renderItems() {

        if (this.state.data_penjual.length == 1) {
            var displaylabel = 'none'
        }
        else if (this.state.data_penjual.length > 1) {
            var displaylabel = 'block'
        }

        if (this.state.data_penjual.length > 0 && this.state.data_alamat.length > 0) {
            return this.state.data_penjual.map((data, index) => {

                let filter_data_checkout_payment;
                filter_data_checkout_payment = this.state.data_checkout.filter(filter => {
                    return filter.seller_id == this.state.data_penjual[index].id;
                });

                let filter_data_checkout_shipto;
                filter_data_checkout_shipto = this.state.data_alamat.filter(filter => {
                    return filter.id == filter_data_checkout_payment[0].shipto_id;
                });

                let filter_data_checkout_billto;
                filter_data_checkout_billto = this.state.data_alamat.filter(filter => {
                    return filter.id == filter_data_checkout_payment[0].billto_id;
                });

                if (index == 0) {
                    var margin = '0px'
                    // var displayline = 'none'
                }
                else {
                    var margin = '35px'
                    // var displayline = 'block'
                }

                if (filter_data_checkout_shipto[0].provinsi.toString().toUpperCase().includes('DKI') == true ||
                    filter_data_checkout_shipto[0].provinsi.toString().toUpperCase().includes('DIY') == true) {
                    var arraystring = []
                    arraystring = filter_data_checkout_shipto[0].provinsi.toString().split(" ")
                    var get_provinsi_edit = arraystring[0].toUpperCase() + " " + arraystring[1]
                }
                else {
                    var get_provinsi_edit = filter_data_checkout_shipto[0].provinsi
                }

                return (
                    <div>
                        <table className="cart__table cart-table" style={{ marginTop: margin }}>
                            <tr>
                                <td colSpan="5">
                                    {/* <span class="fa-stack">
                                        <span class="fa fa-circle fa-stack-2x" ></span>
                                        <span class="fa-stack-1x">
                                            <span style={{ fontSize: '13px', fontWeight: '500', color: 'white' }}>{index + 1}</span>
                                        </span>
                                    </span> */}
                                    <li>
                                        <label style={{ fontSize: '13px', fontWeight: '500' }}>Distributor : <strong>{data.nama_perusahaan}</strong></label>
                                    </li>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="5">
                                    <div className="alert alert-secondary mt-3" >
                                        <span style={{ color: '#3d464d', fontSize: '14px', fontWeight: '500' }}>Informasi kurs : {' '}
                                            <NumberFormat value={Number(data.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tbody>
                                {this.rendergroup(data.nama_perusahaan, index)}
                            </tbody>

                            <tr>
                                <td colSpan="5">
                                    <hr />
                                </td>
                            </tr>

                            <tr >
                                <td colSpan="5" >
                                    <div style={{ float: 'right' }} >
                                        {/* <span data-toggle="tooltip" title="Tambahkan catatan">
                                            <button className="btn btn-light btn-xs mt-2" type="submit" style={{marginRight: '5px'}}>
                                                <i class="fas fa-pencil-alt"></i>
                                            </button>
                                        </span> */}
                                        <button type="submit" className="btn btn-light btn-xs mt-2" onClick={() => this.toggleModalDataPemesanan(data.id)} ><i class="fas fa-pencil-alt" style={{ marginRight: '5px' }}></i>data pemesanan</button>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="5">
                                    <div className="address-card__row-title">Metode Pembayaran</div>
                                    <div className="address-card__row-content">
                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                                            {filter_data_checkout_payment[0].payment_name}
                                        </span>
                                    </div>
                                </td>
                            </tr>

                            <tr >
                                <td colSpan="5" >
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <div className="row" style={{ marginTop: '5px' }}>
                                                <div className="col-md-4">
                                                    <div className="address-card__row">
                                                        <div className="address-card__row-title">Alamat Penagihan</div>
                                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                                                            <div className="address-card__row-content">{filter_data_checkout_billto[0].alamat}</div>
                                                            <div className="address-card__row-content">{'Kel. '}{filter_data_checkout_billto[0].kelurahan}{', Kec. '}{filter_data_checkout_billto[0].kecamatan}</div>
                                                            <div className="address-card__row-content">{filter_data_checkout_billto[0].kota}</div>
                                                            <div className="address-card__row-content">{filter_data_checkout_billto[0].provinsi}{', '}{filter_data_checkout_billto[0].kodepos}</div>
                                                            <div className="address-card__row-content">{'Telepon : '}{filter_data_checkout_billto[0].no_telp}</div>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mt-2 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                                                    <div className="address-card__row">
                                                        <div className="address-card__row-title">Alamat Pengiriman</div>
                                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                                                            <div className="address-card__row-content">{filter_data_checkout_shipto[0].alamat}</div>
                                                            <div className="address-card__row-content">{'Kel. '}{filter_data_checkout_shipto[0].kelurahan}{', Kec. '}{filter_data_checkout_shipto[0].kecamatan}</div>
                                                            <div className="address-card__row-content">{filter_data_checkout_shipto[0].kota}</div>
                                                            <div className="address-card__row-content">{get_provinsi_edit}{', '}{filter_data_checkout_shipto[0].kodepos}</div>
                                                            <div className="address-card__row-content">{'Telepon : '}{filter_data_checkout_shipto[0].no_telp}</div>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mt-2 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                                                    <div className="address-card__row">
                                                        <div className="address-card__row-title">Tanggal Kirim</div>
                                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                                                            <div className="address-card__row-content">
                                                                {filter_data_checkout_payment[0].tgl_permintaan_kirim_edit == null ?
                                                                    (<span>belum diatur</span>) :
                                                                    (<span>{filter_data_checkout_payment[0].tgl_permintaan_kirim_edit}</span>)
                                                                }
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                        </table>
                    </div>
                );
            });
        }

        // else {
        //     return (
        //         <Card style={{ marginTop: '0.6rem', paddingLeft: '0', paddingRight: '0' }}>
        //             <CardBody style={{ padding: '10px 0 0 0' }}>

        //                 <table className="cart__table cart-table" >
        //                     <tr>
        //                         <td colSpan="5">
        //                             <div className="address-card__row-title" style={{ paddingLeft: '10px' }}><lines class="shine" style={{ width: '40%' }}></lines></div>
        //                         </td>
        //                     </tr>
        //                     <tbody>
        //                         <div style={{ display: 'contents' }}>
        //                             <tr>
        //                                 <div className="row">
        //                                     {/* <img src={data.foto} className="detail-foto col-md-2" style={{ padding: '10px 10px 10px 35px' }} /> */}
        //                                     <div className="col-md-2" style={{ padding: '10px 10px 10px 35px' }}></div>
        //                                     <div className="col-md-10" style={{ padding: '5px 0px 0px 10px' }}>
        //                                         <div className="address-card__row-title">
        //                                             <lines class="shine" style={{ width: '50%' }}></lines>
        //                                         </div>
        //                                         <div className="address-card__row-title">
        //                                             <lines class="shine" style={{ width: '50%' }}></lines>
        //                                         </div>
        //                                         <div className="address-card__row-title">
        //                                             <lines class="shine" style={{ width: '50%' }}></lines>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </tr>
        //                         </div>


        //                     </tbody>
        //                     <tr>
        //                         <td colSpan="5">
        //                             <hr style={{ border: '1px solid #f0f0f0' }} />
        //                             <div className="address-card__row-title" style={{ paddingLeft: '10px', paddingBottom: '10px' }}><lines class="shine" style={{ width: '40%' }}></lines></div>
        //                         </td>
        //                     </tr>
        //                 </table>

        //             </CardBody>
        //         </Card>
        //     );
        // }
    }


    // --- flow tunggal gcm ---

    // renderItems() {

    //     if (this.state.data_checkout.length > 0) {
    //         return this.state.data_checkout.map((data, index) => {
    //             if (index == 0) {
    //                 var margin = '0px'
    //             }
    //             else {
    //                 var margin = '5px'
    //             }

    //             return (
    //                 <table className="cart__table cart-table" style={{ marginTop: margin }}>
    //                     <tbody className="cart-table__body">
    //                         <tr className="cart-table__row">
    //                             <td className="cart-table__column cart-table__column--image">
    //                                 <img src={data.foto} alt="" />
    //                             </td>
    //                             <td className="cart-table__column cart-table__column--product">
    //                                 <tr><span style={{ color: '#3d464d', fontSize: '14px', fontWeight: '500' }}>{data.nama}</span></tr>
    //                                 <tr>
    //                                     <label style={{ color: '#3d464d', fontSize: '13px', fontWeight: '500' }}>qty : {data.qty * data.berat} {' '}{data.satuan}</label>
    //                                 </tr>
    //                                 {data.nego_count > 0 && data.harga_final != null && data.harga_final != 0 && data.history_nego_id != 0 ?
    //                                     (<tr>
    //                                         <span style={{ color: '#3d464d', fontSize: '13px', fontWeight: '600' }}><NumberFormat value={Math.round(data.harga_final * data.qty * data.berat)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
    //                                     </tr>) :
    //                                     (<tr>
    //                                         <span style={{ color: '#3d464d', fontSize: '13px', fontWeight: '600' }}><NumberFormat value={Math.round(data.price * this.state.kurs * data.qty * data.berat)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
    //                                     </tr>)
    //                                 }
    //                             </td>
    //                         </tr>
    //                     </tbody>
    //                 </table>
    //             );
    //         });
    //     }


    // <img src={data.foto} className="detail-foto col-md-2" style={{ padding: '10px 10px 10px 35px' }} />
    //     <div className="col-md-10" style={{ padding: '5px 0px 0px 10px' }}>
    //         <td style={{ border: 'none', fontSize: '13px', fontWeight: '500' }} >
    //             <div className="address-card__row-title">
    //                 <label style={{ color: '#3d464d' }}><strong>{data.nama}</strong></label>
    //             </div>
    //             <div className="address-card__row-title">
    //                 <label style={{ color: '#3d464d', fontSize: '12px', fontWeight: '400' }}>{data.qty * data.berat} {' '}{data.satuan}</label>
    //             </div>


    //             {data.nego_count > 0 && data.harga_final != null && data.harga_final != 0 && data.history_nego_id != 0 ?
    //                 (<div className="address-card__row-title">
    //                     <label style={{ color: '#3d464d' }}><NumberFormat value={Math.round(data.harga_final * data.qty * data.berat)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></label>
    //                 </div>) :
    //                 (<div className="address-card__row-title">
    //                     <label style={{ color: '#3d464d' }}><NumberFormat value={Math.round(data.price * this.state.kurs * data.qty * data.berat)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></label>
    //                 </div>)
    //             }
    //         </td>
    //     </div>



    //     else {
    //         return (
    //             <Card style={{ marginTop: '0.6rem', paddingLeft: '0', paddingRight: '0' }}>
    //                 <CardBody style={{ padding: '10px 0 0 0' }}>

    //                     <table className="cart__table cart-table">
    //                         <tr>
    //                             <td colSpan="5">
    //                                 <div className="address-card__row-title" style={{ paddingLeft: '10px' }}><lines class="shine" style={{ width: '40%' }}></lines></div>
    //                             </td>
    //                         </tr>
    //                         <tbody>
    //                             <div style={{ display: 'contents' }}>
    //                                 <tr>
    //                                     <div className="row">
    //                                         {/* <img src={data.foto} className="detail-foto col-md-2" style={{ padding: '10px 10px 10px 35px' }} /> */}
    //                                         <div className="col-md-2" style={{ padding: '10px 10px 10px 35px' }}></div>
    //                                         <div className="col-md-10" style={{ padding: '5px 0px 0px 10px' }}>
    //                                             <div className="address-card__row-title">
    //                                                 <lines class="shine" style={{ width: '50%' }}></lines>
    //                                             </div>
    //                                             <div className="address-card__row-title">
    //                                                 <lines class="shine" style={{ width: '50%' }}></lines>
    //                                             </div>
    //                                             <div className="address-card__row-title">
    //                                                 <lines class="shine" style={{ width: '50%' }}></lines>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </tr>
    //                             </div>
    //                         </tbody>
    //                         <tr>
    //                             <td colSpan="5">
    //                                 <hr style={{ border: '1px solid #f0f0f0' }} />
    //                                 <div className="address-card__row-title" style={{ paddingLeft: '10px', paddingBottom: '10px' }}><lines class="shine" style={{ width: '40%' }}></lines></div>
    //                             </td>
    //                         </tr>
    //                     </table>

    //                 </CardBody>
    //             </Card>
    //         );
    //     }
    // }

    renderSeller_Checkout() {
        return this.state.data_penjual.map((penjual, index) => {
            return (
                <div style={{ display: 'contents' }}>
                    <tr>
                        <td>{penjual.nama_perusahaan}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>Total Harga</td>
                        <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>
                            <NumberFormat value={this.state.array_groupbarang[index]} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                        </td>
                    </tr>

                    {Number(penjual.ppn_seller) != 0 ?
                        (<tr>
                            <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>PPN {Number(penjual.ppn_seller)}%</td>
                            <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>
                                <NumberFormat value={Math.ceil((Number(penjual.ppn_seller) / 100) * this.state.array_groupbarang[index])} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                            </td>
                        </tr>) :
                        (null)
                    }

                    {/* <tr>
                        <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>PPN {Number(penjual.ppn_seller)}%</td>
                        <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>
                            <NumberFormat value={Math.ceil((Number(penjual.ppn_seller) / 100) * this.state.array_groupbarang[index])} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                        </td>
                    </tr> */}
                    <tr>
                        <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>Ongkos Kirim</td>
                        {this.renderSeller_Ongkir(penjual.id)}
                    </tr>
                    <tr>
                        <td style={{ fontSize: '12px', fontWeight: '700', paddingLeft: '20px' }}>Sub Total</td>
                        {/* <td style={{ fontSize: '12px', fontWeight: '700', paddingLeft: '20px' }}>
                            <NumberFormat value={this.state.array_groupbarang[index]} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                        </td> */}
                        {this.renderSeller_Subtotal(penjual.id, this.state.array_groupbarang[index], penjual.ppn_seller)}
                    </tr>
                </div>
            );
        });
    }

    renderSeller_Ongkir(get_id) {
        return this.state.array_ongkir_seller.map((penjual) => {

            if (penjual.id_seller == get_id) {
                if (penjual.ongkir == 'null') {
                    return (
                        <td style={{ fontSize: '12px', fontWeight: '700', paddingLeft: '20px', color: '#ed0909' }}>belum ditentukan</td>
                    );
                }
                else {
                    if (penjual.ongkir == 0) {
                        return (
                            <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>
                                Gratis
                            </td>
                        );
                    }
                    else {
                        return (
                            <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>
                                <NumberFormat value={penjual.ongkir} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                            </td>
                        )
                    }
                }
            }
        });
    }

    renderSeller_Subtotal(get_id, get_total_harga, get_ppn) {
        return this.state.array_ongkir_seller.map((penjual) => {

            if (penjual.id_seller == get_id) {
                if (penjual.ongkir == 'null') {
                    return (
                        <td style={{ fontSize: '12px', fontWeight: '700', paddingLeft: '20px' }}>
                            <NumberFormat value={get_total_harga + Math.ceil((Number(get_ppn) / 100) * get_total_harga)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                        </td>
                    )
                }
                else {
                    if (penjual.ongkir == 0) {
                        return (
                            <td style={{ fontSize: '12px', fontWeight: '700', paddingLeft: '20px' }}>
                                <NumberFormat value={get_total_harga + Math.ceil((Number(get_ppn) / 100) * get_total_harga)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                            </td>
                        );
                    }
                    else {
                        return (
                            <td style={{ fontSize: '12px', fontWeight: '700', paddingLeft: '20px' }}>
                                <NumberFormat value={penjual.ongkir + get_total_harga + Math.ceil((Number(get_ppn) / 100) * get_total_harga)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                            </td>
                        )
                    }
                }
            }
        });
    }

    // renderSeller_Subtotal() {
    //     return this.state.data_penjual.map((penjual, index) => {
    //         return (
    //             <tr>
    //                 <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>{penjual.nama_perusahaan}</td>
    //                 <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}><NumberFormat value={this.state.array_groupbarang[index]} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
    //             </tr>
    //         );
    //     });
    // }

    renderSeller_Shipping() {
        return this.state.array_ongkir_seller.map((penjual) => {

            if (penjual.ongkir == 'null') {
                return (
                    <tr>
                        <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>{penjual.nama_seller}</td>
                        <td style={{ fontSize: '12px', fontWeight: '700', paddingLeft: '20px', color: '#ed0909' }}>belum ditentukan</td>
                    </tr>
                );
            }
            else {
                return (
                    <tr>
                        <td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>{penjual.nama_seller}</td>
                        {penjual.ongkir == 0 ?
                            (<td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>
                                Gratis
                            </td>) :
                            (<td style={{ fontSize: '12px', fontWeight: '500', paddingLeft: '20px' }}>
                                <NumberFormat value={penjual.ongkir} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                            </td>)
                        }
                    </tr>
                );
            }
        });
    }

    renderTotals() {
        return (
            <React.Fragment>
                <tbody className="checkout__totals-subtotals" style={{ fontSize: '13px', fontWeight: '500' }}>
                    {/* <tr>
                        <td>Total Harga</td>
                        <td></td>
                    </tr>
                    {this.renderSeller_Subtotal()}
                    <tr>
                        <td>Ongkos Kirim</td>
                        <td></td>
                    </tr>
                    {this.renderSeller_Shipping()} */}

                    {this.renderSeller_Checkout()}
                </tbody>
            </React.Fragment>
        );
    }

    renderCart() {

        return (
            <table className="checkout__totals">
                {this.renderTotals()}
                <tfoot className="checkout__totals-footer">
                    <tr style={{ fontSize: '13px', fontWeight: '600' }}>
                        <td>Total Tagihan</td>
                        <td><NumberFormat value={this.state.total_harga_asli + this.state.total_harga_nego + this.state.total_ppn + this.state.total_ongkir} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
                    </tr>
                </tfoot>
            </table>
        );
    }

    renderPaymentsListFilter() {

        return this.state.data_payment_filter.map((payment, index) => {

            if (this.state.data_payment_filter[index].id == this.state.selected_payment) {
                var radio_selected = true
            }
            else {
                var radio_selected = false
            }

            return (
                <div className="card-body" style={{ padding: '15px' }}>
                    <div className="row">
                        <div className="col-md-1 col-sm-1 col-1">
                            <span className="input-radio__body">
                                <input
                                    type="radio"
                                    className="input-radio__input"
                                    name="checkout_payment_method"
                                    value={payment.id}
                                    onChange={this.handlePaymentChange}
                                    style={{ cursor: 'pointer' }}
                                    defaultChecked={radio_selected}
                                />
                                <span className="input-radio__circle" />
                            </span>
                        </div>
                        <div className="col-md-10 col-sm-10 col-10">
                            <div className="address-card__row">
                                <div className="address-card__row-title"><strong>{payment.payment_name}</strong></div>
                                <div className="address-card__row-title">{payment.deskripsi}</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    renderPaymentsList() {

        return this.state.data_payment.map((payment) => {

            return (
                <div className="card-body" style={{ padding: '15px' }}>
                    <div className="row">
                        <div className="col-md-1">
                            <span className="input-radio__body">
                                <input
                                    type="radio"
                                    className="input-radio__input"
                                    name="checkout_payment_method"
                                    value={payment.id}
                                    onChange={this.handlePaymentChange}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span className="input-radio__circle" />
                            </span>
                        </div>
                        <div className="col-md-10">
                            <div className="address-card__row">
                                <div className="address-card__row-title"><strong>{payment.payment_name}</strong></div>
                                <div className="address-card__row-title">{payment.deskripsi}</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    renderPaymentsListSingleSeller() {
        const { payment: currentPayment } = this.state;

        if (this.state.data_payment_filter.length == 1) {
            var radio_selected = true
        }
        else {
            var radio_selected = false
        }

        const payments = this.state.data_payment_filter.map((payment) => {
            const renderPayment = ({ setItemRef, setContentRef }) => (
                <li className="payment-methods__item" ref={setItemRef}>
                    <label className="payment-methods__item-header">
                        <span className="payment-methods__item-radio input-radio">
                            <span className="input-radio__body">
                                <input
                                    type="radio"
                                    className="input-radio__input"
                                    name="checkout_payment_method"
                                    value={payment.id}
                                    checked={currentPayment === payment.id}
                                    onChange={this.handlePaymentChange}
                                    defaultChecked={radio_selected}
                                />
                                <span className="input-radio__circle" />
                            </span>
                        </span>
                        <span className="payment-methods__item-title" style={{ fontSize: '13px', fontWeight: '500' }}>{payment.payment_name}</span>
                    </label>
                    <div className="payment-methods__item-container" ref={setContentRef}>
                        <div className="payment-methods__item-description text-muted" style={{ fontSize: '13px', fontWeight: '500' }}>{payment.deskripsi}</div>
                    </div>
                </li>
            );

            return (
                <Collapse
                    key={payment.id}
                    open={currentPayment === payment.id}
                    toggleClass="payment-methods__item--active"
                    render={renderPayment}
                />
            );
        });

        return (
            <div className="payment-methods">
                <ul className="payment-methods__list">
                    {payments}
                </ul>
            </div>
        );
    }

    renderAlamatPenagihan() {

        if (this.state.data_alamat.length > 0) {
            return (
                <Card style={{ marginTop: '0.6rem', paddingLeft: '0', paddingRight: '0' }}>
                    <CardBody>
                        <div className="address-card__badge">Alamat Penagihan</div>

                        <div className="address-card__row">
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{this.state.billto_alamat}</div>
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{'Kel. '}{this.state.billto_kelurahan}{', Kec. '}{this.state.billto_kecamatan}</div>
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{this.state.billto_kota}</div>
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{this.state.billto_provinsi}{', '}{this.state.billto_kodepos}</div>
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{'Telepon : '}{this.state.billto_notelp}</div>
                        </div>

                        <button type="button" class="btn btn-light btn-xs mt-2" onClick={() => this.toggleModalDaftarAlamat('Penagihan')}><span style={{ marginRight: '5px' }}><i class="fas fa-map-marker-alt"></i></span>pilih alamat lain</button>

                    </CardBody>
                </Card>
            );
        }

        else if (this.state.data_alamat.length == 0) {
            return (
                <Card style={{ marginTop: '0.1rem', paddingLeft: '0', paddingRight: '0' }}>
                    <CardBody >
                        <div className="address-card__badge">Alamat Penagihan</div>
                        <div className="address-card__row">
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                        </div>
                        <btnshimmer class="shine mt-2"></btnshimmer>
                    </CardBody>
                </Card>
            );
        }
    }

    renderAlamatPengiriman() {
        if (this.state.data_alamat.length > 0) {
            return (
                <Card style={{ marginTop: '0.1rem', paddingLeft: '0', paddingRight: '0' }}>
                    <CardBody >
                        <div className="address-card__badge">Alamat Pengiriman</div>
                        <div className="address-card__row">
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{this.state.shipto_alamat}</div>
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{'Kel. '}{this.state.shipto_kelurahan}{', Kec. '}{this.state.shipto_kecamatan}</div>
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{this.state.shipto_kota}</div>
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{this.state.shipto_provinsi}{', '}{this.state.shipto_kodepos}</div>
                            <div className="address-card__row-title" style={{ color: '#3d464d' }}>{'Telepon : '}{this.state.shipto_notelp}</div>
                        </div>
                        <button type="button" class="btn btn-light btn-xs mt-2" onClick={() => this.toggleModalDaftarAlamat('Pengiriman')}><span style={{ marginRight: '5px' }}><i class="fas fa-map-marker-alt"></i></span>pilih alamat lain</button>
                    </CardBody>
                </Card>
            );
        }
        else if (this.state.data_alamat.length == 0) {
            return (
                <Card style={{ marginTop: '0.1rem', paddingLeft: '0', paddingRight: '0' }}>
                    <CardBody >
                        <div className="address-card__badge">Alamat Pengiriman</div>
                        <div className="address-card__row">
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                            <div className="address-card__row-title"><lines class="shine"></lines></div>
                        </div>
                        <btnshimmer class="shine mt-2"></btnshimmer>
                    </CardBody>
                </Card>
            );
        }

    }

    renderDaftarAlamatPengiriman() {
        let filter_data_checkout;
        filter_data_checkout = this.state.data_checkout.filter(filter => {
            return filter.seller_id == this.state.selected_seller;
        });

        return this.state.data_alamat.map((data, index) => {

            if (filter_data_checkout.length > 0) {
                if (this.state.data_alamat[index].id == filter_data_checkout[0].shipto_id) {
                    var radio_selected = true
                }
                else {
                    var radio_selected = false
                }
            }

            return (
                <div className="card-body" style={{ padding: '15px' }}>
                    <div className="row">
                        <div className="col-md-1 col-sm-1 col-1">
                            <span className="input-radio__body">
                                <input
                                    type="radio"
                                    className="input-radio__input"
                                    name="checkout_alamat"
                                    value={this.state.data_alamat[index].id}
                                    onClick={() => this.handlePilihAlamat(this.state.data_alamat[index].id, 'shipto')}
                                    style={{ cursor: 'pointer' }}
                                    defaultChecked={radio_selected}
                                />
                                <span className="input-radio__circle" />
                            </span>
                        </div>
                        <div className="col-md-10 col-sm-10 col-10">
                            <div className="address-card__row">
                                <div className="address-card__row-title">{this.state.data_alamat[index].alamat}</div>
                                <div className="address-card__row-title">{'Kel. '}{this.state.data_alamat[index].kelurahan}{', Kec. '}{this.state.data_alamat[index].kecamatan}{', '}{this.state.data_alamat[index].kota}</div>
                                <div className="address-card__row-title">{this.state.data_alamat[index].provinsi}{', '}{this.state.data_alamat[index].kodepos}</div>
                                <div className="address-card__row-title">{'Telepon : '}{this.state.data_alamat[index].no_telp}</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    renderInputTanggalPengiriman() {
        var get_index = ""

        if (this.state.data_checkout.length > 0) {
            for (var x = 0; x < this.state.data_checkout.length; x++) {
                if (this.state.data_checkout[x].seller_id == this.state.selected_seller) {
                    get_index = x

                    if (this.state.selected_pilihtglkirim == false) {
                        return (
                            <Input
                                style={{ fontSize: '13px', fontWeight: '500' }}
                                id={"tgl_kirim_" + this.state.selected_seller}
                                type="date"
                                spellCheck="false"
                                autoComplete="off"
                                className="form-control mt-3"
                                // value={document.getElementById("tgl_kirim_" + this.state.selected_seller).value}
                                value={this.state.data_checkout[get_index].tgl_permintaan_kirim}
                                onChange={event => this.HandlePilihTglKirim(event, "tgl_kirim_" + this.state.selected_seller)}
                            />
                        )
                    }
                    else if (this.state.selected_pilihtglkirim == true) {
                        return (
                            <Input
                                style={{ fontSize: '13px', fontWeight: '500' }}
                                id={"tgl_kirim_" + this.state.selected_seller}
                                type="date"
                                spellCheck="false"
                                autoComplete="off"
                                className="form-control mt-3"
                                value={document.getElementById("tgl_kirim_" + this.state.selected_seller).value}
                                onChange={event => this.HandlePilihTglKirim(event, "tgl_kirim_" + this.state.selected_seller)}
                            />
                        )
                    }

                    // return (
                    //     <Input
                    //         style={{ fontSize: '13px', fontWeight: '500' }}
                    //         id={"tgl_kirim_" + this.state.selected_seller}
                    //         type="date"
                    //         spellCheck="false"
                    //         autoComplete="off"
                    //         className="form-control mt-3"
                    //         // value={document.getElementById("tgl_kirim_" + this.state.selected_seller).value}
                    //         value={this.state.data_checkout[get_index].tgl_permintaan_kirim}
                    //         onChange={event => this.HandlePilihTglKirim(event, "tgl_kirim_" + this.state.selected_seller)}
                    //     />
                    // )
                    break;
                }
            }
        }
    }

    renderDaftarAlamatPenagihan() {

        let filter_data_checkout;
        filter_data_checkout = this.state.data_checkout.filter(filter => {
            return filter.seller_id == this.state.selected_seller;
        });

        return this.state.data_alamat.map((data, index) => {

            if (filter_data_checkout.length > 0) {
                if (this.state.data_alamat[index].id == filter_data_checkout[0].billto_id) {
                    var radio_selected = true
                    return (
                        <div className="card-body" style={{ padding: '15px' }}>
                            <div className="row">
                                <div className="col-md-1 col-sm-1 col-1">
                                    <span className="input-radio__body">
                                        <input
                                            type="radio"
                                            className="input-radio__input"
                                            name="checkout_alamat_penagihan"
                                            value={this.state.data_alamat[index].id}
                                            onClick={() => this.handlePilihAlamat(this.state.data_alamat[index].id, 'billto')}
                                            style={{ cursor: 'pointer' }}
                                            defaultChecked={radio_selected}
                                        />
                                        <span className="input-radio__circle" />
                                    </span>
                                </div>
                                <div className="col-md-10 col-sm-10 col-10">
                                    <div className="address-card__row">
                                        <div className="address-card__row-title">{this.state.data_alamat[index].alamat}</div>
                                        <div className="address-card__row-title">{'Kel. '}{this.state.data_alamat[index].kelurahan}{', Kec. '}{this.state.data_alamat[index].kecamatan}{', '}{this.state.data_alamat[index].kota}</div>
                                        <div className="address-card__row-title">{this.state.data_alamat[index].provinsi}{', '}{this.state.data_alamat[index].kodepos}</div>
                                        <div className="address-card__row-title">{'Telepon : '}{this.state.data_alamat[index].no_telp}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                // else {
                //     var radio_selected = false
                // }
            }

            // return (
            //     <div className="card-body" style={{ padding: '15px' }}>
            //         <div className="row">
            //             <div className="col-md-1">
            //                 <span className="input-radio__body">
            //                     <input
            //                         type="radio"
            //                         className="input-radio__input"
            //                         name="checkout_alamat_penagihan"
            //                         value={this.state.data_alamat[index].id}
            //                         onClick={() => this.handlePilihAlamat(this.state.data_alamat[index].id, 'billto')}
            //                         style={{ cursor: 'pointer' }}
            //                         defaultChecked={radio_selected}
            //                     />
            //                     <span className="input-radio__circle" />
            //                 </span>
            //             </div>
            //             <div className="col-md-10">
            //                 <div className="address-card__row">
            //                     <div className="address-card__row-title">{this.state.data_alamat[index].alamat}</div>
            //                     <div className="address-card__row-title">{'Kel. '}{this.state.data_alamat[index].kelurahan}{', Kec. '}{this.state.data_alamat[index].kecamatan}{', '}{this.state.data_alamat[index].kota}</div>
            //                     <div className="address-card__row-title">{this.state.data_alamat[index].provinsi}{', '}{this.state.data_alamat[index].kodepos}</div>
            //                     <div className="address-card__row-title">{'Telepon : '}{this.state.data_alamat[index].no_telp}</div>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // );
        });
    }

    render() {

        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Checkout', url: '' },
        ];

        const kurschange = this.state.data_kurs_cart.map((item) => {
            return (
                <li>
                    <span>
                        {item.penjual}
                        {' ('}
                        <NumberFormat value={Number(item.kurs_lastadd)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                        {' => '}
                        <NumberFormat value={Number(item.kurs_now)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                        {')'}
                    </span>
                </li>
            );
        });

        let content;

        if (this.state.load_datacheckout == 'done') {
            if (this.state.transaction_status == 'success') {
                content = (
                    <div className="block block-empty">
                        <div className="container">
                            <div className="block-empty__body">
                                <div className="block-empty__message"><i class="fas fa-check-circle fa-2x mb-3" style={{ color: '#8CC63E' }}></i></div>
                                <div className="block-empty__message">Selamat! Anda berhasil melakukan transaksi</div>
                                <div className="block-empty__message">
                                    dengan id : {' '}
                                    {/* <Link to="/transaksi/daftartransaksi"><strong>{this.state.label_id_transaction}</strong></Link> */}
                                    <strong>{this.state.label_id_transaction}</strong>
                                </div>
                                <div className="block-empty__actions">
                                    <Link to="/daftarproduklangganan" className="btn btn-primary btn-sm">Kembali belanja</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            else if (this.state.data_checkout.length > 0) {
                content = (
                    <div className="checkout block">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 col-lg-6 col-xl-7">
                                    <div className="card mb-0">
                                        <div className="card-body">
                                            <h5 className="card-title">Daftar Pesanan</h5>
                                            {this.renderItems()}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0" >
                                    <div className="card mb-0 stickytop">
                                        <div className="card-body">
                                            <h5 className="card-title ">Ringkasan Pesanan</h5>

                                            {this.renderCart()}

                                            {/* {this.state.data_penjual_length == 1 ?
                                                (<div>
                                                    Metode Pembayaran
                                                    {this.renderPaymentsListSingleSeller()}
                                                Pengiriman {'&'} Penagihan
                                                    {this.renderAlamatPengiriman()}
                                                    {this.renderAlamatPenagihan()}
                                                </div>) :
                                                (<div></div>)
                                            } */}
                                            {/* Metode Pembayaran
                                        {this.renderPaymentsListSingleSeller()}
                                        Pengiriman {'&'} Penagihan
                                        {this.renderAlamatPengiriman()}
                                        {this.renderAlamatPenagihan()} */}
                                            <CartContext.Consumer>
                                                {(value) => (
                                                    <button type="submit" className="btn btn-primary btn-md btn-block mt-3" onClick={async () => { await this.submitTransaksi(); await value.loadDataCart(); }}>Buat Pesanan</button>
                                                )}
                                            </CartContext.Consumer>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
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
                            <div className="block-empty__message loading">Sedang memuat</div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <React.Fragment>
                <Helmet>
                    <title>{`Checkout — ${theme.name}`}</title>
                </Helmet>

                <PageHeader header="Checkout" breadcrumb={breadcrumb} />

                {content}

                {/* <div className="checkout block">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-lg-6 col-xl-7">
                                <div className="card mb-0">
                                    <div className="card-body">
                                        <h5 className="card-title">Daftar Pesanan</h5>
                                        {this.renderItems()}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0">
                                <div className="card mb-0">
                                    <div className="card-body">
                                        <h5 className="card-title">Ringkasan Pesanan</h5>

                                        {this.renderCart()}

                                        {this.state.data_penjual_length == 1 ?
                                            (<div>
                                                Metode Pembayaran
                                                {this.renderPaymentsListSingleSeller()}
                                                Pengiriman {'&'} Penagihan
                                                {this.renderAlamatPengiriman()}
                                                {this.renderAlamatPenagihan()}
                                            </div>) :
                                            (<div></div>)
                                        } */}
                {/* Metode Pembayaran
                                        {this.renderPaymentsListSingleSeller()}
                                        Pengiriman {'&'} Penagihan
                                        {this.renderAlamatPengiriman()}
                                        {this.renderAlamatPenagihan()} */}
                {/* 
                                        <button type="submit" className="btn btn-primary btn-md btn-block mt-3" onClick={this.submitTransaksi}>Buat Pesanan</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <Modal isOpen={this.state.modalDaftarAlamat} centered size="md" backdrop="static" >
                    <ModalHeader className="modalHeaderCustom" toggle={this.toggleModalDaftarAlamat}>Pilih Alamat {this.state.modalDaftarAlamat_jenis}</ModalHeader>
                    {this.renderDaftarAlamatPengiriman()}
                </Modal>

                <Modal isOpen={this.state.modalDataPemesanan} centered size="xl" backdrop="static" >
                    <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleModalDataPemesanan}>Data Pemesanan</ModalHeader>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <div className="card-body" style={{ padding: '14px' }}>
                                Metode Pembayaran
                                {this.renderPaymentsListFilter()}
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <div className="card-body" style={{ padding: '14px' }}>
                                Alamat Penagihan
                                {this.renderDaftarAlamatPenagihan()}
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <div className="card-body" style={{ padding: '14px' }}>
                                Alamat Pengiriman
                                {this.renderDaftarAlamatPengiriman()}
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-10">
                            <div className="card-body" style={{ padding: '14px' }}>
                                Tanggal Kirim
                                {this.renderInputTanggalPengiriman()}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12" >
                            <div className="card-body" style={{ float: 'right', paddingTop: '0' }}>
                                <button type="submit" className="btn btn-primary btn-md btn" onClick={() => this.submitDataPemesanan()}>Simpan</button>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Dialog
                    maxWidth="xs"
                    open={this.state.openresponkurs}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Perubahan Kurs</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ada perubahan nominal kurs yang dilakukan oleh distributor :
                            {kurschange}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.loadDataCheckout()}>
                            Mengerti
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    maxWidth="xs"
                    open={this.state.openresponalamat}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Transaksi Tidak Dapat Dilakukan !</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Alamat Pengiriman yang Anda pilih tidak dapat digunakan untuk transaksi ke {this.state.label_distributor}. Silakan ubah alamat pengiriman atau hubungi distributor terkait.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.setState({ openresponalamat: false })}>
                            Mengerti
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    maxWidth="xs"
                    open={this.state.openresponerror}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Transaksi Gagal !</DialogTitle>
                    <DialogContent>
                        <center>
                            <i class="fas fa-exclamation-triangle fa-4x pb-4" style={{ color: '#f74545' }} ></i>
                        </center>
                        <DialogContentText>
                            Lakukan transaksi beberapa saat lagi.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.toggleDialogResponError()}>
                            Mengerti
                        </Button>
                    </DialogActions>
                </Dialog>

            </React.Fragment>
        );
    }
}


const mapStateToProps = (state) => ({
    cart: state.cart,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCheckout);
