// react
import React, { Component } from 'react';

// third-party
import { connect } from 'react-redux';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import firebase from '../firebase/index';
import { Modal, ModalHeader } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// application
import Indicator from './Indicator';
import { Chat24Svg } from '../../svg';
import { cartRemoveItem } from '../../store/cart';
import { CartContext } from '../../context/cart';
import Messenger from '../chat/Messenger';
import { toast } from 'react-toastify';

class IndicatorChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data_notif: [],
            modalChat_isOpen: false,
            emptyChat_isOpen: false,
            first_call_chat: true,
            count_chat: 0,
            empty_chat: true
        }
    }

    async componentDidMount() {
        var company_id_user = decrypt(localStorage.getItem('CompanyIDLogin'))
        firebase.database().ref().orderByChild('company_id_buyer').equalTo(Number(company_id_user)).on("value", snapshot => {
            var count_new_chat = 0
            var empty_chat = true

            snapshot.forEach(function (child) {
                const result = Object.keys(child.val().message).map((key) => child.val().message[key]);
                for (var i = 0; i < result.length; i++) {
                    if (result[i].read == false && result[i].sender != Number(company_id_user)) {
                        count_new_chat++
                        break
                    }
                }

                empty_chat = false

            });

            this.setState({
                empty_chat: empty_chat,
                count_chat: count_new_chat
            })

            // if (this.state.first_call_chat == false) {
            //     if(this.state.modalChat_isOpen == false){
            //         const options = {
            //             autoClose: false,
            //             className: 'custom-toast',
            //             position: 'bottom-right',
            //             autoClose: 7000
            //         };
            //         toast.success('💬 Ada pesan baru', options);
            //     }
            // }

            if (this.state.first_call_chat == true) {
                this.setState({ first_call_chat: false })
            }
        })
    }

    // async readNotif() {
    //     let query = encrypt("update gcm_notification_nego set read_flag = 'Y' where " +
    //         "buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')))

    //     await Axios.post(url.select, {
    //         query: query
    //     }).then(data => {
    //         // Toast.hide()
    //     }).catch(err => {
    //         console.log('error' + err);
    //         console.log(err);
    //     })
    // }

    toggleModalChat = () => {
        if (this.state.empty_chat == true) {
            this.setState({
                emptyChat_isOpen: !this.state.emptyChat_isOpen
            })
        }
        else {
            this.setState({
                modalChat_isOpen: !this.state.modalChat_isOpen
            })
        }

    }

    render() {

        let modal_chat;
        let empty_chat;

        modal_chat = (
            <Modal isOpen={this.state.modalChat_isOpen} size="xl" backdrop="static" >
                <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleModalChat}>Chat</ModalHeader>
                <div className="card-body">
                    <Messenger company_id_buyer={""} company_id_seller={""} barang_id={""} type={"text"}
                        barang_image={""} barang_nama={""} />
                </div>
            </Modal>
        )

        empty_chat = (
            <Dialog
                open={this.state.emptyChat_isOpen}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">Perhatian !</DialogTitle>
                <DialogContent>
                    <center>
                        <img src={"/images/chat90px.png"} />
                    </center>
                    <DialogContentText>
                        Belum ada chat dengan distributor mana pun.
                    </DialogContentText>
                    <center>
                        <button type="submit" style={{ width: '60%' }} className="btn btn-primary mt-4 mb-3" onClick={this.toggleModalChat}>
                            Mengerti
                        </button>
                    </center>
                </DialogContent>
            </Dialog>
        )

        return (
            <CartContext.Consumer>
                {value => {
                    const load = value.notif.check_load_notif;
                    const count_notif = value.notif.count_data_notif;

                    if (this.state.empty_chat == true) {
                        var modal = empty_chat
                    }
                    else {
                        var modal = modal_chat
                    }

                    if (count_notif > 0) {
                        return load == 'yes' ? (
                            <Indicator type={'chat'} dropdown={modal} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
                        ) : (
                                <Indicator type={'chat'} dropdown={modal} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
                            );
                    }
                    else if (load == "no" && count_notif == 0 && this.state.data_notif.length == 0) {
                        return (
                            <Indicator type={'chat'} dropdown={modal} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
                        )
                    }
                    else {
                        return load == 'yes' ? (
                            <Indicator type={'chat'} dropdown={modal} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
                        ) : (
                                <Indicator type={'chat'} dropdown={modal} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
                            );
                    }
                }}
            </CartContext.Consumer>
        )
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
});

const mapDispatchToProps = {
    cartRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorChat);
