import { PageSkeleton } from "@/components/dashboard/PageSkeleton";

export default function Loading() {
  return <PageSkeleton variant="cards" rows={6} />;
}
