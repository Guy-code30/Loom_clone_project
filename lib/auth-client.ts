import { adminClient, organizationClient, twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
// });

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => localStorage.getItem("bearer_token") || "",
    },
    mode: "cors",
  },
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        console.log("Two factor redirect");
      },
    }),
    organizationClient(),
    adminClient(),
  ],
});
