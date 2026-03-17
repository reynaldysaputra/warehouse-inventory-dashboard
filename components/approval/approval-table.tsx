"use client";

import { useInventoryStore } from "@/store/inventory-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ApprovalTable() {
  const { requests, approveRequest, rejectRequest, isLoading } = useInventoryStore();

  const pendingRequests = requests.filter((req) => req.status === "pending");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Dashboard (Officer)</CardTitle>
      </CardHeader>

      <CardContent>
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="rounded-lg border p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold uppercase">{req.type} Request</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(req.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveRequest(req.id)}
                      disabled={isLoading}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectRequest(req.id)}
                      disabled={isLoading}
                    >
                      Reject
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="mb-2 font-medium">Original Value</p>
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(req.originalData, null, 2) || "N/A"}
                    </pre>
                  </div>

                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="mb-2 font-medium">Proposed Value</p>
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(req.proposedData, null, 2) || "N/A"}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}