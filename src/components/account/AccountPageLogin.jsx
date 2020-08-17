// react
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link, useHistory } from 'react-router-dom';
import { Button, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import Swal from 'sweetalert2'
import swal from 'sweetalert';
import Toast from 'light-toast';
import firebase from 'firebase';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

// application
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';

export default class AccountPageLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            empty_username: false,
            empty_password: false,
            icon_pass: 'fa fa-eye-slash',
            test: false,
            openOTP: false,
            statusVerified: 'wait', noHandphoneVerified: '',
            inputNoTelp: '', empty_NoTelp: false, KetTextNoTelp: '',
            inputTipeOTP: '', empty_TipeOTP: false, KetTextTipeOTP: '',
            openConfirmationOTP: false, openInsertOTP: false,
            valueOTP: '', empty_valueOTP: '', KetTextvalueOTP: '',
            sendValueOTP: '',
            displaycatch: false,
            timer: '',
            message_id: ''
        };
    }

    async componentDidMount() {
        localStorage.clear();
        let x = localStorage.getItem('Login');
        if (x !== null) {
            await this.setState({ test: x })
        } else {
            await this.setState({ test: false })
        }

    }

    getTokenFCM = () => {
        const messaging = firebase.messaging()
        messaging.requestPermission().then(() => {
            return messaging.getToken()
        }).then(token => {
            let query = encrypt("insert into gcm_notification_token (user_id, company_id, token) values " +
                "(" + this.state.data[0].id + ", " + this.state.data[0].company_id + ", '" + token + "' )")
            Axios.post(url.select, {
                query: query
            }).then(data => {
                localStorage.setItem('Token', encrypt(token));
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })
        }).catch((error) => {
            console.log('error')
            console.log(error)
        })
    }

    ClickLogin = () => {

        if (document.getElementById("login-username").value == '') {
            this.setState({ empty_username: true });
        }
        if (document.getElementById("login-password").value == '') {
            this.setState({ empty_password: true });
        }
        if (document.getElementById("login-username").value != '' && document.getElementById("login-password").value != '') {
            let Login = "select a.id, a.nama as nama, b.id as company_id, tipe_bisnis, a.status, listing_id from gcm_master_user a " +
                "inner join gcm_master_company b on a.company_id = b.id where b.type = 'B' and username='" + document.getElementById("login-username").value + "' " +
                "and password ='" + encrypt(document.getElementById("login-password").value) + "'";

            let queryLogin = encrypt(Login);

            Toast.loading('loading . . .', () => {
            });

            Axios.post(url.select, {
                query: queryLogin
            }).then((data) => {
                this.setState({ data: data.data.data });
                Toast.hide();
                if (data.data.data.length == 1) {
                    if (data.data.data[0].status == 'A') {
                        this.getTokenFCM()
                        localStorage.setItem('Login', true);
                        localStorage.setItem('UserLogin', encrypt(this.state.data[0].nama));
                        localStorage.setItem('CompanyIDLogin', encrypt(this.state.data[0].company_id));
                        localStorage.setItem('UserIDLogin', encrypt(this.state.data[0].id));
                        localStorage.setItem('TipeBisnis', encrypt(this.state.data[0].tipe_bisnis.toString()));
                        this.props.history.push('/')
                        const Notif = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2300,
                            timerProgressBar: true,
                            onOpen: (toast) => {
                                //   toast.addEventListener('mouseenter', Swal.stopTimer)
                                //   toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        Notif.fire({
                            icon: 'success',
                            title: 'Selamat datang, ' + this.state.data[0].nama
                        })

                    }
                    else if (data.data.data[0].status == 'I') {
                        this.setState({ openOTP: true })
                    }
                }
                else {
                    swal("Username dan/atau Password Anda salah", {
                        title: "Gagal Masuk",
                        icon: "error",
                        buttons: false,
                        timer: 3000,
                        closeOnClickOutside: false,
                    });
                }
            }).catch(err => {
                // console.log("eror : " + err);
                swal(err, {
                    title: "Gagal Masuk",
                    icon: "error",
                    buttons: false,
                    timer: 3000,
                    closeOnClickOutside: false,
                });
            })

        }
    }

    generateOtp = () => {
        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP
    }

    getTipeOTP = (event) => {
        this.setState({
            empty_TipeOTP: false,
            KetTextTipeOTP: '',
            inputTipeOTP: event.target.value
        });
    }

    handleWhitespace = (event) => {
        if (event.which === 32) {
            event.preventDefault();
        }
    }

    handleinput_username = (event) => {
        if (event.target.value.length > 0) {
            this.setState({ empty_username: false });
        }
    }

    handleinput_password = (event) => {
        if (event.target.value.length > 0) {
            this.setState({ empty_password: false });
        }
    }

    handleWhitespace = (event) => {
        if (event.which === 32) {
            event.preventDefault();
        }
    }

    InputOTP_validation = (event) => {
        let get_input = event.target.value
        if (isNaN(Number(get_input))) {
            return;
        }
        else {
            this.setState({
                valueOTP: event.target.value,
                empty_valueOTP: false,
                KetTextvalueOTP: ''
            });
        }
    }

    Numeric_validation = (event) => {
        let get_input = event.target.value
        if (isNaN(Number(get_input))) {
            return;
        }
        else {
            this.setState({
                inputNoTelp: event.target.value,
                empty_NoTelp: false,
                KetTextNoTelp: ''
            });
        }
    }

    Password_appear = () => {
        if (document.getElementById('login-password').type == 'password') {
            document.getElementById('login-password').type = 'text'
            this.setState({ icon_pass: 'fa fa-eye' });
        }
        else {
            document.getElementById('login-password').type = 'password'
            this.setState({ icon_pass: 'fa fa-eye-slash' });
        }
        this.forceUpdate()
    }

    printCountDown = () => {
        let count1 = 60;
        let myTimer = setInterval(() => {
            this.setState({ timer: 'Kirim ulang OTP ? Tunggu ' + count1 + ' detik' })
            count1--;
            if (count1 === 0) {
                clearInterval(myTimer);
                this.setState({ timer: 'Kirim ulang OTP' })
            }
        }, 1000);
    }

    sendOtp = async () => {
        let RootSendOtp = 'https://www.mospay.id/sendotp/message/sendmessage';

        let x = this.generateOtp()
        let dataReturned = Object.create(null);
        dataReturned = {
            otptype: this.state.inputTipeOTP,
            nohp: this.state.inputNoTelp,
            message: 'Yth. pelanggan GLOB di nomor ' + this.state.inputNoTelp + '. Berikut OTP Anda: ' + x +
                '. Gunakan OTP ini untuk aktivasi akun Anda. Terima kasih.',
            userid: 'GMOS001',
            key: 'z25k4at3jzob718iqceofgor6a1tbm'
        }

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await Axios.post(RootSendOtp, dataReturned, axiosConfig).then(res => {
            let status = res.data.successCode
            let messageid = res.data.messageID
            this.setState({
                message_id: messageid,
                sendValueOTP: x
            })

        }).catch(err => {
            // console.log(err);
        })

    }

    timerBtnKirimUlangOtp = () => {
        // setTimeout(() => this.setState({ isBtnWaitOtp: false }), 60000);
        // setTimeout(() => this.setState({ isBtnConfirmOtp: true }), 3600000);
        this.printCountDown()
    }

    toggleCheckOTP = async () => {
        if (this.state.valueOTP == '') {
            this.setState({
                empty_valueOTP: true,
                KetTextvalueOTP: 'Masukkan kode OTP'
            });
        }
        else {
            let RootGetOtp = 'https://www.mospay.id/sendotp/message/getmessage';

            let dataCheckGetOtp = Object.create(null);
            dataCheckGetOtp = {
                messageid: this.state.message_id,
                userid: 'GMOS001',
                key: 'z25k4at3jzob718iqceofgor6a1tbm'
            }

            Toast.loading('loading . . .', () => {
            });

            await Axios.post(RootGetOtp, dataCheckGetOtp).then(res => {
                // let status = res.data.successCode
                // let messageid = res.data.messageID

                if (this.state.valueOTP === this.state.sendValueOTP) {
                    let query = encrypt("update gcm_master_user set status='A', update_by=" + this.state.data[0].id +
                        ", update_date = now(), no_hp_verif = true  where id = " + this.state.data[0].id)

                    Axios.post(url.select, {
                        query: query
                    }).then(data => {
                        // this.checkVerifiedUser()
                        this.setState({
                            openInsertOTP: false
                        });
                        Toast.hide()
                        this.getTokenFCM()
                        localStorage.setItem('Login', true);
                        localStorage.setItem('UserLogin', encrypt(this.state.data[0].nama));
                        localStorage.setItem('CompanyIDLogin', encrypt(this.state.data[0].company_id));
                        localStorage.setItem('UserIDLogin', encrypt(this.state.data[0].id));
                        localStorage.setItem('TipeBisnis', encrypt(this.state.data[0].tipe_bisnis.toString()));
                        this.props.history.push('/')
                        const Notif = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2300,
                            timerProgressBar: true,
                            onOpen: (toast) => {
                                //   toast.addEventListener('mouseenter', Swal.stopTimer)
                                //   toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        Notif.fire({
                            icon: 'success',
                            title: 'Selamat datang, ' + this.state.data[0].nama
                        })
                    }).catch(err => {
                        // console.log('error');
                        // console.log(err);
                    })
                }
                else {
                    Toast.fail('Kode OTP salah !', 2000, () => {
                    });
                }
            }).catch(err => {
                // console.log(err);
            })

        }
    }

    toggleOTP = async () => {
        if (this.state.inputNoTelp == '') {
            this.setState({
                empty_NoTelp: true,
                KetTextNoTelp: 'Inputkan Nomor Handphone'
            });
        }

        if (this.state.inputTipeOTP == '') {
            this.setState({
                empty_TipeOTP: true,
                KetTextTipeOTP: 'Pilih tipe pengiriman OTP'
            });
        }

        if (this.state.inputNoTelp != '' && this.state.inputTipeOTP != '') {

            let query = encrypt("select no_hp from gcm_master_user where company_id = " + this.state.data[0].company_id +
                " and username='" + document.getElementById("login-username").value + "' ")

            Toast.loading('loading . . .', () => {
            });
            await Axios.post(url.select, {
                query: query
            }).then(data => {
                this.setState({ no_hp_registered: data.data.data[0].no_hp });
                Toast.hide()
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })

            if (this.state.no_hp_registered != this.state.inputNoTelp) {
                Toast.fail('Inputkan nomor Handphone yang sama saat pendaftaran', 2500, () => {
                });
            }
            else {
                this.setState({
                    openConfirmationOTP: !this.state.openConfirmationOTP,
                    openOTP: !this.state.openOTP
                });

                // this.setState({ openInsertOTP: true });
                // this.sendOtp()
                // this.timerBtnKirimUlangOtp()
            }
        }
    }

    toggleKirimOTP = async () => {
        this.setState({
            openConfirmationOTP: false,
            openInsertOTP: true
        });
        this.sendOtp()
        this.timerBtnKirimUlangOtp()
    }

    render() {
        const checkLogin = localStorage.getItem('Login');
        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Masuk' },
        ];

        return (

            <React.Fragment>
                <Helmet>
                    {
                        this.state.test ?
                            <title>{`Beranda — ${theme.name}`}</title>
                            : <title>{`Masuk — ${theme.name}`}</title>
                    }
                </Helmet>

                <PageHeader breadcrumb={breadcrumb} />

                <div className="block" >
                    <div className="container" >
                        <div className="row">
                            <div className="col-md-3 d-flex">
                            </div>
                            <div className="col-md-6 d-flex">
                                <div className="card flex-grow-1 mb-md-0">
                                    <div id="login-form" className="card-body">
                                        <h3 className="card-title">Masuk</h3>
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="login-email">Username </label>
                                                <InputGroup>
                                                    <Input
                                                        id="login-username"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        placeholder="Masukkan username"
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.handleinput_username(event)}
                                                        invalid={this.state.empty_username}
                                                    />
                                                    <FormFeedback>Masukkan username Anda</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="login-email">Password</label>
                                                <InputGroup>
                                                    <Input
                                                        id="login-password"
                                                        type="password"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        placeholder="Masukkan password"
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event => this.handleinput_password(event)}
                                                        invalid={this.state.empty_password}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText style={{ cursor: 'pointer' }} onClick={this.Password_appear}><i class={this.state.icon_pass} aria-hidden="true" ></i></InputGroupText>
                                                    </InputGroupAddon>
                                                    <FormFeedback>Masukkan password Anda</FormFeedback>
                                                </InputGroup>
                                            </div>

                                        </form>
                                        <button onClick={this.ClickLogin} className="btn btn-primary mt-2 mt-md-3 mt-lg-4 float-right" >
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 d-flex">
                            </div>
                        </div>
                    </div>

                    <Modal isOpen={this.state.openOTP} size="sm" centered>
                        <ModalHeader className="stickytopmodal" toggle={() => this.setState({ openOTP: false })}>Aktivasi Pengguna</ModalHeader>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12 ">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="alamat-provinsi">Nomor Handphone</label>
                                            <InputGroup>
                                                <Input
                                                    type="text"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    maxLength="15"
                                                    invalid={this.state.empty_NoTelp}
                                                    onKeyPress={event => this.handleWhitespace(event)}
                                                    onChange={event => this.Numeric_validation(event)}
                                                    value={this.state.inputNoTelp}
                                                />
                                                <FormFeedback>{this.state.KetTextNoTelp}</FormFeedback>
                                            </InputGroup>
                                        </div>

                                        <div className="form-group">
                                            <label>Pengiriman OTP</label>
                                            <InputGroup>
                                                <Input
                                                    type="select"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    invalid={this.state.empty_TipeOTP}
                                                    onChange={this.getTipeOTP}
                                                    value={this.state.inputTipeOTP}
                                                >
                                                    <option value="" disabled selected hidden></option>
                                                    {/* <option value="WA" >WhatsApp</option> */}
                                                    <option value="SMS">SMS</option>

                                                </Input>
                                                <FormFeedback>{this.state.KetTextTipeOTP}</FormFeedback>
                                            </InputGroup>
                                        </div>

                                    </form>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 d-flex">
                                    <button id="btnRegister" type="submit" onClick={this.toggleOTP} block className="btn btn-primary mt-12 mt-md-2 mt-lg-3">
                                        Minta OTP
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <Dialog
                        maxWidth="xs"
                        open={this.state.openConfirmationOTP}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">Verifikasi Akun</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Kode OTP akan dikirimkan ke nomor{' '} <span><strong>{this.state.inputNoTelp}</strong></span> {' '} via {' '} <span><strong>{this.state.inputTipeOTP}</strong></span>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={this.toggleKirimOTP}>
                                Ya
                            </Button>
                            <button className="btn btn-light" onClick={() => this.setState({ openConfirmationOTP: false })}>
                                Batal
                            </button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        maxWidth="xs"
                        open={this.state.openInsertOTP}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">Verifikasi Akun</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <label><center>Masukkan kode OTP yang dikirimkan ke nomor : {' '} <span><strong>{this.state.inputNoTelp}</strong></span></center></label>
                            </DialogContentText>
                            <InputGroup>
                                <Input
                                    id="input-otp"
                                    type="text"
                                    spellCheck="false"
                                    autoComplete="off"
                                    className="form-control"
                                    maxLength="6"
                                    invalid={this.state.empty_valueOTP}
                                    value={this.state.valueOTP}
                                    onChange={event => this.InputOTP_validation(event)}
                                />
                                <FormFeedback>{this.state.KetTextvalueOTP}</FormFeedback>
                            </InputGroup>

                            {this.state.timer == 'Kirim ulang OTP' ?
                                (<label onClick={() => { this.sendOtp(); this.timerBtnKirimUlangOtp() }} style={{ fontSize: '13px', fontWeight: '400', textDecoration: 'underline', cursor: 'pointer' }}>{this.state.timer}</label>
                                ) :
                                (<label style={{ fontSize: '13px', fontWeight: '400' }}>{this.state.timer}</label>
                                )
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={this.toggleCheckOTP}>
                                Konfirmasi
                            </Button>
                            <button className="btn btn-light" onClick={() => { this.setState({ openInsertOTP: false }) }}>
                                Batal
                            </button>
                        </DialogActions>
                    </Dialog>

                </div>
            </React.Fragment>
        );
    }
}
