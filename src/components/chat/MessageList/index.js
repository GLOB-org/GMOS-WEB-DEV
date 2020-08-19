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
  // const [messages, setMessages] = useState([])

  // useEffect(() => {
  //   getMessages();
  // },[])

  // const getMessages = () => {
  //     var tempMessages = [
  //       {
  //         id: 1,
  //         author: 'apple',
  //         message: 'Hello',
  //         timestamp: new Date().getTime()
  //       },
  //       {
  //         id: 2,
  //         author: 'orange',
  //         message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //         timestamp: new Date().getTime()
  //       },
  //       {
  //         id: 3,
  //         author: 'orange',
  //         message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
  //         timestamp: new Date().getTime()
  //       },
  //       {
  //         id: 4,
  //         author: 'apple',
  //         message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //         timestamp: new Date().getTime()
  //       },
  //       {
  //         id: 5,
  //         author: 'apple',
  //         message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
  //         timestamp: new Date().getTime()
  //       },
  //       {
  //         id: 6,
  //         author: 'apple',
  //         message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //         timestamp: new Date().getTime()
  //       },
  //       {
  //         id: 7,
  //         author: 'orange',
  //         message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
  //         timestamp: new Date().getTime()
  //       },
  //       {
  //         id: 8,
  //         author: 'orange',
  //         message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //         timestamp: new Date().getTime()
  //       },
  //       {
  //         id: 9,
  //         author: 'apple',
  //         message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
  //         timestamp: 1597630330328
  //       },
  //       {
  //         id: 10,
  //         author: 'orange',
  //         message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //         timestamp: 1597630330809
  //       },
  //     ]
  //     setMessages([...messages, ...tempMessages])
  // }

  const renderMessages = () => {
    
    var tempChat = []
    tempChat = props.messageRoom
    // for (var x = 0; x < tempChat.length; x++){
    //   console.log(tempChat[x].timestamp)
    // }
    
    let i = 0;
    // let messageCount = messages.length;
    // let tempMessages = [];
    let messageCount = tempChat.length;
    let tempMessages = [];

    while (i < messageCount) {
  
      let previous = tempChat[i - 1];
      let current = tempChat[i];
      let next = tempChat[i + 1];
      let isMine = current.sender === Number(decrypt(localStorage.getItem("CompanyIDLogin")));
      let currentMoment = moment(current.timestamp.time);

      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = false;
      let endsSequence = false;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp.time);
        
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        
        // prevBySameAuthor = previous.author === current.author;
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

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
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

  const sendChat = (message) =>{
    var keyRoom = props.keyRoom
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

    sendRef.push({  
                    'uid': "",
                    'contain': message,
                    'read': false,
                    'receiver': -1,
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
    })
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
        objDiv.scrollTop = objDiv.scrollHeight - objDiv.clientHeight;
      })
    .catch(error => console.log(error));
  }

    return(
      <div className="message-list">
        <Toolbar
          title={props.titleRoom}
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        />
        <div className="message-list-container">{renderMessages()}</div>
        <Compose sendChat={sendChat}/>
      </div>
    );
}