// "use client";

// import React from "react";
// import { prisma } from "@/prisma/client";
// import { notFound } from "next/navigation";
// import dynamic from "next/dynamic";
// import IssueFormSkeleton from "./loading";

// const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
//   ssr: false,
//   loading: () => <IssueFormSkeleton />,
// });

// interface Props {
//   params: { id: string };
// }

// const EditIssuePage = async ({ params }: Props) => {
//   const issue = await prisma.issue.findUnique({
//     where: { id: parseInt(params.id) },
//   });

//   if (!issue) notFound();

//   return (
//     <div>
//       <IssueForm issue={issue} />
//     </div>
//   );
// };

// export default EditIssuePage;

// import React from 'react'
// import {prisma} from '@/prisma/client'
// import { notFound } from 'next/navigation'
// import dynamic from 'next/dynamic';
// import IssueFormSkeleton from './loading';

// const IssueForm = dynamic(
//   () => import('@/app/issues/_components/IssueForm'),
//   {
//     ssr: false,
//     loading: () => <IssueFormSkeleton />
//   }
// )

// interface Props {
//   params: { id: string }
// }

// const EditIssuePage = async ({ params }: Props) => {
//   const issue = await prisma.issue.findUnique({
//     where: { id: parseInt(params.id)}
//   });

//   if (!issue) notFound();

//   return (
//     <IssueForm issue={issue} />
//   )
// }

// export default EditIssuePage

import React from "react";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import IssueFormWrapper from "../../_components/IssueFormWrapper";

interface Props {
  params: { id: string };
}

const EditIssuePage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) notFound();

  return <IssueFormWrapper issue={issue} />; // Use the wrapper here
};

export default EditIssuePage;
