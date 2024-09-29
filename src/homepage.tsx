import './index.postcss'
import { PlusIcon } from "lucide-react"
import { useState, useEffect } from 'react'
import NoteContextMenu from './note-context-menu'
import { useNotes } from './NoteContext'

interface Note {
  id: string;
  title: string;
  content: string;
  priority: number;
  deadline: string;
  completed: boolean;
}

const TaskItem = ({ note, onNoteClick }: { note: Note; onNoteClick: (note: Note) => void }) => (
  <li className="mb-2">
    <div 
      className="flex items-center rounded-lg border border-gray-300 px-4 py-2 transition-all duration-300 hover:bg-orange-500 group cursor-pointer"
      onClick={() => onNoteClick(note)}
    >
      <div className="flex-shrink-0 w-5 h-5 mr-3">
        <input 
          type="checkbox" 
          checked={note.completed}
          className="w-5 h-5 rounded-full border-2 border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 transition-colors duration-300 group-hover:border-white"
          onChange={(e) => e.stopPropagation()}
        />
      </div>
      <span className="text-gray-700 group-hover:text-white transition-colors duration-300">{note.title}</span>
    </div>
  </li>
)

const TaskSection = ({ title, notes, onNoteClick }: { title: string; notes: Note[]; onNoteClick: (note: Note) => void }) => (
  <section className="mb-6">
    <h2 className="mb-2 text-lg font-semibold text-gray-700">{title}</h2>
    <ul>
      {notes.map((note) => (
        <TaskItem key={note.id} note={note} onNoteClick={onNoteClick} />
      ))}
    </ul>
  </section>
)

export default function Homepage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const { notes } = useNotes()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000 * 60) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNote(null)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const categorizeNotes = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    return {
      heute: notes.filter(note => new Date(note.deadline).toDateString() === today.toDateString()),
      morgen: notes.filter(note => new Date(note.deadline).toDateString() === tomorrow.toDateString()),
      dieseWoche: notes.filter(note => {
        const noteDate = new Date(note.deadline)
        return noteDate > tomorrow && noteDate <= nextWeek
      }),
      dieserMonat: notes.filter(note => {
        const noteDate = new Date(note.deadline)
        return noteDate > nextWeek && noteDate.getMonth() === today.getMonth()
      }),
      alle: notes
    }
  }

  const categorizedNotes = categorizeNotes()

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notizen App</h1>
        </header>
        <div className="flex gap-8">
          <div className="flex-grow">
            <div 
              className="mb-6 flex items-center rounded-full border border-gray-300 px-4 py-2 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon className="mr-2 h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Neue Notiz</span>
            </div>
            <TaskSection title="Heute" notes={categorizedNotes.heute} onNoteClick={handleNoteClick} />
            <TaskSection title="Morgen" notes={categorizedNotes.morgen} onNoteClick={handleNoteClick} />
            <TaskSection title="Diese Woche" notes={categorizedNotes.dieseWoche} onNoteClick={handleNoteClick} />
            <TaskSection title="Dieser Monat" notes={categorizedNotes.dieserMonat} onNoteClick={handleNoteClick} />
            <TaskSection title="Alle" notes={categorizedNotes.alle} onNoteClick={handleNoteClick} />
          </div>
          <div className="w-64 flex-shrink-0">
            <div className="rounded-lg border border-gray-200 p-4">
              <h2 className="mb-4 text-center text-lg font-semibold text-gray-700">Kalendar</h2>
              <div className="grid grid-cols-7 gap-2">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {Array.from({ length: getFirstDayOfMonth(currentDate) - 1 }, (_, i) => (
                  <div key={`empty-${i}`} className="p-1"></div>
                ))}
                {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    className={`rounded-full p-1 text-sm ${
                      day === currentDate.getDate() ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg">
            <NoteContextMenu onClose={handleCloseModal} initialNote={selectedNote} />
          </div>
        </div>
      )}
    </div>
  )
}