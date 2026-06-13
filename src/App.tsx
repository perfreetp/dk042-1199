import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import Dashboard from "@/pages/Dashboard";
import RequirementList from "@/pages/RequirementList";
import RequirementDetail from "@/pages/RequirementDetail";
import Evaluation from "@/pages/Evaluation";
import RdCommunication from "@/pages/RdCommunication";
import CustomerFollowup from "@/pages/CustomerFollowup";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/requirements" element={<RequirementList />} />
          <Route path="/requirements/:id" element={<RequirementDetail />} />
          <Route path="/evaluation/:id" element={<Evaluation />} />
          <Route path="/rd/:id" element={<RdCommunication />} />
          <Route path="/followup/:id" element={<CustomerFollowup />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
