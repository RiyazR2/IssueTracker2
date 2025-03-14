// import { prisma } from "@/prisma/client";
// import { Table } from "@radix-ui/themes";
// import { IssueStatusBadge, Link } from "@/app/components/index";
// import IssueActions from "./IssueActions";
// import { Status } from "@prisma/client";

// interface Props {
//   searchParams: { status: Status };
// }

// const IssuePage = async ({ searchParams }: Props) => {
//   console.log("SearchParam.status", searchParams.status);
//   const statuses = Object.values(Status);
//   const status = statuses.includes(searchParams.status)
//     ? searchParams.status
//     : undefined;

//   const issues = await prisma.issue.findMany({
//     where: {
//       status,
//     },
//   });

//   return (
//     <div>
//       <IssueActions />
//       <Table.Root variant="surface">
//         <Table.Header>
//           <Table.Row>
//             <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell className="hidden md:table-cell">
//               Status
//             </Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell className="hidden md:table-cell">
//               Created
//             </Table.ColumnHeaderCell>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           {issues.map((issue) => (
//             <Table.Row key={issue.id}>
//               <Table.Cell>
//                 <Link href={`/issues/${issue.id}`}>{issue.title}</Link>

//                 <div className="block md:hidden">
//                   <IssueStatusBadge status={issue.status} />
//                 </div>
//               </Table.Cell>
//               <Table.Cell className="hidden md:table-cell">
//                 <IssueStatusBadge status={issue.status} />
//               </Table.Cell>
//               <Table.Cell className="hidden md:table-cell">
//                 {issue.createdAt.toDateString()}
//               </Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table.Root>
//     </div>
//   );
// };

// export const dynamic = "force-dynamic";

// export default IssuePage;

import { prisma } from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/components/index";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import NextLink from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
  searchParams: { status: Status | "ALL"; orderBy: keyof Issue };
}

const IssuesPage = async ({ searchParams }: Props) => {
  // Log the resolved searchParams object
  console.log("SearchParams:", searchParams);

  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  // If status is "ALL" or undefined, return all issues without filtering
  const issues = await prisma.issue.findMany({
    where: {
      status:
        searchParams.status === "ALL" || !searchParams.status
          ? undefined
          : searchParams.status,
    },
  });
  console.log("Issues from DB:", issues);
  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell key={column.value}>
                <NextLink
                  href={{
                    query: { ...searchParams, orderBy: column.value },
                  }}
                >
                  {column.label}
                </NextLink>
                {column.value === searchParams.orderBy && (
                  <ArrowUpIcon className="inline" />
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default IssuesPage;
