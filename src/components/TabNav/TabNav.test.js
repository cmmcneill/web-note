import { render, fireEvent } from '@testing-library/react';
import TabNav from './TabNav';
import Note from '../../utils/Note';
import { MemoryRouter } from 'react-router-dom';

const notes = [new Note({
    id: 'noteId',
    title: 'Test Note Title',
    content: '',
})];
const onTabChange = jest.fn();
const onTabClose = jest.fn();
const onTabCreate = jest.fn();

let comp;
beforeEach(() => {
    comp = render(
        <MemoryRouter>
            <TabNav
                notes={notes}
                current="my-notes"
                onTabChange={onTabChange}
                onTabClose={onTabClose}
                onTabCreate={onTabCreate}
            />
        </MemoryRouter>
    );
})

test('TabNav renders', () => {
    expect(comp.queryByText(/my notes/i)).toBeTruthy();
});

test('Existing note tab renders', () => {
    expect(comp.queryByText(notes[0].title)).toBeTruthy();
});

test('Opening new note tab', () => {
    const newNoteBtn = comp.getByTitle(/new note/i);
    expect(newNoteBtn).toBeInTheDocument();
    fireEvent.click(newNoteBtn);
    expect(onTabCreate).toHaveBeenCalled();
});

test('Changing tab', () => {
    const tab = comp.getByText(notes[0].title);
    expect(tab).toBeInTheDocument();
    fireEvent.click(tab);
    expect(onTabChange).toHaveBeenCalledWith(notes[0].id);
});

test('Closing existing note tab', () => {
    const closeBtn = comp.getByTitle(/close/i);
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(onTabClose).toHaveBeenCalledWith(notes[0].id);
});