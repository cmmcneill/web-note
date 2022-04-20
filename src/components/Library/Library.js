import React from 'react';
import './Library.scss';
import NoteTile from './NoteTile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Library({ notes, onNoteDelete, onNoteCopy, onNewNote, onNoteOpen }) {
    const tiles = notes.map((note) => {
        return (
            <NoteTile
                key={note.id}
                note={note}
                onDelete={() => onNoteDelete(note.id)}
                onCopy={() => onNoteCopy(note.id)}
                onOpen={() => onNoteOpen(note.id)}
            />
        );
    });

    return (
        <div className="library">
            {tiles}
            <div className="note-tile new" onClick={onNewNote}>
                <div className="title">New Note</div>
                <FontAwesomeIcon icon="plus-square" />
            </div>
        </div>
    );
};