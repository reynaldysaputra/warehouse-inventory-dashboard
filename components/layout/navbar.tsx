import { RoleSwitcher } from "@/components/shared/role-switcher";
import { Warehouse } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border bg-slate-50 p-2">
            <Warehouse className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Warehouse Inventory Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Maker-Checker Workflow Simulation
            </p>
          </div>
        </div>

        <RoleSwitcher />
      </div>
    </header>
  );
}