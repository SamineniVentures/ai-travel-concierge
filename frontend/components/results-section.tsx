"use client"
import { Tab } from "@headlessui/react"
import ResultsGrid from "./results-grid"
import { useSearchStore } from "@/store/search-store"
import { FlightIcon, HotelIcon, ActivityIcon } from "@/components/icons" // Custom icons
import { cn } from "@/lib/utils"

const tabs = [
  { name: "Flights", icon: FlightIcon, type: "flight" as const },
  { name: "Hotels", icon: HotelIcon, type: "hotel" as const },
  { name: "Experiences", icon: ActivityIcon, type: "experience" as const },
]

export default function ResultsSection() {
  const { results, activeTab, setActiveTab } = useSearchStore()

  const filteredResults = results.filter((item) => item.type === activeTab)

  return (
    <div className="w-full">
      <Tab.Group onChange={(index) => setActiveTab(tabs[index].type)}>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary/10 p-1 mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-focus focus:outline-none focus:ring-2",
                  selected
                    ? "bg-background shadow text-primary"
                    : "text-foreground hover:bg-white/[0.12] hover:text-white",
                )
              }
            >
              <span className="flex items-center justify-center gap-2">
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab) => (
            <Tab.Panel key={tab.name}>
              {filteredResults.length > 0 ? (
                <ResultsGrid items={filteredResults} />
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No {tab.name.toLowerCase()} found for your search criteria.</p>
                  <p>Try adjusting your search or check back later!</p>
                </div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
