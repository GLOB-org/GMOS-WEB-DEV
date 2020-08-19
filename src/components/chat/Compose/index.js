import React from 'react';
import './Compose.css';

export default function Compose(props) {

  const handleWhitespace = (event) => {
    if (event.which === 13) {
      props.sendChat(document.getElementById("input-chat").value)
    }
  }

  return (
    <div className="compose">
      <input
        id="input-chat"
        type="text"
        className="compose-input"
        onKeyPress={(event) => handleWhitespace(event)}
        spellcheck="false"
        autoComplete="off"
        placeholder="Tulis pesan di sini..."
      />

      <span id="btn-send" data-toggle="tooltip" title="kirim pesan" onClick={()=>props.sendChat(document.getElementById("input-chat").value)}>
          <img className="compose-send" src={ '/images/sent-30.png' } alt="conversation" />
      </span>
    </div>
  );
}