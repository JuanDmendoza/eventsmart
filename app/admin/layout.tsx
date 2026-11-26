import type { Metadata } from "next";
import { AdminSidebar, AdminTopBar } from "./_components/nav";

export const metadata: Metadata = {
  title: "Panel de Administración · EventSmart",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-1 bg-slate-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-6 py-8 max-sm:px-4">{children}</main>
      </div>
    </div>
  );
}
