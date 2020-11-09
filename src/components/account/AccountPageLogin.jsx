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
import { toast } from 'react-toastify';

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
            disabledInputKodeVerifikasi: true,
            disabledInputOTPtype: true,
            openConfirmationOTP: false, openInsertOTP: false,
            openLupaAkun: false,
            valueOTP: '', empty_valueOTP: '', KetTextvalueOTP: '',
            sendValueOTP: '',
            valueEmail: '', empty_valueEmail: false, KetTextvalueEmail: '',
            disabledLupaAkunBtn: true,
            displaycatch: false,
            timer: '',
            waiting_timer: true,
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
                console.log('store token success')
                localStorage.setItem('Token', encrypt(token));
            })
        }).catch((error) => {
            console.log('error get token')
            console.log(error)
        })
    }

    ClickLupaAkun = () => {
        this.setState({
            valueEmail: '',
            empty_valueEmail: false,
            KetTextvalueEmail: '',
            disabledLupaAkunBtn: true,
            openLupaAkun: !this.state.openLupaAkun
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
            let Login = "select a.id, a.nama as nama, b.id as company_id, tipe_bisnis, a.status, listing_id, a.no_hp from gcm_master_user a " +
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
                        this.setState({
                            openOTP: true,
                            no_hp_registered: data.data.data[0].no_hp
                        })
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

    handleOTPtype = (id) => {

        if (id === 'otp-wa-box') {
            document.getElementById('otp-wa-box').style.border = "3px solid #8CC63E";
            document.getElementById('otp-sms-box').style.border = "1px solid black";
            this.setState({ inputTipeOTP: 'WA' })
        }
        else {
            document.getElementById('otp-sms-box').style.border = "3px solid #8CC63E";
            document.getElementById('otp-wa-box').style.border = "1px solid black";
            this.setState({ inputTipeOTP: 'SMS' })
        }

        this.setState({ disabledInputOTPtype: false })
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

    InputEmail_validation = async (event) => {
        var get_input = event.target.value;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        this.setState({ valueEmail: get_input });

        if (get_input.match(mailformat) || get_input.length == 0) {

            if (get_input.length > 0) {
                this.setState({
                    disabledLupaAkunBtn: false
                })
            }

            this.setState({
                empty_valueEmail: false,
                KetTextvalueEmail: ""
            });

            // let check_email = this.state.data_user.filter(input_email => {
            //     return input_email.email === event.target.value;
            // });

            // if (check_email != '') {
            //     this.setState({
            //         empty_emailakun: true,
            //         KetEmailAkun: "Email telah terdaftar"
            //     });
            // }
            // else {
            //     this.setState({
            //         empty_emailakun: false,
            //         KetEmailAkun: ""
            //     });
            // }
        }
        else {
            this.setState({
                disabledLupaAkunBtn: true,
                empty_valueEmail: true,
                KetTextvalueEmail: "Tidak valid"
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
        let count = 30;
        let myTimer = setInterval(() => {
            this.setState({
                timer: count,
                waiting_timer: true
            })
            count--;
            if (count === 0) {
                clearInterval(myTimer);
                setTimeout(() => {
                    this.setState({ waiting_timer: false })
                }, 1000);
            }
        }, 1000);
    }

    sendOtp = async () => {

        let x = this.generateOtp()

        //config insert otp
        let url = 'https://glob.co.id/External/insertOTP';

        let dataAkun = Object.create(null);
        dataAkun = {
            tujuan: this.state.no_hp_registered,
            kode: x,
            username: "",
            tipe: "akun"
        }

        //config send otp
        let RootSendOtp = 'https://www.emos.id/sendmessage/message/sendmessage';

        let dataReturned = Object.create(null);
        dataReturned = {
            otptype: this.state.inputTipeOTP,
            nohp: this.state.no_hp_registered,
            message: 'Yth. pelanggan GLOB di nomor ' + this.state.no_hp_registered + '. Berikut OTP Anda: ' + x +
                '. Gunakan OTP ini untuk aktivasi akun Anda. Terima kasih.',
            userid: 'GMOS001',
            key: 'z25k4at3jzob718iqceofgor6a1tbm'
        }

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        Toast.loading('loading . . .', () => {
        });

        Axios.post(url, dataAkun).then(res => {

            if (res.data.status_insert === 'success') {

                Axios.post(RootSendOtp, dataReturned, axiosConfig).then(res => {
                    Toast.hide();
                    let status = res.data.successCode

                    if (status === '0') {
                        // set kosong input kode verif
                        if (this.state.openInsertOTP == true) {
                            for (var i = 1; i <= 6; i++) {
                                document.getElementById('codeBox' + i).value = ""
                            }
                        }

                        this.setState({
                            sendValueOTP: x,
                            openConfirmationOTP: false,
                            openInsertOTP: true
                        });
                        setTimeout(() => {
                            this.timerBtnKirimUlangOtp()

                        }, 1000);

                    }
                    else {
                        Toast.hide();
                        Toast.fail('Kode OTP gagal dikirim', 3000, () => {
                        });
                    }
                }).catch(err => {
                    Toast.hide();
                    Toast.fail('Kode OTP gagal dikirim', 3000, () => {
                    });
                })

            }
            else {
                Toast.hide()
                Toast.fail('Kode OTP gagal dikirim', 2000, () => {
                });
            }

        }).catch(err => {
            Toast.hide()
            Toast.fail('Kode OTP gagal dikirim', 2000, () => {
            });
        })

    }

    sendDataAkun = async () => {
        let query = encrypt("select username, password from gcm_master_user where email like '" + this.state.valueEmail + "'");

        Toast.loading('loading . . .', () => {
        });

        await Axios.post(url.select, {
            query: query
        }).then((data) => {
            var data_length = data.data.data.length
            if (data_length == 0) {
                Toast.hide();
                this.setState({
                    empty_valueEmail: true,
                    KetTextvalueEmail: "Email tidak terdaftar"
                });
            }
            else if (data_length > 0) {

                let url = 'https://glob.co.id/External/dataAkun';

                let dataAkun = Object.create(null);
                dataAkun = {
                    email_receiver: this.state.valueEmail,
                    username: data.data.data[0].username,
                    password: data.data.data[0].password,
                }

                Axios.post(url, dataAkun).then(res => {
                    Toast.hide()

                    if (res.data.status === 'success') {
                        Toast.success('Data akun berhasil dikirim', 2000, () => {
                        });
                        this.setState({ openLupaAkun: !this.state.openLupaAkun })
                    }
                    else {
                        Toast.fail('Data akun gagal dikirim', 2000, () => {
                        });
                    }

                }).catch(err => {
                    // console.log(err);
                })

            }
        })
    }

    timerBtnKirimUlangOtp = () => {
        this.printCountDown()
    }

    toggleCheckOTP = async () => {

        let url_otp = 'https://glob.co.id/data/status/otp';
        let dataAkun = Object.create(null);
        dataAkun = {
            tujuan: this.state.no_hp_registered,
            kode: this.state.sendValueOTP,
            tipe: "akun"
        }

        var get_otp_input = ""
        for (var i = 1; i <= 6; i++) {
            get_otp_input = get_otp_input + document.getElementById('codeBox' + i).value.toString()
        }

        if (get_otp_input == this.state.sendValueOTP) {
            Toast.loading('loading . . .', () => {
            });

            Axios.post(url_otp, dataAkun).then(res => {

                if (res.data.status === 'success') {

                    if (res.data.values[0].status_kode == 'expired') {
                        Toast.fail('Kode OTP sudah tidak berlaku !', 3000, () => {
                        });
                    }
                    else {

                        let query = encrypt("update gcm_master_user set status='A', update_by=" + this.state.data[0].id +
                            ", update_date = now(), no_hp_verif = true  where id = " + this.state.data[0].id)

                        Axios.post(url.select, {
                            query: query
                        }).then(data => {
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
                            Toast.fail('Proses aktivasi akun gagal !', 3000, () => {
                            });
                            console.log(err);
                        })
                    }
                }
                else {
                    Toast.fail('Gagal memeriksa kode OTP', 3000, () => {
                    });
                }

            }).catch(err => {
                Toast.fail('Gagal memeriksa kode OTP', 3000, () => {
                });
            })

        }
        else {
            Toast.fail('Kode OTP salah !', 3000, () => {
            });
        }

    }

    toggleOTP = async () => {
        if (this.state.inputTipeOTP != '') {
            this.setState({
                openConfirmationOTP: !this.state.openConfirmationOTP,
                openOTP: !this.state.openOTP
            });
        }
    }

    toggleKirimOTP = async () => {
        this.sendOtp()
    }

    // Function input kode
    getCodeBoxElement = (index) => {
        return document.getElementById('codeBox' + index);
    }

    onKeyUpEvent = (index, event) => {
        const eventCode = event.which || event.keyCode;
        this.setState({ disabledInputKodeVerifikasi: true })

        //cek semua isi code box
        var all_contain = true
        for (var i = 1; i <= 6; i++) {
            if (document.getElementById('codeBox' + i).value.toString() == "") {
                all_contain = false
                break
            }
        }

        if (all_contain == true) {
            this.setState({ disabledInputKodeVerifikasi: false })
        }

        if (this.getCodeBoxElement(index).value.length === 1) {
            if (index !== "6") {
                this.getCodeBoxElement(parseInt(index) + 1).focus();
            } else {
                this.getCodeBoxElement(index).blur();
                // Submit code
                this.setState({ disabledInputKodeVerifikasi: false })
            }
        }
        if (eventCode === 8 && index !== 1) {
            // this.setState({
            //     KetTextKodeVerifikasi: ''
            // })
            if (parseInt(index) > 1) {
                this.getCodeBoxElement(parseInt(index) - 1).focus();
            }
        }
    }
    onFocusEvent = (index) => {
        for (var item = 1; item < parseInt(index); item++) {
            const currentElement = this.getCodeBoxElement(item);
            if (!currentElement.value) {
                currentElement.focus();
                break;
            }
        }
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
                                    <div className="card-body">
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

                                            <div className="form-group" style={{ marginBottom: '7px' }}>
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
                                            <Link className="text-lupaakun" to={`/reset-password`}>Lupa password ?</Link>
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
                        <ModalHeader className="stickytopmodal" toggle={() => this.setState({ openOTP: false, disabledInputOTPtype: true })}>Aktivasi Pengguna</ModalHeader>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12 ">
                                    <form>
                                        <div className="form-group">
                                            <label className="address-card__row-title">Kami akan mengirimkan kode OTP untuk proses aktivasi akun Anda.</label>
                                            <label className="address-card__row-title">Pilih tipe pengiriman :</label>
                                            <div class="outerdiv-otp">
                                                <div id="otp-wa-box" class="innerdiv-otp" onClick={event => this.handleOTPtype("otp-wa-box")}>
                                                    <img src={"/images/whatsapp.png"} height="50" width="50" />
                                                    <label style={{ position: "absolute", bottom: 0, fontSize: "12px" }}>WhatsApp</label>
                                                </div>
                                                <div id="otp-sms-box" class="innerdiv-otp" onClick={event => this.handleOTPtype("otp-sms-box")}>
                                                    <img src={"/images/sms.png"} height="50" width="50" />
                                                    <label style={{ position: "absolute", bottom: 0, fontSize: "12px" }}>SMS</label>
                                                </div>
                                            </div>

                                            {/* <InputGroup>
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
                                                    <option value="WA" >WhatsApp</option>
                                                    <option value="SMS">SMS</option>

                                                </Input>
                                                <FormFeedback>{this.state.KetTextTipeOTP}</FormFeedback>
                                            </InputGroup> */}
                                        </div>

                                    </form>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 d-flex">
                                    <button id="btnRegister" type="submit" disabled={this.state.disabledInputOTPtype} onClick={this.toggleOTP} block className="btn btn-primary mt-12 mt-md-2 mt-lg-3">
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
                                Kode OTP akan dikirimkan ke nomor{' '} <span><strong>{this.state.no_hp_registered}</strong></span> {' '} via {' '}
                                {this.state.inputTipeOTP == 'WA' ?
                                    (<span>
                                        <strong>
                                            WhatsApp
                                        </strong>
                                    </span>) :
                                    (<span>
                                        <strong>
                                            {this.state.inputTipeOTP}
                                        </strong>
                                    </span>)
                                }
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

                            <div className="input_kode">
                                <form>
                                    <input id="codeBox1" type="number" maxLength="1" onKeyUp={event => this.onKeyUpEvent("1", event)} onFocus={() => this.onFocusEvent("1")} onKeyPress={event => this.handleWhitespace(event)} />
                                    <input id="codeBox2" type="number" maxLength="1" onKeyUp={event => this.onKeyUpEvent("2", event)} onFocus={() => this.onFocusEvent("2")} onKeyPress={event => this.handleWhitespace(event)} />
                                    <input id="codeBox3" type="number" maxLength="1" onKeyUp={event => this.onKeyUpEvent("3", event)} onFocus={() => this.onFocusEvent("3")} onKeyPress={event => this.handleWhitespace(event)} />
                                    <input id="codeBox4" type="number" maxLength="1" onKeyUp={event => this.onKeyUpEvent("4", event)} onFocus={() => this.onFocusEvent("4")} onKeyPress={event => this.handleWhitespace(event)} />
                                    <input id="codeBox5" type="number" maxLength="1" onKeyUp={event => this.onKeyUpEvent("5", event)} onFocus={() => this.onFocusEvent("5")} onKeyPress={event => this.handleWhitespace(event)} />
                                    <input id="codeBox6" type="number" maxLength="1" onKeyUp={event => this.onKeyUpEvent("6", event)} onFocus={() => this.onFocusEvent("6")} onKeyPress={event => this.handleWhitespace(event)} />
                                </form>
                            </div>

                            {/* <InputGroup>
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
                            </InputGroup> */}

                            {/* {this.state.timer == 'Kirim ulang OTP' ?
                                (<label onClick={() => { this.sendOtp(); this.timerBtnKirimUlangOtp() }} style={{ fontSize: '13px', fontWeight: '400', textDecoration: 'underline', cursor: 'pointer' }}>{this.state.timer}</label>
                                ) :
                                (<label style={{ fontSize: '13px', fontWeight: '400' }}>{this.state.timer}</label>
                                )
                            } */}
                        </DialogContent>
                        <center>
                            <label className="address-card__row-title" style={{ fontSize: '14px', marginTop: '15px' }}>
                                {this.state.waiting_timer == true ?
                                    (<label>
                                        Kirim ulang kode verifikasi dalam <strong>{this.state.timer} detik</strong>
                                    </label>) :
                                    (<label onClick={() => { this.sendOtp(); this.timerBtnKirimUlangOtp() }} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                        Kirim ulang kode verifikasi
                                    </label>)
                                }
                            </label>
                        </center>
                        <DialogActions>
                            <Button color="primary" disabled={this.state.disabledInputKodeVerifikasi} onClick={this.toggleCheckOTP}>
                                Konfirmasi
                            </Button>
                            <button className="btn btn-light" onClick={() => { this.setState({ openInsertOTP: false }) }}>
                                Batal
                            </button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        maxWidth="xs"
                        open={this.state.openLupaAkun}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">Lupa Akun</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <label><center>Data akun Anda akan dikirimkan melalui email yang terdaftar. Masukkan alamat email : </center></label>
                            </DialogContentText>
                            <InputGroup>
                                <Input
                                    id="input-email"
                                    type="text"
                                    spellCheck="false"
                                    autoComplete="off"
                                    className="form-control"
                                    invalid={this.state.empty_valueEmail}
                                    value={this.state.valueEmail}
                                    onChange={event => this.InputEmail_validation(event)}
                                />
                                <FormFeedback>{this.state.KetTextvalueEmail}</FormFeedback>
                            </InputGroup>

                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" disabled={this.state.disabledLupaAkunBtn} onClick={this.sendDataAkun}>
                                Kirim
                            </Button>
                            <button className="btn btn-light" onClick={() => { this.setState({ openLupaAkun: !this.state.openLupaAkun }) }}>
                                Batal
                            </button>
                        </DialogActions>
                    </Dialog>

                </div>
            </React.Fragment>
        );
    }
}
