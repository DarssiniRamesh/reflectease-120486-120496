import React, { useState, useEffect } from "react";
import "./App.css";
import JournalEntry from "./components/JournalEntry";
import JournalList from "./components/JournalList";
import MoodFilter from "./components/MoodFilter";
import apiService from "./services/api";
import { demoEntries, generateId } from "./utils/demoData";
// Clerk imports
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useUser,
  UserButton
} from "@clerk/clerk-react";

// Clerk publishable key - set this in your .env file as REACT_APP_CLERK_PUBLISHABLE_KEY
const clerkKey =
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY ||
  "pk_test_replace_with_actual_key";

// PUBLIC_INTERFACE
function JournalApp({ demoModeOverride }) {
  // Demo-mode state is retained for fallback/offline
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState("all");
  const [currentEntry, setCurrentEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(demoModeOverride ?? false);

  const moodOptions = [
    "happy",
    "sad",
    "excited",
    "calm",
    "anxious",
    "grateful",
    "frustrated",
    "content",
  ];

  // Fetch entries from backend on mount or user signed in
  useEffect(() => {
    if (demoMode) {
      setEntries(demoEntries);
      setLoading(false);
      return;
    }
    fetchEntries();
    // eslint-disable-next-line
  }, []);

  // Filter entries when mood changes
  useEffect(() => {
    if (selectedMood === "all") {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter((entry) => entry.mood === selectedMood));
    }
  }, [entries, selectedMood]);

  // PUBLIC_INTERFACE
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllEntries();
      setEntries(
        data.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setError(null);
      setDemoMode(false);
    } catch (err) {
      // Demo mode fallback (offline, backend error)
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
        const savedEntry = {
          ...entryData,
          id: currentEntry ? currentEntry.id : generateId(),
        };
        if (currentEntry) {
          setEntries(
            entries.map((entry) =>
              entry.id === currentEntry.id ? savedEntry : entry
            )
          );
        } else {
          setEntries([savedEntry, ...entries]);
        }
      } else {
        const savedEntry = currentEntry
          ? await apiService.updateEntry(currentEntry.id, entryData)
          : await apiService.createEntry(entryData);

        if (currentEntry) {
          setEntries(
            entries.map((entry) =>
              entry.id === currentEntry.id ? savedEntry : entry
            )
          );
        } else {
          setEntries([savedEntry, ...entries]);
        }
      }

      setCurrentEntry(null);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Unable to save entry. Please try again.");
      console.error("Error saving entry:", err);
    }
  };

  // PUBLIC_INTERFACE
  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      if (!demoMode) {
        await apiService.deleteEntry(id);
      }
      setEntries(entries.filter((entry) => entry.id !== id));
      setError(null);
    } catch (err) {
      setError("Unable to delete entry. Please try again.");
      console.error("Error deleting entry:", err);
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
          <div>
            <UserButton />
          </div>
        )}
        <button
          className="new-entry-btn"
          onClick={startNewEntry}
          disabled={isEditing}
        >
          + New Entry
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

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

// PUBLIC_INTERFACE
function App() {
  // Top-level ClerkProvider: wraps everything for auth context.
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <SignedIn>
        {/* Only render app after user signed in */}
        <JournalApp />
      </SignedIn>
      <SignedOut>
        {/* Show Clerk <SignIn /> and <SignUp /> if user not authed */}
        <div className="app">
          <header className="app-header">
            <div className="header-left">
              <h1 className="app-title">Daily Journal</h1>
            </div>
          </header>
          <main className="app-main">
            <div style={{ maxWidth: 400, margin: "2rem auto" }}>
              <SignIn signUpUrl="/sign-up" />
            </div>
            <div style={{ maxWidth: 400, margin: "2rem auto" }}>
              <SignUp />
            </div>
          </main>
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}

export default App;
