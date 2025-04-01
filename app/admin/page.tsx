// app/admin/page.tsx
import CreateEventForm from "@/components/CreateEventForm"; // Adjust path if needed
export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <p>Admin content will be here.</p>
      <CreateEventForm />
    </div>
  );
}
