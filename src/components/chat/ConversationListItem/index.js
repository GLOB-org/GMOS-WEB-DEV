import React, {useEffect} from 'react';
import shave from 'shave';
import moment from 'moment';
import 'moment/locale/id';

import './ConversationListItem.css';

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

  const { id_seller, photo, name, text, unread_message, last_timestamp } = props.data;
  var friendlyTimestamp;

  moment.locale('id')

  //cek hari ini
  var date_now = moment(new Date().getTime()).format('L')
  var date_chat = moment(Number(last_timestamp)).format('L')

  //cek tanggal
  var date_now_D = moment(new Date().getTime()).format('D')
  var date_chat_D = moment(Number(last_timestamp)).format('D')

  //cek bulan & tahun 
  var date_now_MY = moment(new Date().getTime()).format('MM/YYYY')
  var date_chat_MY = moment(Number(last_timestamp)).format('MM/YYYY')

  if(date_now_MY == date_chat_MY){
    if(date_now_D == date_chat_D) {
      friendlyTimestamp = moment(Number(last_timestamp)).format("HH:mm");
    }
    else {
      var selisih = Number(date_now_D) - Number(date_chat_D)
      if (selisih == 1) {
        friendlyTimestamp = "Kemarin";  
      }
      else {
        friendlyTimestamp = moment(Number(last_timestamp)).format('D/M/YY');  
      }
    }
  }

  else {
    friendlyTimestamp = moment(Number(last_timestamp)).format('D/M/YY');
  }

  return (
    <div className="conversation-list-item" onClick={()=>props.clicked(id_seller, name, props.index)}>
      <img className="conversation-photo" src={ photo } alt="conversation" />
      
      <div className="conversation-info-left">
        <h1 className="conversation-title">{ name }</h1>
        <p className="conversation-snippet">{ text }</p>
      </div>

      <div className="conversation-info-right">
        <h1 className="conversation-title text-right">
          {
            unread_message > 0 ? (<span className="indicator-newchat">{ unread_message }</span>) : null
          } 
        </h1>
        <p className="conversation-snippet text-right">{ friendlyTimestamp }</p>
      </div>
      
    </div>
  );
}