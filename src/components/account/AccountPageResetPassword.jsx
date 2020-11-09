// react
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

// third-party
import { Helmet } from 'react-helmet-async';
import { Button, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { encrypt, url } from '../../lib';
import Axios from 'axios';
import Toast from 'light-toast';

import { makeStyles } from '@material-ui/core/styles';

// application
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';

export default class AccountPageLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputEmail: '',
            emptyEmail: false,
            KetTextEmail: '',
            disabledInputEmail: true,
            inputKodeVerifikasi: '',
            emptyKodeVerifikasi: false,
            KetTextKodeVerifikasi: '',
            KetTextKodeVerifikasi_resend: 'none',
            disabledInputKodeVerifikasi: true,
            inputKodeVerifikasi_generate: '',
            inputPassword: '', inputRePassword: '',
            emptyPassword: false, emptyRePassword: false,
            KetTextPassword: '', KetTextRePassword: '',
            disabledInputPassword: true,
            stepInputEmail: true,
            stepInputKodeVerifikasi: false,
            stepInputPassword: false,
            stepChangePasswordSuccess: false,
            icon_pass: 'fa fa-eye-slash',
            icon_repass: 'fa fa-eye-slash',
            openConfirmation: false,
            caretcolor: 'black',
            timer: '',
            waiting_timer: true
        };
    }

    clickInputEmail = async () => {

        if (this.state.inputEmail != '') {
            let query = encrypt("select username, password from gcm_master_user where email = '" + this.state.inputEmail + "'");
            let kode_verifikasi = this.generateKodeVefikasi()

            Toast.loading('loading . . .', () => {
            });

            await Axios.post(url.select, {
                query: query
            }).then((data) => {
                var data_length = data.data.data.length

                if (data_length == 0) {
                    Toast.hide();
                    this.setState({
                        emptyEmail: true,
                        KetTextEmail: "Email tidak terdaftar"
                    });
                }
                else if (data_length > 0) {

                    let url = 'https://glob.co.id/External/insertOTP';

                    let dataAkun = Object.create(null);
                    dataAkun = {
                        tujuan: this.state.inputEmail,
                        kode: kode_verifikasi,
                        username: data.data.data[0].username,
                        tipe: "password"
                    }

                    Axios.post(url, dataAkun).then(res => {
                        Toast.hide()

                        if (res.data.status_insert === 'success' && res.data.status_kirim === 'success') {
                            Toast.success('Kode verifikasi berhasil dikirim', 2000, () => {
                            });

                            this.setState({
                                emptyKodeVerifikasi: false,
                                disabledInputKodeVerifikasi: true,
                                inputKodeVerifikasi: '',
                                KetTextKodeVerifikasi: "",
                                KetTextKodeVerifikasi_resend: 'none'
                            })

                            // set kosong input kode verif
                            if (this.state.stepInputKodeVerifikasi == true) {
                                for (var i = 1; i <= 6; i++) {
                                    document.getElementById('codeBox' + i).value = ""
                                }
                            }

                            setTimeout(() => {
                                this.setState({
                                    stepInputEmail: false,
                                    stepInputKodeVerifikasi: true
                                })

                                this.printCountDown()

                            }, 3000);

                        }
                        else {
                            Toast.fail('Kode verifikasi gagal dikirim', 2000, () => {
                            });
                            // console.log(res)
                        }

                    }).catch(err => {
                        // console.log(err)
                        Toast.fail('Kode verifikasi gagal dikirim', 2000, () => {
                        });
                    })

                }
            })
        }

        else {
            this.setState({
                emptyEmail: true,
                KetTextEmail: "email harus diisi !"
            })
        }
    }

    clickInputKodeVerifikasi = async () => {
        //get input kode
        var get_kode_verif = ""
        for (var i = 1; i <= 6; i++) {
            get_kode_verif = get_kode_verif + document.getElementById('codeBox' + i).value.toString()
        }

        await this.setState({ inputKodeVerifikasi: get_kode_verif })

        let url = 'https://glob.co.id/data/status/otp';
        let dataAkun = Object.create(null);
        dataAkun = {
            tujuan: this.state.inputEmail,
            kode: get_kode_verif,
            tipe: "password"
        }

        if (get_kode_verif != this.state.inputKodeVerifikasi_generate) {
            this.setState({
                emptyKodeVerifikasi: true,
                KetTextKodeVerifikasi: 'Kode verifikasi salah !'
            })
        }
        else {

            Toast.loading('loading . . .', () => {
            });

            Axios.post(url, dataAkun).then(res => {
                Toast.hide()

                if (res.data.status === 'success') {

                    if (res.data.values[0].status_kode == 'expired') {
                        this.setState({
                            emptyKodeVerifikasi: true,
                            KetTextKodeVerifikasi: 'Kode verifikasi sudah tidak berlaku !',
                            KetTextKodeVerifikasi_resend: 'block'
                        })
                    }
                    else {
                        this.setState({
                            stepInputEmail: false,
                            stepInputKodeVerifikasi: false,
                            stepInputPassword: true
                        })
                    }
                }
                else {
                    Toast.fail('Gagal memeriksa kode verifikasi', 2000, () => {
                    });
                }

            }).catch(err => {
                Toast.fail('Gagal memeriksa kode verifikasi', 2000, () => {
                });
            })
        }

    }

    clickInputPassword = async () => {

        var password_encrypt = encrypt(this.state.inputPassword)

        let query = encrypt("update gcm_master_user set password = '" + password_encrypt + "' where email = '" + this.state.inputEmail + "'");

        Toast.loading('loading . . .', () => {
        });

        await Axios.post(url.select, {
            query: query
        }).then(data => {
            Toast.hide()
            this.setState({
                openConfirmation: false,
                stepInputEmail: false,
                stepInputKodeVerifikasi: false,
                stepInputPassword: false,
                stepChangePasswordSuccess: true
            })
        }).catch(err => {
            Toast.hide()
            Toast.fail('Password gagal diubah', 3000, () => {
            });
        })
    }

    generateKodeVefikasi = () => {
        let digits = '01ABCD23EFGH45QRS6OPTU7NVWXY89IJKLMZ';
        let kode = '';
        for (let i = 0; i < 6; i++) {
            kode += digits[Math.floor(Math.random() * 10)];
        }
        this.setState({ inputKodeVerifikasi_generate: kode })
        return kode
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }

    handleWhitespace = (event) => {
        if (event.which === 32) {
            event.preventDefault();
        }
    }

    handleinput_email = (event) => {
        var get_input = event.target.value;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        this.setState({ inputEmail: get_input });

        if (get_input.match(mailformat) || get_input.length == 0) {

            if (get_input.length > 0) {
                this.setState({
                    disabledInputEmail: false
                })
            }
            else if (get_input.length == 0) {
                this.setState({
                    disabledInputEmail: true
                })
            }

            this.setState({
                emptyEmail: false,
                KetTextEmail: ""
            });

        }
        else {
            this.setState({
                disabledInputEmail: true,
                emptyEmail: true,
                KetTextEmail: "Tidak valid"
            });
        }
    }

    handleinput_kodeverifikasi = (event) => {
        var get_input = event.target.value;

        this.setState({
            inputKodeVerifikasi: get_input,
            caretcolor: 'black',
            KetTextKodeVerifikasi_resend: 'none'
        });

        if (get_input.length == 6) {
            this.setState({
                caretcolor: 'transparent',
                disabledInputKodeVerifikasi: false,
                emptyKodeVerifikasi: false,
                KetTextKodeVerifikasi: ""
            })
        }
        else {
            this.setState({
                disabledInputKodeVerifikasi: true
            });

            if (get_input.length == 0) {
                this.setState({
                    emptyKodeVerifikasi: false,
                    KetTextKodeVerifikasi: ""
                });
            }
            else {
                this.setState({
                    emptyKodeVerifikasi: true,
                    KetTextKodeVerifikasi: "Tidak valid"
                });
            }
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
            this.setState({
                emptyPassword: false,
                KetTextPassword: "",
                disabledInputPassword: false
            });

            if (get_input.length == 0 || this.state.inputRePassword == '' || get_input != this.state.inputRePassword) {
                this.setState({
                    disabledInputPassword: true
                });
            }

            if (get_input == this.state.inputRePassword) {
                this.setState({
                    emptyRePassword: false,
                    KetTextRePassword: "",
                });
            }
        }
        else if (contain_UpperCase == 'n' || contain_LowerCase == 'n' || contain_Number == 'n' || (get_input.length > 0 && get_input.length < 8)) {
            this.setState({
                emptyPassword: true,
                KetTextPassword: "Minimal 8 karakter dan harus terdiri dari A-Z, a-z, dan 0-9",
                disabledInputPassword: true
            });
        }
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

    Repassword_validation = async (event) => {
        this.handleChange(event);

        if (this.state.inputPassword != event.target.value &&
            document.getElementById("account-repassword").value != '') {
            this.setState({
                emptyRePassword: true,
                KetTextRePassword: 'Password tidak cocok',
                disabledInputPassword: true
            });

        }

        else if (this.state.inputRePassword == event.target.value ||
            this.state.inputPassword == event.target.value) {
            this.setState({
                emptyRePassword: false,
                KetTextRePassword: '',
                disabledInputPassword: false
            });
        }

        else if (event.target.value.length == 0) {
            this.setState({
                emptyRePassword: false,
                KetTextRePassword: '',
                disabledInputPassword: true

            });
        }
    }

    showPassword = () => {
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

    showRePassword = () => {
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
            this.setState({
                KetTextKodeVerifikasi: ''
            })
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
        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Reset Password' },
        ];

        let component_page;

        if (this.state.stepInputEmail == true) {
            component_page = (
                <div className="card-body">
                    <h3 className="card-title">Reset Password</h3>
                    <form>
                        <div className="form-group">
                            <label className="address-card__row-title">Masukkan email akun Anda yang terdaftar. Anda akan menerima kode verifikasi untuk proses reset password. </label>
                            <InputGroup>
                                <Input
                                    type="text"
                                    spellCheck="false"
                                    autoComplete="off"
                                    className="form-control mt-2"
                                    // placeholder="Masukkan email"
                                    onKeyPress={event => this.handleWhitespace(event)}
                                    onChange={event => this.handleinput_email(event)}
                                    invalid={this.state.emptyEmail}
                                />
                                <FormFeedback>{this.state.KetTextEmail}</FormFeedback>
                            </InputGroup>
                        </div>

                    </form>
                    <button onClick={this.clickInputEmail} disabled={this.state.disabledInputEmail} className="btn btn-primary mt-2 mt-md-3 mt-lg-4 float-right" >
                        Lanjut
                    </button>
                </div>
            )
        }
        else if (this.state.stepInputKodeVerifikasi == true) {
            component_page = (
                <div>
                    <div className="card-body">
                        <center><h3 className="card-title">Input Kode Verifikasi</h3></center>
                        <div lassName="form-group ">
                            <center><label className="address-card__row-title mt-5">Masukkan kode verifikasi yang dikirimkan ke email : {this.state.inputEmail} </label></center>
                        </div>
                        <div className="input_kode">
                            <form>
                                <input id="codeBox1" type="text" maxLength="1" onKeyUp={event => this.onKeyUpEvent("1", event)} onFocus={() => this.onFocusEvent("1")} onKeyPress={event => this.handleWhitespace(event)} />
                                <input id="codeBox2" type="text" maxLength="1" onKeyUp={event => this.onKeyUpEvent("2", event)} onFocus={() => this.onFocusEvent("2")} onKeyPress={event => this.handleWhitespace(event)} />
                                <input id="codeBox3" type="text" maxLength="1" onKeyUp={event => this.onKeyUpEvent("3", event)} onFocus={() => this.onFocusEvent("3")} onKeyPress={event => this.handleWhitespace(event)} />
                                <input id="codeBox4" type="text" maxLength="1" onKeyUp={event => this.onKeyUpEvent("4", event)} onFocus={() => this.onFocusEvent("4")} onKeyPress={event => this.handleWhitespace(event)} />
                                <input id="codeBox5" type="text" maxLength="1" onKeyUp={event => this.onKeyUpEvent("5", event)} onFocus={() => this.onFocusEvent("5")} onKeyPress={event => this.handleWhitespace(event)} />
                                <input id="codeBox6" type="text" maxLength="1" onKeyUp={event => this.onKeyUpEvent("6", event)} onFocus={() => this.onFocusEvent("6")} onKeyPress={event => this.handleWhitespace(event)} />
                            </form>
                        </div>
                        <center className="error-kode">{this.state.KetTextKodeVerifikasi}</center>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <center>
                                <button
                                    onClick={this.clickInputKodeVerifikasi}
                                    disabled={this.state.disabledInputKodeVerifikasi}
                                    style={{ width: '60%' }}
                                    className="btn btn-primary mt-6 mt-md-4 mt-lg-4 mt-xl-4" >
                                    Verifikasi
                                </button>
                            </center>
                            <center>
                                <label className="address-card__row-title" style={{ fontSize: '14px', marginTop: '15px' }}>
                                    {this.state.waiting_timer == true ?
                                        (<label>
                                            Kirim ulang kode verifikasi dalam <strong>{this.state.timer} detik</strong>
                                        </label>) :
                                        (<label onClick={this.clickInputEmail} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                            Kirim ulang kode verifikasi
                                        </label>)
                                    }
                                </label>
                            </center>
                        </div>

                        {/* <form>
                            <div className="form-group">
                                <label className="address-card__row-title">Masukkan kode verifikasi yang dikirimkan ke email : {this.state.inputEmail} </label>
                                <InputGroup>
                                    <Input
                                        id="input-kode-verifikasi"
                                        type="text"
                                        spellCheck="false"
                                        autoComplete="off"
                                        className="form-control mt-2"
                                        maxLength="6"
                                        // placeholder="Masukkan kode verifikasi"
                                        onClick={() => this.setState({ caretcolor: 'black' })}
                                        onKeyPress={event => this.handleWhitespace(event)}
                                        onChange={event => this.handleinput_kodeverifikasi(event)}
                                        invalid={this.state.emptyKodeVerifikasi}
                                        value={this.state.inputKodeVerifikasi}
                                        style={{ caretColor: this.state.caretcolor }}
                                    />
                                    <FormFeedback>
                                        {this.state.KetTextKodeVerifikasi}
                                    </FormFeedback>
                                </InputGroup>
                            </div>
                        </form>
                        <center>
                            <label className="address-card__row-title" style={{ fontSize: '14px' }}>
                                {this.state.waiting_timer == true ?
                                    (<span>
                                        Kirim ulang kode verifikasi dalam <strong>{this.state.timer} detik</strong>
                                    </span>) :
                                    (<span onClick={this.clickInputEmail} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                        Kirim ulang kode verifikasi
                                    </span>)
                                }
                            </label>
                        </center>

                        <button onClick={this.clickInputKodeVerifikasi} disabled={this.state.disabledInputKodeVerifikasi} className="btn btn-primary mt-2 mt-md-3 mt-lg-4 float-right" >
                            Verifikasi
                        </button> */}
                    </div>
                </div>
            )
        }
        else if (this.state.stepInputPassword == true) {
            component_page = (
                <div className="card-body">
                    <h3 className="card-title">Password Baru</h3>
                    <form>
                        <label className="address-card__row-title mb-2">Masukkan password baru untuk akun Anda </label>
                        <div className="form-group">
                            <label htmlFor="account-password">Password</label>
                            <InputGroup>
                                <Input
                                    id="account-password"
                                    name="inputPassword"
                                    type="password"
                                    spellCheck="false"
                                    autoComplete="off"
                                    className="form-control"
                                    invalid={this.state.emptyPassword}
                                    value={this.state.inputPassword}
                                    onKeyPress={event => this.handleWhitespace(event)}
                                    onChange={event => this.Password_validation(event)}
                                />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText style={{ cursor: 'pointer' }} onClick={this.showPassword}><i class={this.state.icon_pass} aria-hidden="true" ></i></InputGroupText>
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
                                    invalid={this.state.emptyRePassword}
                                    value={this.state.inputRePassword}
                                    onKeyPress={event => this.handleWhitespace(event)}
                                    onChange={event => this.Repassword_validation(event)}
                                />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText style={{ cursor: 'pointer' }} onClick={this.showRePassword}><i class={this.state.icon_repass} aria-hidden="true" ></i></InputGroupText>
                                </InputGroupAddon>
                                <FormFeedback>{this.state.KetTextRePassword}</FormFeedback>
                            </InputGroup>
                        </div>

                    </form>
                    <button onClick={() => this.setState({ openConfirmation: !this.state.openConfirmation })} disabled={this.state.disabledInputPassword} className="btn btn-primary mt-2 mt-md-3 mt-lg-4 float-right" >
                        Simpan
                    </button>
                </div>
            )
        }

        else if (this.state.stepChangePasswordSuccess == true) {
            component_page = (
                <div className="card-body">
                    <center><i class="fas fa-check-circle fa-4x mb-3" style={{ color: '#8CC63E' }}></i></center>
                    <center>Selamat, password Anda berhasil diubah</center>
                    <center>
                        <Link to="/masuk" className="btn btn-primary mt-4 mb-3" >menuju Halaman Masuk</Link>
                    </center>
                </div>
            )
        }

        return (

            <React.Fragment>
                <Helmet>
                    {
                        this.state.test ?
                            <title>{`Beranda — ${theme.name}`}</title>
                            : <title>{`Reset Password — ${theme.name}`}</title>
                    }
                </Helmet>

                <PageHeader breadcrumb={breadcrumb} />

                <div className="block" >
                    <div className="container" >
                        <div className="row">
                            <div className="col-md-3 d-flex">
                            </div>
                            <div className="col-md-6 d-flex">
                                <div className="flex-grow-1 mb-md-0">
                                    {component_page}
                                </div>
                            </div>
                            <div className="col-md-3 d-flex">
                            </div>
                        </div>
                    </div>

                    <Dialog
                        maxWidth="xs"
                        open={this.state.openConfirmation}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">Konfirmasi Reset Password</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Password akun Anda akan diubah dengan password yang baru. Lanjutkan ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={this.clickInputPassword}>
                                Ya
                            </Button>
                            <Button className="btn btn-light" onClick={() => this.setState({ openConfirmation: !this.state.openConfirmation })}>
                                Batal
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </React.Fragment>
        );
    }
}
