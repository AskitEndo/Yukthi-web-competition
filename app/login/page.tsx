// app/login/page.tsx
import AuthForm from "@/components/AuthForm"; // Adjust path if needed
export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Login / Register</h1>
      <AuthForm />
    </div>
  );
}
