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
        dataProduct: [],
        dataSeller: [],
        id_personActive: '',
        personActive: '',
        index_personActive: '',
        keyRoomActive: ''
    };
  }

  async componentDidMount(){

      var get_company_id_buyer = this.props.company_id_buyer
      var get_company_id_seller = this.props.company_id_seller

      var company_id_user = decrypt(localStorage.getItem('CompanyIDLogin'))
      await firebase.database().ref().orderByChild('company_id_buyer').equalTo(Number(company_id_user)).on("value", snapshot => {
        var dataChat = [];
        var dataListChat = [];
        var dataBubbleKey = [];
        var dataIdProduct = [];
        var stringIdProduct = '';
        var dataIdSeller = '';
        var count = 0
        var room_exist = false

        snapshot.forEach(function (child) {

          //cek exist room
          if((child.val().company_id_buyer == get_company_id_buyer && 
          child.val().company_id_seller == get_company_id_seller) || 
          (get_company_id_buyer == "" && get_company_id_seller == "")){
            room_exist = true
          }

          const result = Object.keys(child.val().message).map((key) => child.val().message[key]);
          dataChat.push(result)

          //if sudah ada pesan di room
          if(child.val().message != ""){

            // check unread message
            var count_message = 0
            for (var i = 0; i < result.length; i++){
              var get_sender = result[i].sender
              var status_read = result[i].read
              var message_type = result[i].type
              if(get_sender != company_id_user && status_read == false){
                count_message++
              }

              if(message_type == 'barang'){
                dataIdProduct.push(result[i].barang_id)
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
          }

          else {
            dataListChat.push({
              "key_room":child.key,
              "first_index": count,
              "name": child.val().company_id_seller, 
              "text": "",
              "unread_message": 0, 
              "last_timestamp": new Date().getTime()
            });
            count++
          }

        });

        //if room doesn't exist
        if(room_exist == false ){
          if(get_company_id_buyer != "" && get_company_id_seller != "" ){
            this.createRoom(get_company_id_buyer, get_company_id_seller)
          }
        }

        else {

          //order list conversation by timestamp
          dataListChat = dataListChat.sort(function (a, b) { return b.last_timestamp - a.last_timestamp })

          for (var i = 0; i < dataListChat.length; i++){
            dataIdSeller += dataListChat[i].name
            if(i < dataListChat.length-1){
              dataIdSeller += ','
            }
          }

          for (var i = 0; i < dataIdProduct.length; i++){
            stringIdProduct += dataIdProduct[i]
            if(i < dataIdProduct.length-1){
              stringIdProduct += ','
            }
          }

          this.getCompanyName(dataIdSeller, dataListChat, dataChat, stringIdProduct)
        }

      }
    )
  }

  createRoom = async (company_id_buyer, company_id_seller) =>{

    let query = encrypt("select id_sales from gcm_company_listing_sales gcls where buyer_id = " + company_id_buyer +
    " and seller_id = " + company_id_seller + " and status = 'A'")

    await Axios.post(url.select, {
      query: query
      }).then(data => {

        var user_id_seller = data.data.data[0].id_sales
        var user_id_buyer = decrypt(localStorage.getItem('UserIDLogin'))
          
        let createRef = firebase.database().ref();
        createRef.push({  
                        'company_id_buyer': Number(company_id_buyer),
                        'company_id_seller': Number(company_id_seller),
                        'last_timestamp': new Date().getTime(),
                        'message': "",
                        'type': "user_to_sales",
                        'user_id_buyer': Number(user_id_buyer),
                        'user_id_seller': Number(user_id_seller)
        })
        .then(res => {
          

          })
        .catch(err => {
        
          // console.log('error' + err);
          // console.log(err);
        })
        
      }).catch(err => {
          // console.log('error' + err);
          // console.log(err);
    })
   
  }

  getCompanyName = async(id, dataListChat, dataChat, stringIdProduct) => {
    let query = encrypt("select id, nama_perusahaan from gcm_master_company where id in (" + id + ")")
    await Axios.post(url.select, {
      query: query
      }).then(async(data) => {

          if(stringIdProduct != ""){
            await this.getProduct(stringIdProduct)
          }
          
          let newConversations = dataListChat.map(result => {
            var nama_seller = 'kosong'
            var id_seller
            for (var i = 0; i < data.data.data.length; i++){
              if(result.name == data.data.data[i].id){
                nama_seller = data.data.data[i].nama_perusahaan
                id_seller = data.data.data[i].id
                break;
              }
            }

            return {
              key_room: `${result.key_room}`,
              first_index: `${result.first_index}`,
              photo: "/images/person-55.png",
              id_seller: `${id_seller}`, 
              name: `${nama_seller}`,
              text: `${result.text}`,
              unread_message: `${result.unread_message}`,
              last_timestamp: `${result.last_timestamp}`
            };
          });

        this.setState({
          dataChat: dataChat,
          dataConversationList: newConversations,
          dataConversationList_tetap: newConversations
        })

        if(this.props.company_id_buyer != '' && this.props.company_id_seller != ''){

          var get_name_seller = ""
          for(var i = 0; i < this.state.dataConversationList_tetap.length; i++){
            if(this.props.company_id_seller == this.state.dataConversationList_tetap[i].id_seller){
              get_name_seller = this.state.dataConversationList_tetap[i].name
            } 
          }

          // this.props.clickConversationList(this.props.company_id_seller, get_name_seller, this.state.dataChat,  this.state.dataConversationList_tetap, this.state.dataProduct)

          if(this.state.personActive != '' || this.state.index_personActive != ''){
            this.props.clickConversationList( this.state.id_personActive, this.state.personActive, this.state.dataChat, this.state.dataConversationList_tetap, this.state.dataProduct)
          }
          else if (this.state.personActive == '' && this.state.index_personActive == '') {
            this.props.clickConversationList(this.props.company_id_seller, get_name_seller, this.state.dataChat,  this.state.dataConversationList_tetap, this.state.dataProduct)
          }

        }

        else {

          if(this.state.personActive != '' || this.state.index_personActive != ''){
            this.props.clickConversationList( this.state.id_personActive, this.state.personActive, this.state.dataChat, this.state.dataConversationList_tetap, this.state.dataProduct)
          }
          else if (this.state.personActive == '' && this.state.index_personActive == '') {
            this.props.clickConversationList(this.state.dataConversationList_tetap[0].id_seller, this.state.dataConversationList_tetap[0].name, this.state.dataChat,  this.state.dataConversationList_tetap, this.state.dataProduct)
          }

        }

      }).catch(err => {
          // console.log('error' + err);
          // console.log(err);
      })
  }

  getProduct = async(id) =>{
    let query = encrypt(
      "select a.id, a.kode_barang, a.company_id, b.nama, "+
      "case when a.flag_foto = 'Y' then "+
      "(select concat('https://www.glob.co.id/admin/assets/images/product/', a.company_id,'/',a.kode_barang,'.png')) "+
      "else 'https://glob.co.id/admin/assets/images/no_image.png' end as foto,"+
      "a.price, c.nominal as kurs, d.alias as satuan " +
      "from gcm_list_barang a " +
      "inner join gcm_master_barang b on a.barang_id = b.id " +
      "inner join gcm_listing_kurs c on a.company_id = c.company_id " +
      "inner join gcm_master_satuan d on b.satuan = d.id " +
      "where a.id in (" + id + ") and now() between c.tgl_start and c.tgl_end")

    await Axios.post(url.select, {
      query: query
      }).then(data => {
          
        this.setState({
          dataProduct: data.data.data
        })
      
      }).catch(err => {
          // console.log('error' + err);
          // console.log(err);
    })
  }

  render(){

    const clickRoom = (id_personChat, personChat, index) => {

      this.setState({
        id_personActive: id_personChat,
        personActive: personChat,
        index_personActive: index
      })

      this.props.clickConversationList(id_personChat, personChat, this.state.dataChat, this.state.dataConversationList_tetap, this.state.dataProduct)
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
