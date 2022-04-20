import { useState } from 'react';
import './App.scss';
import '../utils/fontAwesome';
import TabNav from './TabNav/TabNav';
import Library from './Library/Library';
import Editor from './Editor/Editor';
import Note from '../utils/Note';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // Load existing notes from browser's localStorage if present
    let initNotes = [];
    if (localStorage.notes) {
        const storedNotes = JSON.parse(localStorage.notes);
        initNotes = storedNotes.map((data) => new Note(data));
    }
    const [notes, setNotes] = useState(initNotes);

    const [openNoteIds, setOpenNoteIds] = useState([]);
    const [activeTab, setActiveTab] = useState('');

    // Ensure notes are saved back to localStorage upon page close
    window.addEventListener('beforeunload', () => {
        localStorage.notes = JSON.stringify(notes);
    });

    // Prevent default context menu behaviour so we can use our own in certain places
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    const openNotes = openNoteIds.map((noteId) => {
        return notes.find((note) => note.id === noteId);
    });

    return (
        <div id="App">
            <TabNav
                notes={openNotes}
                activeTab={activeTab}
                onTabClose={handleNoteClose}
                onTabCreate={handleNewNote}
                onTabChange={handleTabChange}
            />
            <div className="under-nav">
                <Routes>
                    <Route path="/note/:noteId" element={
                        <Editor
                            notes={notes}
                            onNoteOpen={(noteId) => handleNoteOpen(noteId)}
                            onNoteChange={(noteId, updates) => handleNoteChange(noteId, updates)}
                            onNoteDelete={(noteId) => handleNoteDelete(noteId)}
                        />
                    }>
                    </Route>
                    <Route path="/" element={
                        <Library
                            notes={notes}
                            onNewNote={handleNewNote}
                            onNoteDelete={(noteId) => handleNoteDelete(noteId)}
                            onNoteCopy={(noteId) => handleNoteCopy(noteId)}
                            onNoteOpen={(noteId) => handleNoteOpen(noteId)}
                        />
                    }>
                    </Route>
                </Routes>
            </div>
        </div>
    );

    function handleNoteClose(noteId) {
        const tabIndex = openNoteIds.indexOf(noteId);
        if (tabIndex < 0) return;
        const newOpenNoteIds = openNoteIds.slice();
        newOpenNoteIds.splice(tabIndex, 1);
        setOpenNoteIds(newOpenNoteIds);

        // Change to a different tab if the currently active tab was closed
        if (activeTab === noteId) {
            if (newOpenNoteIds.length) {
                const activeNoteId = newOpenNoteIds[tabIndex > 0 ? tabIndex - 1 : 0];
                handleNoteOpen(activeNoteId);
            } else {
                handleTabChange();
            }
        }
        
        // Delete empty notes when closed
        const noteIndex = notes.findIndex((n) => n.id === noteId);
        const note = notes[noteIndex];
        if (!note.title && !note.content) {
            const newNotes = notes.slice();
            newNotes.splice(noteIndex, 1);
            setNotes(newNotes);
        }
    }

    function handleTabChange(noteId = '') {
        if (activeTab !== noteId) setActiveTab(noteId);
        const path = noteId ? `/note/${noteId}` : '/';
        if (location.pathname !== path) navigate(path);
    }

    function handleNoteOpen(noteId, isNew = false) {
        // When a new note was just created, it won't be in the notes list yet so we don't need to check
        if (!isNew && !notes.find(n => n.id === noteId)) {
            // This note has been deleted, so return to the notes list instead
            handleTabChange();
            return;
        }

        if (openNoteIds.indexOf(noteId) === -1) {
            const newOpenNoteIds = openNoteIds.slice();
            newOpenNoteIds.push(noteId);
            setOpenNoteIds(newOpenNoteIds);
        }
        handleTabChange(noteId);
    }

    function handleNoteChange(noteId, updates) {
        const newNotes = notes.slice();
        const noteIndex = newNotes.findIndex(n => n.id === noteId);
        newNotes[noteIndex] = { ...newNotes[noteIndex], ...updates };
        setNotes(newNotes);
    }

    function handleNewNote() {
        const newNotes = notes.slice();
        const note = new Note();
        newNotes.push(note);
        setNotes(newNotes);
        handleNoteOpen(note.id, true);
    }

    function handleNoteDelete(noteId) {
        const newNotes = notes.slice();
        newNotes.splice(newNotes.findIndex((n) => n.id === noteId), 1);
        setNotes(newNotes);
        handleNoteClose(noteId);
    }

    function handleNoteCopy(noteId) {
        const newNotes = notes.slice();
        const note = newNotes.find(n => n.id === noteId);
        const copy = new Note({
            title: note.title + ' (copy)',
            content: note.content,
        });
        newNotes.push(copy);
        setNotes(newNotes);
        handleNoteOpen(copy.id);
    }
}