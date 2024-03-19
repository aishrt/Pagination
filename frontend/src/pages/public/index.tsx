import { Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import Landing from "./landing";
import Header from "../../layout/header";
import NotFound from "./notFound";
import TaskList from "./taskList";
import { CreateTask } from "./createTask";
import UpdateTask from "./updateTask";


const App = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="w-screen h-screen alignmentLogo">Any Image Here</div>
        }
      >
        <Header />
        <Outlet></Outlet>
      </Suspense>
    </div>
  );
};

export const publicRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/not-found", element: <NotFound /> },
      { path: "/create-task", element: <CreateTask   /> },
      { path: "/update-task/:id", element: <UpdateTask /> },
      { path: "/task-list", element: <TaskList /> },
      { path: "*", element: <Navigate to="/not-found" /> },
    ],
  },
];
