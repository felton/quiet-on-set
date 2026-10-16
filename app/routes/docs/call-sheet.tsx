import type { Route } from "./+types/call-sheet";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Call Sheet: Getting started · quiet on set" }];
}

export default function CallSheet() {
  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>Call Sheet</h1>
    </main>
  );
}
