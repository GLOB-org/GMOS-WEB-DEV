import React from 'react';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import 'moment/locale/id';
import './Message.css';

const client_timezone = new Date().getTimezoneOffset()

export default function Message(props) {
    const {
      data,
      isMine,
      tagProduct,
      product,
      startsSequence,
      endsSequence,
      showTimestamp
    } = props;

    console.log(product)

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

    //adjust timezone
    var chat_time = moment(data.timestamp.time).format("HH:mm");
    
    var read = data.read
    if(read == true){
      var icon_read = "/images/double-tick-15-bold.png"
    }
    else {
      var icon_read = "/images/double-tick-15-grey.png"
    }

    return (
      <div className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`,
        // `${tagProduct ? 'tag-product' : ''}`,
      ].join(' ')}>
        {
          showTimestamp &&
            <div className="timestamp">
              { friendlyTimestamp }
            </div>
        }

        {isMine ?  
          (
            tagProduct ? (
              <div className="bubble-container">
                <p className="bubble-time" style={{marginRight:'5px'}}>
                  <img className="box-chat-read" src={icon_read} />
                </p>
                <p className="bubble-time" style={{marginRight:'5px'}}>{chat_time}</p>
                <div className="bubble" title={friendlyTimestamp}>
                    <div className="box_chat">
                      <div className="box-chat-header">
                        <img className="box-chat-photo" src={ product.foto } alt="" />
                        <div className="conversation-info">
                          <h1 className="conversation-title box-chat-title">{ product.nama }</h1>
                          <p className="box-chat-snippet">
                            <NumberFormat value={Math.ceil(Number(product.price) * Number(product.kurs))} displayType={'text'} 
                                          allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /> / {product.satuan}
                          </p>
                        </div>
                      </div>
                      <div className="box-chat-message">{ data.contain }</div>
                    </div>  
                </div>
              </div>
            ):(
              <div className="bubble-container">           
                <p className="bubble-time" style={{marginRight:'5px'}}>
                  <img className="box-chat-read" src={icon_read} />
                </p>
                <p className="bubble-time" style={{marginRight:'5px'}}>{chat_time}</p>
                <div className="bubble" title={friendlyTimestamp}>
                  { data.contain }
                </div>
              </div>
            )
            
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