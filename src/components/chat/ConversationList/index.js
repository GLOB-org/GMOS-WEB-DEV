import React, {useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import axios from 'axios';
import firebase from "../../firebase/index";
import './ConversationList.css';
import { decrypt } from '../../../lib';

export default function ConversationList(props) {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    getConversations()
  },[])

 const getConversations = () => {
    axios.get('https://randomuser.me/api/?results=5').then(response => {
        let newConversations = response.data.results.map(result => {
          return {
            photo: "/images/person-55.png",
            name: `${result.name.first} ${result.name.last}`,
            text: 'Hello world! This is a long message that needs to be truncated.'
          };
        });
        setConversations([...conversations, ...newConversations])
    });

    // const rootRef = firebase.database().ref();
    // const pasienRef = rootRef.child('-MER5gSQp8acRor0pzE9');
    //  rootRef.once('value', snap => {
    //  snap.forEach( row => {
    //       //  this.setState({
    //       //    patient: this.state.patient.concat([row.val().content]),
    //       //    address: this.state.address.concat([row.val().address]),
    //       //    operation: this.state.operation.concat([row.val().operationType]),
    //       //    phone: this.state.phone.concat([row.val().phone])
    //       //  });
    //       console.log([row.val().user1.company_id] + " - " + [row.val().type])
    //  });
    // })

    var dataRoomChat = [];
    var dataBubleChat = [];
    var dataBubleChatSpecific = [];

    var company_id_user = decrypt(localStorage.getItem('CompanyIDLogin'))
    
    var ref = firebase.database().ref();
    firebase.database().ref().orderByChild('company_id_buyer').equalTo(Number(company_id_user)).on("value", snapshot => {
      snapshot.forEach(function (child) {
          console.log(child.key)
          const result = Object.keys(child.val().message).map((key) => child.val().message[key]);

          console.log(result)
          result.map((data)=>{
              console.log(data.contain)
          })            

      });
  })
    // ref.on("value", snapshot => {
    //   snapshot.forEach(function(child) {
    //     // console.log(child.key)
    //     dataRoomChat.push(child.val())
    //     dataRoomChat = dataRoomChat.filter(input => {
    //       return (input.user1.company_id == 5);
    //     });  
    //   });

    //   let newConversations = dataRoomChat.map( (value, index) => {
    //     return {
    //         photo: "/images/person-55.png",
    //         name: dataRoomChat[index].user1.company_id,
    //         text: 'Ini pesan terakhir'
    //       };
    //     });
    //     setConversations([...conversations, ...newConversations])

    //   // for (var i = 0; i < dataRoomChat.length; i++){
    //   //   dataBubleChat.push(dataRoomChat[i].message) 
    //   // }



    //   // console.log(dataBubleChat[0])

    //   // dataBubleChatSpecific.push(dataBubleChat[0])
    //   // console.log(dataBubleChatSpecific)

    //   // console.log(dataRoomChat)
    //   // console.log(dataRoomChat[].message)
    //   // console.log(dataRoomChat[0].user1.company_id)
    //   // console.log(dataRoomChat[1].user1.company_id)
    //   // dataBubleChat.push(dataRoomChat[0].message)
    //   // console.log(dataBubleChat)
    // });



    // ref.on("value", function(snapshot) {
    //     var childData = snapshot.val();
    //     console.log(childData)
    //     var room_length = Object.keys(childData).length //panjang data room chat
    //     // console.log(room_length)
        
    //     // for (var i = 0; i < room_length; i++) {
    //     //   var key = Object.keys(childData)[i];
    //     //   // var object = Object.keys(childData)
    //     //   // console.log(key)
    //     //   // console.log(object)

    //     // }
             
    //     // console.log(childData[key].id);  
    // });

  }

  const clickRoom = (personChat) => {
    props.clickConversationList(personChat)
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
        <ConversationSearch />
        {
          conversations.map(conversation =>
            <ConversationListItem
              key={conversation.name}
              data={conversation}
              clicked={clickRoom}
            />
          )
        }
      </div>
    );
}