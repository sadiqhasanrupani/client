import { postRequest } from "@/lib/utils";

export async function verifyToken(token: string) {
  return postRequest("/verify/token", { token });
}
