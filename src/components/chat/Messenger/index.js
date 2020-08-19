import React, { Component } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Messenger.css';
import firebase from "../../firebase/index";
import { decrypt } from '../../../lib';

export default class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
        personChat: '',
        dataChat: '',
        keyRoom: ''
    };
  }

  componentDidMount(){
    this.setState({
      personChat: ''
    })
  }

  render(){

    const clickRoom = async (person, index, dataChat, dataConversation) => {
      
      var get_index
      var get_key_room
      var chat_key = []
      var company_id_user = Number(decrypt(localStorage.getItem('CompanyIDLogin')))

      for (var i = 0; i < dataConversation.length; i++){
        if(person == dataConversation[i].name){
          get_index = dataConversation[i].first_index
          get_key_room = dataConversation[i].key_room
          break;
        }
      }

      await this.setState({
        personChat: person,
        dataChat: dataChat[get_index],
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
    }

    const updateReadChat = (chat_key) => {
      for (var i = 0; i < chat_key.length; i++) {
        var direktori_update = "/" + this.state.keyRoom + "/message/" + chat_key[i]
        let updateRef = firebase.database().ref(direktori_update);  
        updateRef.update({ 'read': true });
      }
    }

    return (
      <div className="messenger">
        <div className="scrollable sidebar">
          <ConversationList clickConversationList = {clickRoom} />
        </div>
        <div id="message-room" className="scrollable content">
          <MessageList titleRoom = {this.state.personChat} messageRoom = {this.state.dataChat} keyRoom = {this.state.keyRoom}/> 
        </div>
      </div>
    )
  }
}

// export default function Messenger(props) {

//   const clickRoom = (name) => {
//     alert(name +" - siskaeee")
//   }

//     return (
//       <div className="messenger">
//         <div className="scrollable sidebar">
//           <ConversationList clickenak={clickRoom}/>
//         </div>
//         <div className="scrollable content">
//           <MessageList headerRoom={}/> 
//         </div>
//       </div>
//     );
// }