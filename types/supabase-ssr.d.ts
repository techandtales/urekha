// Patch for @supabase/ssr@0.9.0 which is missing "types" in package.json
declare module "@supabase/ssr" {
  export * from "@supabase/ssr/dist/main/index";
}
