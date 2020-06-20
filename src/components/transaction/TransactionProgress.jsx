// react
import React, { Component } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Input } from 'reactstrap';
import Pagination from '../shared/Pagination';
import Toast from 'light-toast';
import DialogCatch from '../shared/DialogCatch';

// data stubs
import addresses from '../../data/accountAddresses';
import datatheme from '../../data/theme';
import TransactionWaiting from './TransactionProgress-Waiting';
import TransactionOngoing from './TransactionProgress-Ongoing';
import TransactionShipped from './TransactionProgress-Shipped';
import TransactionReceived from './TransactionProgress-Received';
import TransactionComplained from './TransactionProgress-Complained';
import TransactionFinished from './TransactionProgress-Finished';
import TransactionCanceled from './TransactionProgress-Canceled';

export default class TransactionProgress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data_all: [],
            data_waitingtetap: [],
            data_waiting: [],
            data_waiting_length: '',
            data_ongoingtetap: [],
            data_ongoing: [],
            data_ongoing_length: '',
            data_shippedtetap: [],
            data_shipped: [],
            data_shipped_length: '',
            data_receivedtetap: [],
            data_received: [],
            data_received_length: '',
            data_complainedtetap: [],
            data_complained: [],
            data_complained_length: '',
            data_finishedtetap: [],
            data_finished: [],
            data_finished_length: '',
            data_canceledtetap: [],
            data_canceled: [],
            data_canceled_length: '',
            count_id_canceled_by_time: '', label_id_canceled_by_time: '',
            checkTabPane: true,
            openConfirmation: false, openConfirmationReceived: false,
            openConfirmationComplained: false, openTimeLimitComplained: false,
            openTimeLimitPaid: false,
            activeTab: 'waiting',
            page_waiting: 1,
            total_page_waiting: '',
            sliceX_waiting: '0',
            sliceY_waiting: '10',
            page_ongoing: 1,
            total_page_ongoing: '',
            sliceX_ongoing: '0',
            sliceY_ongoing: '10',
            page_shipped: 1,
            total_page_shipped: '',
            sliceX_shipped: '0',
            sliceY_shipped: '10',
            page_received: 1,
            total_page_received: '',
            sliceX_received: '0',
            sliceY_received: '10',
            page_complained: 1,
            total_page_complained: '',
            sliceX_complained: '0',
            sliceY_complained: '10',
            page_finished: 1,
            total_page_finished: '',
            sliceX_finished: '0',
            sliceY_finished: '10',
            page_canceled: 1,
            total_page_canceled: '',
            sliceX_canceled: '0',
            sliceY_canceled: '10',
            showData: '',
            totalData: '',
            selectedSort: '',
            set_finished: '', set_recieved: '',
            set_complained: '', set_complained_query: '',
            displaycatch: false,
            openFilter: false,
            date_from: '', date_to: ''
        };
    }

    ClickTabPane = async (get_status) => {
        await this.setState({
            checkTabPane: null,
            activeTab: get_status
        })
        if (this.state.activeTab == 'waiting') {
            let total_pagination = Math.ceil(this.state.data_waitingtetap.length / 10)
            this.setState({
                data_waiting: this.state.data_waitingtetap,
                total_page_waiting: total_pagination,
                //other length
                data_ongoing_length: "(" + this.state.data_ongoingtetap.length + ")",
                data_shipped_length: "(" + this.state.data_shippedtetap.length + ")",
                data_received_length: "(" + this.state.data_receivedtetap.length + ")",
                data_complained_length: "(" + this.state.data_complainedtetap.length + ")",
                data_finished_length: "(" + this.state.data_finishedtetap.length + ")",
                data_canceled_length: "(" + this.state.data_canceledtetap.length + ")"
            })
        }
        else if (this.state.activeTab == 'ongoing') {
            let total_pagination = Math.ceil(this.state.data_ongoingtetap.length / 10)
            this.setState({
                data_ongoing: this.state.data_ongoingtetap,
                total_page_ongoing: total_pagination,
                //other length
                data_waiting_length: "(" + this.state.data_waitingtetap.length + ")",
                data_shipped_length: "(" + this.state.data_shippedtetap.length + ")",
                data_received_length: "(" + this.state.data_receivedtetap.length + ")",
                data_complained_length: "(" + this.state.data_complainedtetap.length + ")",
                data_finished_length: "(" + this.state.data_finishedtetap.length + ")",
                data_canceled_length: "(" + this.state.data_canceledtetap.length + ")"
            })
        }
        else if (this.state.activeTab == 'shipped') {
            let total_pagination = Math.ceil(this.state.data_shippedtetap.length / 10)
            this.setState({
                data_shipped: this.state.data_shippedtetap,
                total_page_shipped: total_pagination,
                //other length
                data_waiting_length: "(" + this.state.data_waitingtetap.length + ")",
                data_ongoing_length: "(" + this.state.data_ongoingtetap.length + ")",
                data_received_length: "(" + this.state.data_receivedtetap.length + ")",
                data_complained_length: "(" + this.state.data_complainedtetap.length + ")",
                data_finished_length: "(" + this.state.data_finishedtetap.length + ")",
                data_canceled_length: "(" + this.state.data_canceledtetap.length + ")"
            })
        }
        else if (this.state.activeTab == 'received') {
            let total_pagination = Math.ceil(this.state.data_receivedtetap.length / 10)
            this.setState({
                data_received: this.state.data_receivedtetap,
                total_page_received: total_pagination,
                //other length
                data_waiting_length: "(" + this.state.data_waitingtetap.length + ")",
                data_ongoing_length: "(" + this.state.data_ongoingtetap.length + ")",
                data_shipped_length: "(" + this.state.data_shippedtetap.length + ")",
                data_complained_length: "(" + this.state.data_complainedtetap.length + ")",
                data_finished_length: "(" + this.state.data_finishedtetap.length + ")",
                data_canceled_length: "(" + this.state.data_canceledtetap.length + ")"
            })
        }
        else if (this.state.activeTab == 'complained') {
            let total_pagination = Math.ceil(this.state.data_complainedtetap.length / 10)
            this.setState({
                data_complained: this.state.data_complainedtetap,
                total_page_complained: total_pagination,
                //other length
                data_waiting_length: "(" + this.state.data_waitingtetap.length + ")",
                data_ongoing_length: "(" + this.state.data_ongoingtetap.length + ")",
                data_shipped_length: "(" + this.state.data_shippedtetap.length + ")",
                data_received_length: "(" + this.state.data_receivedtetap.length + ")",
                data_finished_length: "(" + this.state.data_finishedtetap.length + ")",
                data_canceled_length: "(" + this.state.data_canceledtetap.length + ")"
            })
        }
        else if (this.state.activeTab == 'finished') {
            let total_pagination = Math.ceil(this.state.data_finishedtetap.length / 10)
            this.setState({
                data_finished: this.state.data_finishedtetap,
                total_page_finished: total_pagination,
                //other length
                data_waiting_length: "(" + this.state.data_waitingtetap.length + ")",
                data_ongoing_length: "(" + this.state.data_ongoingtetap.length + ")",
                data_shipped_length: "(" + this.state.data_shippedtetap.length + ")",
                data_complained_length: "(" + this.state.data_complainedtetap.length + ")",
                data_received_length: "(" + this.state.data_receivedtetap.length + ")",
                data_canceled_length: "(" + this.state.data_canceledtetap.length + ")"
            })
        }
        else if (this.state.activeTab == 'canceled') {
            let total_pagination = Math.ceil(this.state.data_canceledtetap.length / 10)
            this.setState({
                data_canceled: this.state.data_canceledtetap,
                total_page_canceled: total_pagination,
                //other length
                data_waiting_length: "(" + this.state.data_waitingtetap.length + ")",
                data_ongoing_length: "(" + this.state.data_ongoingtetap.length + ")",
                data_shipped_length: "(" + this.state.data_shippedtetap.length + ")",
                data_complained_length: "(" + this.state.data_complainedtetap.length + ")",
                data_finished_length: "(" + this.state.data_finishedtetap.length + ")",
                data_received_length: "(" + this.state.data_receivedtetap.length + ")"
            })
        }

        document.getElementById('searchBarTransaction').value = ''
        document.getElementById('SortingTransaksi').selectedIndex = '0'
    }

    handlePageChangeWaiting = (page_waiting) => {
        this.setState(() => ({ page_waiting }));
        this.GetDataPaginationWaiting(page_waiting)
    };

    handlePageChangeOngoing = (page_ongoing) => {
        this.setState(() => ({ page_ongoing }));
        this.GetDataPaginationOngoing(page_ongoing)
    };

    handlePageChangeShipped = (page_shipped) => {
        this.setState(() => ({ page_shipped }));
        this.GetDataPaginationShipped(page_shipped)
    };

    handlePageChangeReceived = (page_received) => {
        this.setState(() => ({ page_received }));
        this.GetDataPaginationReceived(page_received)
    };

    handlePageChangeComplained = (page_complained) => {
        this.setState(() => ({ page_complained }));
        this.GetDataPaginationComplained(page_complained)
    };

    handlePageChangeFinished = (page_finished) => {
        this.setState(() => ({ page_finished }));
        this.GetDataPaginationFinished(page_finished)
    };

    handlePageChangeCanceled = (page_canceled) => {
        this.setState(() => ({ page_canceled }));
        this.GetDataPaginationCanceled(page_canceled)
    };

    async LoadDataAll() {
        if (localStorage.getItem('Login') != null) {

            let query_limit_time_bayar = encrypt("select string_agg(''''||a.id_transaction||''''  , ',') as id_transaction, string_agg(''||a.id_transaction||''  , ', ') as id_transaction_edit, " +
                "count (a.id_transaction) as jumlah from gcm_master_transaction a " +
                "inner join gcm_payment_listing b on a.payment_id = b.id " +
                "inner join gcm_seller_payment_listing c on b.payment_id = c.id " +
                "inner join gcm_master_payment d on c.payment_id = d.id " +
                "where a.status = 'WAITING' and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) +
                " and now() > a.create_date + interval '48 hours' and d.id = 2 order by id_transaction")

            await Axios.post(url.select, {
                query: query_limit_time_bayar
            }).then(data => {
                if (data.data.data[0].id_transaction != null) {
                    this.setState({
                        count_id_canceled_by_time: data.data.data[0].jumlah,
                        label_id_canceled_by_time: data.data.data[0].id_transaction_edit
                    })

                    let query_update_limit_time_bayar = encrypt("update gcm_master_transaction set status ='CANCELED', " +
                        "date_canceled = now(), cancel_reason = 'melewati batas waktu pembayaran' where id_transaction in (" + data.data.data[0].id_transaction + ")")
                    Axios.post(url.select, {
                        query: query_update_limit_time_bayar
                    }).then(data => {
                        if (this.state.count_id_canceled_by_time > 0) {
                            this.setState({ openTimeLimitPaid: true })
                        }
                    }).catch(err => {
                        // console.log('error');
                        // console.log(err);
                    })
                }
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })

            let query_limit_time_complain = encrypt("select string_agg(''''||e.id_transaction||'''' , ',') as id_transaction " +
                "from  gcm_master_company gmc ,gcm_transaction_detail a inner join " +
                "gcm_list_barang b on a.barang_id=b.id " +
                "inner join gcm_master_transaction e on e.id_transaction = a.transaction_id " +
                "inner join gcm_limit_complain f on b.company_id = f.company_id " +
                "where gmc.id = b.company_id and e.status = 'RECEIVED' " +
                "and now() > e.date_received + ( f.limit_hari || ' days')::interval")

            await Axios.post(url.select, {
                query: query_limit_time_complain
            }).then(data => {
                if (data.data.data[0].id_transaction != null) {
                    let query_update_limit_time_bayar = encrypt("update gcm_master_transaction set status ='FINISHED', " +
                        "date_finished = now() where id_transaction in (" + data.data.data[0].id_transaction + ")")
                    Axios.post(url.select, {
                        query: query_update_limit_time_bayar
                    }).then(data => {

                    }).catch(err => {
                        // console.log('error');
                        // console.log(err);
                    })
                }
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })

            // let query_limit_time_bayar = "with new_update as ( " +
            //     "update gcm_master_transaction set status ='CANCELED', update_date = now(), cancel_reason = 'melewati batas waktu pembayaran'" +
            //     "where id_transaction in (select a.id_transaction from gcm_master_transaction a " +
            //     "inner join gcm_payment_listing b on a.payment_id = b.id " +
            //     "inner join gcm_seller_payment_listing c on b.payment_id = c.id " +
            //     "inner join gcm_master_payment d on c.payment_id = d.id " +
            //     "where a.status = 'WAITING' and a.company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and now() > a.create_date + interval '48 hours' and d.id = 2))"

            let query_transaction = "select a.id_transaction, status,  a.create_date, to_char(a.create_date, 'dd-MM-yyyy / HH24:MI') as create_date_edit, to_char(a.date_ongoing, 'dd-MM-yyyy / HH24:MI') as date_ongoing, " +
                "to_char (a.date_shipped, 'dd-MM-yyyy / HH24:MI') as date_shipped, to_char(a.date_received, 'dd-MM-yyyy / HH24:MI') as date_received, to_char(a.date_complained, 'dd-MM-yyyy / HH24:MI') as date_complained, " +
                "to_char(a.date_finished, 'dd-MM-yyyy / HH24:MI') as date_finished, to_char(a.date_canceled, 'dd-MM-yyyy / HH24:MI') as date_canceled, sum(harga) as total, a.ongkos_kirim, " +
                "case when a.ongkos_kirim is null then (sum(harga)) + 0  else (sum(harga)) + a.ongkos_kirim  end as totaltrx , " +
                "case when a.ongkos_kirim is null then (sum(harga)) + ((sum(harga) * a.ppn_seller/100)) + 0  else (sum(harga)) + ((sum(harga) * a.ppn_seller/100)) + a.ongkos_kirim  end as totaltrx_tax, " +
                "case when a.ongkos_kirim is null then (sum(b.harga_final)) + ((sum(b.harga_final) * a.ppn_seller/100)) + 0  else (sum(b.harga_final)) + ((sum(b.harga_final) * a.ppn_seller/100)) + a.ongkos_kirim  end as totaltrx_tax_final, " +
                "sum(b.harga_final) + a.ongkos_kirim as totaltrx_final from gcm_master_transaction a inner join gcm_transaction_detail b on a.id_transaction=b.transaction_id where a.company_id= " + decrypt(localStorage.getItem('CompanyIDLogin')) + " group by a.id_transaction, status, " +
                "a.create_date, a.date_ongoing, a.date_shipped, a.date_received, a.date_complained, a.date_finished, a.date_canceled, a.ongkos_kirim, a.ppn_seller order by a.create_date desc"

            // let final_query = encrypt(query_limit_time_bayar.concat(query_transaction))
            let final_query = encrypt(query_transaction)

            await Axios.post(url.select, {
                query: final_query
            }).then(data => {

                this.setState({
                    data_all: data.data.data
                });

                let waiting = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'waiting';
                });

                let ongoing = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'ongoing';
                });

                let shipped = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'shipped';
                });

                let received = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'received';
                });

                let complained = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'complained';
                });

                let finished = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'finished';
                });

                let canceled = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'canceled';
                });

                this.setState({
                    data_waiting: waiting,
                    data_waitingtetap: waiting,
                    data_waiting_length: "(" + waiting.length + ")",
                    total_page_waiting: Math.ceil(waiting.length / 10),

                    data_ongoing: ongoing,
                    data_ongoingtetap: ongoing,
                    data_ongoing_length: "(" + ongoing.length + ")",
                    total_page_ongoing: Math.ceil(ongoing.length / 10),

                    data_shipped: shipped,
                    data_shippedtetap: shipped,
                    data_shipped_length: "(" + shipped.length + ")",
                    total_page_shipped: Math.ceil(shipped.length / 10),

                    data_received: received,
                    data_receivedtetap: received,
                    data_received_length: "(" + received.length + ")",
                    total_page_received: Math.ceil(received.length / 10),

                    data_complained: complained,
                    data_complainedtetap: complained,
                    data_complained_length: "(" + complained.length + ")",
                    total_page_complained: Math.ceil(complained.length / 10),

                    data_finished: finished,
                    data_finishedtetap: finished,
                    data_finished_length: "(" + finished.length + ")",
                    total_page_finished: Math.ceil(finished.length / 10),

                    data_canceled: canceled,
                    data_canceledtetap: canceled,
                    data_canceled_length: "(" + canceled.length + ")",
                    total_page_canceled: Math.ceil(canceled.length / 10),
                });

                if (this.state.data_waiting.length == 0) {
                    document.getElementById('alertemptyWaiting').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionWaiting').style.display = 'none'
                    document.getElementById('pagination-waiting').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-waiting').style.display = 'block'
                    document.getElementById('rowTransactionWaiting').style.display = 'inset'
                    document.getElementById('alertemptyWaiting').style.display = 'none'
                    document.getElementById('shimmerTransactionWaiting').style.display = 'none'
                    document.getElementById('contentShimmerTransactionWaiting').style.display = 'contents'
                }

                if (this.state.data_ongoing.length == 0) {
                    document.getElementById('alertemptyOngoing').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionOngoing').style.display = 'none'
                    document.getElementById('pagination-ongoing').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionOngoing').style.display = 'none'
                    document.getElementById('contentShimmerTransactionOngoing').style.display = 'contents'
                    document.getElementById('pagination-ongoing').style.display = 'block'
                    document.getElementById('rowTransactionOngoing').style.display = 'inset'
                    document.getElementById('alertemptyOngoing').style.display = 'none'
                }

                if (this.state.data_shipped.length == 0) {
                    document.getElementById('alertemptyShipped').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionShipped').style.display = 'none'
                    document.getElementById('pagination-shipped').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionShipped').style.display = 'none'
                    document.getElementById('contentShimmerTransactionShipped').style.display = 'contents'
                    document.getElementById('pagination-shipped').style.display = 'block'
                    document.getElementById('rowTransactionShipped').style.display = 'inset'
                    document.getElementById('alertemptyShipped').style.display = 'none'
                }

                if (this.state.data_received.length == 0) {
                    document.getElementById('alertemptyReceived').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionReceived').style.display = 'none'
                    document.getElementById('pagination-received').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-received').style.display = 'block'
                    document.getElementById('rowTransactionReceived').style.display = 'inset'
                    document.getElementById('alertemptyReceived').style.display = 'none'
                    document.getElementById('shimmerTransactionReceived').style.display = 'none'
                    document.getElementById('contentShimmerTransactionReceived').style.display = 'contents'
                }

                if (this.state.data_complained.length == 0) {
                    document.getElementById('alertemptyComplained').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionComplained').style.display = 'none'
                    document.getElementById('pagination-complained').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionComplained').style.display = 'none'
                    document.getElementById('contentShimmerTransactionComplained').style.display = 'contents'
                    document.getElementById('pagination-complained').style.display = 'block'
                    document.getElementById('rowTransactionComplained').style.display = 'inset'
                    document.getElementById('alertemptyComplained').style.display = 'none'
                }

                if (this.state.data_finished.length == 0) {
                    document.getElementById('alertemptyFinished').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionFinished').style.display = 'none'
                    document.getElementById('pagination-finished').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionFinished').style.display = 'none'
                    document.getElementById('contentShimmerTransactionFinished').style.display = 'contents'
                    document.getElementById('pagination-finished').style.display = 'block'
                    document.getElementById('rowTransactionFinished').style.display = 'inset'
                    document.getElementById('alertemptyFinished').style.display = 'none'
                }

                if (this.state.data_canceled.length == 0) {
                    document.getElementById('alertemptyCanceled').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionCanceled').style.display = 'none'
                    document.getElementById('pagination-canceled').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionCanceled').style.display = 'none'
                    document.getElementById('contentShimmerTransactionCanceled').style.display = 'contents'
                    document.getElementById('pagination-canceled').style.display = 'block'
                    document.getElementById('rowTransactionCanceled').style.display = 'inset'
                    document.getElementById('alertemptyCanceled').style.display = 'none'
                }

                // if (this.state.count_id_canceled_by_time > 0) {
                //     this.setState({ openTimeLimitPaid: true })
                // }

            }).catch(err => {
                // this.setState({
                //     displaycatch: !this.state.displaycatch
                // });
                // console.log('error');
                // console.log(err);
            })
            this.forceUpdate()
        }
    }

    async LoadDataAll_Filter(get_param, get_sort) {

        var range;
        var sort = '';
        var search = '';
        var get_seacrh = document.getElementById('searchBarTransaction').value;
        var compare = 'true';

        document.getElementById('filter_date').style.display = 'none'

        //sort
        if (get_sort == '') {
            sort = ''
        }
        else if (get_sort == 'terbaru') {
            sort = "order by create_date desc"
        }
        else if (get_sort == 'terlama') {
            sort = "order by create_date asc"
        }
        else if (get_sort == 'terendah') {
            sort = "order by totaltrx asc"
        }
        else if (get_sort == 'tertinggi') {
            sort = "order by totaltrx desc"
        }

        //search
        if (get_seacrh.length == 0) {
            search = ""
        }
        else {
            search = " and id_transaction like '%" + get_seacrh + "%'"
        }

        //filter
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

        if (localStorage.getItem('Login') != null && compare == 'true') {
            Toast.loading('loading . . .', () => {
            });

            let query_transaction = encrypt("select a.id_transaction, status,  a.create_date, to_char(a.create_date, 'dd-MM-yyyy / HH24:MI') as create_date_edit, a.update_date, " +
                "to_char(a.update_date, 'dd-MM-yyyy / HH24:MI') as update_date_edit, sum(harga) as total, a.ongkos_kirim, case when a.ongkos_kirim is null then (sum(harga)) + 0  else (sum(harga)) + a.ongkos_kirim  end as totaltrx ," +
                "sum(b.harga_final) + a.ongkos_kirim as totaltrx_final from gcm_master_transaction a inner join gcm_transaction_detail b " +
                "on a.id_transaction=b.transaction_id where a.company_id=" + decrypt(localStorage.getItem('CompanyIDLogin')) + " and " + range + search +
                " group by a.id_transaction, status, a.create_date, a.update_date, a.ongkos_kirim " + sort)

            await Axios.post(url.select, {
                query: query_transaction
            }).then(data => {
                this.setState({
                    data_all: data.data.data
                });

                let waiting = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'waiting';
                });

                let ongoing = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'ongoing';
                });

                let shipped = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'shipped';
                });

                let received = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'received';
                });

                let complained = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'complained';
                });

                let finished = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'finished';
                });

                let canceled = this.state.data_all.filter(input => {
                    return input.status.toLowerCase() == 'canceled';
                });

                this.setState({
                    data_waiting: waiting,
                    data_waitingtetap: waiting,
                    data_waiting_length: "(" + waiting.length + ")",
                    total_page_waiting: Math.ceil(waiting.length / 10),

                    data_ongoing: ongoing,
                    data_ongoingtetap: ongoing,
                    data_ongoing_length: "(" + ongoing.length + ")",
                    total_page_ongoing: Math.ceil(ongoing.length / 10),

                    data_shipped: shipped,
                    data_shippedtetap: shipped,
                    data_shipped_length: "(" + shipped.length + ")",
                    total_page_shipped: Math.ceil(shipped.length / 10),

                    data_received: received,
                    data_receivedtetap: received,
                    data_received_length: "(" + received.length + ")",
                    total_page_received: Math.ceil(received.length / 10),

                    data_complained: complained,
                    data_complainedtetap: complained,
                    data_complained_length: "(" + complained.length + ")",
                    total_page_complained: Math.ceil(complained.length / 10),

                    data_finished: finished,
                    data_finishedtetap: finished,
                    data_finished_length: "(" + finished.length + ")",
                    total_page_finished: Math.ceil(finished.length / 10),

                    data_canceled: canceled,
                    data_canceledtetap: canceled,
                    data_canceled_length: "(" + canceled.length + ")",
                    total_page_canceled: Math.ceil(canceled.length / 10),

                    openFilter: false
                });

                if (get_param == 'between') {
                    this.setState({
                        date_from: document.getElementById('date_from').value.toString(),
                        date_to: document.getElementById('date_to').value.toString()
                    });
                    document.getElementById('filter_date').style.display = 'block'
                }

                Toast.hide()

                if (this.state.data_waiting.length == 0) {
                    document.getElementById('alertemptyWaiting').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionWaiting').style.display = 'none'
                    document.getElementById('pagination-waiting').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-waiting').style.display = 'block'
                    document.getElementById('rowTransactionWaiting').style.display = 'inset'
                    document.getElementById('alertemptyWaiting').style.display = 'none'
                    document.getElementById('shimmerTransactionWaiting').style.display = 'none'
                    document.getElementById('contentShimmerTransactionWaiting').style.display = 'contents'
                }

                if (this.state.data_ongoing.length == 0) {
                    document.getElementById('alertemptyOngoing').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionOngoing').style.display = 'none'
                    document.getElementById('pagination-ongoing').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionOngoing').style.display = 'none'
                    document.getElementById('contentShimmerTransactionOngoing').style.display = 'contents'
                    document.getElementById('pagination-ongoing').style.display = 'block'
                    document.getElementById('rowTransactionOngoing').style.display = 'inset'
                    document.getElementById('alertemptyOngoing').style.display = 'none'
                }

                if (this.state.data_shipped.length == 0) {
                    document.getElementById('alertemptyShipped').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionShipped').style.display = 'none'
                    document.getElementById('pagination-shipped').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionShipped').style.display = 'none'
                    document.getElementById('contentShimmerTransactionShipped').style.display = 'contents'
                    document.getElementById('pagination-shipped').style.display = 'block'
                    document.getElementById('rowTransactionShipped').style.display = 'inset'
                    document.getElementById('alertemptyShipped').style.display = 'none'
                }

                if (this.state.data_received.length == 0) {
                    document.getElementById('alertemptyReceived').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionReceived').style.display = 'none'
                    document.getElementById('pagination-received').style.display = 'none'
                }
                else {
                    document.getElementById('alertemptyReceived').style.display = 'table-cell'
                    document.getElementById('contentShimmerTransactionReceived').style.display = 'contents'
                    document.getElementById('pagination-received').style.display = 'block'
                    document.getElementById('rowTransactionReceived').style.display = 'inset'
                    document.getElementById('alertemptyReceived').style.display = 'none'
                }

                if (this.state.data_complained.length == 0) {
                    document.getElementById('alertemptyComplained').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionComplained').style.display = 'none'
                    document.getElementById('pagination-complained').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionComplained').style.display = 'none'
                    document.getElementById('contentShimmerTransactionComplained').style.display = 'contents'
                    document.getElementById('pagination-complained').style.display = 'block'
                    document.getElementById('rowTransactionComplained').style.display = 'inset'
                    document.getElementById('alertemptyComplained').style.display = 'none'
                }

                if (this.state.data_finished.length == 0) {
                    document.getElementById('alertemptyFinished').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionFinished').style.display = 'none'
                    document.getElementById('pagination-finished').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionFinished').style.display = 'none'
                    document.getElementById('contentShimmerTransactionFinished').style.display = 'contents'
                    document.getElementById('pagination-finished').style.display = 'block'
                    document.getElementById('rowTransactionFinished').style.display = 'inset'
                    document.getElementById('alertemptyFinished').style.display = 'none'
                }

                if (this.state.data_canceled.length == 0) {
                    document.getElementById('alertemptyCanceled').style.display = 'table-cell'
                    document.getElementById('shimmerTransactionCanceled').style.display = 'none'
                    document.getElementById('pagination-canceled').style.display = 'none'
                }
                else {
                    document.getElementById('shimmerTransactionCanceled').style.display = 'none'
                    document.getElementById('contentShimmerTransactionCanceled').style.display = 'contents'
                    document.getElementById('pagination-canceled').style.display = 'block'
                    document.getElementById('rowTransactionCanceled').style.display = 'inset'
                    document.getElementById('alertemptyCanceled').style.display = 'none'
                }

                document.getElementById('date_from').value = ''
                document.getElementById('date_to').value = ''

            }).catch(err => {
                // this.setState({
                //     displaycatch: !this.state.displaycatch
                // });
                console.log('error');
                console.log(err);
            })
            this.forceUpdate()
        }

        else if (compare == 'false') {
            Toast.fail('Anda memasukkan tanggal yang salah', 1500, () => {
            });
        }
    }

    async LoadDataReceived() {
        let query_received = encrypt("select a.id_transaction, status, a.create_date, a.update_date, sum(qty*harga) as total from gcm_master_transaction a inner join gcm_transaction_detail b " +
            "on a.id_transaction=b.transaction_id where a.company_id=" + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status='RECEIVED' group by a.id_transaction, status, a.create_date, a.update_date " +
            "order by a.update_date desc;");
        await Axios.post(url.select, {
            query: query_received
        }).then(data => {
            this.setState({ data_received: data.data.data });
            if (data.data.data.length == 0) {
                document.getElementById('alertemptyReceived').style.display = 'table-cell'
                document.getElementById('rowTransactionReceived').style.display = 'none'
            }
            else {
                document.getElementById('rowTransactionReceived').style.display = 'inset'
                document.getElementById('alertemptyReceived').style.display = 'none'
            }
            this.LoadDataFinished()
            this.forceUpdate()
        }).catch(err => {
            console.log('error');
            console.log(err);
        })
        this.forceUpdate()
    }

    LoadDataComplained() {
        let query_complained = encrypt("select a.id_transaction, status, a.create_date, a.update_date, sum(qty*harga) as total from gcm_master_transaction a inner join gcm_transaction_detail b " +
            "on a.id_transaction=b.transaction_id where a.company_id=" + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status='COMPLAINED' group by a.id_transaction, status, a.create_date, a.update_date " +
            "order by a.update_date desc;");
        Axios.post(url.select, {
            query: query_complained
        }).then(data => {
            this.setState({ data_complained: data.data.data });
            if (data.data.data.length == 0) {
                document.getElementById('alertemptyComplained').style.display = 'table-cell'
                document.getElementById('rowTransactionComplained').style.display = 'none'
            }
            else {
                document.getElementById('rowTransactionComplained').style.display = 'inset'
                document.getElementById('alertemptyComplained').style.display = 'none'
            }
        }).catch(err => {
            console.log('error');
            console.log(err);
        })
    }


    LoadDataFinished() {
        let query_finished = encrypt("select a.id_transaction, status, a.create_date, a.update_date, sum(qty*harga) as total from gcm_master_transaction a inner join gcm_transaction_detail b " +
            "on a.id_transaction=b.transaction_id where a.company_id=" + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status='FINISHED' group by a.id_transaction, status, a.create_date, a.update_date " +
            "order by a.update_date desc;");
        Axios.post(url.select, {
            query: query_finished
        }).then(data => {
            this.setState({ data_finished: data.data.data });
            if (data.data.data.length == 0) {
                document.getElementById('alertemptyFinished').style.display = 'table-cell'
                document.getElementById('rowTransactionFinished').style.display = 'none'
            }
            else {
                document.getElementById('rowTransactionFinished').style.display = 'inset'
                document.getElementById('alertemptyFinished').style.display = 'none'
            }
        }).catch(err => {
            console.log('error');
            console.log(err);
        })
    }

    GetDataPaginationWaiting(get_page) {
        this.setState({
            sliceX_waiting: (get_page * 10) - 10,
            sliceY_waiting: get_page * 10
        });
    }

    GetDataPaginationOngoing(get_page) {
        this.setState({
            sliceX_ongoing: (get_page * 10) - 10,
            sliceY_ongoing: get_page * 10
        });
    }

    GetDataPaginationShipped(get_page) {
        this.setState({
            sliceX_shipped: (get_page * 10) - 10,
            sliceY_shipped: get_page * 10
        });
    }

    GetDataPaginationReceived(get_page) {
        this.setState({
            sliceX_received: (get_page * 10) - 10,
            sliceY_received: get_page * 10
        });
    }

    GetDataPaginationComplained(get_page) {
        this.setState({
            sliceX_complained: (get_page * 10) - 10,
            sliceY_complained: get_page * 10
        });
    }

    GetDataPaginationFinished(get_page) {
        this.setState({
            sliceX_finished: (get_page * 10) - 10,
            sliceY_finished: get_page * 10
        });
    }

    GetDataPaginationCanceled(get_page) {
        this.setState({
            sliceX_canceled: (get_page * 10) - 10,
            sliceY_canceled: get_page * 10
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
        if (this.state.activeTab == 'waiting') {
            if (get_sorting == 'terbaru') {
                var sort = doSorting.sortBy(this.state.data_waiting, ['create_date']).reverse()
                this.setState({
                    data_waiting: sort
                });
            }
            else if (get_sorting == 'terlama') {
                var sort = doSorting.sortBy(this.state.data_waiting, ['create_date'])
                this.setState({
                    data_waiting: sort
                });
            }
            else if (get_sorting == 'terendah') {
                var sort = this.state.data_waiting.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                this.setState({
                    data_waiting: sort
                });
            }
            else if (get_sorting == 'tertinggi') {
                var sort = this.state.data_waiting.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                this.setState({
                    data_waiting: sort
                });
            }
        }

        else if (this.state.activeTab == 'ongoing') {
            if (get_sorting == 'terbaru') {
                var sort = doSorting.sortBy(this.state.data_ongoing, ['create_date']).reverse()
                this.setState({
                    data_ongoing: sort
                });
            }
            else if (get_sorting == 'terlama') {
                var sort = doSorting.sortBy(this.state.data_ongoing, ['create_date'])
                this.setState({
                    data_ongoing: sort
                });
            }
            else if (get_sorting == 'terendah') {
                var sort = this.state.data_ongoing.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                this.setState({
                    data_ongoing: sort
                });
            }
            else if (get_sorting == 'tertinggi') {
                var sort = this.state.data_ongoing.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                this.setState({
                    data_ongoing: sort
                });
            }
        }

        else if (this.state.activeTab == 'shipped') {
            if (get_sorting == 'terbaru') {
                var sort = doSorting.sortBy(this.state.data_shipped, ['create_date']).reverse()
                this.setState({
                    data_shipped: sort
                });
            }
            else if (get_sorting == 'terlama') {
                var sort = doSorting.sortBy(this.state.data_shipped, ['create_date'])
                this.setState({
                    data_shipped: sort
                });
            }
            else if (get_sorting == 'terendah') {
                var sort = this.state.data_shipped.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                this.setState({
                    data_shipped: sort
                });
            }
            else if (get_sorting == 'tertinggi') {
                var sort = this.state.data_shipped.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                this.setState({
                    data_shipped: sort
                });
            }
        }

        else if (this.state.activeTab == 'received') {
            if (get_sorting == 'terbaru') {
                var sort = doSorting.sortBy(this.state.data_received, ['create_date']).reverse()
                this.setState({
                    data_received: sort
                });
            }
            else if (get_sorting == 'terlama') {
                var sort = doSorting.sortBy(this.state.data_received, ['create_date'])
                this.setState({
                    data_received: sort
                });
            }
            else if (get_sorting == 'terendah') {
                var sort = this.state.data_received.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                this.setState({
                    data_received: sort
                });
            }
            else if (get_sorting == 'tertinggi') {
                var sort = this.state.data_received.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                this.setState({
                    data_received: sort
                });
            }
        }

        else if (this.state.activeTab == 'complained') {
            if (get_sorting == 'terbaru') {
                var sort = doSorting.sortBy(this.state.data_complained, ['create_date']).reverse()
                this.setState({
                    data_complained: sort
                });
            }
            else if (get_sorting == 'terlama') {
                var sort = doSorting.sortBy(this.state.data_complained, ['create_date'])
                this.setState({
                    data_complained: sort
                });
            }
            else if (get_sorting == 'terendah') {
                var sort = this.state.data_complained.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                this.setState({
                    data_complained: sort
                });
            }
            else if (get_sorting == 'tertinggi') {
                var sort = this.state.data_complained.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                this.setState({
                    data_complained: sort
                });
            }
        }

        else if (this.state.activeTab == 'finished') {
            if (get_sorting == 'terbaru') {
                var sort = doSorting.sortBy(this.state.data_finished, ['create_date']).reverse()
                this.setState({
                    data_finished: sort
                });
            }
            else if (get_sorting == 'terlama') {
                var sort = doSorting.sortBy(this.state.data_finished, ['create_date'])
                this.setState({
                    data_finished: sort
                });
            }
            else if (get_sorting == 'terendah') {
                var sort = this.state.data_finished.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                this.setState({
                    data_finished: sort
                });
            }
            else if (get_sorting == 'tertinggi') {
                var sort = this.state.data_finished.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                this.setState({
                    data_finished: sort
                });
            }
        }

        else if (this.state.activeTab == 'canceled') {
            if (get_sorting == 'terbaru') {
                var sort = doSorting.sortBy(this.state.data_canceled, ['create_date']).reverse()
                this.setState({
                    data_canceled: sort
                });
            }
            else if (get_sorting == 'terlama') {
                var sort = doSorting.sortBy(this.state.data_canceled, ['create_date'])
                this.setState({
                    data_canceled: sort
                });
            }
            else if (get_sorting == 'terendah') {
                var sort = this.state.data_canceled.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                this.setState({
                    data_canceled: sort
                });
            }
            else if (get_sorting == 'tertinggi') {
                var sort = this.state.data_canceled.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                this.setState({
                    data_canceled: sort
                });
            }
        }

        this.forceUpdate()
    }

    handleReceivedTransaction = (id) => {
        let query = encrypt("update gcm_master_transaction set status = 'RECEIVED', update_by = " + decrypt(localStorage.getItem('UserIDLogin')) + ", date_received=now() where id_transaction = '" + id + "'")
        Toast.loading('loading . . .', () => {
        });
        Axios.post(url.select, {
            query: query
        }).then(async (data) => {
            await this.LoadDataAll()
            this.toggleConfirmationReceived();
            Toast.hide();
        }).catch(err => {
            console.log('error');
            console.log(err);
        })
        this.forceUpdate()
    }

    handleComplainTransaction = (id, query) => {
        Toast.loading('loading . . .', () => {
        });
        Axios.post(url.select, {
            query: query
        }).then(async (data) => {
            await this.LoadDataAll()
            this.toggleConfirmationComplained();
            Toast.hide();
            Toast.success('Berhasil mengirim komplain', 2000, () => { });
        }).catch(err => {
            console.log('error');
            console.log(err);
        })
        this.forceUpdate()
    }

    handleFinishedTransaction = (id) => {
        let query = encrypt("update gcm_master_transaction set status = 'FINISHED', update_by = " + decrypt(localStorage.getItem('UserIDLogin')) + ", date_finished=now() where id_transaction = '" + id + "'")
        Toast.loading('loading . . .', () => {
        });
        Axios.post(url.select, {
            query: query
        }).then(async (data) => {
            await this.LoadDataAll();
            this.toggleCloseConfirmation();
            Toast.hide();
            Toast.success('Berhasil menyelesaikan pesanan', 2000, () => {
            });
        }).catch(err => {
            console.log('error');
            console.log(err);
        })
        this.forceUpdate()

    }

    pencarianTabel = (event) => {

        let searching;
        let get_sorting = this.state.selectedSort
        var doSorting = require('lodash');

        if (event.target.value.length == 0) {
            if (this.state.activeTab == 'waiting') {
                if (this.state.selectedSort == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_waitingtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_waitingtetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_waitingtetap.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_waitingtetap.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                }
                else {
                    var sort = this.state.data_waitingtetap
                }

                let total_pagination = Math.ceil(this.state.data_waitingtetap.length / 10)
                this.setState({
                    total_page_waiting: total_pagination,
                    data_waiting_length: '(' + sort.length + ')',
                    page_waiting: 1,
                    data_waiting: sort,
                    sliceX_waiting: '0',
                    sliceY_waiting: '10'
                });
                if (this.state.data_waitingtetap.length > 0) {
                    document.getElementById('pagination-waiting').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'ongoing') {
                if (this.state.selectedSort == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_ongoingtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_ongoingtetap, ['create_date'])

                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_ongoingtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });

                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_ongoingtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });

                }
                else {
                    var sort = this.state.data_ongoingtetap
                }
                let total_pagination = Math.ceil(this.state.data_ongoingtetap.length / 10)
                this.setState({
                    total_page_ongoing: total_pagination,
                    page_ongoing: 1,
                    data_ongoing: sort,
                    sliceX_ongoing: '0',
                    sliceY_ongoing: '10'
                });
                if (this.state.data_ongoingtetap.length > 0) {
                    document.getElementById('pagination-ongoing').style.display = 'block'
                } else {
                    document.getElementById('pagination-ongoing').style.display = 'none'
                }
            }

            else if (this.state.activeTab == 'shipped') {
                if (this.state.selectedSort == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_shippedtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_shippedtetap, ['create_date'])

                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_shippedtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });

                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_shippedtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });

                }
                else {
                    var sort = this.state.data_shippedtetap
                }
                let total_pagination = Math.ceil(this.state.data_shippedtetap.length / 10)
                this.setState({
                    total_page_shipped: total_pagination,
                    page_shipped: 1,
                    data_shipped: sort,
                    sliceX_shipped: '0',
                    sliceY_shipped: '10'
                });
                if (this.state.data_shippedtetap.length > 0) {
                    document.getElementById('pagination-shipped').style.display = 'block'
                } else {
                    document.getElementById('pagination-shipped').style.display = 'none'
                }
            }

            else if (this.state.activeTab == 'received') {
                if (this.state.selectedSort == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_receivedtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_receivedtetap, ['create_date'])

                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_receivedtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });

                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_receivedtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });

                }
                else {
                    var sort = this.state.data_receivedtetap
                }
                let total_pagination = Math.ceil(this.state.data_receivedtetap.length / 10)
                this.setState({
                    total_page_received: total_pagination,
                    page_received: 1,
                    data_received: sort,
                    sliceX_received: '0',
                    sliceY_received: '10'
                });
                if (this.state.data_receivedtetap.length > 0) {
                    document.getElementById('pagination-received').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'complained') {
                if (this.state.selectedSort == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_complainedtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_complainedtetap, ['create_date'])

                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_complainedtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });

                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_complainedtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });

                }
                else {
                    var sort = this.state.data_complainedtetap
                }
                let total_pagination = Math.ceil(this.state.data_complainedtetap.length / 10)
                this.setState({
                    total_page_complained: total_pagination,
                    page_complained: 1,
                    data_complained: sort,
                    sliceX_complained: '0',
                    sliceY_complained: '10'
                });
                if (this.state.data_complainedtetap.length > 0) {
                    document.getElementById('pagination-complained').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'finished') {
                if (this.state.selectedSort == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_finishedtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_finishedtetap, ['create_date'])

                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_finishedtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });

                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_finishedtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });

                }
                else {
                    var sort = this.state.data_finishedtetap
                }
                let total_pagination = Math.ceil(this.state.data_finishedtetap.length / 10)
                this.setState({
                    total_page_finished: total_pagination,
                    page_finished: 1,
                    data_finished: sort,
                    sliceX_finished: '0',
                    sliceY_finished: '10'
                });
                if (this.state.data_finishedtetap.length > 0) {
                    document.getElementById('pagination-finished').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'canceled') {
                if (this.state.selectedSort == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_canceledtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_canceledtetap, ['create_date'])

                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_canceledtetap.sort(function (a, b) { return a.totaltrx - b.totaltrx });

                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_canceledtetap.sort(function (a, b) { return b.totaltrx - a.totaltrx });

                }
                else {
                    var sort = this.state.data_canceledtetap
                }
                let total_pagination = Math.ceil(this.state.data_canceledtetap.length / 10)
                this.setState({
                    total_page_canceled: total_pagination,
                    page_canceled: 1,
                    data_canceled: sort,
                    sliceX_canceled: '0',
                    sliceY_canceled: '10'
                });
                if (this.state.data_canceledtetap.length > 0) {
                    document.getElementById('pagination-canceled').style.display = 'block'
                }
            }
            this.forceUpdate()
        }

        if (event.target.value.length > 0 || document.getElementById('searchBarTransaction').value.length > 0) {
            if (this.state.activeTab == 'waiting') {

                if (get_sorting == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_waitingtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_waitingtetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_waitingtetap.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_waitingtetap.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                }
                else {
                    var sort = this.state.data_waitingtetap
                }

                searching = sort.filter(input => {
                    return input.id_transaction.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
                });
                let total_pagination = Math.ceil(searching.length / 10)
                this.setState({
                    data_waiting: searching,
                    page_waiting: 1,
                    total_page_waiting: total_pagination,
                    data_waiting_length: '(' + searching.length + ')',
                    showData: searching.length,
                    totalData: this.state.data_waitingtetap.length,
                    sliceX_waiting: '0',
                    sliceY_waiting: '10'
                });

                if (searching.length == 0) {
                    document.getElementById('pagination-waiting').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-waiting').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'ongoing') {
                if (get_sorting == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_ongoingtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_ongoingtetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_ongoingtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_ongoingtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });
                }
                else {
                    var sort = this.state.data_ongoingtetap
                }

                searching = sort.filter(input => {
                    return input.id_transaction.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
                });
                let total_pagination = Math.ceil(searching.length / 10)
                this.setState({
                    data_ongoing: searching,
                    page_ongoing: 1,
                    total_page_ongoing: total_pagination,
                    data_ongoing_length: '(' + searching.length + ')',
                    showData: searching.length,
                    totalData: this.state.data_ongoingtetap.length,
                    sliceX_ongoing: '0',
                    sliceY_ongoing: '10'
                });

                if (searching.length == 0) {
                    document.getElementById('pagination-ongoing').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-ongoing').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'shipped') {
                if (get_sorting == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_shippedtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_shippedtetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_shippedtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_shippedtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });
                }
                else {
                    var sort = this.state.data_shippedtetap
                }

                searching = sort.filter(input => {
                    return input.id_transaction.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
                });
                let total_pagination = Math.ceil(searching.length / 10)
                this.setState({
                    data_shipped: searching,
                    page_shipped: 1,
                    total_page_shipped: total_pagination,
                    data_shipped_length: '(' + searching.length + ')',
                    showData: searching.length,
                    totalData: this.state.data_shippedtetap.length,
                    sliceX_shipped: '0',
                    sliceY_shipped: '10'
                });

                if (searching.length == 0) {
                    document.getElementById('pagination-shipped').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-shipped').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'received') {
                if (get_sorting == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_receivedtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_receivedtetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_receivedtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_receivedtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });
                }
                else {
                    var sort = this.state.data_receivedtetap
                }
                searching = sort.filter(input => {
                    return input.id_transaction.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
                });
                let total_pagination = Math.ceil(searching.length / 10)
                this.setState({
                    data_received: searching,
                    page_received: 1,
                    total_page_received: total_pagination,
                    showData: searching.length,
                    data_received_length: '(' + searching.length + ')',
                    totalData: this.state.data_receivedtetap.length,
                    sliceX_received: '0',
                    sliceY_received: '10'
                });

                if (searching.length == 0) {
                    document.getElementById('pagination-received').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-received').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'complained') {
                if (get_sorting == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_complainedtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_complainedtetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_complainedtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_complainedtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });
                }
                else {
                    var sort = this.state.data_complainedtetap
                }

                searching = sort.filter(input => {
                    return input.id_transaction.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
                });
                let total_pagination = Math.ceil(searching.length / 10)
                this.setState({
                    data_complained: searching,
                    page_complained: 1,
                    total_page_complained: total_pagination,
                    showData: searching.length,
                    data_complained_length: '(' + searching.length + ')',
                    totalData: this.state.data_complainedtetap.length,
                    sliceX_complained: '0',
                    sliceY_complained: '10'
                });

                if (searching.length == 0) {
                    document.getElementById('pagination-complained').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-complained').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'finished') {
                if (get_sorting == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_finishedtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_finishedtetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_finishedtetap.sort(function (a, b) { return a.totaltrx_final - b.totaltrx_final });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_finishedtetap.sort(function (a, b) { return b.totaltrx_final - a.totaltrx_final });
                }
                else {
                    var sort = this.state.data_finishedtetap
                }

                searching = sort.filter(input => {
                    return input.id_transaction.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
                });
                let total_pagination = Math.ceil(searching.length / 10)
                this.setState({
                    data_finished: searching,
                    total_page_finished: total_pagination,
                    showData: searching.length,
                    totalData: this.state.data_finishedtetap.length,
                    data_finished_length: '(' + searching.length + ')',
                    page_finished: 1,
                    sliceX_finished: '0',
                    sliceY_finished: '10'
                });

                if (searching.length == 0) {
                    document.getElementById('pagination-finished').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-finished').style.display = 'block'
                }
            }

            else if (this.state.activeTab == 'canceled') {

                if (get_sorting == 'terbaru') {
                    var sort = doSorting.sortBy(this.state.data_canceledtetap, ['create_date']).reverse()
                }
                else if (get_sorting == 'terlama') {
                    var sort = doSorting.sortBy(this.state.data_canceledtetap, ['create_date'])
                }
                else if (get_sorting == 'terendah') {
                    var sort = this.state.data_canceledtetap.sort(function (a, b) { return a.totaltrx - b.totaltrx });
                }
                else if (get_sorting == 'tertinggi') {
                    var sort = this.state.data_canceledtetap.sort(function (a, b) { return b.totaltrx - a.totaltrx });
                }
                else {
                    var sort = this.state.data_canceledtetap
                }

                searching = sort.filter(input => {
                    return input.id_transaction.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
                });
                let total_pagination = Math.ceil(searching.length / 10)
                this.setState({
                    data_canceled: searching,
                    total_page_canceled: total_pagination,
                    showData: searching.length,
                    totalData: this.state.data_canceledtetap.length,
                    data_canceled_length: '(' + searching.length + ')',
                    page_canceled: 1,
                    sliceX_canceled: '0',
                    sliceY_canceled: '10'
                });

                if (searching.length == 0) {
                    document.getElementById('pagination-canceled').style.display = 'none'
                }
                else {
                    document.getElementById('pagination-canceled').style.display = 'block'
                }
            }
        }
        this.forceUpdate()
    }

    toggleCloseConfirmation = () => {
        this.setState({
            openConfirmation: !this.state.openConfirmation
        });
    }

    toggleConfirmationReceived = (id) => {
        this.setState({
            openConfirmationReceived: !this.state.openConfirmationReceived,
            set_recieved: id
        });
    }

    toggleConfirmationComplained = (id, query) => {
        this.setState({
            openConfirmationComplained: !this.state.openConfirmationComplained,
            set_complained: id, set_complained_query: query
        });
    }

    toggleTimeLimitComplained = () => {
        this.setState({
            openTimeLimitComplained: !this.state.openTimeLimitComplained
        });
    }

    toggleFilterDate = () => {
        this.setState({
            openFilter: !this.state.openFilter
        });
    }

    toggleConfirmation = (id) => {
        this.setState({
            openConfirmation: !this.state.openConfirmation,
            set_finished: id
        });
    }

    async componentDidMount() {
        this.LoadDataAll()
    }

    render() {

        const address = addresses[0];

        return (

            <div className="dashboard" >
                <Helmet>
                    <title>{`Transaksi — ${datatheme.name}`}</title>
                </Helmet>

                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header">
                        <div className="row" style={{ marginBottom: '10px' }}>
                            <div className="col-md-4" >
                                <h5>Daftar Transaksi</h5>
                            </div>
                            <div className="col-md-8" style={{ display: 'none' }}>
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
                                <select className="form-control" id="SortingTransaksi" onChange={this.getSelectSorting}>
                                    <option value="" disabled selected hidden>Urutkan</option>
                                    <option value="terbaru">Tanggal (Terbaru)</option>
                                    <option value="terlama">Tanggal (Terlama)</option>
                                    <option value="tertinggi">Transaksi (Tertinggi)</option>
                                    <option value="terendah">Transaksi (Terendah)</option>
                                </select>
                            </div>
                            <div className="col-md-2" >

                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 mt-xs-1 mt-sm-1 mt-1" >
                                <div className="input-group" >
                                    <input id="searchBarTransaction" type="text" class="form-control" autoComplete="off" spellCheck="false" placeholder="Cari data di sini..." onChange={event => this.pencarianTabel(event)} />
                                    <div className="input-group-append">
                                        <span id="searchBarTransaction" className="input-group-text"><i className="fa fa-search"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab_container">
                        <input className="radioTab" id="tab1" type="radio" name="tabs" checked={this.state.checkTabPane} onClick={() => this.ClickTabPane('waiting')} />
                        <label className="labeledit" for="tab1">Menunggu {''}{this.state.data_waiting_length}</label>

                        <input className="radioTab" id="tab2" type="radio" name="tabs" onClick={() => this.ClickTabPane('ongoing')} />
                        <label className="labeledit" for="tab2">Diproses {''}{this.state.data_ongoing_length}</label>

                        <input className="radioTab" id="tab3" type="radio" name="tabs" onClick={() => this.ClickTabPane('shipped')} />
                        <label className="labeledit" for="tab3">Dikirim {''}{this.state.data_shipped_length}</label>

                        <input className="radioTab" id="tab4" type="radio" name="tabs" onClick={() => this.ClickTabPane('received')} />
                        <label className="labeledit" for="tab4">Diterima {''}{this.state.data_received_length}</label>

                        <input className="radioTab" id="tab5" type="radio" name="tabs" onClick={() => this.ClickTabPane('complained')} />
                        <label className="labeledit" for="tab5">Dikomplain {''}{this.state.data_complained_length}</label>

                        <input className="radioTab" id="tab6" type="radio" name="tabs" onClick={() => this.ClickTabPane('finished')} />
                        <label className="labeledit" for="tab6">Selesai {''}{this.state.data_finished_length}</label>

                        <input className="radioTab" id="tab7" type="radio" name="tabs" onClick={() => this.ClickTabPane('canceled')} />
                        <label className="labeledit" for="tab7">Dibatalkan {''}{this.state.data_canceled_length}</label>

                        <section id="content1" class="tab-content">
                            <div className="card-table">
                                <div className="table-responsive-sm">
                                    <table >
                                        <thead>
                                            <tr>
                                                <th><center>ID Transaksi</center></th>
                                                <th><center>Tanggal Transaksi</center></th>
                                                <th><center>Total Transaksi</center></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <div id="shimmerTransactionWaiting" style={{ display: 'contents' }}>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                            </div>

                                            <div id="contentShimmerTransactionWaiting" style={{ display: 'none' }}>
                                                {this.state.data_waiting.slice(this.state.sliceX_waiting, this.state.sliceY_waiting).map((value) => {
                                                    return (<TransactionWaiting data={value} status='Waiting' />)
                                                })
                                                }
                                            </div>

                                            <tr>
                                                <td id='alertemptyWaiting' style={{ display: 'none' }} colspan="3"><center>- Tidak Ada Data -</center></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div id="pagination-waiting" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                                        <Pagination
                                            current={this.state.page_waiting}
                                            siblings={2}
                                            total={this.state.total_page_waiting}
                                            onPageChange={this.handlePageChangeWaiting}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="content2" class="tab-content">
                            <div className="card-table">
                                <div className="table-responsive-sm">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th><center>ID Transaksi</center></th>
                                                <th><center>Tanggal Transaksi</center></th>
                                                <th><center>Tanggal Diproses</center></th>
                                                <th><center>Total Transaksi</center></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <div id="shimmerTransactionOngoing" style={{ display: 'contents' }}>
                                                <tr>
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
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                            </div>

                                            <div id="contentShimmerTransactionOngoing" style={{ display: 'none' }}>
                                                {this.state.data_ongoing.slice(this.state.sliceX_ongoing, this.state.sliceY_ongoing).map((value) => {
                                                    return (<TransactionOngoing data={value} />)
                                                })
                                                }
                                            </div>

                                            <tr>
                                                <td id='alertemptyOngoing' style={{ display: 'none' }} colspan="4"><center>- Tidak Ada Data -</center></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div id="pagination-ongoing" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                                        <Pagination
                                            current={this.state.page_ongoing}
                                            siblings={2}
                                            total={this.state.total_page_ongoing}
                                            onPageChange={this.handlePageChangeOngoing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="content3" class="tab-content">
                            <div className="card-table">
                                <div className="table-responsive-sm">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th><center>ID Transaksi</center></th>
                                                <th><center>Tanggal Transaksi</center></th>
                                                <th><center>Tanggal Dikirim</center></th>
                                                <th><center>Total Transaksi</center></th>
                                                <th><center>Aksi</center></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <div id="shimmerTransactionShipped" style={{ display: 'contents' }}>
                                                <tr>
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
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                            </div>

                                            <div id="contentShimmerTransactionShipped" style={{ display: 'none' }}>
                                                {this.state.data_shipped.slice(this.state.sliceX_shipped, this.state.sliceY_shipped).map((value) => {
                                                    return (<TransactionShipped data={value} handleTerimaPesanan={this.toggleConfirmationReceived.bind(this)} />)
                                                })
                                                }
                                            </div>

                                            <tr>
                                                <td id='alertemptyShipped' style={{ display: 'none' }} colspan="5"><center>- Tidak Ada Data -</center></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div id="pagination-shipped" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                                        <Pagination
                                            current={this.state.page_shipped}
                                            siblings={2}
                                            total={this.state.total_page_shipped}
                                            onPageChange={this.handlePageChangeShipped}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="content4" class="tab-content">
                            <div className="card-table">
                                <div className="table-responsive-sm">
                                    <table>
                                        <thead>
                                            <tr>
                                                {/* <th style={{ width: '20%' }}><center>ID Transaksi</center></th>
                                                <th style={{ width: '20%' }}><center>Tanggal Transaksi</center></th>
                                                <th style={{ width: '20%' }}><center>Tanggal Diterima</center></th>
                                                <th style={{ width: '25%' }}><center>Total Transaksi</center></th>
                                                <th style={{ width: '30%' }}><center>Aksi</center></th> */}
                                                <th ><center>ID Transaksi</center></th>
                                                <th ><center>Tanggal Transaksi</center></th>
                                                <th ><center>Tanggal Diterima</center></th>
                                                <th ><center>Total Transaksi</center></th>
                                                <th ><center>Aksi</center></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <div id="shimmerTransactionReceived" style={{ display: 'contents' }}>
                                                <tr>
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
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                            </div>

                                            <div id="contentShimmerTransactionReceived" style={{ display: 'none' }}>
                                                {this.state.data_received.slice(this.state.sliceX_received, this.state.sliceY_received).map((value, index) => {
                                                    return (<TransactionReceived data={value} index={index} handleSelesaikanPesanan={this.toggleConfirmation.bind(this)} handleSubmitComplain={this.toggleConfirmationComplained.bind(this)}
                                                        loadDataReceived={this.LoadDataReceived.bind(this)} loadDataComplained={this.LoadDataComplained.bind(this)} handleTimeLimitComplain={this.toggleTimeLimitComplained.bind(this)} />)
                                                })
                                                }
                                            </div>

                                            <tr>
                                                <td id='alertemptyReceived' style={{ display: 'none' }} colspan="5"><center>- Tidak Ada Data -</center></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div id="pagination-received" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                                        <Pagination
                                            current={this.state.page_received}
                                            siblings={2}
                                            total={this.state.total_page_received}
                                            onPageChange={this.handlePageChangeReceived}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="content5" class="tab-content">
                            <div className="card-table">
                                <div className="table-responsive-sm">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th><center>ID Transaksi</center></th>
                                                <th><center>Tanggal Transaksi</center></th>
                                                <th><center>Tanggal Komplain</center></th>
                                                <th><center>Total Transaksi</center></th>
                                                <th><center>Aksi</center></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <div id="shimmerTransactionComplained" style={{ display: 'contents' }}>
                                                <tr>
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
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                            </div>

                                            <div id="contentShimmerTransactionComplained" style={{ display: 'none' }}>
                                                {this.state.data_complained.slice(this.state.sliceX_complained, this.state.sliceY_complained).map((value) => {
                                                    return (<TransactionComplained data={value} handleSelesaikanPesanan={this.toggleConfirmation.bind(this)} />)
                                                })
                                                }
                                            </div>

                                            <tr>
                                                <td id='alertemptyComplained' style={{ display: 'none' }} colspan="5"><center>- Tidak Ada Data -</center></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div id="pagination-complained" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                                        <Pagination
                                            current={this.state.page_complained}
                                            siblings={2}
                                            total={this.state.total_page_complained}
                                            onPageChange={this.handlePageChangeComplained}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="content6" class="tab-content">
                            <div className="card-table">
                                <div className="table-responsive-sm">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th><center>ID Transaksi</center></th>
                                                <th><center>Tanggal transaksi</center></th>
                                                <th><center>Tanggal selesai</center></th>
                                                <th><center>Total Transaksi</center></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <div id="shimmerTransactionFinished" style={{ display: 'contents' }}>
                                                <tr>
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
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                            </div>

                                            <div id="contentShimmerTransactionFinished" style={{ display: 'none' }}>
                                                {this.state.data_finished.slice(this.state.sliceX_finished, this.state.sliceY_finished).map((value) => {
                                                    return (<TransactionFinished data={value} />)
                                                })
                                                }
                                            </div>

                                            <tr>
                                                <td id='alertemptyFinished' style={{ display: 'none' }} colspan="4"><center>- Tidak Ada Data -</center></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div id="pagination-finished" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                                        <Pagination
                                            current={this.state.page_finished}
                                            siblings={2}
                                            total={this.state.total_page_finished}
                                            onPageChange={this.handlePageChangeFinished}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="content7" class="tab-content">
                            <div className="card-table">
                                <div className="table-responsive-sm">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th><center>ID Transaksi</center></th>
                                                <th><center>Tanggal transaksi</center></th>
                                                <th><center>Tanggal dibatalkan</center></th>
                                                <th><center>Total Transaksi</center></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <div id="shimmerTransactionCanceled" style={{ display: 'contents' }}>
                                                <tr>
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
                                                </tr>
                                                <tr>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                    <td><linestable class="shine"></linestable></td>
                                                </tr>
                                            </div>

                                            <div id="contentShimmerTransactionCanceled" style={{ display: 'none' }}>
                                                {this.state.data_canceled.slice(this.state.sliceX_canceled, this.state.sliceY_canceled).map((value) => {
                                                    return (<TransactionCanceled data={value} />)
                                                })
                                                }
                                            </div>

                                            <tr>
                                                <td id='alertemptyCanceled' style={{ display: 'none' }} colspan="4"><center>- Tidak Ada Data -</center></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div id="pagination-canceled" style={{ paddingTop: '10px', paddingBottom: '10px', display: 'none' }}>
                                        <Pagination
                                            current={this.state.page_canceled}
                                            siblings={2}
                                            total={this.state.total_page_canceled}
                                            onPageChange={this.handlePageChangeCanceled}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <Dialog
                    open={this.state.openTimeLimitComplained}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Tidak Dapat Melakukan Komplain</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Anda telah melewati batas waktu komplain sejak barang diterima
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => { this.toggleTimeLimitComplained(); this.LoadDataAll() }}>
                            Perbarui data transaksi
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.openTimeLimitPaid}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Transaksi Dibatalkan</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Maaf, <strong>{this.state.count_id_canceled_by_time}</strong> {' '} transaksi ( {this.state.label_id_canceled_by_time} ) <strong>dibatalkan</strong> {' '}
                            karena telah melewati batas waktu pembayaran.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => { this.setState({ openTimeLimitPaid: false }) }}>
                            Mengerti
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.openConfirmationComplained}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Konfirmasi</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Apakah Anda yakin ingin mengirim komplain ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.handleComplainTransaction(this.state.set_complained, this.state.set_complained_query)}>
                            Ya
                        </Button>
                        <Button color="light" onClick={this.toggleConfirmationComplained}>
                            Batal
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.openConfirmationReceived}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Konfirmasi</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Apakah Anda yakin barang sudah diterima ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.handleReceivedTransaction(this.state.set_recieved)}>
                            Ya
                        </Button>
                        <Button color="light" onClick={this.toggleConfirmationReceived}>
                            Batal
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.openConfirmation}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Selesaikan Pesanan </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ketika pesanan telah diselesaikan, segala bentuk komplain tidak akan diterima. Selesaikan pesanan sekarang ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.handleFinishedTransaction(this.state.set_finished)}>
                            Ya
                        </Button>
                        <Button color="light" onClick={this.toggleCloseConfirmation}>
                            Batal
                        </Button>
                    </DialogActions>
                </Dialog>

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

            </div>
        );
    }
}
