import { render, fireEvent } from '@testing-library/react';
import Library from './Library';
import Note from '../../utils/Note';
import { MemoryRouter } from 'react-router-dom';

const notes = [new Note({
    id: 'noteId',
    title: 'Test Note Title',
    content: '<div>Test &lt;note&gt; content</div>',
})];
const onNoteOpen = jest.fn();
const onNewNote = jest.fn();
const onNoteDelete = jest.fn();
const onNoteCopy = jest.fn();

let comp;
beforeEach(() => {
    comp = render(
        <MemoryRouter>
            <Library
                notes={notes}
                onNoteOpen={onNoteOpen}
                onNewNote={onNewNote}
                onNoteDelete={onNoteDelete}
                onNoteCopy={onNoteCopy}
            />
        </MemoryRouter>
    );
})

test('Library renders', () => {
    expect(comp.queryByText(/new note/i)).toBeTruthy();
});

test('Note tile renders', () => {
    expect(comp.queryByText(notes[0].title)).toBeTruthy();
    expect(comp.queryByText('Test <note> content')).toBeTruthy();
});

test('Opening new note', () => {
    fireEvent.click(comp.getByText(/new note/i));
    expect(onNewNote).toHaveBeenCalled();
});

test('Opening existing note', () => {
    fireEvent.click(comp.getByText(notes[0].title));
    expect(onNoteOpen).toHaveBeenCalledWith(notes[0].id);
});

test('Context menu opens', () => {
    fireEvent.contextMenu(comp.getByText(notes[0].title));
    expect(comp.queryByText(/copy .*note/i)).toBeTruthy();
});

test('Copy note', () => {
    fireEvent.contextMenu(comp.getByText(notes[0].title));
    fireEvent.click(comp.getByText(/copy .*note/i));
    expect(onNoteCopy).toHaveBeenCalledWith(notes[0].id);
});

test('Delete note', () => {
    fireEvent.contextMenu(comp.getByText(notes[0].title));
    fireEvent.click(comp.getByText(/delete .*note/i));
    expect(onNoteDelete).toHaveBeenCalledWith(notes[0].id);
});