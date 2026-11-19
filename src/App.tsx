import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Logo } from './components/Logo';
import { ErrorState } from './components/ErrorState';

// Divisão de código por rota com React.lazy (RNF-019)
const CreateRoomPage = lazy(() =>
  import('./routes/CreateRoomPage').then((m) => ({ default: m.CreateRoomPage }))
);
const RoomCreatedPage = lazy(() =>
  import('./routes/RoomCreatedPage').then((m) => ({ default: m.RoomCreatedPage }))
);
const RoomPage = lazy(() =>
  import('./routes/RoomPage').then((m) => ({ default: m.RoomPage }))
);

const RouteLoading: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <Logo size="md" />
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<CreateRoomPage />} />
          <Route path="/created/:code" element={<RoomCreatedPage />} />
          <Route path="/r/:code" element={<RoomPage />} />
          <Route path="/404" element={<ErrorState code="ROOM_NOT_FOUND" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
export default App;
