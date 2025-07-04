import React from 'react';

// PUBLIC_INTERFACE
function MoodFilter({ selectedMood, onMoodChange, moodOptions }) {
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

  return (
    <div className="mood-filter">
      <h3>Filter by Mood</h3>
      <div className="mood-options">
        <button
          className={`mood-btn ${selectedMood === 'all' ? 'active' : ''}`}
          onClick={() => onMoodChange('all')}
        >
          All Moods
        </button>
        {moodOptions.map(mood => (
          <button
            key={mood}
            className={`mood-btn ${selectedMood === mood ? 'active' : ''}`}
            onClick={() => onMoodChange(mood)}
            title={mood}
          >
            {getMoodEmoji(mood)} {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodFilter;
