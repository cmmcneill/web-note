import { useRef } from 'react';
import ContextMenu from '../ContextMenu';

export default function NoteTile({ note, onCopy, onDelete, onOpen }) {
    const tileRef = useRef();

    let title = note.title;
    if (title.length > 40) title = title.slice(0, 37) + '...';
    const menuItems = [
        {
            title: 'Copy This Note',
            icon: 'copy',
            onClick: onCopy,
        },
        {
            title: 'Delete This Note',
            icon: 'trash-can',
            onClick: onDelete,
        },
    ];

    return (
        <div
            ref={tileRef}
            className="note-tile"
            onClick={onOpen}
            title={note.title}
        >
            <div className="title">{title}</div>
            <div className="preview" dangerouslySetInnerHTML={{ __html: note.content }}></div>
            <ContextMenu items={menuItems} trigger={tileRef}/>
        </div>
    );
}