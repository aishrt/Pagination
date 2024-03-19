import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import { publicRoutes } from "../pages/public";
import NotFound from "../pages/public/notFound";
import storage from "../utils/storage";

export const AppRoutes = () => {

  const commonRoutes = [
    { path: "/", element: <NotFound /> },
    { path: "*", element: <Navigate to="/" /> },
  ]; // These are routes which are accessible  , with or without token

  let allRoutes: RouteObject[] = [];

  allRoutes = [...publicRoutes];

  allRoutes = [...allRoutes, ...commonRoutes];
  const element = useRoutes(allRoutes);

  return <>{element}</>;
};
