import { render, fireEvent } from '@testing-library/react';
import Editor from './Editor';
import Note from '../../utils/Note';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const notes = [new Note({
    id: 'NOTE_ID',
    title: 'Test Note Title',
    content: '<div>Test &lt;note&gt; content</div>',
})];
const onNoteChange = jest.fn();
const onNoteDelete = jest.fn();
const onNoteOpen = jest.fn();

let comp;
beforeEach(() => {
    comp = render(
        <MemoryRouter initialEntries={['/note/NOTE_ID']}>
            <Routes>
                <Route path="/note/:noteId" element={
                    <Editor
                        notes={notes}
                        onNoteChange={onNoteChange}
                        onNoteDelete={onNoteDelete}
                        onNoteOpen={onNoteOpen}
                    />
                }/>
            </Routes>
        </MemoryRouter>
    );
})

test('Editor renders', () => {
    expect(comp.queryByDisplayValue(notes[0].title)).toBeTruthy();
    expect(comp.queryByText('Test <note> content')).toBeTruthy();
    expect(onNoteOpen).toHaveBeenCalledWith(notes[0].id);
});

test('Change title', () => {
    const title = 'Changed Title';
    fireEvent.change(comp.queryByDisplayValue(notes[0].title), {
        target: { value: title }
    });
    expect(onNoteChange).toHaveBeenCalledWith(notes[0].id, { title });
});

test('Change content', () => {
    const content = '<div>Changed content.</div>';
    const editable = comp.queryByText('Test <note> content').closest('[contenteditable]');
    fireEvent.input(editable, {
        target: { innerHTML: content }
    });
    expect(onNoteChange).toHaveBeenCalledWith(notes[0].id, { content });
});

test('Dropdown menu opens', () => {
    const menuBtn = comp.queryByTitle(/menu/i);
    expect(menuBtn).toBeTruthy();
    fireEvent.click(menuBtn);
    expect(comp.queryByText(/delete .*note/i)).toBeTruthy();
});

test('Delete note', () => {
    fireEvent.click(comp.getByTitle(/menu/i));
    fireEvent.click(comp.getByText(/delete .*note/i));
    expect(onNoteDelete).toHaveBeenCalledWith(notes[0].id);
});