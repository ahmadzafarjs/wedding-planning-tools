import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import SignupPage from "./pages/SignupPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CheckListPage from "./pages/ChecklistPage";
import GuestPage from "./pages/GuestPage";
import BudgetPage from "./pages/BudgetPage";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./ui/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthProvider />}>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="checklist" element={<CheckListPage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="guests" element={<GuestPage />} />
            </Route>
          </Route>
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
