"use client"
// Basic Headless UI Date Picker - This is a simplified version.
// A full-featured one requires more effort.
import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isEqual,
  isToday,
} from "date-fns"
import { cn } from "@/lib/utils" // Your cn utility

interface CustomDatePickerProps {
  selected?: Date
  onSelect: (date: Date) => void
  disabled?: (date: Date) => boolean
}

export function CustomDatePicker({ selected, onSelect, disabled }: CustomDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selected ? startOfMonth(selected) : startOfMonth(new Date()))

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  // Add empty cells for days before the first day of the month
  const startingDayIndex = getDay(startOfMonth(currentMonth)) // 0 for Sunday, 1 for Monday, etc.
  const prefixDays = Array.from({ length: startingDayIndex }).map((_, i) => <div key={`empty-${i}`} />)

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className="p-3 bg-background rounded-md shadow-lg border">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-accent">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span className="font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={handleNextMonth} className="p-1 rounded hover:bg-accent">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {dayNames.map((day) => (
          <div key={day} className="font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {prefixDays}
        {days.map((day) => {
          const isSelected = selected && isEqual(day, selected)
          const isDisabled = disabled ? disabled(day) : false
          const isCurrentToday = isToday(day)
          return (
            <button
              key={day.toString()}
              onClick={() => !isDisabled && onSelect(day)}
              disabled={isDisabled}
              className={cn(
                "p-2 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                !isSelected && !isDisabled && "hover:bg-accent",
                isCurrentToday && !isSelected && "border border-primary",
                isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed",
              )}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}
