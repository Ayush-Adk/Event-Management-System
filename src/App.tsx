import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { Auth } from './components/Auth';
import { EventForm } from './components/EventForm';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<Layout />}>
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/calendar" element={
            <PrivateRoute>
              <CalendarView />
            </PrivateRoute>
          } />
          <Route path="/create" element={
            <PrivateRoute>
              <EventForm />
            </PrivateRoute>
          } />
          <Route path="/edit/:id" element={
            <PrivateRoute>
              <EventForm editMode />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;