import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function NoteContextMenu() {
  const [importance, setImportance] = useState(50)
  const [deadline, setDeadline] = useState("heute")
  const [date, setDate] = useState<Date | undefined>(new Date())

  const getSliderColor = (value: number) => {
    const hue = 120 - value * 1.2 // This will transition from green (120) to orange (0)
    return `hsl(${hue}, 100%, 50%)`
  }

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titel</Label>
          <Input id="title" placeholder="Titel eingeben" />
        </div>

        <div>
          <Label htmlFor="note">Notiz</Label>
          <Textarea id="note" placeholder="Notiz eingeben" className="h-24" />
        </div>

        <div>
          <Label>Wichtigkeit</Label>
          <div className="relative mt-2">
            <input
              type="range"
              min="0"
              max="100"
              value={importance}
              onChange={(e) => setImportance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${getSliderColor(0)} 0%, ${getSliderColor(50)} 50%, ${getSliderColor(100)} 100%)`,
              }}
            />
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: ${getSliderColor(importance)};
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
              }
              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: ${getSliderColor(importance)};
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
              }
            `}</style>
            <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
              <span>Niedrige Priorität</span>
              <span>Hohe Priorität</span>
            </div>
          </div>
        </div>

        <div>
          <Label>Deadline</Label>
          <RadioGroup value={deadline} onValueChange={setDeadline} className="flex flex-wrap gap-4 mt-2">
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
                onSelect={setDate}
                className="rounded-md border"
                classNames={{
                  day_selected: "bg-orange-500 text-white hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white",
                  day_today: "bg-gray-100 text-gray-900",
                }}
              />
            </div>
          )}
        </div>

        <Button 
          className={cn(
            "w-full bg-white text-black border border-black transition-colors duration-300",
            "hover:bg-black hover:text-white"
          )}
        >
          Speichern
        </Button>
      </div>
    </div>
  )
}