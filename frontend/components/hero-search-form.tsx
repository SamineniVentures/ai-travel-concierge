"use client"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { MapPinIcon, CalendarDaysIcon, UsersIcon, SearchIcon, PlaneTakeoffIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/utils/cn" // Assuming you moved cn to frontend/utils/cn.ts

const searchSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().min(1, "Destination is required"),
  departureDate: z.date().optional(),
  returnDate: z.date().optional(),
  travellers: z.string().min(1, "Number of travellers is required"),
})

type SearchFormValues = z.infer<typeof searchSchema>

export default function HeroSearchForm() {
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
    },
  })

  // const departureDate = watch("departureDate") // Not used, can be removed if not needed

  const onSubmit: SubmitHandler<SearchFormValues> = (data) => {
    const params = {
      ...data,
      departureDate: data.departureDate ? format(data.departureDate, "yyyy-MM-dd") : undefined,
      returnDate: data.returnDate ? format(data.returnDate, "yyyy-MM-dd") : undefined,
    }
    console.log("Search Submitted:", params)
    // Here you would typically trigger an API call or update state
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-background p-4 sm:p-6 rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-start"
    >
      <div className="space-y-1">
        <label htmlFor="origin" className="text-sm font-medium text-muted-foreground flex items-center">
          <PlaneTakeoffIcon className="w-4 h-4 mr-2" /> Origin
        </label>
        <Controller
          name="origin"
          control={control}
          render={({ field }) => (
            <Input
              id="origin"
              placeholder="e.g. New York, NY"
              {...field}
              value={field.value || ""} // Ensure value is controlled
              onChange={(e) => setValue("origin", e.target.value, { shouldValidate: true, shouldDirty: true })}
              className={cn(errors.origin && "border-red-500")}
            />
          )}
        />
        {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="destination" className="text-sm font-medium text-muted-foreground flex items-center">
          <MapPinIcon className="w-4 h-4 mr-2" /> Destination
        </label>
        <Controller
          name="destination"
          control={control}
          render={({ field }) => (
            <Input
              id="destination"
              placeholder="e.g. Los Angeles, CA"
              {...field}
              value={field.value || ""} // Ensure value is controlled
              onChange={(e) => setValue("destination", e.target.value, { shouldValidate: true, shouldDirty: true })}
              className={cn(errors.destination && "border-red-500")}
            />
          )}
        />
        {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination.message}</p>}
      </div>
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
                  className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                >
                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {/* Replace with actual shadcn/ui Calendar component */}
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Calendar component would go here.</p>
                  <Input type="date" onChange={(e) => field.onChange(new Date(e.target.value))} />
                </div>
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
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
                  className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                >
                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {/* Replace with actual shadcn/ui Calendar component */}
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Calendar component would go here.</p>
                  <Input type="date" onChange={(e) => field.onChange(new Date(e.target.value))} />
                </div>
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="travellers" className="text-sm font-medium text-muted-foreground flex items-center">
          <UsersIcon className="w-4 h-4 mr-2" /> Travellers
        </label>
        <Controller
          name="travellers"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="travellers">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num} Traveller{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.travellers && <p className="text-xs text-red-500 mt-1">{errors.travellers.message}</p>}
      </div>
      <Button type="submit" className="w-full lg:w-auto h-10 px-6 self-end mt-5 md:mt-0">
        <SearchIcon className="w-5 h-5 mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  )
}
