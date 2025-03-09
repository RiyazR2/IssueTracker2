"use client";

import dynamic from "next/dynamic";
import IssueFormSkeleton from "../[id]/edit/loading";
import { Issue } from "@prisma/client";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

interface IssueFormWrapperProps {
  issue: Issue; // Explicitly define the type
}

const IssueFormWrapper = ({ issue }: IssueFormWrapperProps) => {
  return <IssueForm issue={issue} />;
};

export default IssueFormWrapper;
