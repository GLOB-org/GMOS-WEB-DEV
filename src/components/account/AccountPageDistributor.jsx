// react
import React, { Component } from 'react';
import classNames from 'classnames';

// third-party
import { Helmet } from 'react-helmet-async';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Check9x7Svg } from '../../svg';

// data stubs
import addresses from '../../data/accountAddresses';
import theme from '../../data/theme';
import ListDistributor from './AccountPageDashboard-Distributor';
import DialogCatch from '../shared/DialogCatch';
import Toast from 'light-toast';

class AccountPageDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            listDistributor: [],
            listAlamat: [],
            listDistributor_join: [],
            id_distributor: '',
            displaycatch: false,
            openListDistributor: false,
            openConfirmation: false,
            disablebutton: true
        };
    }

    checkDistributor = async (id) => {
        let id_get;
        id_get = this.state.listDistributor[id].id;
        var checkCB = 'n'
        if (document.getElementById(id).checked == true) {
            await this.setState(prevState => ({
                listDistributor_join: [...prevState.listDistributor_join, { id: id_get }]
            }))
        }
        else {
            await this.setState({
                listDistributor_join: this.state.listDistributor_join.filter((_, i) => i !== id)
            });
        }
        for (var i = 0; i < this.state.listDistributor.length; i++) {
            if (document.getElementById(i).checked == true) {
                checkCB = 'y';
                document.getElementById('lanjutjoin').disabled = false
                this.setState({
                    disablebutton: false
                });
                break;
            }
        }
        if (checkCB == 'n') {
            document.getElementById('lanjutjoin').disabled = true
            this.setState({
                disablebutton: true
            });
        }
    }

    controlDialogListDistributor = async () => {
        if (this.state.openListDistributor == false) {
            if (localStorage.getItem('Login') != null) {
                Toast.loading('loading . . .', () => {
                });

                if (decrypt(localStorage.getItem('TipeBisnis')) == '1') {
                    var querydistributor = encrypt("select id, nama_perusahaan from gcm_master_company where id not in (" + this.state.id_distributor + ") and type ='S' and seller_status='A'")
                }

                else {
                    var querydistributor = encrypt("select id, nama_perusahaan from gcm_master_company where tipe_bisnis = " +
                        "(select tipe_bisnis from gcm_master_company where id = " + decrypt(localStorage.getItem("CompanyIDLogin")) + ") and id not in (" + this.state.id_distributor + ") and type ='S' and seller_status='A'")
                }

                await Axios.post(url.select, {
                    query: querydistributor
                }).then(data => {
                    this.setState({
                        listDistributor: data.data.data
                    });
                    Toast.hide()
                }).catch(err => {
                    this.setState({ displaycatch: true });
                    // console.log('error' + err);
                    // console.log(err);
                })
            }
        }

        if (this.state.listDistributor.length == 0) {
            Toast.fail('Tidak ada distributor yang dapat ditampilkan', 2000, () => {
            });
        }
        else if (this.state.listDistributor.length > 0) {
            this.setState({
                openListDistributor: !this.state.openListDistributor,
                disablebutton: true
            });
            document.getElementById('lanjutjoin').disabled = true
        }

    }

    loadDataDistributor = () => {
        if (localStorage.getItem('Login') != null) {
            let querydistributor = encrypt("SELECT b.id, b.nama_perusahaan, case when (a.status = 'A') then " +
                "'Diverifikasi' when (a.status = 'I') then 'Menunggu Verifikasi' when (a.status = 'R') then " +
                "'Verifikasi Ditolak' end as status FROM gcm_company_listing a inner join gcm_master_company b " +
                "on a.seller_id=b.id where buyer_id = " + decrypt(localStorage.getItem("CompanyIDLogin")) + " order by a.status, b.nama_perusahaan asc")

            Axios.post(url.select, {
                query: querydistributor
            }).then(data => {
                this.setState({ data: data.data.data });
                if (data.data.data.length == 0) {
                    document.getElementById('alertempty').style.display = 'table-cell'
                }

                let id_dist = "";
                for (var i = 0; i < data.data.data.length; i++) {
                    id_dist = id_dist.concat(data.data.data[i].id.toString())
                    id_dist = id_dist.concat(',')
                }

                id_dist = id_dist.concat(decrypt(localStorage.getItem("CompanyIDLogin")))
                this.setState({ id_distributor: id_dist });
                document.getElementById('shimmerDistributor').style.display = 'none'
                document.getElementById('contentShimmerDistributor').style.display = 'contents'
            }).catch(err => {
                this.setState({ displaycatch: true });
                // console.log('error' + err);
                // console.log(err);
            })

            let queryalamat = encrypt("select id from gcm_master_alamat where company_id = " + decrypt(localStorage.getItem("CompanyIDLogin")) +
                " and flag_active = 'A'")

            Axios.post(url.select, {
                query: queryalamat
            }).then(data => {
                this.setState({ listAlamat: data.data.data });
            }).catch(err => {
                this.setState({ displaycatch: true });
                // console.log('error' + err);
                // console.log(err);
            })

        }
    }

    submitBerlangganan = () => {
        if (localStorage.getItem('Login') != null) {

            Toast.loading('loading . . .', () => {
            });

            let query = "insert into gcm_company_listing (buyer_id, seller_id, buyer_number_mapping, " +
                "seller_number_mapping,status,create_date,update_date, blacklist_by, is_blacklist, " +
                "id_blacklist, notes_blacklist) values "

            let loop_1 = ""
            let loop_2 = ""
            let length_dist = this.state.listDistributor_join.length;
            let length_alamat = this.state.listAlamat.length;
            for (var i = 0; i < length_dist; i++) {
                loop_1 = loop_1 + "(" + decrypt(localStorage.getItem("CompanyIDLogin")) + "," + this.state.listDistributor_join[i].id + ",null,null,'I',now(),now(),null,false,0,'')"
                if (i < length_dist - 1) {
                    loop_1 = loop_1.concat(",")
                }
            }

            let query_result1 = query.concat(loop_1)
            let query_list_alamat = "insert into gcm_listing_alamat (id_master_alamat, id_buyer, " +
                "id_seller, kode_alamat_customer) values "

            for (var i = 0; i < length_dist; i++) {
                for (var j = 0; j < length_alamat; j++) {

                    loop_2 = loop_2 + "(" + this.state.listAlamat[j].id + "," + decrypt(localStorage.getItem("CompanyIDLogin")) + "," + this.state.listDistributor_join[i].id + ",null)"
                    if (j < length_alamat - 1) {
                        loop_2 = loop_2.concat(",")
                    }
                }
                if (i < length_dist - 1) {
                    loop_2 = loop_2.concat(",")
                }

            }

            let query_result2 = query_list_alamat.concat(loop_2)
            let final_query = "with new_insert as (" + query_result1 + ")" + query_result2

            Axios.post(url.select, {
                query: encrypt(final_query)
            }).then(data => {
                this.loadDataDistributor()
                Toast.hide()
                Toast.success('Permintaan berlangganan berhasil dikirim', 2000, () => {
                });
                this.setState({
                    openListDistributor: false,
                    openConfirmation: false,
                    listDistributor_join: [],
                    id_distributor: ''
                });
            }).catch(err => {
                this.setState({ displaycatch: true });
                // console.log('error' + err);
                // console.log(err);
            })
        }
    }

    toggleConfirmation = () => {
        this.setState({
            openConfirmation: !this.state.openConfirmation
        });
    }

    componentDidMount() {
        this.loadDataDistributor()
    }

    render() {

        const itemsList = this.state.listDistributor.map((item, index) => {
            return (
                <label
                    key={item.id}
                    className={classNames('filter-list__item', {
                        'filter-list__item--disabled': item.disabled,
                    })}
                >
                    <span className="filter-list__input input-check">
                        <span className="input-check__body">
                            <input id={index} className="input-check__input" type="checkbox" defaultChecked={false} disabled={false} onClick={() => this.checkDistributor(index)} />
                            <span className="input-check__box" />
                            <Check9x7Svg className="input-check__icon" />
                        </span>
                    </span>
                    <label className="filter-list__title">{item.nama_perusahaan}</label>
                </label>
            );
        });


        return (
            <div className="card">
                <Helmet>
                    <title>{`Akun — ${theme.name}`}</title>
                </Helmet>

                <div className="card-header">
                    <div className="row" style={{ marginBottom: '10px' }}>
                        <div className="col-md-9" >
                            <h5>Daftar Distributor</h5>
                        </div>
                        <div className="col-md-3 mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0" >
                            <div className="btn btn-primary btn-sm" style={{ float: 'right', width: '100%' }} onClick={this.controlDialogListDistributor}>  <span style={{ paddingRight: '5px' }}><i class="fas fa-plus"></i></span>Berlangganan</div>
                        </div>
                    </div>
                </div>

                <div className="card-table">
                    <div className="table-responsive-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', width: '70%' }}>Distributor</th>
                                    <th style={{ textAlign: 'center', width: '30%' }}>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                <div id="shimmerDistributor" style={{ display: 'contents' }}>
                                    <tr>
                                        <td><lines class="shine"></lines></td>
                                        <td><lines class="shine"></lines></td>
                                    </tr>
                                    <tr>
                                        <td><lines class="shine"></lines></td>
                                        <td><lines class="shine"></lines></td>
                                    </tr>
                                    <tr>
                                        <td><lines class="shine"></lines></td>
                                        <td><lines class="shine"></lines></td>
                                    </tr>
                                </div>

                                <div id="contentShimmerDistributor" style={{ display: 'none' }}>
                                    {this.state.data.map((value) => {
                                        return (<ListDistributor data={value} />)
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

                <Modal isOpen={this.state.openListDistributor} size="md" centered>
                    <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={() => this.controlDialogListDistributor()}>Daftar Distributor</ModalHeader>
                    <ModalBody>
                        <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '15px' }}>Silakan pilih disbributor di bawah ini :</label>
                        <div className="filter-list">
                            <div className="filter-list__list">
                                {itemsList}
                            </div>
                        </div>
                        <button id='lanjutjoin' className="btn btn-primary mt-2 mt-md-3 mt-lg-4" type="submit" onClick={this.toggleConfirmation.bind(this)} style={{ float: 'right', marginTop: '15px' }} disabled={this.state.disablebutton}>Berlangganan</button>
                    </ModalBody>
                </Modal>

                <Dialog
                    open={this.state.openConfirmation}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">Konfirmasi</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Permintaan berlangganan akan dikirim ke distributor yang Anda pilih. Lanjutkan ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.submitBerlangganan}>
                            Ya
                        </Button>
                        <Button color="light" onClick={this.toggleConfirmation}>
                            Batal
                        </Button>
                    </DialogActions>
                </Dialog>


                <DialogCatch isOpen={this.state.displaycatch} />
            </div >
        )
    }
}

export default AccountPageDashboard;
