// react
import React, { Component } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { InputGroup, InputGroupAddon, InputGroupText, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import NumberFormat from 'react-number-format';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Input } from 'reactstrap';
import 'font-awesome/css/font-awesome.min.css';
import swal from 'sweetalert';
import Pagination from '../shared/Pagination';
import Toast from 'light-toast';
import DialogCatch from '../shared/DialogCatch';

// data stubs
import addresses from '../../data/accountAddresses';
import theme from '../../data/theme';
import TransactionNegoTable from './TransactionNego-Table';

export default class TransactionNego extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data_tetap: [],
            data: [],
            data_pagination: [],
            data_paginationtetap: [],
            history_nego: [],
            data_nego_length: '',
            display_negoform: 'none',
            display_dealnego: 'none',
            displaydeal: 'none',
            id_history_nego: '',
            data_negoaktif_length: '',
            data_negoselesai_length: '',
            harganego1_pembeli: '',
            harganego2_pembeli: '',
            harganego3_pembeli: '',
            harganego1_penjual: '',
            harganego2_penjual: '',
            harganego3_penjual: '',
            harganegocurrent_pembeli: '',
            harganegocurrent_penjual: '',
            harga_final: '',
            updatedate1: '',
            updateby1: '',
            updatedate2: '',
            updateby2: '',
            updatedate3: '',
            updateby3: '',
            inputNego: '',
            idBarang: '',
            namaBarang: '',
            satuanBarang: '',
            hargaBarang: '',
            hargaSales: '',
            id_mastercart: '',
            get_qty: '',
            get_berat: '',
            get_qty_approve: '',
            get_berat_approve: '',
            kurs: '',
            selectedSort: '',
            openNego: false,
            openCatatan: false,
            openApprovalNego: false,
            openFilter: false,
            time_to_respon: 'yes',
            sizeModal: 'lg',
            nego_countBarang: '',
            notes: '',
            namaBarangApproval: '',
            hargaBarangAwal: '',
            hargaBarangApproval: '',
            negocountBarangApproval: '',
            historyidApproval: '',
            id_mastercartApproval: '',
            page_negoaktif: 1, page_negoselesai: 1,
            total_page_negoaktif: '',
            total_page_negoselesai: '',
            sliceX: '0',
            sliceY: '10',
            displaycatch: false,
            date_from: '', date_to: '',
            checkTabPane: true, activeTab: 'aktif',
            data_negoaktif_tetap: [],
            data_negoaktif: [],
            data_negoaktif_length: '',
            data_pagination_negoaktif: [],
            data_paginationtetap_negoaktif: [],

            data_negoselesai_tetap: [],
            data_negoselesai: [],
            data_negoselesai_length: '',
            data_pagination_negoselesai: [],
            data_paginationtetap_negoselesai: [],

            negocurrent1_penjual: '',
            negocurrent2_penjual: '',
            negocurrent3_penjual: '',
            negocurrent_penjual: '',

            selected_id_nego: '',
            selected_status_nego: ''

        };
    }

    ClickTabPane = async (get_status) => {
        await this.setState({
            checkTabPane: null,
            activeTab: get_status
        })
        // if (this.state.activeTab == 'aktif') {
        //     let total_pagination = Math.ceil(this.state.data_waitingtetap.length / 10)
        //     this.setState({
        //         data_waiting: this.state.data_waitingtetap,
        //         total_page_waiting: total_pagination
        //     })
        // }
        // else if (this.state.activeTab == 'selesai') {
        //     let total_pagination = Math.ceil(this.state.data_ongoingtetap.length / 10)
        //     this.setState({
        //         data_ongoing: this.state.data_ongoingtetap,
        //         total_page_ongoing: total_pagination
        //     })
        // }

        document.getElementById('searchBarNego').value = ''
        document.getElementById('SortingNego').selectedIndex = '0'
    }

    controlCatatanDisplay = () => {
        this.setState({ openCatatan: !this.state.openCatatan });
    }

    controlApprovalNego = () => {
        this.setState({ openApprovalNego: !this.state.openApprovalNego });
    }

    controlRiwayatDisplay = () => {
        document.getElementById('riwayatnego').style.display = 'block'
        this.setState({
            sizeModal: 'xl'
        });
        if (this.state.nego_countBarang == 1) {
            document.getElementById('overlayNego2').style.display = 'flex'
            document.getElementById('badgeNego2').style.display = 'none'
            document.getElementById('overlayNego3').style.display = 'flex'
            document.getElementById('badgeNego3').style.display = 'none'
            document.getElementById('labelupdateNego2').style.display = 'none'
            document.getElementById('labelupdateNego3').style.display = 'none'
        }
        else if (this.state.nego_countBarang == 2) {
            document.getElementById('overlayNego3').style.display = 'flex'
            document.getElementById('badgeNego3').style.display = 'none'
            document.getElementById('labelupdateNego3').style.display = 'none'
        }

        this.forceUpdate()
    }

    approve_nego = (id, harga_sales) => {

        this.setState({
            namaBarangApproval: this.state.data_paginationtetap_negoaktif[id].nama,
            hargaBarangAwal: Math.ceil(this.state.data_paginationtetap_negoaktif[id].price * this.state.data_paginationtetap_negoaktif[id].kurs),
            hargaBarangApproval: harga_sales,
            satuanBarangApproval: this.state.data_paginationtetap_negoaktif[id].satuan,
            negocountBarangApproval: this.state.data_paginationtetap_negoaktif[id].nego_count,
            historyidApproval: this.state.data_paginationtetap_negoaktif[id].history_nego_id,
            id_mastercartApproval: this.state.data_paginationtetap_negoaktif[id].id_mastercart,
            get_qty_approve: this.state.data_paginationtetap_negoaktif[id].qty,
            get_berat_approve: this.state.data_paginationtetap_negoaktif[id].berat,
            openApprovalNego: true,
        });
    }

    getFilterWaktu = (event) => {
        if (event.target.value == 'lain') {
            this.toggleFilterDate()
            event.target.value = ''
        }
        else {
            this.LoadDataAll_Filter(event.target.value, this.state.selectedSort)
        }
    }

    getSelectSorting = (event) => {
        var get_sorting = event.target.value
        this.setState({
            selectedSort: get_sorting
        });
        var doSorting = require('lodash');
        if (this.state.activeTab == 'aktif') {
            if (get_sorting == 'terbaru') {
                var sort = doSorting.sortBy(this.state.data_pagination_negoaktif, ['create_date']).reverse()
                this.setState({
                    data_pagination_negoaktif: sort
                });
            }
            else if (get_sorting == 'terlama') {
                var sort = doSorting.sortBy(this.state.data_pagination_negoaktif, ['create_date'])
                this.setState({
                    data_pagination_negoaktif: sort
                });
            }
            else if (get_sorting == 'terendah') {
                var sort = this.state.data_pagination_negoaktif.sort(function (a, b) { return (a.price * a.kurs) - (b.price * b.kurs) });
                this.setState({
                    data_pagination_negoaktif: sort
                });
            }
            else if (get_sorting == 'tertinggi') {
                var sort = this.state.data_pagination_negoaktif.sort(function (a, b) { return (b.price * b.kurs) - (a.price * a.kurs) });
                this.setState({
                    data_pagination_negoaktif: sort
                });
            }
        }

        else if (this.state.activeTab == 'selesai') {
            if (get_sorting == 'terbaru') {
                var sort = doSorting.sortBy(this.state.data_pagination_negoselesai, ['create_date']).reverse()
                this.setState({
                    data_pagination_negoselesai: sort
                });
            }
            else if (get_sorting == 'terlama') {
                var sort = doSorting.sortBy(this.state.data_pagination_negoselesai, ['create_date'])
                this.setState({
                    data_pagination_negoselesai: sort
                });
            }

            else if (get_sorting == 'terendah') {
                var sort = this.state.data_pagination_negoselesai.sort(function (a, b) { return (a.price * a.kurs) - (b.price * b.kurs) });
                this.setState({
                    data_pagination_negoselesai: sort
                });
            }
            else if (get_sorting == 'tertinggi') {
                var sort = this.state.data_pagination_negoselesai.sort(function (a, b) { return (b.price * b.kurs) - (a.price * a.kurs) });
                this.setState({
                    data_pagination_negoselesai: sort
                });
            }
        }

        this.forceUpdate()
    }

    handlePageChange_Aktif = (page_negoaktif) => {
        this.setState(() => ({ page_negoaktif }));
        this.GetDataPagination(page_negoaktif, 'negoaktif')
    };

    handlePageChange_Selesai = (page_negoselesai) => {
        this.setState(() => ({ page_negoselesai }));
        this.GetDataPagination(page_negoselesai, 'negoselesai')
    };

    nego_detail = async (id, status) => {

        var param = ""
        if (status == 'aktif') {
            param = this.state.data_paginationtetap_negoaktif[id].history_nego_id
        }
        else {
            param = this.state.data_paginationtetap_negoselesai[id].history_nego_id
        }

        let history_nego = encrypt("SELECT a.id, b.barang_id, b.qty, d.berat,a.harga_nego, a.harga_sales, a.notes, a.created_by, a.created_date, a.updated_by, " +
            "a.updated_date, a.harga_nego_2, a.harga_sales_2, a.harga_nego_3, a.harga_sales_3, a.harga_final, a.updated_by_2, a.updated_by_3, a.updated_date_2, a.updated_date_3, " +
            "to_char(a.time_respon, 'yyyy-MM-dd HH24:MI:SS') as time_respon, b.nego_count, b.id as id_mastercart, b.harga_sales as harga_sales_mastercart " +
            "FROM gcm_history_nego a, gcm_master_cart b, gcm_list_barang c, gcm_master_barang d where a.id ='" + param + "' and a.id = b.history_nego_id and b.barang_id = c.id and c.barang_id = d.id")

        Toast.loading('loading . . .', () => {
        });

        await Axios.post(url.select, {
            query: history_nego
        }).then(async (data) => {
            this.setState({
                history_nego: data.data.data,
                harganego1_pembeli: data.data.data[0].harga_nego,
                harganego1_penjual: data.data.data[0].harga_sales,
                harganego2_pembeli: data.data.data[0].harga_nego_2,
                harganego2_penjual: data.data.data[0].harga_sales_2,
                harganego3_pembeli: data.data.data[0].harga_nego_3,
                harganego3_penjual: data.data.data[0].harga_sales_3,
                harga_final: data.data.data[0].harga_final,
                updateby1: data.data.data[0].updated_by,
                updateby2: data.data.data[0].updated_by_2,
                updateby3: data.data.data[0].updated_by_3,
                get_berat: data.data.data[0].berat,
                get_qty: data.data.data[0].qty,
                id_mastercart: data.data.data[0].id_mastercart,
                notes: data.data.data[0].notes
            });

            Toast.hide();

            var respon_sales = 'yes'

            //cek respon time
            var gettime_respon = data.data.data[0].time_respon;
            var timestamp_respon = new Date(gettime_respon).getTime()
            var timestamp_now = new Date().getTime()
            var time_to_respon = "yes";

            if (timestamp_now >= timestamp_respon) {
                time_to_respon = "yes"
            }
            else if (timestamp_now < timestamp_respon) {
                time_to_respon = "no"
            }

            if (data.data.data[0].nego_count == '1') {
                if (data.data.data[0].harga_nego == null) {
                    this.setState({
                        harganego1_pembeli: 0
                    });
                }
                if (data.data.data[0].harga_sales == null || time_to_respon == 'no') {
                    this.setState({
                        harganego1_penjual: null
                    });
                }
                if (data.data.data[0].harga_nego_2 == null) {
                    this.setState({
                        harganego2_pembeli: 0
                    });
                }
                if (data.data.data[0].harga_sales_2 == null) {
                    this.setState({
                        harganego2_penjual: 0
                    });
                }
                if (data.data.data[0].harga_nego_3 == null) {
                    this.setState({
                        harganego3_pembeli: 0
                    });
                }
                if (data.data.data[0].harga_sales_3 == null) {
                    this.setState({
                        harganego3_penjual: 0
                    });
                }
            }

            else if (data.data.data[0].nego_count == '2') {
                if (data.data.data[0].harga_nego == null) {
                    this.setState({
                        harganego1_pembeli: 0
                    });
                }
                if (data.data.data[0].harga_sales == null) {
                    this.setState({
                        harganego1_penjual: 0
                    });
                }
                if (data.data.data[0].harga_nego_2 == null) {
                    this.setState({
                        harganego2_pembeli: 0
                    });
                }
                if (data.data.data[0].harga_sales_2 == null || time_to_respon == 'no') {
                    this.setState({
                        harganego2_penjual: null
                    });
                }
                if (data.data.data[0].harga_nego_3 == null) {
                    this.setState({
                        harganego3_pembeli: 0
                    });
                }
                if (data.data.data[0].harga_sales_3 == null) {
                    this.setState({
                        harganego3_penjual: 0
                    });
                }
            }

            else if (data.data.data[0].nego_count == '3') {
                if (data.data.data[0].harga_nego == null) {
                    this.setState({
                        harganego1_pembeli: 0
                    });
                }
                if (data.data.data[0].harga_sales == null) {
                    this.setState({
                        harganego1_penjual: 0
                    });
                }
                if (data.data.data[0].harga_nego_2 == null) {
                    this.setState({
                        harganego2_pembeli: 0
                    });
                }
                if (data.data.data[0].harga_sales_2 == null) {
                    this.setState({
                        harganego2_penjual: 0
                    });
                }
                if (data.data.data[0].harga_nego_3 == null) {
                    this.setState({
                        harganego3_pembeli: 0
                    });
                }
                if (data.data.data[0].harga_sales_3 == null || time_to_respon == 'no') {
                    this.setState({
                        harganego3_penjual: null
                    });
                }
            }

            if (data.data.data[0].updated_by == null) {
                this.setState({
                    updateby1: '-'
                });
            }

            if (data.data.data[0].updated_by_2 == null) {
                this.setState({
                    updateby2: '-'
                });
            }

            if (data.data.data[0].updated_by_3 == null) {
                this.setState({
                    updateby3: '-'
                });
            }

            if (data.data.data[0].updated_date != null) {
                this.setState({
                    updatedate1: data.data.data[0].updated_date.substring(8, 10) + '-' + data.data.data[0].updated_date.substring(5, 7) + '-' + data.data.data[0].updated_date.substring(0, 4)
                });

            }
            else {
                this.setState({
                    updatedate1: '-'
                });
            }
            if (data.data.data[0].updated_date_2 != null) {
                this.setState({
                    updatedate2: data.data.data[0].updated_date_2.substring(8, 10) + '-' + data.data.data[0].updated_date_2.substring(5, 7) + '-' + data.data.data[0].updated_date_2.substring(0, 4)
                });

            }
            else {
                this.setState({
                    updatedate2: '-'
                });
            }
            if (data.data.data[0].updated_date_3 != null) {
                this.setState({
                    updatedate3: data.data.data[0].updated_date_3.substring(8, 10) + '-' + data.data.data[0].updated_date_3.substring(5, 7) + '-' + data.data.data[0].updated_date_3.substring(0, 4)
                });
            }
            else {
                this.setState({
                    updatedate3: '-'
                });
            }


            var get_nego_count = ""
            if (status == 'aktif') {
                get_nego_count = this.state.data_paginationtetap_negoaktif[id].nego_count
            }
            else {
                get_nego_count = this.state.data_paginationtetap_negoselesai[id].nego_count
            }

            if (get_nego_count == 1) {
                this.setState({
                    harganegocurrent_pembeli: data.data.data[0].harga_nego,
                    harganegocurrent_penjual: data.data.data[0].harga_sales
                });

                //nego 1 belum ada respon dari seller
                if (data.data.data[0].harga_sales_mastercart == null || time_to_respon == 'no') {
                    respon_sales = 'no'
                    this.setState({
                        harganegocurrent_penjual: null,
                        negocurrent1_penjual: 'no',
                        negocurrent_penjual: 'no',
                        harga_final: 0,
                        display_dealnego: 'none',
                        display_negoform: 'none'
                    });
                }

                //nego 1 sudah ada respon
                else if (data.data.data[0].harga_sales_mastercart != null) {

                    this.setState({
                        negocurrent1_penjual: 'yes',
                        negocurrent_penjual: 'yes'
                    });

                    if (status == 'selesai') {
                        this.setState({
                            display_negoform: 'none',
                            display_dealnego: 'flex'
                        });
                    }
                    else if (status == 'aktif') {
                        this.setState({
                            display_negoform: 'block',
                            display_dealnego: 'none'
                        });
                    }
                }
                else {
                    document.getElementById('labelnegocurrent_penjualnull').style.display = 'none'
                }

            }

            else if (get_nego_count == 2) {
                this.setState({
                    harganegocurrent_pembeli: data.data.data[0].harga_nego_2,
                    harganegocurrent_penjual: data.data.data[0].harga_sales_2
                });

                //nego 2 belum ada respon dari seller
                if (data.data.data[0].harga_sales_2 == null || time_to_respon == 'no') {
                    respon_sales = 'no'
                    this.setState({
                        harganegocurrent_penjual: null,
                        negocurrent2_penjual: 'no',
                        negocurrent_penjual: 'no',
                        harga_final: 0,
                        display_dealnego: 'none',
                        display_negoform: 'none'
                    });
                }

                //nego 2 sudah ada respon
                else if (data.data.data[0].harga_sales_2 != null) {

                    this.setState({
                        negocurrent2_penjual: 'yes',
                        negocurrent_penjual: 'yes'
                    });

                    if (status == 'selesai') {
                        this.setState({
                            display_negoform: 'none',
                            display_dealnego: 'flex'
                        });
                    }
                    else if (status == 'aktif') {
                        this.setState({
                            display_negoform: 'block',
                            display_dealnego: 'none'
                        });
                    }
                }
                else {
                    document.getElementById('labelnegocurrent_penjualnull').style.display = 'none'
                }
            }

            else if (get_nego_count == 3) {
                this.setState({
                    harganegocurrent_pembeli: data.data.data[0].harga_nego_3,
                    harganegocurrent_penjual: data.data.data[0].harga_sales_3
                });
                //nego 3 belum ada respon dari seller
                if (data.data.data[0].harga_sales_3 == null || time_to_respon == 'no') {
                    respon_sales = 'no'
                    this.setState({
                        harganegocurrent_penjual: null,
                        negocurrent3_penjual: 'no',
                        negocurrent_penjual: 'no',
                        harga_final: 0,
                        display_dealnego: 'none',
                        display_negoform: 'none'
                    });
                }

                //nego 3 sudah ada respon
                else if (data.data.data[0].harga_sales_3 != null) {

                    this.setState({
                        negocurrent3_penjual: 'yes',
                        negocurrent_penjual: 'yes'
                    });

                    if (status == 'selesai') {
                        this.setState({
                            display_negoform: 'none',
                            display_dealnego: 'flex'
                        });
                    }
                    else if (status == 'aktif') {
                        this.setState({
                            display_negoform: 'none',
                            display_dealnego: 'none'
                        });
                    }
                }
                else {
                    document.getElementById('labelnegocurrent_penjualnull').style.display = 'none'
                }
            }

            if (data.data.data[0].harga_final == 0 && respon_sales == 'yes') {
                document.getElementById('nego-form').style.display = 'block'
                document.getElementById('rowKesepakatanHarga').style.display = 'none'
            }
            else {
                if (data.data.data[0].harga_final != 0) {
                    document.getElementById('rowKesepakatanHarga').style.display = 'inset'
                }
                else {
                    document.getElementById('rowKesepakatanHarga').style.display = 'none'
                }
                document.getElementById('nego-form').style.display = 'none'
            }



        }).catch(err => {
            // this.setState({
            //     displaycatch: true
            // });
            // console.log('error' + err);
            // console.log(err);
        })

        // alert(this.state.data_paginationtetap_negoselesai[id].history_nego_id)
        // alert(this.state.data_paginationtetap_negoselesai[id].barang_id)
        // alert(this.state.data_paginationtetap_negoselesai[id].nama)
        // alert(this.state.data_paginationtetap_negoselesai[id].satuan)
        // alert(this.state.data_paginationtetap_negoselesai[id].price)
        // alert(this.state.data_paginationtetap_negoselesai[id].kurs)
        // alert(this.state.data_paginationtetap_negoselesai[id].nego_count)

        if (status == 'aktif') {
            this.setState({
                id_history_nego: this.state.data_paginationtetap_negoaktif[id].history_nego_id,
                idBarang: this.state.data_paginationtetap_negoaktif[id].barang_id,
                namaBarang: this.state.data_paginationtetap_negoaktif[id].nama,
                satuanBarang: this.state.data_paginationtetap_negoaktif[id].satuan,
                hargaBarang: Math.ceil(this.state.data_paginationtetap_negoaktif[id].price * this.state.data_paginationtetap_negoaktif[id].kurs),
                nego_countBarang: this.state.data_paginationtetap_negoaktif[id].nego_count,
                sizeModal: 'lg'
            });
        }
        else {
            this.setState({
                id_history_nego: this.state.data_paginationtetap_negoselesai[id].history_nego_id,
                idBarang: this.state.data_paginationtetap_negoselesai[id].barang_id,
                namaBarang: this.state.data_paginationtetap_negoselesai[id].nama,
                satuanBarang: this.state.data_paginationtetap_negoselesai[id].satuan,
                hargaBarang: Math.ceil(this.state.data_paginationtetap_negoselesai[id].price * this.state.data_paginationtetap_negoselesai[id].kurs),
                nego_countBarang: this.state.data_paginationtetap_negoselesai[id].nego_count,
                sizeModal: 'lg'
            });
        }

        // this.setState({
        //     id_history_nego: this.state.data[id].history_nego_id,
        //     idBarang: this.state.data[id].barang_id,
        //     namaBarang: this.state.data[id].nama,
        //     satuanBarang: this.state.data[id].satuan,
        //     hargaBarang: Math.ceil(this.state.data[id].price * this.state.data[id].kurs),
        //     nego_countBarang: this.state.data[id].nego_count,
        //     sizeModal: 'lg'
        // });

        if (this.state.data[id].harga_sales == null) {
            this.setState({
                hargaSales: "-"
            });
        }
        else {
            this.setState({
                hargaSales: this.state.data[id].harga_sales
            });
        }
        // this.forceUpdate();
        await this.toggleNego();

    }

    toggleNego = async () => {
        await this.setState({ openNego: !this.state.openNego });
    }

    toggleFilterDate = () => {
        this.setState({
            openFilter: !this.state.openFilter
        });
    }

    pencarianTabel = (event) => {

        let searching;
        let get_sorting = this.state.selectedSort
        var doSorting = require('lodash');

        if (event.target.value.length == 0) {
            if (this.state.activeTab == 'aktif') {
                if (this.state.selectedSort == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_negoaktif_tetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_negoaktif_tetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_negoaktif_tetap.sort(function (a, b) { return a.price - b.price });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_negoaktif_tetap.sort(function (a, b) { return b.price - a.price });
                }
                else {
                    var sort = this.state.data_negoaktif_tetap
                }

                let total_pagination = Math.ceil(this.state.data_negoaktif_tetap.length / 10)
                this.setState({
                    total_page_negoaktif: total_pagination,
                    data_negoaktif_length: '(' + sort.length + ')',
                    page_negoaktif: 1,
                    data_pagination_negoaktif: sort,
                    sliceX: '0',
                    sliceY: '10'
                });
                if (this.state.data_negoaktif_tetap.length > 0) {
                    document.getElementById('pagination_nego_Aktif').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'selesai') {
                if (this.state.selectedSort == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_negoselesai_tetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_negoselesai_tetap, ['create_date'])

                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_negoselesai_tetap.sort(function (a, b) { return a.price - b.price });

                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_negoselesai_tetap.sort(function (a, b) { return b.price - a.price });

                }
                else {
                    var sort = this.state.data_negoselesai_tetap
                }
                let total_pagination = Math.ceil(this.state.data_negoselesai_tetap.length / 10)
                this.setState({
                    total_page_negoselesai: total_pagination,
                    data_negoselesai_length: '(' + sort.length + ')',
                    page_negoselesai: 1,
                    data_pagination_negoselesai: sort,
                    sliceX: '0',
                    sliceY: '10'
                });
                if (this.state.data_negoselesai_tetap.length > 0) {
                    document.getElementById('pagination_nego_Selesai').style.display = 'block'
                } else {
                    document.getElementById('pagination_nego_Selesai').style.display = 'none'
                }
            }

            this.forceUpdate()
        }

        if (event.target.value.length > 0 || document.getElementById('searchBarNego').value.length > 0) {
            if (this.state.activeTab == 'aktif') {

                if (get_sorting == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_negoaktif_tetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_negoaktif_tetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_negoaktif_tetap.sort(function (a, b) { return a.price - b.price });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_negoaktif_tetap.sort(function (a, b) { return b.price - a.price });
                }
                else {
                    var sort = this.state.data_negoaktif_tetap
                }

                searching = sort.filter(input => {
                    return input.nama.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1 || input.nama_perusahaan.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
                });
                let total_pagination = Math.ceil(searching.length / 10)
                this.setState({
                    data_pagination_negoaktif: searching,
                    page_negoaktif: 1,
                    total_page_negoaktif: total_pagination,
                    data_negoaktif_length: '(' + searching.length + ')',
                    showData: searching.length,
                    totalData: this.state.data_negoaktif_tetap.length,
                    sliceX: '0',
                    sliceY: '10'
                });

                if (searching.length == 0) {
                    document.getElementById('pagination_nego_Aktif').style.display = 'none'
                }
                else {
                    document.getElementById('pagination_nego_Aktif').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'selesai') {
                if (get_sorting == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_negoselesai_tetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_negoselesai_tetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_negoselesai_tetap.sort(function (a, b) { return a.price - b.price });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_negoselesai_tetap.sort(function (a, b) { return b.price - a.price });
                }
                else {
                    var sort = this.state.data_negoselesai_tetap
                }

                searching = sort.filter(input => {
                    return input.nama.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1 || input.nama_perusahaan.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
                });
                let total_pagination = Math.ceil(searching.length / 10)
                this.setState({
                    data_pagination_negoselesai: searching,
                    page_negoselesai: 1,
                    total_page_negoselesai: total_pagination,
                    data_negoselesai_length: '(' + searching.length + ')',
                    showData: searching.length,
                    totalData: this.state.data_negoselesai_tetap.length,
                    sliceX: '0',
                    sliceY: '10'
                });

                if (searching.length == 0) {
                    document.getElementById('pagination_nego_Selesai').style.display = 'none'
                }
                else {
                    document.getElementById('pagination_nego_Selesai').style.display = 'block'
                }

            }
        }
        this.forceUpdate()


        // let searching;
        // if (event.target.value.length > 0) {
        //     searching = this.state.data_tetap.filter(input => {
        //         return input.nama.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1 || input.nama_perusahaan.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
        //     });
        //     console.log(searching)
        //     this.setState({ data_pagination: searching.slice(0, 10) });
        //     let total_pagination = Math.ceil(searching.length / 10)
        //     this.setState({
        //         total_page: total_pagination,
        //         data_nego_length: searching.length,
        //         page: 1
        //     });
        // }
        // if (event.target.value.length == 0) {
        //     let total_pagination = Math.ceil(this.state.data_tetap.length / 10)
        //     this.setState({
        //         total_page: total_pagination,
        //         data_pagination: this.state.data_paginationtetap,
        //         data_nego_length: this.state.data_tetap.length
        //     });

        // }
        // if (searching.length == 0) {
        //     document.getElementById('pagination_nego').style.display = 'none'
        // }
        // else {
        //     document.getElementById('pagination_nego').style.display = 'block'
        // }
        // this.forceUpdate()
    }

    // untuk nego ke 2 dan 3 
    kirimNego = () => {

        var input_nego = document.getElementById('inputNego').value.split('.').join("")
        var user_id = decrypt(localStorage.getItem('UserIDLogin'))

        if (input_nego == "") {
            Toast.info('Silakan masukkan harga nego !', 2500, () => {
            });
        }

        else if (Number(input_nego) < Number(this.state.harganegocurrent_pembeli)) {
            Toast.info('Harga nego harus lebih dari penawaran terakhir Anda', 2500, () => {
            });
        }
        else if (Number(input_nego) > Number(this.state.hargaBarang)) {
            Toast.info('Harga nego harus kurang dari harga barang', 2500, () => {
            });
        }

        else {
            Toast.loading('loading . . .', () => {
            });

            let nego2 = "with new_update as (update gcm_history_nego set harga_nego_2 = " + input_nego + ", updated_by_2 = " + user_id +
                " , updated_date_2 = now() where id=" + this.state.id_history_nego + " returning harga_nego_2 as harga_nego, updated_date_2 as updated_date) "

            let nego3 = "with new_update as (update gcm_history_nego set harga_nego_3 = " + input_nego + ", updated_by_3 = " + user_id +
                " , updated_date_3 = now() where id=" + this.state.id_history_nego + " returning harga_nego_3 as harga_nego, updated_date_3 as updated_date) "

            if (this.state.nego_countBarang == 1) {
                var nego = nego2
            }
            else if (this.state.nego_countBarang == 2) {
                var nego = nego3
            }

            let update_mastercart = "update gcm_master_cart set nego_count = nego_count + 1 , harga_konsumen = " +
                "(select harga_nego from new_update)" + " , update_by = " + user_id +
                ", update_date = (select updated_date from new_update) where id = '" + this.state.id_mastercart + "'"

            let final_query = encrypt(nego.concat(update_mastercart))

            Axios.post(url.select, {
                query: final_query
            }).then(data => {
                document.getElementById('inputNego').value = ""
                Toast.hide();
                Toast.success('Berhasil mengirim nego', 2000, () => {
                });
                this.LoadDataNego()
                this.toggleNego()
            }).catch(err => {
                // console.log('error' + err);
                // console.log(err);
            })
        }
    }

    kirimNotes = () => {
        var input_notes = document.getElementById('inputNotes').value
        let notes = encrypt("update gcm_history_nego set notes = '" + input_notes + "' where id=" + this.state.id_history_nego)

        Axios.post(url.select, {
            query: notes
        }).then(data => {
            this.setState({ openCatatan: false });
            this.forceUpdate()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    submitApproval = () => {
        var param_update = ""
        if (this.state.negocountBarangApproval == 1) {
            param_update = "harga_nego"
        }
        else if (this.state.negocountBarangApproval == 2) {
            param_update = "harga_nego_2"
        }
        else if (this.state.negocountBarangApproval == 3) {
            param_update = "harga_nego_3"
        }

        let approve1 = "with new_update as (update gcm_history_nego set harga_final = " + this.state.hargaBarangApproval + ", " + param_update + " = "
            + this.state.hargaBarangApproval + " where id = " + this.state.historyidApproval + ") "
        let approve2 = "update gcm_master_cart set harga_konsumen = harga_sales where id = " + this.state.id_mastercartApproval

        let final_query = encrypt(approve1.concat(approve2))
        Toast.loading('loading . . .', () => {
        });
        Axios.post(url.select, {
            query: final_query
        }).then(data => {
            Toast.hide()
            Toast.success('Harga berhasil disepakati', 2000, () => {
            });
            window.location.reload()
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })
    }

    GetDataPagination(get_page, get_nego) {

        if (get_nego == 'negoaktif') {
            this.setState({
                sliceX: (get_page * 10) - 10,
                sliceY: get_page * 10,
                data_pagination_negoaktif: this.state.data_negoaktif_tetap.slice((get_page * 10) - 10, get_page * 10)
            });
        }
        else {
            this.setState({
                sliceX: (get_page * 10) - 10,
                sliceY: get_page * 10,
                data_pagination_negoselesai: this.state.data_negoselesai_tetap.slice((get_page * 10) - 10, get_page * 10)
            });
        }

    }

    sortTable(n) {
        // alert("klik")
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("daftar-nego");
        switching = true;
        //Set the sorting direction to ascending:
        dir = "desc";
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            // rows = table.rows;
            rows = 3;
            /*Loop through all table rows (except the
            first, which contains table headers):*/
            for (i = 1; i < (rows.length - 1); i++) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                /*Get the two elements you want to compare,
                one from current row and one from the next:*/
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];

                /*check if the two rows should switch place,
                based on the direction, asc or desc:*/
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /*If a switch has been marked, make the switch
                and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                //Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /*If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again.*/
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

    async LoadDataAll_Filter(get_param, get_sort) {

        if (localStorage.getItem('Login') != null) {

            document.getElementById('filter_date').style.display = 'none'

            var range;
            var compare = 'true'
            var search = '';
            var sort = '';
            var get_seacrh = document.getElementById('searchBarNego').value.toString().toLowerCase();

            //sort
            if (get_sort == '') {
                sort = ''
            }
            else if (get_sort == 'terbaru') {
                sort = " order by a.create_date desc"
            }
            else if (get_sort == 'terlama') {
                sort = " order by a.create_date asc"
            }
            else if (get_sort == 'terendah') {
                sort = " order by (b.price * h.nominal ) asc"
            }
            else if (get_sort == 'tertinggi') {
                sort = " order by (b.price * h.nominal ) desc"
            }

            //search
            if (get_seacrh.length == 0) {
                search = ""
            }
            else {
                search = " and (lower(e.nama)  like '%" + get_seacrh + "%' or lower (g.nama_perusahaan) like '%" + get_seacrh + "%')"
            }

            if (get_param == 'all') {
                range = "a.create_date <= date_trunc('day', CURRENT_TIMESTAMP +'1 day')"
            }
            else if (get_param == '1') {
                range = "a.create_date >= date_trunc('day', CURRENT_TIMESTAMP )"
            }
            else if (get_param == '7') {
                range = "a.create_date > date_trunc('day', CURRENT_TIMESTAMP - interval '7 day')"
            }
            else if (get_param == '30') {
                range = "a.create_date > date_trunc('day', CURRENT_TIMESTAMP - interval '30 day')"
            }
            else if (get_param == 'blnini') {
                range = "extract (month FROM a.create_date) = extract (month FROM CURRENT_DATE) and extract (year FROM a.create_date) = extract (year FROM CURRENT_DATE)"
            }
            else if (get_param == 'blnlalu') {
                range = "a.create_date >= date_trunc('month', current_date - interval '1' month) and a.create_date < date_trunc('month', current_date)"
            }
            else if (get_param == 'between') {
                var date_from = document.getElementById('date_from').value
                var date_to = document.getElementById('date_to').value

                //compare date
                var comp_date_from = new Date(date_from)
                var comp_date_to = new Date(date_to)

                if (date_from == '' || date_to == '') {
                    compare = 'null'
                    Toast.fail('Silakan isi tanggal yang kosong', 1500, () => {
                    });
                }

                else {
                    if (comp_date_from > comp_date_to) {
                        compare = 'false'
                    }
                    else if (comp_date_from < comp_date_to) {
                        compare = 'true'
                    }
                    else if (comp_date_from == comp_date_to) {
                        compare = 'true'
                    }
                    range = "a.create_date between '" + date_from + "' and date '" + date_to + "'+ integer'1'"
                }

            }

            if (compare == 'true') {
                Toast.loading('loading . . .', () => {
                });

                // let nego = encrypt("select a.id as id_mastercart, d.id, a.status, e.nama, e.berat, a.barang_id,a.qty, b.price, b.foto, e.category_id, b.company_id, a.nego_count, a.harga_konsumen, a.harga_sales, a.history_nego_id, f.harga_final, f.harga_nego as harga_nego_1, f.harga_sales as harga_sales_1, f.harga_nego_2, f.harga_sales_2, f.harga_nego_3, f.harga_sales_3, g.nama_perusahaan, a.create_date " +
                //     "from gcm_master_company g , gcm_history_nego f inner join gcm_master_cart a on f.id = a.history_nego_id inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang e on b.barang_id=e.id " +
                //     "left join gcm_master_user c on c.id=a.update_by left join gcm_master_company d on d.id=c.company_id " +
                //     "where a.company_id= " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and nego_count > 0 and b.company_id = g.id and " + range + " order by a.update_date desc")

                let nego = encrypt("select a.id as id_mastercart, d.id, a.status, e.nama, e.berat, a.barang_id,a.qty, b.price, b.foto, e.category_id, b.company_id, a.nego_count, a.harga_konsumen, a.harga_sales, a.history_nego_id, f.harga_final, " +
                    "f.harga_nego as harga_nego_1, f.harga_sales as harga_sales_1, f.harga_nego_2, f.harga_sales_2, f.harga_nego_3, f.harga_sales_3, to_char(f.time_respon, 'yyyy-MM-dd HH24:MI:SS') as time_respon , " +
                    "case when now() < f.time_respon then 'no' end as status_time_respon, " +
                    "g.nama_perusahaan, to_char(a.create_date, 'dd-MM-yyyy / HH24:MI') as create_date, h.nominal as kurs, i.alias as satuan " +
                    "from gcm_master_company g , gcm_history_nego f inner join gcm_master_cart a on f.id = a.history_nego_id inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang e on b.barang_id=e.id " +
                    "left join gcm_master_user c on c.id=a.update_by left join gcm_master_company d on d.id=c.company_id inner join gcm_listing_kurs h on h.company_id = b.company_id inner join gcm_master_satuan i on e.satuan = i.id " +
                    "where b.company_id = g.id and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and nego_count > 0 and now() between h.tgl_start and h.tgl_end and " + range + search + sort)

                Axios.post(url.select, {
                    query: nego
                }).then(async (data) => {
                    await this.setState({
                        data_tetap: data.data.data,
                        data: data.data.data,
                        data_nego_length: data.data.data.length,
                        // data_pagination: data.data.data.slice(this.state.sliceX, this.state.sliceY),
                        // data_paginationtetap: data.data.data.slice(this.state.sliceX, this.state.sliceY)
                    });

                    // let nego_aktif = this.state.data_tetap.filter(input => {
                    //     return input.status.toLowerCase() == 'a';
                    // });

                    // let nego_selesai = this.state.data_tetap.filter(input => {
                    //     return input.status.toLowerCase() == 'i';
                    // });

                    let nego_aktif = this.state.data_tetap.filter(input => {
                        return (input.status.toLowerCase() == 'a' && input.harga_final == '0') || (input.status.toLowerCase() == 'a' && input.status_time_respon == 'no');
                    });

                    let nego_selesai = this.state.data_tetap.filter(input => {
                        return input.harga_final != '0' && input.status_time_respon != 'no';
                    });

                    if (get_param == 'between') {

                        this.setState({
                            date_from: document.getElementById('date_from').value.toString(),
                            date_to: document.getElementById('date_to').value.toString(),
                            openFilter: false
                        });
                        document.getElementById('filter_date').style.display = 'block'

                    }

                    this.setState({
                        data_negoaktif_tetap: nego_aktif,
                        data_negoaktif: nego_aktif,
                        data_negoaktif_length: '(' + nego_aktif.length + ')',
                        data_pagination_negoaktif: nego_aktif.slice(this.state.sliceX, this.state.sliceY),
                        data_paginationtetap_negoaktif: nego_aktif.slice(this.state.sliceX, this.state.sliceY),

                        data_negoselesai_tetap: nego_selesai,
                        data_negoselesai: nego_selesai,
                        data_negoselesai_length: '(' + nego_selesai.length + ')',
                        data_pagination_negoselesai: nego_selesai.slice(this.state.sliceX, this.state.sliceY),
                        data_paginationtetap_negoselesai: nego_selesai.slice(this.state.sliceX, this.state.sliceY)
                    });

                    if (nego_aktif.length <= 2) {
                        this.setState({
                            total_page_negoaktif: 1
                        });
                    }
                    else {
                        var total_pagination = Math.ceil(nego_aktif.length / 10)
                        this.setState({
                            total_page_negoaktif: total_pagination
                        });
                    }

                    if (nego_selesai.length <= 2) {
                        this.setState({
                            total_page_negoselesai: 1
                        });
                    }
                    else {
                        var total_pagination = Math.ceil(nego_selesai.length / 10)
                        this.setState({
                            total_page_negoselesai: total_pagination
                        });
                    }

                    Toast.hide()

                    document.getElementById('shimmerTransactionNego_Aktif').style.display = 'none'
                    document.getElementById('shimmerTransactionNego_Selesai').style.display = 'none'
                    document.getElementById('contentShimmerTransactionNego_Aktif').style.display = 'contents'
                    document.getElementById('contentShimmerTransactionNego_Selesai').style.display = 'contents'

                    if (this.state.data_negoaktif.length == 0) {
                        document.getElementById('alertemptyNego_Aktif').style.display = 'table-cell'
                        document.getElementById('rowTransactionNego').style.display = 'none'
                        document.getElementById('pagination_nego_Aktif').style.display = 'none'
                    }
                    else {
                        document.getElementById('pagination_nego_Aktif').style.display = 'block'
                        document.getElementById('rowTransactionNego').style.display = 'inset'
                        document.getElementById('alertemptyNego_Aktif').style.display = 'none'
                    }

                    if (this.state.data_negoselesai.length == 0) {
                        document.getElementById('alertemptyNego_Selesai').style.display = 'table-cell'
                        document.getElementById('rowTransactionNego').style.display = 'none'
                        document.getElementById('pagination_nego_Selesai').style.display = 'none'
                    }
                    else {
                        document.getElementById('pagination_nego_Selesai').style.display = 'block'
                        document.getElementById('rowTransactionNego').style.display = 'inset'
                        document.getElementById('alertemptyNego_Selesai').style.display = 'none'
                    }

                    document.getElementById('date_from').value = ''
                    document.getElementById('date_to').value = ''

                }).catch(err => {
                    // console.log('error' + err);
                    // console.log(err);
                })
            }

            else if (compare == 'false') {
                Toast.fail('Anda memasukkan tanggal yang salah', 1500, () => {
                });
            }
        }
    }

    LoadDataNego = () => {
        if (localStorage.getItem('Login') != null) {

            // let nego = encrypt("select a.id as id_mastercart, d.id, a.status, e.nama, e.berat, a.barang_id,a.qty, b.price, b.foto, e.category_id, b.company_id, a.nego_count, a.harga_konsumen, a.harga_sales, a.history_nego_id, f.harga_final, " +
            //     "f.harga_nego as harga_nego_1, f.harga_sales as harga_sales_1, f.harga_nego_2, f.harga_sales_2, f.harga_nego_3, f.harga_sales_3, to_char(f.time_respon, 'yyyy-MM-dd HH24:MI:SS') as time_respon , g.nama_perusahaan, to_char(a.create_date, 'dd-MM-yyyy / HH24:MI') as create_date, h.nominal as kurs, i.alias as satuan " +
            //     "from gcm_master_company g , gcm_history_nego f inner join gcm_master_cart a on f.id = a.history_nego_id inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang e on b.barang_id=e.id " +
            //     "left join gcm_master_user c on c.id=a.update_by left join gcm_master_company d on d.id=c.company_id inner join gcm_listing_kurs h on h.company_id = b.company_id inner join gcm_master_satuan i on e.satuan = i.id " +
            //     "where b.company_id = g.id and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and nego_count > 0 and now() between h.tgl_start and h.tgl_end order by a.update_date desc")

            let nego = encrypt("select a.id as id_mastercart, d.id, a.status, e.nama, e.berat, a.barang_id,a.qty, b.price, b.foto, e.category_id, b.company_id, a.nego_count, a.harga_konsumen, a.harga_sales, a.history_nego_id, f.harga_final, " +
                "f.harga_nego as harga_nego_1, f.harga_sales as harga_sales_1, f.harga_nego_2, f.harga_sales_2, f.harga_nego_3, f.harga_sales_3, to_char(f.time_respon, 'yyyy-MM-dd HH24:MI:SS') as time_respon , " +
                "case when now() < f.time_respon then 'no' end as status_time_respon, " +
                "g.nama_perusahaan, to_char(a.create_date, 'dd-MM-yyyy / HH24:MI') as create_date, h.nominal as kurs, i.alias as satuan " +
                "from gcm_master_company g , gcm_history_nego f inner join gcm_master_cart a on f.id = a.history_nego_id inner join gcm_list_barang b on a.barang_id=b.id inner join gcm_master_barang e on b.barang_id=e.id " +
                "left join gcm_master_user c on c.id=a.update_by left join gcm_master_company d on d.id=c.company_id inner join gcm_listing_kurs h on h.company_id = b.company_id inner join gcm_master_satuan i on e.satuan = i.id " +
                "where b.company_id = g.id and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and nego_count > 0 and now() between h.tgl_start and h.tgl_end order by a.update_date desc")

            Axios.post(url.select, {
                query: nego
            }).then(data => {
                this.setState({
                    data_tetap: data.data.data,
                    data: data.data.data,
                    data_nego_length: data.data.data.length,
                });

                let nego_aktif = this.state.data_tetap.filter(input => {
                    return (input.status.toLowerCase() == 'a' && input.harga_final == '0') || (input.status.toLowerCase() == 'a' && input.status_time_respon == 'no');
                });

                let nego_selesai = this.state.data_tetap.filter(input => {
                    return input.harga_final != '0' && input.status_time_respon != 'no';
                });

                this.setState({
                    data_negoaktif_tetap: nego_aktif,
                    data_negoaktif: nego_aktif,
                    data_negoaktif_length: '(' + nego_aktif.length + ')',
                    data_pagination_negoaktif: nego_aktif.slice(this.state.sliceX, this.state.sliceY),
                    data_paginationtetap_negoaktif: nego_aktif.slice(this.state.sliceX, this.state.sliceY),

                    data_negoselesai_tetap: nego_selesai,
                    data_negoselesai: nego_selesai,
                    data_negoselesai_length: '(' + nego_selesai.length + ')',
                    data_pagination_negoselesai: nego_selesai.slice(this.state.sliceX, this.state.sliceY),
                    data_paginationtetap_negoselesai: nego_selesai.slice(this.state.sliceX, this.state.sliceY)
                });

                if (nego_aktif.length <= 2) {
                    this.setState({
                        total_page_negoaktif: 1
                    });
                }
                else {
                    var total_pagination = Math.ceil(nego_aktif.length / 10)
                    this.setState({
                        total_page_negoaktif: total_pagination
                    });
                }

                if (nego_selesai.length <= 2) {
                    this.setState({
                        total_page_negoselesai: 1
                    });
                }
                else {
                    var total_pagination = Math.ceil(nego_selesai.length / 10)
                    this.setState({
                        total_page_negoselesai: total_pagination
                    });
                }

                document.getElementById('shimmerTransactionNego_Aktif').style.display = 'none'
                document.getElementById('shimmerTransactionNego_Selesai').style.display = 'none'
                document.getElementById('contentShimmerTransactionNego_Aktif').style.display = 'contents'
                document.getElementById('contentShimmerTransactionNego_Selesai').style.display = 'contents'

                if (this.state.data_negoaktif.length == 0) {
                    document.getElementById('alertemptyNego_Aktif').style.display = 'table-cell'
                    // document.getElementById('rowTransactionNego').style.display = 'none'
                    document.getElementById('pagination_nego_Aktif').style.display = 'none'
                }
                else {
                    document.getElementById('pagination_nego_Aktif').style.display = 'block'
                    // document.getElementById('rowTransactionNego').style.display = 'inset'
                    document.getElementById('alertemptyNego_Aktif').style.display = 'none'
                }

                if (this.state.data_negoselesai.length == 0) {
                    document.getElementById('alertemptyNego_Selesai').style.display = 'table-cell'
                    // document.getElementById('rowTransactionNego').style.display = 'none'
                    document.getElementById('pagination_nego_Selesai').style.display = 'none'
                }
                else {
                    document.getElementById('pagination_nego_Selesai').style.display = 'block'
                    // document.getElementById('rowTransactionNego').style.display = 'inset'
                    document.getElementById('alertemptyNego_Selesai').style.display = 'none'
                }

            }).catch(err => {
                // console.log('error' + err);
                // console.log(err);
            })
            // this.GetDataPagination(1)

        }
    }

    async componentDidMount() {
        this.LoadDataNego()
    }

    render() {
        const address = addresses[0];

        return (
            <div className="dashboard" >
                <Helmet>
                    <title>{`Transaksi — ${theme.name}`}</title>
                </Helmet>

                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header" >
                        <div className="row" style={{ marginBottom: '10px' }}>
                            <div className="col-md-4" >
                                <h5>Daftar Nego</h5>
                            </div>

                            <div className="col-md-8" >
                                <label id="filter_date" style={{ float: 'right', display: 'none', fontSize: '11px' }}>
                                    Filter : {this.state.date_from} s.d. {this.state.date_to}
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-3 mt-xs-1 mt-sm-1 mt-1" >
                                <select className="form-control" id="FilterTransaksi" onChange={this.getFilterWaktu}>
                                    <option value="" disabled selected hidden>Filter waktu</option>
                                    <option value="all">Semua</option>
                                    <option value="1">Hari Ini</option>
                                    <option value="7">7 hari terakhir</option>
                                    <option value="30">30 hari terakhir</option>
                                    <option value="blnini">Bulan Ini</option>
                                    <option value="blnlalu">Bulan Lalu</option>
                                    <option value="lain">Lainnya</option>
                                </select>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-3 mt-xs-1 mt-sm-1 mt-1" >
                                <select className="form-control" id="SortingNego" onChange={this.getSelectSorting}>
                                    <option value="" disabled selected hidden>Urutkan</option>
                                    <option value="terbaru">Tanggal (Baru-Lama)</option>
                                    <option value="terlama">Tanggal (Lama-Baru)</option>
                                    <option value="tertinggi">Harga Barang (Tertinggi)</option>
                                    <option value="terendah">Harga Barang (Terendah)</option>
                                </select>
                            </div>
                            <div className="col-md-2" >

                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 mt-xs-1 mt-sm-1 mt-1" >
                                <div className="input-group" >
                                    <input id="searchBarNego" type="text" class="form-control" autoComplete="off" spellCheck="false" placeholder="Cari data di sini..." onChange={event => this.pencarianTabel(event)} />
                                    <div className="input-group-append">
                                        <span id="searchBarNego" className="input-group-text"><i className="fa fa-search"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab_container">
                        <input className="radioTab" id="tab1" type="radio" name="tabs" checked={this.state.checkTabPane} onClick={() => this.ClickTabPane('aktif')} />
                        <label className="labeledit" for="tab1" style={{ width: '50%' }}>Aktif {''}{this.state.data_negoaktif_length}</label>

                        <input className="radioTab" id="tab2" type="radio" name="tabs" onClick={() => this.ClickTabPane('selesai')} style={{ width: '50%' }} />
                        <label className="labeledit" for="tab2" style={{ width: '50%' }}>Selesai {''}{this.state.data_negoselesai_length}</label>

                        <section id="content1" class="tab-content">
                            <div className="card-table">
                                <div className="table-responsive-sm">
                                    <table >
                                        <thead>
                                            <tr>
                                                <th onClick={() => this.sortTable(0)}><center>Barang</center></th>
                                                <th><center>Penjual</center></th>
                                                <th><center>Tanggal</center></th>
                                                <th><center>Harga Barang <br />(Rp)</center></th>
                                                <th><center>Harga Nego <br />(Rp)</center></th>
                                                <th><center>Harga Penjual <br />(Rp)</center></th>
                                                <th><center>Sisa Nego</center></th>
                                                <th><center>Aksi</center></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <div id="shimmerTransactionNego_Aktif" style={{ display: 'contents' }}>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                            </div>

                                            <div id="contentShimmerTransactionNego_Aktif" style={{ display: 'none' }}>
                                                {this.state.data_pagination_negoaktif.map((value, index) => {
                                                    return (<TransactionNegoTable data={value} index={index} length={this.state.data_pagination_negoaktif.length} kurs={this.state.kurs} approve_nego={this.approve_nego} nego_detail={this.nego_detail} status="nego_aktif" />)
                                                })
                                                }
                                            </div>

                                            <tr>
                                                <td id='alertemptyNego_Aktif' style={{ display: 'none' }} colspan="8"><center>- Tidak Ada Data -</center></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div id="pagination_nego_Aktif" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                                        <Pagination
                                            value=''
                                            current={this.state.page_negoaktif}
                                            siblings={2}
                                            total={this.state.total_page_negoaktif}
                                            onPageChange={this.handlePageChange_Aktif}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="content2" class="tab-content">
                            <div className="card-table">
                                <div className="table-responsive-sm">
                                    <table >
                                        <thead>
                                            <tr>
                                                <th onClick={() => this.sortTable(0)}><center>Barang</center></th>
                                                <th><center>Penjual</center></th>
                                                <th><center>Tanggal</center></th>
                                                <th><center>Harga Barang <br />(Rp)</center></th>
                                                <th><center>Harga Nego <br />(Rp)</center></th>
                                                <th><center>Harga Penjual <br />(Rp)</center></th>
                                                <th><center>Sisa Nego</center></th>
                                                <th><center>Aksi</center></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <div id="shimmerTransactionNego_Selesai" style={{ display: 'contents' }}>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                            </div>

                                            <div id="contentShimmerTransactionNego_Selesai" style={{ display: 'none' }}>
                                                {this.state.data_pagination_negoselesai.map((value, index) => {
                                                    return (<TransactionNegoTable data={value} index={index} kurs={this.state.kurs} approve_nego={this.approve_nego} nego_detail={this.nego_detail} status="nego_selesai" />)
                                                })
                                                }
                                            </div>

                                            <tr>
                                                <td id='alertemptyNego_Selesai' style={{ display: 'none' }} colspan="8"><center>- Tidak Ada Data -</center></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div id="pagination_nego_Selesai" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                                        <Pagination
                                            current={this.state.page_negoselesai}
                                            siblings={2}
                                            total={this.state.total_page_negoselesai}
                                            onPageChange={this.handlePageChange_Selesai}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* <div className="card-table">
                        <div className="table-responsive-sm">
                            <table id='daftar-nego'>
                                <thead>
                                    <tr>
                                        <th onClick={() => this.sortTable(0)}><center>Barang</center></th>
                                        <th><center>Penjual</center></th>
                                        <th><center>Tanggal</center></th>
                                        <th><center>Harga Barang <br />(Rp)</center></th>
                                        <th><center>Harga Nego <br />(Rp)</center></th>
                                        <th><center>Harga Penjual <br />(Rp)</center></th>
                                        <th><center>Sisa Nego</center></th>
                                        <th><center>Aksi</center></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <div id="shimmerTransactionNego" style={{ display: 'contents' }}>
                                        <tr>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                        </tr>
                                        <tr>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                        </tr>
                                        <tr>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                            <td><linestable class="shine"></linestable></td>
                                        </tr>
                                    </div>

                                    <div id="contentShimmerTransactionNego" style={{ display: 'none' }}>
                                        {this.state.data_pagination.map((value, index) => {
                                            return (<TransactionNegoTable data={value} index={index} kurs={this.state.kurs} approve_nego={this.approve_nego} nego_detail={this.nego_detail} />)
                                        })
                                        }
                                    </div>

                                    <tr>
                                        <td id='alertemptyNego' style={{ display: 'none' }} colspan="8"><center>- Tidak Ada Data -</center></td>
                                    </tr>

                                </tbody>
                            </table>

                        </div>

                    </div>
                    <div id="pagination_nego" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                        <Pagination
                            current={this.state.page}
                            siblings={2}
                            total={this.state.total_page}
                            onPageChange={this.handlePageChange}
                        />
                    </div> */}

                </div>

                <Modal isOpen={this.state.openNego} size={this.state.sizeModal} centered>
                    <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleNego}>Nego</ModalHeader>
                    <ModalBody style={{ padding: '30px' }}>
                        <div className="row">
                            <div className="col-md-8" >
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Nama Barang</div>
                                    <div className="address-card__row-content"><strong>{this.state.namaBarang}</strong></div>
                                </div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Harga Barang</div>
                                    <div className="address-card__row-content"><strong><NumberFormat value={this.state.hargaBarang} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /> <label style={{ fontSize: '12px', fontWeight: '600' }}>/ {this.state.satuanBarang}</label></strong></div>
                                </div>
                            </div>
                            <div className="col-md-4 pt-3 pt-sm-0 pt-md-0 pt-lg-0 pt-xl-0" >
                                <button className="btn btn-secondary btn-sm" type="submit" onClick={this.controlRiwayatDisplay.bind(this)} style={{ float: 'right' }} >Riwayat Nego</button>
                                <span data-toggle="tooltip" title="Tambahkan catatan">
                                    <button className="btn btn-secondary btn-sm" type="submit" onClick={this.controlCatatanDisplay.bind(this)} style={{ float: 'right', marginRight: '5px' }} >
                                        <i class="fas fa-pencil-alt"></i>
                                    </button>
                                </span>
                            </div>
                        </div>

                        <div id='riwayatnego' style={{ display: 'none' }}>
                            <label style={{ fontSize: '15px', fontWeight: '700', marginTop: '15px' }}>Riwayat Nego</label>
                            <hr />

                            <div className="row">
                                <div className="col-md-4" >
                                    <div id='nego1' className="dashboard__address card address-card address-card--featured" style={{ width: '100%' }} >
                                        {/* <label style={{ fontSize: '11px', fontWeight: '400', position: "absolute", paddingLeft: '3px' }}>update : {this.state.updatedate1}, by : {this.state.updateby1}</label> */}
                                        <label style={{ fontSize: '11px', fontWeight: '400', position: "absolute", paddingLeft: '3px' }}>diperbarui : {this.state.updatedate1}</label>
                                        <div className="overlay" id="overlayNego1" style={{ display: 'none' }}><label style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>Nego 1</label></div>
                                        <div id="badgeNego1" className="address-card__badge" style={{ display: 'block' }}>Nego 1</div>
                                        <div className="address-card__body" >

                                            <div className="table-responsive-sm">
                                                <table style={{ width: '100%' }}>
                                                    <tbody>
                                                        <tr>
                                                            <td><label style={{ fontSize: '13px', fontWeight: '400' }}>Harga Nego</label></td><td style={{ textAlign: 'right' }}><span id='nego1-pembeli' style={{ fontSize: '15px', fontWeight: '600' }}><NumberFormat value={this.state.harganego1_pembeli} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span></td>
                                                        </tr>
                                                        <tr>
                                                            <td><label style={{ fontSize: '13px', fontWeight: '400' }}>Harga Penjual</label></td><td style={{ textAlign: 'right' }}>
                                                                <span style={{ fontSize: '15px', fontWeight: '600' }}>

                                                                    {this.state.negocurrent1_penjual == 'no' ?
                                                                        (<span>Menunggu respon</span>)
                                                                        :
                                                                        (<span><NumberFormat value={this.state.harganego1_penjual} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>)
                                                                    }

                                                                </span>
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4" >
                                    <div id='nego2' className="dashboard__address card address-card address-card--featured" style={{ width: '100%' }} >
                                        <label id='labelupdateNego2' style={{ fontSize: '11px', fontWeight: '400', position: "absolute", paddingLeft: '3px' }}>diperbarui : {this.state.updatedate2}</label>
                                        {/* <label id='labelupdateNego2' style={{ fontSize: '11px', fontWeight: '400', position: "absolute", paddingLeft: '3px' }}>update : {this.state.updatedate2}, by : {this.state.updateby2}</label> */}
                                        <div className="overlay" id="overlayNego2" style={{ display: 'none' }}><label style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>Nego 2 </label></div>
                                        <div id="badgeNego2" className="address-card__badge" style={{ display: 'block' }}>Nego 2</div>
                                        <div className="address-card__body" >
                                            <div className="table-responsive-sm">
                                                <table style={{ width: '100%' }}>
                                                    <tbody>
                                                        <tr>
                                                            <td><label style={{ fontSize: '13px', fontWeight: '400' }}>Harga Nego</label></td><td style={{ textAlign: 'right' }}><label style={{ fontSize: '15px', fontWeight: '600' }}><NumberFormat value={this.state.harganego2_pembeli} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></label></td>
                                                        </tr>
                                                        <tr>
                                                            <td><label style={{ fontSize: '13px', fontWeight: '400' }}>Harga Penjual</label></td><td style={{ textAlign: 'right' }}>
                                                                <span style={{ fontSize: '15px', fontWeight: '600' }}>

                                                                    {this.state.negocurrent2_penjual == 'no' ?
                                                                        (<span>Menunggu respon</span>)
                                                                        :
                                                                        (<span><NumberFormat value={this.state.harganego2_penjual} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>)
                                                                    }

                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4" >
                                    <div id='nego3' className="dashboard__address card address-card address-card--featured" style={{ width: '100%' }} >
                                        {/* <label id='labelupdateNego3' style={{ fontSize: '11px', fontWeight: '400', position: "absolute", paddingLeft: '3px' }}>update : {this.state.updatedate3}, by : {this.state.updateby3}</label> */}
                                        <label id='labelupdateNego3' style={{ fontSize: '11px', fontWeight: '400', position: "absolute", paddingLeft: '3px' }}>diperbarui : {this.state.updatedate3}</label>
                                        <div className="overlay" id="overlayNego3" style={{ display: 'none' }}><label style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>Nego 3</label></div>
                                        <div id="badgeNego3" className="address-card__badge" style={{ display: 'block' }}>Nego 3</div>
                                        <div className="address-card__body" >
                                            <div className="table-responsive-sm">
                                                <table style={{ width: '100%' }}>
                                                    <tbody>
                                                        <tr>
                                                            <td><label style={{ fontSize: '13px', fontWeight: '400' }}>Harga Nego</label></td><td style={{ textAlign: 'right' }}><label style={{ fontSize: '15px', fontWeight: '600' }}><NumberFormat value={this.state.harganego3_pembeli} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></label></td>
                                                        </tr>
                                                        <tr>
                                                            <td><label style={{ fontSize: '13px', fontWeight: '400' }}>Harga Penjual</label></td><td style={{ textAlign: 'right' }}>
                                                                <span style={{ fontSize: '15px', fontWeight: '600' }}>

                                                                    {this.state.negocurrent3_penjual == 'no' ?
                                                                        (<span>Menunggu respon</span>)
                                                                        :
                                                                        (<span><NumberFormat value={this.state.harganego3_penjual} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>)
                                                                    }

                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <label style={{ fontSize: '15px', fontWeight: '700', marginTop: '15px' }}>Pengajuan Nego</label>
                        <hr />

                        <div className="row justify-content">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-4">

                                <div className="row">
                                    <div className="col-7 col-md-7 col-sm-12">
                                        <label style={{ fontSize: '13px', fontWeight: '400' }}>Penawaran terakhir Anda </label>
                                    </div>
                                    <div className="col-5 col-md-5 col-sm-12" style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '15px', fontWeight: '600' }}><NumberFormat value={this.state.harganegocurrent_pembeli} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                                    </div>
                                </div>

                                <div className="row" >
                                    <div className="col-7 col-md-7 col-sm-12">
                                        <label style={{ fontSize: '13px', fontWeight: '400' }}>Penawaran terakhir Penjual</label>
                                    </div>
                                    <div className="col-5 col-md-5 col-sm-12" style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '15px', fontWeight: '600' }}>
                                            {this.state.negocurrent_penjual == 'no' ?
                                                (<span>Menunggu respon</span>)
                                                :
                                                (<span><NumberFormat value={this.state.harganegocurrent_penjual} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>)
                                            }

                                            {/* <span id='labelnegocurrent_penjualnull' style={{ display: 'none' }}>Menunggu respon</span> */}
                                            {/* <span id='labelnegocurrent_penjual'><NumberFormat value={this.state.harganegocurrent_penjual} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span> */}
                                        </span>
                                    </div>
                                </div>

                                {/* <div id='rowKesepakatanHarga' className="row" style={{ display: this.state.display_dealnego }} >
                                    <div className="col-7 col-md-7 col-sm-12">
                                        <label style={{ fontSize: '13px', fontWeight: '400' }}>Kesepakatan Harga Akhir</label>
                                    </div>
                                    <div className="col-5 col-md-5 col-sm-12" style={{ textAlign: 'right' }}>
                                        <span id='hargaKesepakatan' style={{ fontSize: '15px', fontWeight: '600' }}><NumberFormat value={this.state.harga_final} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                                    </div>
                                </div> */}

                                <div className="row" style={{ display: this.state.display_dealnego }} >
                                    <div className="col-7 col-md-7 col-sm-12">
                                        <label style={{ fontSize: '13px', fontWeight: '400' }}>Kesepakatan Harga Akhir</label>
                                    </div>
                                    <div className="col-5 col-md-5 col-sm-12" style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '15px', fontWeight: '600' }}><NumberFormat value={this.state.harga_final} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></span>
                                    </div>
                                </div>

                                <div style={{ display: this.state.display_negoform }}>
                                    <div className="row" >
                                        <div className="col-12">
                                            <label style={{ fontSize: '13px', fontWeight: '400' }}>Masukkan Harga Nego</label>
                                        </div>
                                    </div>

                                    <div className="row" >
                                        <div className="col-7 col-md-7 col-sm-12">
                                            <InputGroup >
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>Rp</InputGroupText>
                                                </InputGroupAddon>
                                                <NumberFormat id='inputNego' style={{ width: '100%' }} className="form-control" allowNegative={false} spellCheck="false" autoComplete="off" thousandSeparator={'.'} decimalSeparator={','} />
                                            </InputGroup>
                                        </div>
                                        <div className="col-5 col-md-5 col-sm-12" style={{ textAlign: 'right' }}>
                                            <button className="btn btn-primary " type="submit" onClick={this.kirimNego.bind(this)} style={{ float: 'right', width: '120px' }}>
                                                <span id='spinner-nego' style={{ display: 'none' }}><i class="fa fa-spinner fa-spin"></i></span><span id='label-kirimnego'>Kirim Nego</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </ModalBody>
                </Modal >

                {/* Modal Approval Harga Nego*/}
                <Modal isOpen={this.state.openApprovalNego} size='md' centered>
                    <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.controlApprovalNego}>Kesepakatan Nego</ModalHeader>
                    <ModalBody style={{ padding: '30px' }}>
                        <div className="row">
                            <div className="col-md-8" >
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Nama Barang</div>
                                    <div className="address-card__row-content"><strong>{this.state.namaBarangApproval}</strong></div>
                                </div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Harga Barang</div>
                                    <div className="address-card__row-content"><strong><NumberFormat value={this.state.hargaBarangAwal} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /> <label style={{ fontSize: '12px', fontWeight: '600' }}>/ {this.state.satuanBarangApproval}</label></strong></div>
                                </div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Harga Kesepakatan</div>
                                    <div className="address-card__row-content"><strong><NumberFormat value={this.state.hargaBarangApproval} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /> <label style={{ fontSize: '12px', fontWeight: '600' }}>/ {this.state.satuanBarangApproval}</label></strong></div>
                                </div>
                            </div>
                            <div className="col-md-4" >
                                <button className="btn btn-secondary" type="submit" onClick={this.submitApproval.bind(this)} style={{ float: 'right' }} >Setujui Harga</button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal >

                {/* Modal Notes */}
                <Modal isOpen={this.state.openCatatan} size='md' centered>
                    <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.controlCatatanDisplay}>Catatan</ModalHeader>
                    <ModalBody style={{ padding: '30px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '500' }}>Silakan tulis catatan Anda untuk penjual !</label>
                        <textarea id='inputNotes' class="form-control" rows="4" cols="50" spellCheck="false" autoComplete="off">{this.state.notes}</textarea>
                        <button className="btn btn-primary mt-2 mt-md-3 mt-lg-4" type="submit" onClick={this.kirimNotes.bind(this)} style={{ float: 'right' }}>Simpan</button>
                    </ModalBody>
                </Modal >

                <Dialog
                    open={this.state.openFilter}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Filter Tanggal </DialogTitle>
                    <DialogContent>

                        <div className="row">
                            <div className="col-md-6">
                                <DialogContentText style={{ marginBottom: '5px' }}>
                                    dari :
                                </DialogContentText>
                                <Input
                                    id="date_from"
                                    type="date"
                                    spellCheck="false"
                                    autoComplete="off"
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <DialogContentText style={{ marginBottom: '5px' }}>
                                    sampai :
                                </DialogContentText>
                                <Input
                                    id="date_to"
                                    type="date"
                                    spellCheck="false"
                                    autoComplete="off"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.LoadDataAll_Filter('between')}>
                            OK
                        </Button>
                        <Button color="light" onClick={this.toggleFilterDate}>
                            Batal
                        </Button>
                    </DialogActions>
                </Dialog>

                <DialogCatch isOpen={this.state.displaycatch} />
            </div >
        );
    }
}
