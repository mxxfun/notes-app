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
  // Weitere Funktionen wie updateNote, deleteNote, etc. können hier hinzugefügt werden
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote = { ...note, id: Date.now().toString() };
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote }}>
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