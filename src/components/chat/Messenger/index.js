import React, { Component } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Messenger.css';

export default class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
        personChat: ''
    };
  }

  componentDidMount(){
    this.setState({
      personChat: ''
    })
  }

  render(){

    const clickRoom = (person) => {
      this.setState({
        personChat: person
      })
    }

    return (
      <div className="messenger">
        <div className="scrollable sidebar">
          <ConversationList clickConversationList={clickRoom}/>
        </div>
        <div className="scrollable content">
          <MessageList titleRoom={this.state.personChat}/> 
        </div>
      </div>
    )
  }
}

// export default function Messenger(props) {

//   const clickRoom = (name) => {
//     alert(name +" - siskaeee")
//   }

//     return (
//       <div className="messenger">
//         <div className="scrollable sidebar">
//           <ConversationList clickenak={clickRoom}/>
//         </div>
//         <div className="scrollable content">
//           <MessageList headerRoom={}/> 
//         </div>
//       </div>
//     );
// }