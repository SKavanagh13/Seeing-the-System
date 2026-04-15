import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './layout/AppShell'
import { ChapterPage } from './pages/ChapterPage'
import { EpiloguePage } from './pages/EpiloguePage'
import { GlossaryPage } from './pages/GlossaryPage'
import { HomePage } from './pages/HomePage'
import { ToolkitPage } from './pages/ToolkitPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="annual-clock" element={<ChapterPage chapterId="annual-clock" />} />
        <Route
          path="trajectory-clock"
          element={<ChapterPage chapterId="trajectory-clock" />}
        />
        <Route
          path="generational-clock"
          element={<ChapterPage chapterId="generational-clock" />}
        />
        <Route
          path="toolkit"
          element={<ToolkitPage />}
        />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route path="epilogue" element={<EpiloguePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
