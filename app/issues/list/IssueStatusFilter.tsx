"use client";
import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";

const statuses: { label: string; value?: Status | "ALL" }[] = [
  {
    label: "All",
    value: "ALL", // Special value for "All"
  },
  {
    label: "Open",
    value: "OPEN",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Closed",
    value: "CLOSED",
  },
];

const IssueStatusFilter = () => {
  const router = useRouter();

  console.log("statuses", statuses);
  return (
    <Select.Root
      onValueChange={(status) => {
        console.log("Selected status:", status); // Debugging
        const query = status === "ALL" ? "" : `?status=${status}`;
        router.push("/issues/list" + query);
        console.log("/issues/list" + query);
      }}
    >
      <Select.Trigger placeholder="Filter by status..." />
      <Select.Content>
        {statuses.map((status) => (
          <Select.Item
            key={status.value || status.label}
            value={status.value || "ALL"} // Ensure a non-empty value
          >
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;
