export default function ResultsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Search Results</h2>
        <p className="text-muted-foreground">Showing 0 results</p>
      </div>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Start your search to see amazing travel options!</p>
        {/* Placeholder for actual results or loading states */}
      </div>
    </div>
  )
}
