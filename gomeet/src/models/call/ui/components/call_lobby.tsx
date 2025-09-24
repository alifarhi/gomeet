import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-clients";
import { generateAvatarUi } from "@/lib/avatar";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import Link from "next/link";

interface Props {
  onJoin: () => void;
}

const DisabeldVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user.name ??
            generateAvatarUi({
              seed: data?.user.name ?? "",
              variant: "initials",
            }),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserPermission = () => {
  return (
    <p className="text-sm">
      Please grantyour browser acess to your camera and microphone
    </p>
  );
};

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="flex flex-col items-entre justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div>
            <h6 className="text-lg font-medium ">Ready to Join??</h6>
            <p className="text-sm">Set up your Call before Joining</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission
                ? DisabeldVideoPreview
                : AllowBrowserPermission
            }
          />
          <div className="flex gap-x-2">
              <ToggleAudioPreviewButton />
              <ToggleVideoPreviewButton />
          </div>
          <div className="flex gap-x-2 justify-between w-full">
               <Button asChild variant="ghost" >
                <Link href={"/meetings"} >
                Cancel
                </Link>
               </Button>
               <Button onClick={onJoin}>
                 Join Call
               </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
