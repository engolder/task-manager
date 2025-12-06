import type { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HistoryPage } from "../pages/HistoryPage";
import { TasksPage } from "../pages/TasksPage";
import BottomNavigation from '../shared/ui/BottomNavigation';
import { QueryProvider } from './providers/QueryProvider';

export const App: FC = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<TasksPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
          <BottomNavigation />
        </main>
      </BrowserRouter>
    </QueryProvider>
  )
}

export default App
