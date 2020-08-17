import React from 'react';
import './Compose.css';

export default function Compose(props) {
    return (
      <div className="compose">
        <input
          type="text"
          className="compose-input"
          spellcheck="false"
          autoComplete="off"
          placeholder="Tulis pesan di sini..."
        />

        {/* {
          props.rightItems
        } */}
        {/* <button style={{marginLeft: '10px'}}>kirim</button> */}
        <span data-toggle="tooltip" title="kirim pesan">
            <img className="compose-send" src={ '/images/sent-30.png' } alt="conversation" />
        </span>
      </div>
    );
}