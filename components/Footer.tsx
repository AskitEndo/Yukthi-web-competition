// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} SeeVent. All rights reserved.
      </div>
    </footer>
  );
}
