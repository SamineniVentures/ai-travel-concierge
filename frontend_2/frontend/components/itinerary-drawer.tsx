"use client"
import { Fragment } from "react"
import { Dialog, Transition, Disclosure } from "@headlessui/react"
import { XIcon, ChevronUpIcon, Trash2Icon } from "lucide-react"
import { useItineraryStore } from "@/store/itinerary-store"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import type { Listing } from "@/types"

export default function ItineraryDrawer() {
  const { items, removeItem, isDrawerOpen, toggleDrawer } = useItineraryStore()

  const groupedItems: { [key: string]: Listing[] } = items.reduce(
    (acc, item) => {
      const dateKey = item.date ? format(parseISO(item.date), "PPP") : "Unscheduled"
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(item)
      return acc
    },
    {} as { [key: string]: Listing[] },
  )

  return (
    <Transition.Root show={isDrawerOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={() => toggleDrawer(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-background shadow-xl">
                    <div className="px-4 py-6 sm:px-6 bg-primary text-primary-foreground">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-semibold">Your Itinerary</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md text-primary-foreground hover:text-primary-foreground/80 focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => toggleDrawer(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6 py-6">
                      {items.length === 0 ? (
                        <p className="text-center text-muted-foreground">Your itinerary is empty. Add some items!</p>
                      ) : (
                        <div className="space-y-4">
                          {Object.entries(groupedItems).map(([date, dayItems]) => (
                            <Disclosure key={date} defaultOpen>
                              {({ open }) => (
                                <>
                                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-muted px-4 py-2 text-left text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                                    <span>
                                      {date} ({dayItems.length} items)
                                    </span>
                                    <ChevronUpIcon
                                      className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-primary`}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted-foreground space-y-3">
                                    {dayItems.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-start gap-3 p-2 border rounded-md bg-card"
                                      >
                                        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                          <Image
                                            src={item.imageUrl || "https://via.placeholder.com/100"}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="flex-grow">
                                          <h4 className="font-medium text-foreground">{item.name}</h4>
                                          <p className="text-xs">${item.price.toFixed(2)}</p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-destructive hover:text-destructive/80"
                                          onClick={() => removeItem(item.id)}
                                        >
                                          <Trash2Icon className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          ))}
                        </div>
                      )}
                    </div>
                    {items.length > 0 && (
                      <div className="border-t border-border px-4 py-4 sm:px-6">
                        <Button className="w-full" onClick={() => alert("Proceed to checkout (not implemented)")}>
                          Proceed to Checkout
                        </Button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
