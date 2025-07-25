import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { ReactElement } from 'react';
import Index from "./pages/Index";
import Login from "./features/Login";
import SignUp from "./features/SignUp";
import Dashboard from "./pages/app/Dashboard";
import AppLayout from "./components/app/AppLayout";
import Hydration from "./pages/app/Hydration";
import HealthVault from "./pages/app/HealthVault";
import DoctorMeetups from "./pages/app/DoctorMeetups";

import ProtectedRoute from './features/ProtectedRoute';

type RouteDef = { path: string; element: ReactElement; protected: boolean };

const routeList: RouteDef[] = [
  { path: '/', element: <Index />, protected: false },
  { path: '/login', element: <Login />, protected: false },
  { path: '/signup', element: <SignUp />, protected: false },
  { path: '/dashboard', element: <Dashboard />, protected: true },
  { path: '/hydration', element: <Hydration />, protected: true },
  { path: '/health-vault', element: <HealthVault />, protected: true },
  { path: '/doctor-meetup', element: <DoctorMeetups />, protected: true },
];

const App = () => {
  const publicRoutes = routeList.filter((route: RouteDef) => !route.protected);
  const protectedRoutes = routeList.filter((route: RouteDef) => route.protected);

  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map(({ path, element }: RouteDef) => (
          <Route key={path} path={path} element={element} />
        ))}

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            {protectedRoutes.map(({ path, element }: RouteDef) => (
              <Route key={path} path={path.slice(1)} element={element} />
            ))}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;