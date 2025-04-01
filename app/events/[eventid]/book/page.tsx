// app/events/[eventId]/book/page.tsx
export default function BookingPage({
  params,
}: {
  params: { eventId: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Book Seats</h1>
      <p>Seat selection for event ID: {params.eventId} will be here.</p>
    </div>
  );
}
