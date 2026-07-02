import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    // This creates a full-screen dark background without any headers or footers
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Outlet /> {/* The Login or SignUp page will render right here */}
    </div>
  );
}