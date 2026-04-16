export const siteTitle = 'The Three Clocks of Public Finance'
export const siteSubtitle = 'What every official needs to know — and few do'

const routeTitles: Record<string, string> = {
  '/': siteTitle,
  '/annual-clock': `The Annual Clock | ${siteTitle}`,
  '/trajectory-clock': `The Trajectory Clock | ${siteTitle}`,
  '/generational-clock': `The Generational Clock | ${siteTitle}`,
  '/toolkit': `Critical Questions | ${siteTitle}`,
  '/glossary': `Glossary | ${siteTitle}`,
  '/epilogue': `Epilogue | ${siteTitle}`,
}

export function getDocumentTitle(pathname: string) {
  return routeTitles[pathname] ?? siteTitle
}
