import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./features/Login";
import SignUp from "./features/SignUp";
import Dashboard from "./pages/app/Dashboard";
import AppLayout from "./components/app/AppLayout";

const routeList = [
  { path: '/', element: <Index />, protected: false },
  { path: '/login', element: <Login />, protected: false },
  { path: '/signup', element: <SignUp />, protected: false },
  { path: '/dashboard', element: <Dashboard />, protected: true },
  // Add more protected routes here later
];

const App = () => {
  const publicRoutes = routeList.filter(route => !route.protected);
  const protectedRoutes = routeList.filter(route => route.protected);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Protected Routes (under AppLayout) */}
        <Route path="/" element={<AppLayout />}>
          {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path.slice(1)} element={element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
