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
        dataSeller: [],
        personActive: '',
        index_personActive: ''
    };
  }

  async componentDidMount(){
      
      var company_id_user = decrypt(localStorage.getItem('CompanyIDLogin'))
      await firebase.database().ref().orderByChild('company_id_buyer').equalTo(Number(company_id_user)).on("value", snapshot => {
        var dataChat = [];
        var dataListChat = [];
        var dataIdSeller = '';
        snapshot.forEach(function (child) {
            // dataRoomChat.push(child.key)
            const result = Object.keys(child.val().message).map((key) => child.val().message[key]);
            dataChat.push(result)
            dataListChat.push({"name": child.val().company_id_seller , "text": result[result.length-1].contain});
        });

        for (var i = 0; i < dataListChat.length; i++){
          dataIdSeller += dataListChat[i].name
          if(i < dataListChat.length-1){
            dataIdSeller += ','
          }
        }

        this.getCompanyName(dataIdSeller, dataListChat, dataChat)

        // let newConversations = dataListChat.map(result => {
        //   var nama_seller = ''
        //   for (var i = 0; i < this.state.dataSeller; i++){
        //     if(result.name == this.state.dataSeller[i].id){
        //       nama_seller = this.state.dataSeller[i].nama_perusahaan
        //     }
        //   }

        //   return {
        //     photo: "/images/person-55.png",
        //     name: `${nama_seller}`,
        //     text: `${result.text}`
        //   };
        // });

        // this.setState({
        //   dataChat: dataChat,
        //   dataConversationList: newConversations
        // })

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
              console.log(result.name + " - " + data.data.data[i].id)
              if(result.name == data.data.data[i].id){
                nama_seller = data.data.data[i].nama_perusahaan
                break;
              }
            }

            return {
              photo: "/images/person-55.png",
              name: `${nama_seller}`,
              text: `${result.text}`
            };
          });

        this.setState({
          dataChat: dataChat,
          dataConversationList: newConversations
        })

        if(this.state.personActive != '' || this.state.index_personActive != ''){
          this.props.clickConversationList(this.state.personActive, this.state.index_personActive, this.state.dataChat)
        }

      }).catch(err => {
          // console.log('error' + err);
          // console.log(err);
      })
  }

  render(){
    // const [conversations, setConversations] = useState([]);
    // useEffect(() => {
    //   getConversations()
    // },[])
  
  //  const getConversations = () => {
  //     // axios.get('https://randomuser.me/api/?results=5').then(response => {
  //     //     let newConversations = response.data.results.map(result => {
  //     //       return {
  //     //         photo: "/images/person-55.png",
  //     //         name: `${result.name.first} ${result.name.last}`,
  //     //         text: 'Hello world! This is a long message that needs to be truncated.'
  //     //       };
  //     //     });
  //     //     setConversations([...conversations, ...newConversations])
  //     // });
  
  //     // const rootRef = firebase.database().ref();
  //     // const pasienRef = rootRef.child('-MER5gSQp8acRor0pzE9');
  //     //  rootRef.once('value', snap => {
  //     //  snap.forEach( row => {
  //     //       //  this.setState({
  //     //       //    patient: this.state.patient.concat([row.val().content]),
  //     //       //    address: this.state.address.concat([row.val().address]),
  //     //       //    operation: this.state.operation.concat([row.val().operationType]),
  //     //       //    phone: this.state.phone.concat([row.val().phone])
  //     //       //  });
  //     //       console.log([row.val().user1.company_id] + " - " + [row.val().type])
  //     //  });
  //     // })
  
  //     // var dataChat = [];
  //     // var dataListChat = [];
  //     // var company_id_user = decrypt(localStorage.getItem('CompanyIDLogin'))
  //     // var ref = firebase.database().ref();
  //     // firebase.database().ref().orderByChild('company_id_buyer').equalTo(Number(company_id_user)).on("value", snapshot => {
  //     //   snapshot.forEach(function (child) {
  //     //       // dataRoomChat.push(child.key)
  //     //       const result = Object.keys(child.val().message).map((key) => child.val().message[key]);
  //     //       dataChat.push(result)
            
  //     //       // dataRoomChat.push([child.val().company_id_seller], result[result.length-1].contain)
  //     //       // console.log("id seller : " + child.val().company_id_seller + ", pesan terakhir : " + result[result.length-1].contain )
  
  
  
  //     //       // console.log(result)
  //     //       // result.map((data)=>{
  //     //       //     console.log(data.contain)
  //     //       // })
  
  //     //       dataListChat.push({"name": child.val().company_id_seller , "text": result[result.length-1].contain});
  //     //   });
  
  //     //   // console.log(dataChat)
  
  //     //   console.log(dataChat[1])
  //     //   dataChat[1].map((data)=>{
  //     //     console.log(data.contain)
  //     //     console.log(data.read)
  //     //   })
  
  //     //   let newConversations = dataListChat.map(result => {
  //     //     return {
  //     //       photo: "/images/person-55.png",
  //     //       name: `${result.name}`,
  //     //       text: `${result.text}`
  //     //     };
  //     //   });
  //     //   setConversations([...conversations, ...newConversations])
  
  
  //   })
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
  
    // }
  
    const clickRoom = (personChat, index) => {
      this.setState({
        personActive: personChat,
        index_personActive: index
      })
      this.props.clickConversationList(personChat, index, this.state.dataChat)
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


// export default function ConversationList(props) {
//   const [conversations, setConversations] = useState([]);
//   useEffect(() => {
//     getConversations()
//   },[])

//  const getConversations = () => {
//     // axios.get('https://randomuser.me/api/?results=5').then(response => {
//     //     let newConversations = response.data.results.map(result => {
//     //       return {
//     //         photo: "/images/person-55.png",
//     //         name: `${result.name.first} ${result.name.last}`,
//     //         text: 'Hello world! This is a long message that needs to be truncated.'
//     //       };
//     //     });
//     //     setConversations([...conversations, ...newConversations])
//     // });

//     // const rootRef = firebase.database().ref();
//     // const pasienRef = rootRef.child('-MER5gSQp8acRor0pzE9');
//     //  rootRef.once('value', snap => {
//     //  snap.forEach( row => {
//     //       //  this.setState({
//     //       //    patient: this.state.patient.concat([row.val().content]),
//     //       //    address: this.state.address.concat([row.val().address]),
//     //       //    operation: this.state.operation.concat([row.val().operationType]),
//     //       //    phone: this.state.phone.concat([row.val().phone])
//     //       //  });
//     //       console.log([row.val().user1.company_id] + " - " + [row.val().type])
//     //  });
//     // })

//     var dataChat = [];
//     var dataListChat = [];
//     var company_id_user = decrypt(localStorage.getItem('CompanyIDLogin'))
//     var ref = firebase.database().ref();
//     firebase.database().ref().orderByChild('company_id_buyer').equalTo(Number(company_id_user)).on("value", snapshot => {
//       snapshot.forEach(function (child) {
//           // dataRoomChat.push(child.key)
//           const result = Object.keys(child.val().message).map((key) => child.val().message[key]);
//           dataChat.push(result)
          
//           // dataRoomChat.push([child.val().company_id_seller], result[result.length-1].contain)
//           // console.log("id seller : " + child.val().company_id_seller + ", pesan terakhir : " + result[result.length-1].contain )



//           // console.log(result)
//           // result.map((data)=>{
//           //     console.log(data.contain)
//           // })

//           dataListChat.push({"name": child.val().company_id_seller , "text": result[result.length-1].contain});
//       });

//       // console.log(dataChat)

//       console.log(dataChat[1])
//       dataChat[1].map((data)=>{
//         console.log(data.contain)
//         console.log(data.read)
//       })

//       let newConversations = dataListChat.map(result => {
//         return {
//           photo: "/images/person-55.png",
//           name: `${result.name}`,
//           text: `${result.text}`
//         };
//       });
//       setConversations([...conversations, ...newConversations])


//   })
//     // ref.on("value", snapshot => {
//     //   snapshot.forEach(function(child) {
//     //     // console.log(child.key)
//     //     dataRoomChat.push(child.val())
//     //     dataRoomChat = dataRoomChat.filter(input => {
//     //       return (input.user1.company_id == 5);
//     //     });  
//     //   });

//     //   let newConversations = dataRoomChat.map( (value, index) => {
//     //     return {
//     //         photo: "/images/person-55.png",
//     //         name: dataRoomChat[index].user1.company_id,
//     //         text: 'Ini pesan terakhir'
//     //       };
//     //     });
//     //     setConversations([...conversations, ...newConversations])

//     //   // for (var i = 0; i < dataRoomChat.length; i++){
//     //   //   dataBubleChat.push(dataRoomChat[i].message) 
//     //   // }



//     //   // console.log(dataBubleChat[0])

//     //   // dataBubleChatSpecific.push(dataBubleChat[0])
//     //   // console.log(dataBubleChatSpecific)

//     //   // console.log(dataRoomChat)
//     //   // console.log(dataRoomChat[].message)
//     //   // console.log(dataRoomChat[0].user1.company_id)
//     //   // console.log(dataRoomChat[1].user1.company_id)
//     //   // dataBubleChat.push(dataRoomChat[0].message)
//     //   // console.log(dataBubleChat)
//     // });



//     // ref.on("value", function(snapshot) {
//     //     var childData = snapshot.val();
//     //     console.log(childData)
//     //     var room_length = Object.keys(childData).length //panjang data room chat
//     //     // console.log(room_length)
        
//     //     // for (var i = 0; i < room_length; i++) {
//     //     //   var key = Object.keys(childData)[i];
//     //     //   // var object = Object.keys(childData)
//     //     //   // console.log(key)
//     //     //   // console.log(object)

//     //     // }
             
//     //     // console.log(childData[key].id);  
//     // });

//   }

//   const clickRoom = (personChat, index) => {
//     props.clickConversationList(personChat)
//   }

//     return (
//       <div className="conversation-list">
//         <Toolbar
//           title="Daftar Chat"
//           leftItems={[
//             <ToolbarButton key="cog" icon="ion-ios-cog" />
//           ]}
//           rightItems={[
//             <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
//           ]}
//         />
//         <ConversationSearch />
//         {
//           conversations.map((conversation, index) =>
//             <ConversationListItem
//               key={conversation.name}
//               data={conversation}
//               index={index}
//               clicked={clickRoom}
//             />
//           )
//         }
//       </div>
//     );
// }