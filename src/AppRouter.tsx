import { createBrowserRouter, RouterProvider, RouteObject } from "react-router";
import { Suspense, lazy, useMemo } from "react";
import { useAuth } from "./contexts/auth.context";

const Home = lazy(() => import("./app/Home"));
const Crew = lazy(() => import("./app/Crew"));
const Individual = lazy(() => import("./app/Individual"));
const CrewInfo = lazy(() => import("./app/CrewInfo"));
const Resume = lazy(() => import("./app/Resume"));
const Signup = lazy(() => import("./app/Signup"));
const Scrap = lazy(() => import("./app/Scrap"));
const NotFound = lazy(() => import("./app/NotFound"));
const AppLayout = lazy(() => import("./components/features/AppLayout"));

export default function AppRouter() {
  const { user } = useAuth();
  const children = useMemo<RouteObject[]>(() => {
    const SharedChildren: RouteObject[] = [
      { index: true, Component: Home },
      { path: "crew", Component: Crew },
      { path: "individual", Component: Individual },
    ];

    if (user) {
      SharedChildren.push(
        { path: "crewinfo", element: <CrewInfo user={user} /> },
        { path: "resume", element: <Resume user={user} /> },
        { path: "scrap", element: <Scrap user={user} /> }
      );
    }

    const routes: RouteObject[] = [
      {
        path: "/",
        element: <AppLayout user={user} />,
        children: SharedChildren,
      },
      { path: "*", Component: NotFound }, //? 임시방편
    ];

    if (!user) {
      routes.push({ path: "signup", Component: Signup });
    }
    return routes;
  }, [user]);

  const router = createBrowserRouter([
    {
      // path: "/",
      children,
    },
  ]);

  return (
    <Suspense fallback={<h1>App is Loading...</h1>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
