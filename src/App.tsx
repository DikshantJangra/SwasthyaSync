import { BrowserRouter, Route, Routes } from "react-router-dom"
import Index from "./pages/Index"

const routeList = [
  { path: '/', element: <Index />, protected: false, }
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