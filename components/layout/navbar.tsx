import { RoleSwitcher } from "@/components/shared/role-switcher";

export function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Warehouse Inventory Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Maker-Checker Workflow Simulation
          </p>
        </div>
        <RoleSwitcher />
      </div>
    </header>
  );
}