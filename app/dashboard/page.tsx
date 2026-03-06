import { UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <nav className="flex justify-between p-4 border-b">
      <span>My App</span>
      {/* This renders the user's avatar and the logout menu */}
      <UserButton showName />
    </nav>
  );
}