import React from 'react';
import './ConversationSearch.css';

export default function ConversationSearch(props) {
    return (
      <div className="conversation-search">
        <input
          type="search"
          onChange={(event) => props.search(event)}
          spellcheck="false"
          autoComplete="off"
          className="conversation-search-input"
          placeholder="Cari nama"
        />
      </div>
    );
}