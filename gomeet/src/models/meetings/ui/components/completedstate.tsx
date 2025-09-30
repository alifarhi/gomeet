import React from "react";
import { MeetingGetOne } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  BookOpenTextIcon,
  ClockFadingIcon,
  FileVideoIcon,
  SparklesIcon,
} from "lucide-react";
import { ScrollBar } from "@/components/ui/scroll-area";
import { GeneratedAvatar } from "@/components/generator-avatar";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import Markdown from "react-markdown";

interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none bg-background data-[state=active]
                    :shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary
                    data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none bg-background data-[state=active]
                    :shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary
                    data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileVideoIcon />
                Recording
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="recording">
          <div className="bg-white rounded-lg border px-4 py-5">
            <video
              src={data.recordingurl!}
              className="w-full rounded-lg"
            ></video>
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 flex flex-col gap-y-5 col-span-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              <div className="flex gap-x-2 items-center">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-5"
                  />
                  {data.agent.name}
                </Link>{" "}
                <p>{data.StartedAt ? format(data.StartedAt, "PPP") : ""}</p>
              </div>
              <div className="flex gap-x-2 items-center">
                <SparklesIcon className="size-4" />
                <p>General Summary</p>
              </div>
              <Badge
                className="flex items-center gap-x-2 [&>svg]:size-4"
                variant="outline"
              >
                <ClockFadingIcon className="text-blue-700" />
                {data.duration ? formatDuration(data.duration) : "no duration"}
              </Badge>
              <div>
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 className="text-2xl font-medium mb-6" {...props} />
                    ),
                    h2: (props) => (
                      <h2 className="text-xl font-medium mb-6" {...props} />
                    ),
                    h3: (props) => (
                      <h3 className="text-lg font-medium mb-6" {...props} />
                    ),
                    h4: (props) => (
                      <h4 className="text-base font-medium mb-6" {...props} />
                    ),
                     p: (props) => (
                      <p className="mb-6 leading-relaxed" {...props} />
                    ),
                     ul: (props) => (
                      <ul className="list-disc list-inside mb-6" {...props} />
                    ),
                     li: (props) => (
                      <li className="mb-1" {...props} />
                    ),
                     ol: (props) => (
                      <ol className="list-inside list-decimal mb-6" {...props} />
                    ),
                     strong: (props) => (
                      <strong className="font-semibold" {...props} />
                    ),
                     code: (props) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded" {...props} />
                    ),
                     blockquote: (props) => (
                      <blockquote className="border-l-4 pl-4 italic my-4" {...props} />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
