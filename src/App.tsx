import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './layout/AppShell'
import { ChapterPage } from './pages/ChapterPage'
import { GlossaryPage } from './pages/GlossaryPage'
import { HomePage } from './pages/HomePage'

type PlaceholderPageProps = {
  eyebrow: string
  title: string
  description: string
}

function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="page">
      <p className="page__eyebrow">{eyebrow}</p>
      <h1 className="page__title">{title}</h1>
      <p className="page__description">{description}</p>
    </section>
  )
}

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
          element={
            <PlaceholderPage
              eyebrow="Toolkit"
              title="Toolkit placeholder"
              description="PR1 creates the toolkit route only. Table behavior and data presentation are intentionally out of scope."
            />
          }
        />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route
          path="epilogue"
          element={
            <PlaceholderPage
              eyebrow="Epilogue"
              title="Epilogue placeholder"
              description="This route is present so the application shell is complete, but the final epilogue experience is intentionally deferred."
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
