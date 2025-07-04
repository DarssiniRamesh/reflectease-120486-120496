import React, { useState, useEffect } from 'react';
import './App.css';
import JournalEntry from './components/JournalEntry';
import JournalList from './components/JournalList';
import MoodFilter from './components/MoodFilter';
import AuthForm from './components/AuthForm';
import apiService from './services/api';
import {
  login as loginApi,
  register as registerApi,
  isLoggedIn,
  setToken,
  clearToken,
  getToken
} from './services/auth';
import { demoEntries, generateId } from './utils/demoData';

// PUBLIC_INTERFACE
function App() {
  // Journal UI States
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState('all');
  const [currentEntry, setCurrentEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // General UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth-specific states
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authed, setAuthed] = useState(isLoggedIn());
  const [demoMode, setDemoMode] = useState(false);

  // Define mood options
  const moodOptions = ['happy', 'sad', 'excited', 'calm', 'anxious', 'grateful', 'frustrated', 'content'];

  // Fetch entries from backend
  useEffect(() => {
    if (authed) {
      fetchEntries();
    } else {
      setLoading(false);
    }
  }, [authed]);

  // Filter entries when mood filter changes
  useEffect(() => {
    if (selectedMood === 'all') {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter(entry => entry.mood === selectedMood));
    }
  }, [entries, selectedMood]);

  // PUBLIC_INTERFACE
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllEntries();
      setEntries(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setError(null);
      setDemoMode(false);
    } catch (err) {
      // If failed, enter demo mode
      setEntries(demoEntries);
      setDemoMode(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const saveEntry = async (entryData) => {
    try {
      if (demoMode) {
        // Handle demo mode locally
        const savedEntry = {
          ...entryData,
          id: currentEntry ? currentEntry.id : generateId()
        };

        if (currentEntry) {
          setEntries(entries.map(entry =>
            entry.id === currentEntry.id ? savedEntry : entry
          ));
        } else {
          setEntries([savedEntry, ...entries]);
        }
      } else {
        // Use API service
        const savedEntry = currentEntry
          ? await apiService.updateEntry(currentEntry.id, entryData)
          : await apiService.createEntry(entryData);

        if (currentEntry) {
          setEntries(entries.map(entry =>
            entry.id === currentEntry.id ? savedEntry : entry
          ));
        } else {
          setEntries([savedEntry, ...entries]);
        }
      }

      setCurrentEntry(null);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Unable to save entry. Please try again.');
      console.error('Error saving entry:', err);
    }
  };

  // PUBLIC_INTERFACE
  const deleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      if (!demoMode) {
        await apiService.deleteEntry(id);
      }
      setEntries(entries.filter(entry => entry.id !== id));
      setError(null);
    } catch (err) {
      setError('Unable to delete entry. Please try again.');
      console.error('Error deleting entry:', err);
    }
  };

  // PUBLIC_INTERFACE
  const editEntry = (entry) => {
    setCurrentEntry(entry);
    setIsEditing(true);
  };

  // PUBLIC_INTERFACE
  const startNewEntry = () => {
    setCurrentEntry(null);
    setIsEditing(true);
  };

  // PUBLIC_INTERFACE
  const cancelEdit = () => {
    setCurrentEntry(null);
    setIsEditing(false);
  };

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    clearToken();
    setAuthed(false);
    setEntries([]);
    setError(null);
    setIsEditing(false);
    setCurrentEntry(null);
    setDemoMode(false);
  };

  // PUBLIC_INTERFACE
  const handleAuth = async (username, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === 'login') {
        await loginApi(username, password);
      } else {
        await registerApi(username, password);
      }
      setAuthed(true);
      setEntries([]); // Will refetch entries on authed state
      setError(null);
      setLoading(true);
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    }
    setAuthLoading(false);
  };

  // PUBLIC_INTERFACE
  const switchAuthMode = () => {
    setAuthMode(prev => (prev === 'login' ? 'register' : 'login'));
    setAuthError(null);
  };

  // Gating UI
  if (!authed && !demoMode) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <h1 className="app-title">Daily Journal</h1>
          </div>
        </header>
        <main className="app-main">
          <AuthForm
            mode={authMode}
            onAuthenticate={handleAuth}
            error={authError}
            loading={authLoading}
            switchMode={switchAuthMode}
          />
          <div style={{ marginTop: '2rem', textAlign: 'center', color: '#888' }}>
            <p>
              This app is private and requires login.<br />
              {authMode === 'login'
                ? "Don't have an account? You can register using the button above."
                : 'Already registered? Switch above to login.'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading your journal...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Daily Journal</h1>
          {demoMode && <span className="demo-badge">Demo Mode</span>}
        </div>
        {!demoMode && (
          <button
            className="btn btn-secondary"
            onClick={handleLogout}
            style={{ marginRight: '1rem' }}
          >
            Logout
          </button>
        )}
        <button
          className="new-entry-btn"
          onClick={startNewEntry}
          disabled={isEditing}
        >
          + New Entry
        </button>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <main className="app-main">
        {isEditing ? (
          <div className="entry-section">
            <JournalEntry
              entry={currentEntry}
              onSave={saveEntry}
              onCancel={cancelEdit}
              moodOptions={moodOptions}
            />
          </div>
        ) : (
          <div className="browse-section">
            <div className="filters">
              <MoodFilter
                selectedMood={selectedMood}
                onMoodChange={setSelectedMood}
                moodOptions={moodOptions}
              />
            </div>
            <JournalList
              entries={filteredEntries}
              onEdit={editEntry}
              onDelete={deleteEntry}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
