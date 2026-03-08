import CalendarSchedule from "@/components/calendar-schedule"


export default function SchedulePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* The Calendar Grid */}
      <CalendarSchedule />
    </div>
  )
}