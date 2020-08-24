// react
import React, { Component } from 'react';

// third-party
import { connect } from 'react-redux';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';
import firebase from '../firebase/index';
import { Modal, ModalHeader } from 'reactstrap';

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
            first_call_chat: true,
            count_chat: 0
        }
    }

    async componentDidMount() {
        // this.loadDataNotif()
        var company_id_user = decrypt(localStorage.getItem('CompanyIDLogin'))
        firebase.database().ref().orderByChild('company_id_buyer').equalTo(Number(company_id_user)).on("value", snapshot => {
            var count_new_chat = 0
            snapshot.forEach(function (child) {
                const result = Object.keys(child.val().message).map((key) => child.val().message[key]);
                for (var i = 0; i < result.length; i ++){
                    if(result[i].read == false && result[i].sender != Number(company_id_user)){
                        count_new_chat++
                        break
                    }
                }
            });

            this.setState({count_chat: count_new_chat})
            
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

    async readNotif() {
        let query = encrypt("update gcm_notification_nego set read_flag = 'Y' where " +
            "buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')))

        // Toast.loading('', () => {
        // });

        await Axios.post(url.select, {
            query: query
        }).then(data => {
            // Toast.hide()
        }).catch(err => {
            console.log('error' + err);
            console.log(err);
        })
    }

    toggleModalChat = () => {
        this.setState({
            modalChat_isOpen: !this.state.modalChat_isOpen
        })
    }

    render() {
        let dropdown;
        let dropdown_first;
        let dropdown_null;

        let modal_chat;

        modal_chat = (
            <Modal isOpen={this.state.modalChat_isOpen} size="xl" backdrop="static" >
                <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleModalChat}>Chat</ModalHeader>
                <div className="card-body">
                    <Messenger  company_id_buyer={""} company_id_seller={""} barang_id={""} type={"text"}
                                barang_image={""} barang_nama={""}/> 
                </div>
            </Modal>
        )

        const items = this.state.data_notif.map((item, index) => {
            let text = "Balasan nego ";

            return (
                <div>
                    <label style={{ fontSize: '13px', fontWeight: '550', textAlign: 'justify' }}>{text}<strong>"{item.barang_nama}"</strong> ({item.seller_nama})</label>
                    <hr style={{ margin: '8px' }} />
                </div>
            );
        });

        dropdown_first = (
            <div className="dropcart">
                <div className="dropcart__products-list" style={{ paddingBottom: '0px' }}>
                    <center>Notifikasi</center>
                </div>
                <div className="dropcart__products-list" style={{ overflowY: 'auto', maxHeight: '300px' }}>
                    {items}
                </div>
                <div className="dropcart__products-list" >
                    <CartContext.Consumer>
                        {(value) => (
                            <button type="submit" onClick={async () => { await this.readNotif(); await value.loadDataNotif() }} className="btn btn-primary btn-xs " style={{ width: '100%' }}>
                                Tandai telah dibaca ({this.state.data_notif.length})
                            </button>
                        )}
                    </CartContext.Consumer>
                </div>
            </div >
        );

        dropdown_null = (
            <div className="dropcart">
                <div className="dropcart__empty">
                    Tidak ada notifikasi
                </div>
            </div>
        )

        dropdown = (
            <div className="dropcart" >
                <div className="dropcart__products-list" style={{ paddingBottom: '0px' }}>
                    <center>Notifikasi</center>
                </div>
                <CartContext.Consumer>
                    {value => {
                        const load = value.notif.check_load_notif;

                        const items_update = value.notif.data_notif.map((item, index) => {
                            let text = "Balasan nego ";

                            return (
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '550' }}>{text}<strong>"{item.barang_nama}"</strong> ({item.seller_nama})</label>
                                    <hr style={{ margin: '8px' }} />
                                </div>
                            );
                        });

                        return load == 'yes' ? (
                            <div className="dropcart__products-list" style={{ overflowY: 'auto', maxHeight: '300px' }}>{items_update}</div>
                        ) : (
                                <div className="dropcart__products-list" style={{ overflowY: 'auto', maxHeight: '300px' }}>{items}</div>
                            );

                    }}

                </CartContext.Consumer>

                <div className="dropcart__products-list" >
                    <CartContext.Consumer>
                        {(value) => (
                            <button type="submit" onClick={async () => { await this.readNotif(); await value.loadDataNotif() }} className="btn btn-primary btn-xs " style={{ width: '100%' }}>
                                Tandai telah dibaca ({value.notif.count_data_notif})
                            </button>
                        )}
                    </CartContext.Consumer>
                </div>
            </div>
        );

        return (
            <CartContext.Consumer>
                {value => {
                    const load = value.notif.check_load_notif;
                    const count_notif = value.notif.count_data_notif;

                    if (count_notif > 0) {
                        return load == 'yes' ? (
                            <Indicator type={'chat'} dropdown={modal_chat} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
                        ) : (
                                <Indicator type={'chat'} dropdown={modal_chat} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
                            );
                    }
                    else if (load == "no" && count_notif == 0 && this.state.data_notif.length == 0) {
                        return (
                            <Indicator type={'chat'} dropdown={modal_chat} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
                        )
                    }
                    else {
                        return load == 'yes' ? (
                            <Indicator type={'chat'} dropdown={modal_chat} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
                        ) : (
                                <Indicator type={'chat'} dropdown={modal_chat} value={this.state.count_chat} icon={<Chat24Svg />} modalChat={this.toggleModalChat} />
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
