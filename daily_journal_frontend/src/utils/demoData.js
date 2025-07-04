// Demo data for testing the journal application when backend is not available

export const demoEntries = [
  {
    id: 1,
    title: "First Day of Spring",
    notes: "Today felt like a fresh start. The weather was perfect, and I spent most of the afternoon in the garden. There's something incredibly peaceful about planting new seeds and watching them grow. I'm feeling optimistic about the changes coming in my life.",
    mood: "content",
    date: "2024-03-20"
  },
  {
    id: 2,
    title: "Challenging Day at Work",
    notes: "Had a difficult meeting with the team today. The project deadlines are tight, and everyone seems stressed. I'm trying to stay positive, but it's hard when everything feels overwhelming. Need to remember to take breaks and not let work consume me.",
    mood: "anxious",
    date: "2024-03-19"
  },
  {
    id: 3,
    title: "Weekend Adventures",
    notes: "Went hiking with friends today! The trail was longer than expected, but the views were absolutely breathtaking. We packed a picnic and spent hours just talking and laughing. These are the moments that make life worth living.",
    mood: "happy",
    date: "2024-03-18"
  },
  {
    id: 4,
    title: "Quiet Evening Reflection",
    notes: "Spent tonight reading by the fireplace. Sometimes the best evenings are the quiet ones. I've been thinking about what I want to achieve this year and how to balance ambition with contentment. Grateful for these peaceful moments.",
    mood: "grateful",
    date: "2024-03-17"
  },
  {
    id: 5,
    title: "Exciting News!",
    notes: "Got the call today - I got the promotion! All those late nights and weekend work sessions have finally paid off. I'm so excited about the new responsibilities and the team I'll be working with. This feels like the beginning of something amazing.",
    mood: "excited",
    date: "2024-03-16"
  }
];

// PUBLIC_INTERFACE
export const getMoodEmoji = (mood) => {
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

// PUBLIC_INTERFACE
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// PUBLIC_INTERFACE
export const getRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return formatDate(dateString);
  }
};

// PUBLIC_INTERFACE
export const sortEntriesByDate = (entries, ascending = false) => {
  return [...entries].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// PUBLIC_INTERFACE
export const filterEntriesByMood = (entries, mood) => {
  if (!mood || mood === 'all') {
    return entries;
  }
  return entries.filter(entry => entry.mood === mood);
};

// PUBLIC_INTERFACE
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};
