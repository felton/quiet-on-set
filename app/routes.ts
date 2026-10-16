import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("docs/call-sheet", "routes/docs/call-sheet.tsx"),
] satisfies RouteConfig;
