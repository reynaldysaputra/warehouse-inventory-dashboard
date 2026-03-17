"use client";

import { toast } from "sonner";
import { useInventoryStore } from "@/store/inventory-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DiffView } from "./diff-view";
import { formatDateTime } from "@/lib/helpers";

export function ApprovalTable() {
  const { requests, approveRequest, rejectRequest, isLoading } = useInventoryStore();

  const pendingRequests = requests.filter((req) => req.status === "pending");

  const handleApprove = async (id: string) => {
    await approveRequest(id);
    toast.success("Request approved successfully.");
  };

  const handleReject = async (id: string) => {
    await rejectRequest(id);
    toast.success("Request rejected.");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Approval Dashboard</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review and approve/reject pending stock change requests.
        </p>
      </CardHeader>

      <CardContent>
        {pendingRequests.length === 0 ? (
          <EmptyState
            title="No pending requests"
            description="All stock change requests have been reviewed. New requests from staff will appear here."
          />
        ) : (
          <div className="space-y-5">
            {pendingRequests.map((req) => (
              <div key={req.id} className="rounded-xl border p-5 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="uppercase">
                        {req.type}
                      </Badge>
                      <Badge variant="outline">Pending</Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Submitted: {formatDateTime(req.createdAt)}</p>
                      <p>
                        Item:{" "}
                        {req.proposedData?.productName ||
                          req.originalData?.productName ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(req.id)}
                      disabled={isLoading}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(req.id)}
                      disabled={isLoading}
                    >
                      Reject
                    </Button>
                  </div>
                </div>

                <DiffView request={req} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}