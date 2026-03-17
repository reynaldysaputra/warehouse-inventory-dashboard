import { StockRequest } from "@/types/inventory";
import { getChangedFields, formatCurrency } from "@/lib/helpers";

type Props = {
  request: StockRequest;
};

export function DiffView({ request }: Props) {
  if (request.type === "create") {
    return (
      <div className="rounded-lg border bg-emerald-50 p-4">
        <p className="mb-2 text-sm font-semibold text-emerald-700">Pending Creation</p>
        <div className="grid gap-2 text-sm">
          <p><span className="font-medium">SKU:</span> {request.proposedData?.sku}</p>
          <p><span className="font-medium">Product:</span> {request.proposedData?.productName}</p>
          <p><span className="font-medium">Category:</span> {request.proposedData?.category}</p>
          <p><span className="font-medium">Price:</span> {formatCurrency(request.proposedData?.price || 0)}</p>
          <p><span className="font-medium">Quantity:</span> {request.proposedData?.quantity}</p>
          <p><span className="font-medium">Supplier:</span> {request.proposedData?.supplier}</p>
        </div>
      </div>
    );
  }

  if (request.type === "delete") {
    return (
      <div className="rounded-lg border bg-red-50 p-4">
        <p className="mb-2 text-sm font-semibold text-red-700">Pending Deletion</p>
        <div className="grid gap-2 text-sm">
          <p><span className="font-medium">SKU:</span> {request.originalData?.sku}</p>
          <p><span className="font-medium">Product:</span> {request.originalData?.productName}</p>
          <p><span className="font-medium">Quantity:</span> {request.originalData?.quantity}</p>
        </div>
      </div>
    );
  }

  const changedFields = getChangedFields(request.originalData, request.proposedData);

  return (
    <div className="rounded-lg border p-4">
      <p className="mb-3 text-sm font-semibold">Field Changes</p>

      {changedFields.length === 0 ? (
        <p className="text-sm text-muted-foreground">No changes detected.</p>
      ) : (
        <div className="space-y-3">
          {changedFields.map((change) => (
            <div key={String(change.field)} className="rounded-md bg-slate-50 p-3">
              <p className="mb-2 text-sm font-medium capitalize">{String(change.field)}</p>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm">
                  <p className="mb-1 font-medium text-red-700">Original</p>
                  <p>
                    {change.field === "price"
                      ? formatCurrency(Number(change.oldValue))
                      : String(change.oldValue)}
                  </p>
                </div>

                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm">
                  <p className="mb-1 font-medium text-emerald-700">New</p>
                  <p>
                    {change.field === "price"
                      ? formatCurrency(Number(change.newValue))
                      : String(change.newValue)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}