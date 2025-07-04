import React from 'react';

// PUBLIC_INTERFACE
function JournalList({ entries, onEdit, onDelete }) {
  // PUBLIC_INTERFACE
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // PUBLIC_INTERFACE
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      excited: '🤩',
      calm: '😌',
      anxious: '😰',
      grateful: '🙏',
      frustrated: '😤',
      content: '😊'
    };
    return moodEmojis[mood] || '😐';
  };

  if (entries.length === 0) {
    return (
      <div className="journal-list">
        <div className="empty-state">
          <h3>No entries found</h3>
          <p>Start writing your first journal entry!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-list">
      <div className="entries-count">
        {entries.length} {entries.length === 1 ? 'entry' : 'entries'} found
      </div>
      
      <div className="entries">
        {entries.map(entry => (
          <div key={entry.id} className="entry-card">
            <div className="entry-header">
              <div className="entry-meta">
                <h3 className="entry-title">{entry.title}</h3>
                <div className="entry-date">{formatDate(entry.date)}</div>
              </div>
              <div className="entry-actions">
                {entry.mood && (
                  <span className="mood-indicator" title={entry.mood}>
                    {getMoodEmoji(entry.mood)}
                  </span>
                )}
                <button 
                  className="btn btn-small"
                  onClick={() => onEdit(entry)}
                  title="Edit entry"
                >
                  ✏️
                </button>
                <button 
                  className="btn btn-small btn-danger"
                  onClick={() => onDelete(entry.id)}
                  title="Delete entry"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="entry-preview">
              {entry.notes.length > 200 
                ? `${entry.notes.substring(0, 200)}...` 
                : entry.notes
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JournalList;
