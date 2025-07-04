import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
function JournalEntry({ entry, onSave, onCancel, moodOptions }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setNotes(entry.notes || '');
      setMood(entry.mood || '');
      setDate(entry.date || '');
    } else {
      // New entry - set today's date
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setNotes('');
      setMood('');
      setDate(today);
    }
  }, [entry]);

  // PUBLIC_INTERFACE
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !notes.trim()) {
      alert('Please fill in both title and notes.');
      return;
    }

    const entryData = {
      title: title.trim(),
      notes: notes.trim(),
      mood: mood || null,
      date: date || new Date().toISOString().split('T')[0],
    };

    onSave(entryData);
  };

  // PUBLIC_INTERFACE
  const handleCancel = () => {
    if (title.trim() || notes.trim()) {
      if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <div className="journal-entry">
      <div className="entry-header">
        <h2>{entry ? 'Edit Entry' : 'New Entry'}</h2>
        <div className="entry-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            form="entry-form"
          >
            {entry ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      <form id="entry-form" onSubmit={handleSubmit} className="entry-form">
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind today?"
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="mood">Mood (optional):</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="">Select a mood</option>
            {moodOptions.map(moodOption => (
              <option key={moodOption} value={moodOption}>
                {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your thoughts here..."
            rows="15"
            required
          />
        </div>
      </form>
    </div>
  );
}

export default JournalEntry;
