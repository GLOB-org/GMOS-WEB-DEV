import React, { Component } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import Compose from '../Compose';
import './Messenger.css';
import firebase from "../../firebase/index";
import { decrypt } from '../../../lib';
import Toast from 'light-toast';

export default class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
        personChat: '',
        dataChat: '',
        productOnChat: [],
        keyRoom: '',
        messageChat:'',
        seller_id:'',
        barang_id: '',
        barang_image: '',
        barang_nama: '',
        display_preview: 'none',
        hide_preview: false,
        className_messenger: '',
        className_sidebar: '',
        className_content: ''
    };
  }

  componentDidMount(){
    if(this.props.barang_id != ""){
      this.setState({
        personChat: '',
        barang_id: this.props.barang_id,
        barang_image: this.props.barang_image,
        barang_nama: this.props.barang_nama,
        display_preview: 'flex',
        className_messenger: 'messenger-tag-product',
        className_sidebar: 'scrollable sidebar-tag-product',
        className_content: 'scrollable content-tag-product'
      })
    }

    else {
      this.setState({
        className_messenger: 'messenger',
        className_sidebar: 'scrollable sidebar',
        className_content: 'scrollable content'
      })
    }

  }

  render(){

    const clickRoom = async (id_person, person, dataChat, dataConversation, dataProduct) => {

      var get_index
      var get_key_room
      var chat_key = []
      var company_id_user = Number(decrypt(localStorage.getItem('CompanyIDLogin')))

      for (var i = 0; i < dataConversation.length; i++){
      
        if(id_person == dataConversation[i].id_seller){
          get_index = dataConversation[i].first_index
          get_key_room = dataConversation[i].key_room
          break;
        }
      }

      await this.setState({
        seller_id: id_person,
        personChat: person,
        dataChat: dataChat[get_index],
        productOnChat: dataProduct,
        keyRoom: get_key_room
      })

      for (var i = 0; i < this.state.dataChat.length; i++){
        var get_sender = this.state.dataChat[i].sender
        var status_read = this.state.dataChat[i].read
        var uid = this.state.dataChat[i].uid
        if(get_sender != company_id_user && status_read == false){
          chat_key.push(uid)
        }
      }

      if(chat_key.length > 0){
        await updateReadChat(chat_key)
      }

      if(this.props.barang_id != ""){
        if(id_person != this.props.company_id_seller || this.state.hide_preview == true){
          hidePreview()
        }
        else if(id_person == this.props.company_id_seller){
          showPreview()
        }
      }
      else {
        hidePreview()
      }

      //scroll to bottom
      var objDiv = document.getElementById("message-room");
      objDiv.scrollTop = objDiv.scrollHeight;

    }

    const updateReadChat = (chat_key) => {
      for (var i = 0; i < chat_key.length; i++) {
        var direktori_update = "/" + this.state.keyRoom + "/message/" + chat_key[i]
        if(chat_key[i] != undefined){
          let updateRef = firebase.database().ref(direktori_update);  
          updateRef.update({ 'read': true });
        }
       
      }
    }

    const hidePreview = () => {
      this.setState({
        display_preview: 'none',
        className_messenger: 'messenger',
        className_sidebar: 'scrollable sidebar',
        className_content: 'scrollable content',
        barang_id: ""
      })
    }

    const hidePreview_full = () =>{
      hidePreview()
      this.setState({
        hide_preview: true
      })
    }

    const showPreview = () => {
      this.setState({
        display_preview: 'flex',
        className_messenger: 'messenger-tag-product',
        className_sidebar: 'scrollable sidebar-tag-product',
        className_content: 'scrollable content-tag-product',
        barang_id: this.props.barang_id
      })
    }

    const sendChat = (message) =>{
      var keyRoom = this.state.keyRoom
      var keyChat = ""
  
      var direktori_write = "/" + keyRoom + "/message"
      let sendRef = firebase.database().ref(direktori_write);
  
      var direktori_update = "/" + keyRoom 
      let updateRef = firebase.database().ref(direktori_update);
  
      var get_date = new Date().getDate() 
      var get_day = new Date().getDay()
      var get_month = new Date().getMonth()
      var get_hours = new Date().getHours()
      var get_minutes = new Date().getMinutes()
      var get_seconds = new Date().getSeconds()
      var get_year = new Date().getFullYear()
      var get_time = new Date().getTime()
      var get_timezone = new Date().getTimezoneOffset()

      if(this.state.barang_id != ""){
        var param = { 
          'barang_id': Number(this.state.barang_id),
          'uid': "",
          'contain': message,
          'read': false,
          'receiver': Number(this.state.seller_id),
          'sender': Number(decrypt(localStorage.getItem("CompanyIDLogin"))),
          'timestamp':  {   
                            'date': get_date,
                            'day': get_day,
                            'hours':get_hours,
                            'minutes': get_minutes,
                            'month': get_month,
                            'seconds': get_seconds,
                            'time': get_time,
                            'timezoneOffset': get_timezone,
                            'year':get_year
                        },
          'type': "barang" 
        }
      }
      else {
        var param = { 
          'uid': "",
          'contain': message,
          'read': false,
          'receiver': Number(this.state.seller_id),
          'sender': Number(decrypt(localStorage.getItem("CompanyIDLogin"))),
          'timestamp':  {   
                            'date': get_date,
                            'day': get_day,
                            'hours':get_hours,
                            'minutes': get_minutes,
                            'month': get_month,
                            'seconds': get_seconds,
                            'time': get_time,
                            'timezoneOffset': get_timezone,
                            'year':get_year
                        },
          'type': "text"    
        }
      }

      if(keyRoom != ""){
        sendRef.push(param)
        .then(res => {
            //update uid
            keyChat = res.getKey()
            var direktori_update_uid = "/" + keyRoom + "/message/" + keyChat
            let uidRef = firebase.database().ref(direktori_update_uid);
            uidRef.update({'uid': keyChat})
            
            //update last timestamp
            updateRef.update({ 'last_timestamp': get_time });
            
            //scroll chat page
            document.getElementById("input-chat").value = ""
            var objDiv = document.getElementById("message-room");
            objDiv.scrollTop = objDiv.scrollHeight;
  
            //hide preview
            hidePreview()
          })
        .catch(err => {
          Toast.fail('Gagal mengirim pesan', 2000, () => {
          });
          // console.log('error' + err);
          // console.log(err);
        })
      }
      else {
        Toast.fail('Tidak dapat mengirim pesan!', 2000, () => {
        });
        document.getElementById("input-chat").value = ""

      }

    }

    return (

      <div className={this.state.className_messenger}>
        <div className={this.state.className_sidebar}>
          <ConversationList clickConversationList = {clickRoom} company_id_buyer = {this.props.company_id_buyer} 
                           company_id_seller = {this.props.company_id_seller} />
        </div>
        <div className="header">
            {this.state.personChat}
        </div>

        <div id="message-room" className={this.state.className_content}>
          <MessageList  titleRoom = {this.state.personChat} messageRoom = {this.state.dataChat} 
                        keyRoom = {this.state.keyRoom} product = {this.state.productOnChat}/> 
        </div>

        <div className="preview-product" style={{display: this.state.display_preview}}>
          <img className="preview-product-photo" src={ this.state.barang_image } alt="" />
          <h1 className="preview-product-title">{ this.state.barang_nama }</h1>
          {/* <button className="hide-preview" onClick={()=> hidePreview_full()}>
            <span style={{textAlign: 'center', margin: 'auto'}}>x</span>
          </button> */}
          <span className="hide-preview" onClick={()=> hidePreview_full()}>
            x
          </span>

        </div>

        <Compose sendChat={sendChat}/>

      </div>
    )
  }
}
