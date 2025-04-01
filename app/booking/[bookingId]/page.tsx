// app/booking/[bookingId]/page.tsx
export default function BookingConfirmationPage({
  params,
}: {
  params: { bookingId: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Booking Confirmation</h1>
      <p>
        Your ticket/confirmation for booking ID: {params.bookingId} will show
        here.
      </p>
    </div>
  );
}
