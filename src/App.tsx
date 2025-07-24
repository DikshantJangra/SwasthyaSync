import { BrowserRouter, Route, Routes } from "react-router-dom"
import Index from "./pages/Index"
import Login from "./features/Login"
import SignUp from "./features/SignUp"
import AppLayout from "./components/app/AppLayout"

const routeList = [
  { path: '/', element: <Index />, protected: false, },
  { path: '/Login', element: <Login />, protected: false, },
  { path: '/SignUp', element: <SignUp />, protected: false, },
  { path: '/dashboard', element: <AppLayout />, protected: false, },
]

const App = ()=>{
  return(
    <>
    <BrowserRouter>
      <Routes>
        {routeList.map(({path, element, protected: isProtected})=>(
          <Route
            key={path}
            path={path}
            element={!isProtected && element}
          />
          ))}
      </Routes>
    </BrowserRouter>
    </>
  )
}
export default App