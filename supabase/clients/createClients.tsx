import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function createServerClient() {
  return createServerComponentClient({ cookies });
}

export function createClient() {
  return createClientComponentClient();
}
