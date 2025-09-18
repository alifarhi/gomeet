import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/models/meetings/ui/views/meetings_view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MeetingListHeader } from "@/models/meetings/ui/components/meeting-list-header";
import { SearchParams } from "nuqs/server";
import { LoadSearchParams } from "@/models/meetings/params";


interface Props{
  searchParams:Promise<SearchParams>;
}

const Page = async({searchParams}:Props) => {
  const filters =await LoadSearchParams(searchParams);
  const session = await auth.api.getSession({
          headers: await headers(),
        });
        if(!session){
          redirect("/sign-in")
        }
    const queryClient=getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({
          ...filters,
        })
    );
  return (
    <>
    <MeetingListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)} >
        <Suspense fallback={<MeetingsViewLoading/>} >
            <ErrorBoundary fallback={<MeetingsViewError/>} >
                 <MeetingsView/>
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
    </>
  );
};
 export default Page;


 