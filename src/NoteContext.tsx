import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  priority: number;
  deadline: string;
  completed: boolean;
}

interface NoteContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote = { ...note, id: Date.now().toString(), completed: false };
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  const updateNote = (id: string, updatedNote: Partial<Note>) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, ...updatedNote } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};