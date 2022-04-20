import { useState, useEffect, useRef } from 'react';
import './Editor.scss';
import ContentEditable from './ContentEditable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropdownMenu from '../DropdownMenu';
import { useParams } from 'react-router-dom';

export default function Editor({ notes, onNoteDelete, onNoteChange, onNoteOpen }) {
    const { noteId } = useParams();
    const [showMenu, setShowMenu] = useState(false);
    const titleRef = useRef();
    const contentRef = useRef();
    const menuRef = useRef();

    const note = notes.find(n => n.id === noteId);
    const menuItems = [
        {
            title: 'Delete This Note',
            icon: 'trash-can',
            onClick: () => onNoteDelete(noteId),
        }
    ];

    // Add note to the list of open notes in case this URL was loaded directly by the browser
    useEffect(() => {
        onNoteOpen(noteId);
    }, [onNoteOpen, noteId]);

    // If there's no title yet, force cursor into the title field
    useEffect(() => {
        autoFocusTitle();
    });

    useEffect(() => {
        document.title = 'Web Note - ' + note.title;
    }, [note.title]);

    // Sometimes a deleted note is opened via browser back-button or bookmark
    if (!note) return <div className="editor"></div>;

    return (
        <div className="editor">
            <div className="title-wrapper">
                <input
                    key={`title_${note.id}`}
                    ref={titleRef}
                    className="title"
                    value={note.title}
                    onChange={(e) => onNoteChange(noteId, { title: e.target.value })}
                    onKeyDown={(e) => handleTitleKeyDown(e)}
                    placeholder="Note Title"
                />
                <div
                    ref={menuRef}
                    className="menu-button"
                    onClick={() => setShowMenu(!showMenu)}
                    title="Options menu"
                >
                    <FontAwesomeIcon icon="ellipsis-vertical" />
                    <DropdownMenu
                        show={showMenu}
                        items={menuItems}
                        trigger={menuRef}
                        onClose={() => setShowMenu(false)}
                    />
                </div>
            </div>
            <ContentEditable
                key={`content_${note.id}`}
                ref={contentRef}
                html={note.content}
                onChange={(html) => onNoteChange(noteId, { content: html })}
                selection={note.selection}
                onSelectionChange={(selection) => onNoteChange(noteId, { selection })}
                noFocus={!note.title && !note.html}
            />
        </div>
    );

    function autoFocusTitle() {
        if (titleRef.current && !note.title && !note.html) {
            titleRef.current.focus();
        }
    }

    function handleTitleKeyDown(e) {
        if (note.title && e.key === 'Enter') {
            e.preventDefault();
            contentRef.current.focus();
        }
    }
}