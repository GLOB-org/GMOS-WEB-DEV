// react
import React, { Component } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Button, FormFeedback, Input, InputGroup } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Axios from 'axios';
import DialogCatch from '../shared/DialogCatch';
import Toast from 'light-toast';
// import OTPInput from 'otp-input-react';

// data stubs
import theme from '../../data/theme';
import { encrypt, decrypt, url } from '../../lib';

export default class AccountPageVerification extends Component {

    constructor(props) {
        super(props);
        this.state = {
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

    checkVerifiedUser = () => {
        if (localStorage.getItem('Login') != null) {

            let get_status = encrypt("select no_hp_verif, no_hp from gcm_master_user where id = " + decrypt(localStorage.getItem('UserIDLogin')));

            Axios.post(url.select, {
                query: get_status
            }).then(data => {
                this.setState({
                    statusVerified: data.data.data[0].no_hp_verif,
                    noHandphoneVerified: data.data.data[0].no_hp
                });
            }).catch(err => {
                this.setState({ displaycatch: true });
                console.log('error');
                console.log(err);
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
            message: 'Yth. pelanggan GMOS di nomor ' + this.state.inputTipeOTP + '. Berikut OTP Anda: ' + x +
                '. Gunakan OTP ini untuk aktivasi akun Anda. Terima kasih.',
            userid: 'GMOS001',
            key: 'z25k4at3jzob718iqceofgor6a1tbm'
        }

        await Axios.post(RootSendOtp, dataReturned).then(res => {
            let status = res.data.successCode
            let messageid = res.data.messageID
            this.setState({
                message_id: messageid,
                sendValueOTP: x
            })

        }).catch(err => {
            console.log(err);
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
                    let query = encrypt("update gcm_master_user set status='A', update_by=" + decrypt(localStorage.getItem('UserIDLogin')) +
                        ", update_date = now(), no_hp_verif = true  where id = " + decrypt(localStorage.getItem('UserIDLogin')))

                    Axios.post(url.select, {
                        query: query
                    }).then(data => {
                        this.checkVerifiedUser()
                        this.setState({
                            openInsertOTP: false
                        });
                        Toast.hide()
                    }).catch(err => {
                        console.log('error');
                        console.log(err);
                    })
                }
                else {
                    Toast.fail('Kode OTP salah, silakan ulangi proses aktivasi', 2000, () => {
                    });
                }
            }).catch(err => {
                console.log(err);
            })

        }
    }

    toggleOTP = () => {
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
            this.setState({
                openConfirmationOTP: !this.state.openConfirmationOTP
            });
        }

    }

    toggleKirimOTP = async () => {
        this.setState({ openConfirmationOTP: false });

        let query = encrypt("select no_hp from gcm_master_user where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) +
            " and id =" + decrypt(localStorage.getItem('UserIDLogin')))

        Toast.loading('loading . . .', () => {
        });
        await Axios.post(url.select, {
            query: query
        }).then(data => {
            this.setState({ no_hp_registered: data.data.data[0].no_hp });
            Toast.hide()
        }).catch(err => {
            console.log('error');
            console.log(err);
        })

        if (this.state.no_hp_registered != this.state.inputNoTelp) {
            Toast.fail('Inputkan nomor Handphone yang sama saat pendaftaran', 2500, () => {
            });
        }
        else {
            this.setState({ openInsertOTP: true });
            this.sendOtp()
            this.timerBtnKirimUlangOtp()
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

    componentDidMount() {
        this.checkVerifiedUser()
    }

    render() {

        if (this.state.statusVerified == true) {
            return (
                <div className="card">
                    <Helmet>
                        <title>{`Akun — ${theme.name}`}</title>
                    </Helmet>
                    <div className="card-header">
                        <h5>Verifikasi Akun</h5>
                    </div>
                    <div className="card-divider" />
                    <div className="card-body">
                        <img src={"/images/verified-60.png"} /> Akun Anda telah terverifikasi
                        {/* melalui nomor : {'  '}<strong>{this.state.noHandphoneVerified}</strong> */}
                    </div>

                    {/* <div className="row">
                        <div className="col-md-1 mt-4 mb-4">
                            <img src={"/images/verified-60.png"} />
                        </div>
                        <div className="col-md-11 mt-4 mb-4">
                            Akun Anda telah terverifikasi
                        </div>
                    </div> */}
                </div>
            );
        }
        else if (this.state.statusVerified == false) {
            return (
                <div className="card">
                    <Helmet>
                        <title>{`Akun — ${theme.name}`}</title>
                    </Helmet>

                    <div className="card-header">

                        <h5>Verifikasi Akun</h5>
                    </div>
                    <div className="card-divider" />
                    <div className="card-body">
                        <div className="row no-gutters">
                            <div className="col-12 col-lg-7 col-xl-6">
                                <div className="form-group">
                                    <label htmlFor="perusahaan-nama">Nomor Handphone</label>
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
                                            <option value="WA">WhatsApp</option>
                                            <option value="SMS">SMS</option>

                                        </Input>
                                        <FormFeedback>{this.state.KetTextTipeOTP}</FormFeedback>
                                    </InputGroup>
                                </div>

                                <div className="form-group mt-5 mb-0">
                                    <button type="button" className="btn btn-primary" onClick={this.toggleOTP}>Minta OTP</button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <button className="btn btn-light" onClick={this.toggleOTP}>
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

                    <DialogCatch isOpen={this.state.displaycatch} />

                </div>
            );
        }

        else if (this.state.statusVerified == 'wait') {
            return (
                <div className="card">
                    <Helmet>
                        <title>{`Akun — ${theme.name}`}</title>
                    </Helmet>
                    <div className="card-header">
                        <h5>Verifikasi Akun</h5>

                    </div>
                    <div className="card-divider" />
                    <div className="card-body">
                        <lines class="shine"></lines>
                        <lines class="shine"></lines>
                        <lines class="shine"></lines>
                    </div>
                </div>
            );
        }


    }
}
