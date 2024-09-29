import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { PrioritySlider } from "@/components/priority-slider"

export default function NoteContextMenu() {
  const [deadline, setDeadline] = useState("heute")
  const [date, setDate] = useState<Date | undefined>(new Date())

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
          <PrioritySlider />
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