import React, {useEffect} from 'react';
import shave from 'shave';

import './ConversationListItem.css';

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

  const { id_seller, photo, name, text, unread_message } = props.data;
  return (
    <div className="conversation-list-item" onClick={()=>props.clicked(id_seller, name, props.index)}>
      <img className="conversation-photo" src={ photo } alt="conversation" />
      <div className="conversation-info">
        <h1 className="conversation-title">{ name }</h1>
        <p className="conversation-snippet">{ text }</p>
      </div>
      {
        unread_message > 0 ? (<span className="indicator-newchat">{ unread_message }</span>) : null
      }
    </div>
  );
}