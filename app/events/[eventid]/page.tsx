// app/events/[eventId]/page.tsx
export default function EventDetailPage({
  params,
}: {
  params: { eventId: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>
      <p>Details for event ID: {params.eventId} will show here.</p>
    </div>
  );
}
