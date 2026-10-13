import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Quiet on set" }, { name: "description", content: "Places, everyone" }];
}

export default function Home() {
  return <Welcome />;
}
