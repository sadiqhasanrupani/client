import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

export default function RefreshButton(props: { refetch: any; isRefetching: boolean }) {
  return (
    <Button onClick={() => props.refetch()} className="flex gap-2 items-center">
      {props.isRefetching ? <ReloadIcon className="animate-spin" /> : <ReloadIcon />}
      <span>Refresh</span>
    </Button>
  );
}
