import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./app/testlogin/page";
import Livepage from "./app/live/Livepage";
import Psvpage from "./app/live/[id]/psv/Psvpage";

export default function App() {
  const location = useLocation();
  console.log(location.pathname, "surya");
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/live" element={<Livepage />} />
      <Route path="/live/:id/psv" element={<Psvpage />} />
      {/* <Route path="/testlogin" element={<Logout />} />
      <Route path="/live/:id/:psv" element={<Psv />} /> */}
      {/* <Route path="/live" element={< />} />
      <Route path="/settings" element={<Settings />} /> */}
    </Routes>
  );
}
