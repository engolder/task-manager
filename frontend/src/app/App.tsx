import type { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HistoryPage } from "../pages/HistoryPage";
import { TasksPage } from "../pages/TasksPage";
import BottomNavigation from '../shared/ui/BottomNavigation';
import { QueryProvider } from './providers/QueryProvider';
import * as styles from './app.css';

export const App: FC = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <main className={styles.main}>
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
