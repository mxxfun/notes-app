import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';

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
  addNote: (note: Omit<Note, 'id'>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'notes'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notesData: Note[] = [];
        querySnapshot.forEach((doc) => {
          notesData.push({ id: doc.id, ...doc.data() } as Note);
        });
        setNotes(notesData);
      });

      return () => unsubscribe();
    }
  }, [auth.currentUser]);

  const addNote = async (note: Omit<Note, 'id'>) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, 'notes'), { ...note, userId: user.uid });
        console.log('Note added successfully');
      } catch (error) {
        console.error('Error adding note: ', error);
      }
    } else {
      console.error('No user logged in');
    }
  };

  const updateNote = async (id: string, updatedNote: Partial<Note>) => {
    try {
      await updateDoc(doc(db, 'notes', id), updatedNote);
      console.log('Note updated successfully');
    } catch (error) {
      console.error('Error updating note: ', error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      console.log('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note: ', error);
    }
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