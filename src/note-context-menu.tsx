import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { PrioritySlider } from "@/components/priority-slider";
import { X } from "lucide-react";
import { useNotes } from "./NoteContext";

interface Note {
  id: string;
  title: string;
  content: string;
  priority: number;
  deadline: string;
  completed: boolean;
}

interface NoteContextMenuProps {
  onClose: () => void;
  initialNote?: Note | null;
}

export default function NoteContextMenu({
  onClose,
  initialNote,
}: NoteContextMenuProps) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [priority, setPriority] = useState(initialNote?.priority || 50);
  const [deadline, setDeadline] = useState(initialNote?.deadline || "heute");
  const [date, setDate] = useState<Date | undefined>(
    initialNote?.deadline ? new Date(initialNote.deadline) : new Date()
  );
  const [completed, setCompleted] = useState(initialNote?.completed || false);

  const { addNote, updateNote, deleteNote } = useNotes();

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
      setPriority(initialNote.priority);
      setDeadline(initialNote.deadline);
      setDate(new Date(initialNote.deadline));
      setCompleted(initialNote.completed);
    }
  }, [initialNote]);

  const handleSubmit = () => {
    const noteData = {
      title,
      content,
      priority,
      deadline: date ? date.toISOString() : new Date().toISOString(),
      completed,
    };

    if (initialNote) {
      updateNote(initialNote.id, noteData);
    } else {
      addNote(noteData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (initialNote) {
      deleteNote(initialNote.id);
      onClose();
    }
  };

  const handleDeadlineChange = (value: string) => {
    setDeadline(value);
    let newDate = new Date();

    switch (value) {
      case "heute":
        newDate = new Date();
        break;
      case "morgen":
        newDate = new Date();
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "diese-woche":
        newDate = new Date();
        newDate.setDate(newDate.getDate() + (7 - newDate.getDay()));
        break;
      case "manuell":
        // Keep the current date
        break;
    }

    setDate(newDate);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {initialNote ? "Notiz bearbeiten" : "Neue Notiz"}
      </h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="block mb-1">
            Titel
          </Label>
          <Input
            id="title"
            placeholder="Titel eingeben"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note" className="block mb-1">
            Notiz
          </Label>
          <Textarea
            id="note"
            placeholder="Notiz eingeben"
            className="h-24"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="block mb-2">Wichtigkeit</Label>
          <PrioritySlider value={priority} onChange={setPriority} />
        </div>

        <div className="space-y-2">
          <Label className="block mb-2">Deadline</Label>
          <RadioGroup
            value={deadline}
            onValueChange={handleDeadlineChange}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="heute" id="heute" />
              <Label htmlFor="heute">Heute</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="morgen" id="morgen" />
              <Label htmlFor="morgen">Morgen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="diese-woche" id="diese-woche" />
              <Label htmlFor="diese-woche">Diese Woche</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manuell" id="manuell" />
              <Label htmlFor="manuell">Manuell</Label>
            </div>
          </RadioGroup>
          {deadline === "manuell" && (
            <div className="mt-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => setDate(newDate || new Date())}
                className="rounded-md border"
                classNames={{
                  day_selected:
                    "bg-orange-500 text-white hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white",
                  day_today: "bg-gray-100 text-gray-900",
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <Label htmlFor="completed">Erledigt</Label>
        </div>

        <Button
          className={cn(
            "w-full bg-white text-black border border-black transition-colors duration-300",
            "hover:bg-black hover:text-white"
          )}
          onClick={handleSubmit}
        >
          {initialNote ? "Aktualisieren" : "Speichern"}
        </Button>
        {initialNote && (
          <div className="text-center">
            <button
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Löschen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}