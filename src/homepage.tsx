import './index.postcss'
import { PlusIcon, ChevronRight, ChevronDown } from "lucide-react"
import { useState, useEffect } from 'react'
import NoteContextMenu from './note-context-menu'
import { useNotes } from './NoteContext'
import { CustomCheckbox } from '@/components/custom-checkbox'
import { PriorityStatusComponent } from '@/components/priority-status'

interface Note {
  id: string;
  title: string;
  content: string;
  priority: number;
  deadline: string;
  completed: boolean;
}

const TaskItem = ({ note, onNoteClick, onToggleComplete }: { note: Note; onNoteClick: (note: Note) => void; onToggleComplete: (id: string, completed: boolean) => void }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <li className="mb-2">
      <div 
        className="flex items-center justify-between w-full rounded-lg border border-gray-300 px-3 py-2 transition-all duration-300 hover:bg-orange-50 cursor-pointer"
        onClick={() => onNoteClick(note)}
      >
        <div className="flex-shrink-0 mr-3" onClick={(e) => e.stopPropagation()}>
          <CustomCheckbox
            checked={note.completed}
            onChange={(checked) => onToggleComplete(note.id, checked)}
            id={`task-${note.id}`}
          />
        </div>
        <span className={`text-gray-700 transition-colors duration-300 flex-grow ${note.completed ? 'line-through text-gray-400' : ''}`}>{note.title}</span>
        <div className="flex items-center space-x-2 ml-2">
          <span className="text-sm text-gray-500">{formatDate(note.deadline)}</span>
          <div className="flex-shrink-0 w-8 h-8">
            <PriorityStatusComponent priority={note.priority} />
          </div>
        </div>
      </div>
    </li>
  )
}
const TaskSection = ({ title, notes, onNoteClick, onToggleComplete, defaultCollapsed = true }: { title: string; notes: Note[]; onNoteClick: (note: Note) => void; onToggleComplete: (id: string, completed: boolean) => void; defaultCollapsed?: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <section className="mb-6">
      <h2 
        className="mb-2 text-lg font-semibold text-gray-700 cursor-pointer flex items-center"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="mr-2">
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
        {title}
      </h2>
      {!isCollapsed && (
        <ul>
          {notes.map((note) => (
            <TaskItem key={note.id} note={note} onNoteClick={onNoteClick} onToggleComplete={onToggleComplete} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default function Homepage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const { notes, updateNote } = useNotes()
  const [viewMode, setViewMode] = useState<'date' | 'priority'>('date')

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

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateNote(id, { completed });
  };

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
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const categories = {
      ueberfaellig: [] as Note[],
      heute: [] as Note[],
      morgen: [] as Note[],
      dieseWoche: [] as Note[],
      dieserMonat: [] as Note[],
      alle: [] as Note[],
      erledigt: [] as Note[]
    }

    notes.forEach(note => {
      const noteDate = new Date(note.deadline)
      noteDate.setHours(0, 0, 0, 0)

      if (note.completed) {
        categories.erledigt.push(note)
      } else {
        categories.alle.push(note)

        if (noteDate < today) {
          categories.ueberfaellig.push(note)
        }
        if (noteDate.getTime() === today.getTime()) {
          categories.heute.push(note)
        }
        if (noteDate.getTime() === tomorrow.getTime()) {
          categories.morgen.push(note)
        }
        if (noteDate > today && noteDate <= nextWeek) {
          categories.dieseWoche.push(note)
        }
        if (noteDate > today && noteDate < nextMonth) {
          categories.dieserMonat.push(note)
        }
      }
    })

    return categories
  }

  const sortNotesByPriority = (notesToSort: Note[]) => {
    return [...notesToSort].sort((a, b) => b.priority - a.priority);
  }

  const categorizedNotes = categorizeNotes()
  const prioritySortedNotes = sortNotesByPriority(notes.filter(note => !note.completed))

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
            <div className="mb-6 flex space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                  viewMode === 'date'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('date')}
              >
                Datum
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                  viewMode === 'priority'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setViewMode('priority')}
              >
                Priority Score
              </button>
            </div>
            {viewMode === 'date' ? (
              <>
                <TaskSection title="Überfällig" notes={categorizedNotes.ueberfaellig} onNoteClick={handleNoteClick} onToggleComplete={handleToggleComplete} defaultCollapsed={false} />
                <TaskSection title="Heute" notes={categorizedNotes.heute} onNoteClick={handleNoteClick} onToggleComplete={handleToggleComplete} defaultCollapsed={false} />
                <TaskSection title="Morgen" notes={categorizedNotes.morgen} onNoteClick={handleNoteClick} onToggleComplete={handleToggleComplete} />
                <TaskSection title="Diese Woche" notes={categorizedNotes.dieseWoche} onNoteClick={handleNoteClick} onToggleComplete={handleToggleComplete} />
                <TaskSection title="Dieser Monat" notes={categorizedNotes.dieserMonat} onNoteClick={handleNoteClick} onToggleComplete={handleToggleComplete} />
                <TaskSection title="Alle" notes={categorizedNotes.alle} onNoteClick={handleNoteClick} onToggleComplete={handleToggleComplete} />
                <TaskSection title="Erledigt" notes={categorizedNotes.erledigt} onNoteClick={handleNoteClick} onToggleComplete={handleToggleComplete} />
              </>
            ) : (
              <>
                <TaskSection title="Nach Priorität sortiert" notes={prioritySortedNotes} onNoteClick={handleNoteClick} onToggleComplete={handleToggleComplete} defaultCollapsed={false} />
                <TaskSection title="Erledigt" notes={categorizedNotes.erledigt} onNoteClick={handleNoteClick} onToggleComplete={handleToggleComplete} />
              </>
            )}
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg m-4">
          <NoteContextMenu onClose={handleCloseModal} initialNote={selectedNote} />
        </div>
      </div>
      )}
    </div>
  )
}