import React from 'react';
import moment from 'moment';
import 'moment/locale/id';
import './Message.css';

export default function Message(props) {
    const {
      data,
      isMine,
      startsSequence,
      endsSequence,
      showTimestamp
    } = props;

    moment.locale('id')

    //cek hari ini
    var date_now = moment(new Date().getTime()).format('L')
    var date_chat = moment(data.timestamp.time).format('L')

    var friendlyTimestamp;

    if(date_now == date_chat){
      friendlyTimestamp = "Hari ini"
    }
    else {
      friendlyTimestamp = moment(data.timestamp.time).format('LL');
    }

    var get_hours = data.timestamp.hours
    var get_minutes = data.timestamp.minutes
    var get_time = get_hours.toString() + ":" + get_minutes.toString()
    var chat_time = moment(get_time,'HHmm').format("HH:mm")

    return (
      <div className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
        {
          showTimestamp &&
            <div className="timestamp">
              { friendlyTimestamp }
            </div>
        }

        {isMine ?  
          (
            <div className="bubble-container">
              <p className="bubble-time" style={{marginRight:'5px'}}>{chat_time}</p>
              <div className="bubble" title={friendlyTimestamp}>
                { data.contain }
              </div>
            </div>
          ):
          (
            <div className="bubble-container">
              <div className="bubble" title={friendlyTimestamp}>
                { data.contain }
              </div>
              <p className="bubble-time" style={{marginLeft:'5px'}}>{chat_time}</p>
            </div>
          )
        }

      </div>
    );
}