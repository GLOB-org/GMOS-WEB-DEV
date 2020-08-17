import React from 'react';
import './ConversationSearch.css';

export default function ConversationSearch() {
    return (
      <div className="conversation-search">
        <input
          type="search"
          spellcheck="false"
          autoComplete="off"
          className="conversation-search-input"
          placeholder="Cari nama"
        />
      </div>
    );
}