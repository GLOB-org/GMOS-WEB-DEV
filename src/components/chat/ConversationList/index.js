import React, { Component, useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Axios from 'axios';
import firebase from "../../firebase/index";
import './ConversationList.css';
import { encrypt, decrypt, url } from '../../../lib';

export default class ConversationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
        dataChat: [],
        dataConversationList: [],
        dataConversationList_tetap: [],
        dataSeller: [],
        personActive: '',
        index_personActive: '',
        keyRoomActive: ''
    };
  }

  async componentDidMount(){
      var company_id_user = decrypt(localStorage.getItem('CompanyIDLogin'))
      await firebase.database().ref().orderByChild('company_id_buyer').equalTo(Number(company_id_user)).on("value", snapshot => {
        var dataChat = [];
        var dataListChat = [];
        var dataBubbleKey = [];
        var dataIdSeller = '';
        var count = 0
        snapshot.forEach(function (child) {
            const result = Object.keys(child.val().message).map((key) => child.val().message[key]);
            dataChat.push(result)

            // check unread message
            var count_message = 0
            for (var i = 0; i < result.length; i++){
              var get_sender = result[i].sender
              var status_read = result[i].read
              if(get_sender != company_id_user && status_read == false){
                count_message++
              }
            }

            dataListChat.push({
              "key_room":child.key,
              "first_index": count,
              "name": child.val().company_id_seller, 
              "text": result[result.length-1].contain,
              "unread_message": count_message, 
              "last_timestamp": child.val().last_timestamp
            });
            count++
            dataBubbleKey.push(child.val().message)
        });

        //order list conversation by timestamp
        dataListChat = dataListChat.sort(function (a, b) { return b.last_timestamp - a.last_timestamp })

        for (var i = 0; i < dataListChat.length; i++){
          dataIdSeller += dataListChat[i].name
          if(i < dataListChat.length-1){
            dataIdSeller += ','
          }
        }

        this.getCompanyName(dataIdSeller, dataListChat, dataChat)

      }
    )
  }

  getCompanyName = async(id, dataListChat, dataChat) => {
    let query = encrypt("select id, nama_perusahaan from gcm_master_company where id in (" + id + ")")
    await Axios.post(url.select, {
      query: query
      }).then(async(data) => {
          
          let newConversations = dataListChat.map(result => {
            var nama_seller = 'kosong'
            for (var i = 0; i < data.data.data.length; i++){
              if(result.name == data.data.data[i].id){
                nama_seller = data.data.data[i].nama_perusahaan
                break;
              }
            }

            return {
              key_room: `${result.key_room}`,
              first_index: `${result.first_index}`,
              photo: "/images/person-55.png",
              name: `${nama_seller}`,
              text: `${result.text}`,
              unread_message: `${result.unread_message}`
            };
          });

        this.setState({
          dataChat: dataChat,
          dataConversationList: newConversations,
          dataConversationList_tetap: newConversations
        })

        if(this.state.personActive != '' || this.state.index_personActive != ''){
          this.props.clickConversationList(this.state.personActive, this.state.index_personActive, this.state.dataChat, this.state.dataConversationList_tetap)
        }
        else if (this.state.personActive == '' && this.state.index_personActive == '') {
          this.props.clickConversationList(this.state.dataConversationList_tetap[0].name, 0, this.state.dataChat, this.state.dataConversationList_tetap)
        }

      }).catch(err => {
          // console.log('error' + err);
          // console.log(err);
      })
  }

  render(){
  
    const clickRoom = (personChat, index) => {
      this.setState({
        personActive: personChat,
        index_personActive: index
      })
      this.props.clickConversationList(personChat, index, this.state.dataChat, this.state.dataConversationList_tetap)
    }

    const searchRoom = (event) =>{
      let searching;

      searching = this.state.dataConversationList_tetap.filter(input => {
          return input.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
      });

      this.setState({
        dataConversationList: searching
      })

    } 
  
      return (
        <div className="conversation-list">
          <Toolbar
            title="Daftar Chat"
            leftItems={[
              <ToolbarButton key="cog" icon="ion-ios-cog" />
            ]}
            rightItems={[
              <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
            ]}
          />
          <ConversationSearch search={searchRoom}/>
          {
            this.state.dataConversationList.map((conversation, index) =>
              <ConversationListItem
                key={conversation.name}
                data={conversation}
                index={index}
                clicked={clickRoom}
              />
            )
          }
        </div>
      );
  }

}
