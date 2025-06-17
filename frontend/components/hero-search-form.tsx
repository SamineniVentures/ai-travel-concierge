"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { MapPinIcon, CalendarDaysIcon, UsersIcon, SearchIcon, PlaneTakeoffIcon, PlaneIcon } from "lucide-react"
import { useSearchStore } from "@/store/search-store"
import { format } from "date-fns"
import usCities from "@/lib/us-cities.json" // Import the city list
import { cn } from "@/lib/utils"

const searchSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departureDate: z.date({
    required_error: "Departure date is required",
  }),
  returnDate: z.date().optional(),
  travellers: z.string().min(1, "Number of travellers is required"),
  cabinClass: z.enum(["economy", "business", "first"]).default("economy"),
  tripType: z.enum(["one_way", "round_trip"]).default("round_trip"),
})

type SearchFormValues = z.infer<typeof searchSchema>

// Autocomplete Input Component (internal to HeroSearchForm for simplicity)
interface AutocompleteInputProps {
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  id: string
  error?: string
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ value, onChange, placeholder, id, error }) => {
  const [inputValue, setInputValue] = useState(value || "")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    setInputValue(value || "")
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentVal = e.target.value
    setInputValue(currentVal)
    onChange(currentVal) // Update form state immediately for RHF to track

    if (currentVal.length > 1) {
      const filtered = usCities.filter((city) => city.toLowerCase().includes(currentVal.toLowerCase())).slice(0, 7) // Limit suggestions
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    onChange(suggestion) // This updates the react-hook-form field
    setSuggestions([])
    setShowSuggestions(false)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full">
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
        ref={inputRef}
        autoComplete="off"
        className={cn(error && "border-red-500")}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-background border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function HeroSearchForm() {
  const { searchFlights, loading, error } = useSearchStore()
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: "",
      destination: "",
      travellers: "1",
      cabinClass: "economy",
      tripType: "round_trip",
    },
  })

  const tripType = watch("tripType")
  const departureDate = watch("departureDate")

  const onSubmit: SubmitHandler<SearchFormValues> = (data) => {
    const params = {
      ...data,
      departureDate: data.departureDate ? format(data.departureDate, "yyyy-MM-dd") : undefined,
      returnDate: data.returnDate ? format(data.returnDate, "yyyy-MM-dd") : undefined,
    }
    searchFlights(params)
    console.log("Search Submitted:", params)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-background/95 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-start"
    >
      {/* Origin */}
      <div className="space-y-1">
        <label htmlFor="origin" className="text-sm font-medium text-muted-foreground flex items-center">
          <PlaneTakeoffIcon className="w-4 h-4 mr-2" /> Origin
        </label>
        <Controller
          name="origin"
          control={control}
          render={({ field }) => (
            <AutocompleteInput
              id="origin"
              placeholder="e.g. New York, NY"
              value={field.value}
              onChange={(val) => setValue("origin", val, { shouldValidate: true, shouldDirty: true })}
              error={errors.origin?.message}
            />
          )}
        />
      </div>

      {/* Destination */}
      <div className="space-y-1">
        <label htmlFor="destination" className="text-sm font-medium text-muted-foreground flex items-center">
          <MapPinIcon className="w-4 h-4 mr-2" /> Destination
        </label>
        <Controller
          name="destination"
          control={control}
          render={({ field }) => (
            <AutocompleteInput
              id="destination"
              placeholder="e.g. Los Angeles, CA"
              value={field.value}
              onChange={(val) => setValue("destination", val, { shouldValidate: true, shouldDirty: true })}
              error={errors.destination?.message}
            />
          )}
        />
      </div>

      {/* Departure Date */}
      <div className="space-y-1">
        <label htmlFor="departureDate" className="text-sm font-medium text-muted-foreground flex items-center">
          <CalendarDaysIcon className="w-4 h-4 mr-2" /> Departure
        </label>
        <Controller
          name="departureDate"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    errors.departureDate && "border-red-500"
                  )}
                >
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CustomDatePicker
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.departureDate && (
          <p className="text-xs text-red-500">{errors.departureDate.message}</p>
        )}
      </div>

      {/* Return Date - Only show for round trip */}
      {tripType === "round_trip" && (
        <div className="space-y-1">
          <label htmlFor="returnDate" className="text-sm font-medium text-muted-foreground flex items-center">
            <CalendarDaysIcon className="w-4 h-4 mr-2" /> Return
          </label>
          <Controller
            name="returnDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CustomDatePicker
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < (departureDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
      )}

      {/* Trip Type */}
      <div className="space-y-1">
        <label htmlFor="tripType" className="text-sm font-medium text-muted-foreground flex items-center">
          <PlaneIcon className="w-4 h-4 mr-2" /> Trip Type
        </label>
        <Controller
          name="tripType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select trip type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round_trip">Round Trip</SelectItem>
                <SelectItem value="one_way">One Way</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Cabin Class */}
      <div className="space-y-1">
        <label htmlFor="cabinClass" className="text-sm font-medium text-muted-foreground">
          Cabin Class
        </label>
        <Controller
          name="cabinClass"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Passengers */}
      <div className="space-y-1">
        <label htmlFor="travellers" className="text-sm font-medium text-muted-foreground flex items-center">
          <UsersIcon className="w-4 h-4 mr-2" /> Passengers
        </label>
        <Controller
          name="travellers"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select passengers" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Passenger" : "Passengers"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.travellers && (
          <p className="text-xs text-red-500">{errors.travellers.message}</p>
        )}
      </div>

      {/* Search Button */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground opacity-0">
          Search
        </label>
        <Button 
          type="submit" 
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching...
            </div>
          ) : (
            <div className="flex items-center">
              <SearchIcon className="w-4 h-4 mr-2" />
              Search Flights
            </div>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="col-span-full">
          <p className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </p>
        </div>
      )}
    </form>
  )
}
