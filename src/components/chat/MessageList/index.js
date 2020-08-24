import React, {useEffect, useState} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import firebase from "../../firebase/index";
import './MessageList.css';
import { decrypt } from '../../../lib';

export default function MessageList(props) {
  
  const renderMessages = () => {
    
    var tempChat = []
    tempChat = props.messageRoom
   
    let i = 0;
    let messageCount = tempChat.length;
    let tempMessages = [];

    while (i < messageCount) {
  
      let previous = tempChat[i - 1];
      let current = tempChat[i];
      let next = tempChat[i + 1];
      let isMine = current.sender === Number(decrypt(localStorage.getItem("CompanyIDLogin")));
      let messageType = current.type
      let tagProduct = false
      let idProduct, dataProduct
      let currentMoment = moment(current.timestamp.time);

      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = false;
      let endsSequence = false;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp.time);
        
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        
        prevBySameAuthor = previous.sender === current.sender;

        if (prevBySameAuthor && previousDuration.as('days') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('days') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp.time);
        
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        
        nextBySameAuthor = next.sender === current.sender;

        if (nextBySameAuthor && nextDuration.as('days') < 1) {
          endsSequence = false;
        }
      }

      if (messageType == 'barang'){
        tagProduct = true
        idProduct = current.barang_id
        for (var x = 0; x < props.product.length; x++){
          if(idProduct == props.product[x].id){
            dataProduct = props.product[x]
          }
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          tagProduct={tagProduct}
          product={dataProduct}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  }

    return(
      <div className="message-list">
        <div className="message-list-container ">
            {renderMessages()}
        </div>
      </div>
    );
}