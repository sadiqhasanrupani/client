import { queryClient } from "@/http";
import { verifyToken } from "@/http/get";
import { getCookie } from "@/lib/utils";

export async function loader() {
  const token = getCookie("authToken");

  if (!token) {
    return null;
  }

  return queryClient.fetchQuery<any, any, any>({
    queryKey: ["verify-token", { navigate: "Something" }],
    queryFn: verifyToken,
    retry: 2,
  });
}
