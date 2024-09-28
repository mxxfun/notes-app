import './index.postcss'
import { PlusIcon } from "lucide-react"
import { useState, useEffect } from 'react'

const TaskItem = ({ task }) => (
  <li className="mb-2">
    <div className="flex items-center rounded-lg border border-gray-300 px-4 py-2 transition-all duration-300 hover:bg-orange-500 group">
      <div className="flex-shrink-0 w-5 h-5 mr-3">
        <input 
          type="checkbox" 
          className="w-5 h-5 rounded-full border-2 border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 transition-colors duration-300 group-hover:border-white"
        />
      </div>
      <span className="text-gray-700 group-hover:text-white transition-colors duration-300">{task}</span>
    </div>
  </li>
)

const TaskSection = ({ title, tasks }) => (
  <section className="mb-6">
    <h2 className="mb-2 text-lg font-semibold text-gray-700">{title}</h2>
    <ul>
      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} />
      ))}
    </ul>
  </section>
)

export default function Homepage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const tasks = {
    heute: ["Projekt-Präsentation vorbereiten", "E-Mails beantworten"],
    morgen: ["Team-Meeting", "Bericht fertigstellen"],
    dieseWoche: ["Kundengespräch vorbereiten", "Neue Software testen"],
    dieserMonat: ["Quartalsplanung erstellen", "Fortbildung planen"],
    alle: ["Langzeitprojekt strukturieren", "Urlaubsplanung"]
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000 * 60) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notizen App</h1>
        </header>
        <div className="flex gap-8">
          <div className="flex-grow">
            <div className="mb-6 flex items-center rounded-full border border-gray-300 px-4 py-2">
              <PlusIcon className="mr-2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Aufgabe hinzufügen"
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <TaskSection title="Heute" tasks={tasks.heute} />
            <TaskSection title="Morgen" tasks={tasks.morgen} />
            <TaskSection title="Diese Woche" tasks={tasks.dieseWoche} />
            <TaskSection title="Dieser Monat" tasks={tasks.dieserMonat} />
            <TaskSection title="Alle" tasks={tasks.alle} />
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
    </div>
  )
}