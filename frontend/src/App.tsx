import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import RequireAuth from "./pages/RequireAuth";
import Profile from "./pages/Profile";
import CreateShipment from "./pages/CreateShipment";
import EditShipment from "./pages/EditShipment";
import { lazy, Suspense } from "react";
const Analytics = lazy(() => import("./pages/Analytics"));
const Carriers = lazy(() => import("./pages/Carriers"));

const queryClient = new QueryClient();

const App = () => (
  <ApolloProvider client={apolloClient}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/shipments/new" element={<RequireAuth><CreateShipment /></RequireAuth>} />
            <Route path="/shipments/:id/edit" element={<RequireAuth><EditShipment /></RequireAuth>} />
            <Route path="/analytics" element={<RequireAuth><Suspense fallback={<div className='p-8 text-center'>Loading analytics...</div>}><Analytics /></Suspense></RequireAuth>} />
            <Route path="/carriers" element={<RequireAuth><Suspense fallback={<div className='p-8 text-center'>Loading carriers...</div>}><Carriers /></Suspense></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ApolloProvider>
);

export default App;
