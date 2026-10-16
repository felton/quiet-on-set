import { Link } from "react-router";

import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Quiet on set" }, { name: "description", content: "Places, everyone" }];
}

export default function Home() {
  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>Places, everyone.</h1>
      <Link to="/docs/call-sheet">Call Sheet</Link>
    </main>
  );
}
