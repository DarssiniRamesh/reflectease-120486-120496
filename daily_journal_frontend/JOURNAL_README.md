# Daily Journal Frontend

A minimal, distraction-free journaling application built with React.

## Features

- **Create Journal Entries**: Write daily thoughts with title, notes, and optional mood tags
- **Browse Journal History**: View all entries organized by date
- **Mood Filtering**: Filter entries by mood to revisit specific emotional moments
- **Edit & Delete**: Modify or remove past entries
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Minimalistic Interface**: Clean, distraction-free writing environment

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Daily Journal Backend API running on port 8000

### Installation

1. Navigate to the project directory:
```bash
cd daily_journal_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Configuration

### Environment Variables

Create a `.env` file in the project root to configure the API endpoint:

```env
REACT_APP_API_URL=http://localhost:8000
```

### Available Moods

The application supports the following mood options:
- Happy 😊
- Sad 😢
- Excited 🤩
- Calm 😌
- Anxious 😰
- Grateful 🙏
- Frustrated 😤
- Content 😊

## Usage

### Creating a New Entry

1. Click the "New Entry" button in the header
2. Select the date (defaults to today)
3. Enter a title for your entry
4. Choose an optional mood
5. Write your thoughts in the notes section
6. Click "Save" to store your entry

### Browsing Entries

- All entries are displayed in reverse chronological order (newest first)
- Each entry card shows the title, date, mood (if selected), and a preview of the notes
- Click the edit button (✏️) to modify an entry
- Click the delete button (🗑️) to remove an entry

### Filtering by Mood

Use the mood filter section to:
- View all entries (default)
- Filter by specific moods to find entries matching your emotional state

## API Integration

The frontend communicates with the backend API using the following endpoints:

- `GET /entries` - Retrieve all journal entries
- `POST /entries` - Create a new journal entry
- `PUT /entries/{id}` - Update an existing entry
- `DELETE /entries/{id}` - Delete an entry

## Design

The application follows a minimalistic design philosophy with:

- **Color Scheme**: 
  - Primary: #22223b (dark blue)
  - Secondary: #4a4e69 (medium blue)
  - Accent: #9a8c98 (muted purple)
- **Typography**: System fonts for optimal readability
- **Layout**: Single-column design focused on content
- **Responsive**: Mobile-first approach with tablet and desktop optimizations

## Development

### Project Structure

```
src/
├── components/
│   ├── JournalEntry.js    # Entry creation/editing form
│   ├── JournalList.js     # Entry browsing and management
│   └── MoodFilter.js      # Mood filtering component
├── services/
│   └── api.js             # API service layer
├── App.js                 # Main application component
├── App.css                # Application styles
└── index.js               # Application entry point
```

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Troubleshooting

### Common Issues

1. **API Connection Error**: Ensure the backend is running on the configured port
2. **Entries Not Loading**: Check the API URL in the `.env` file
3. **Styling Issues**: Clear browser cache and refresh

### Error Messages

- "Unable to load journal entries" - Backend API is not accessible
- "Unable to save entry" - Network error or backend validation failure
- "Unable to delete entry" - Permission or network issue

## Contributing

1. Follow the existing code style and patterns
2. Add comments for public interfaces
3. Test responsive design on multiple screen sizes
4. Ensure accessibility standards are met

## License

This project is part of the Daily Journal application suite.
