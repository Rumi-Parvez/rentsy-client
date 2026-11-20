import { PageSkeleton } from "@/components/dashboard/PageSkeleton";

export default function Loading() {
  return <PageSkeleton variant="table" rows={8} />;
}
