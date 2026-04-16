import { useState } from 'react'

import toolkitSource from '../../content/toolkit.json'

import { GlossaryTerm } from '../components/GlossaryTerm'

type Availability = 'green' | 'yellow' | 'red'

type ToolkitRow = {
  question: string
  whatToLookFor: string
  whereToFind: string
  availability: Availability
  glossaryTerms: string[]
}

type ToolkitQuestion = {
  keyQuestion: string
  note?: string
  rows: ToolkitRow[]
}

type ToolkitSection = {
  clock: 'annual' | 'trajectory' | 'generational'
  clockLabel: string
  clockColor: string
  questions: ToolkitQuestion[]
}

type ToolkitDocument = {
  sections: ToolkitSection[]
}

const toolkit = toolkitSource as ToolkitDocument

const availabilityOrder: Availability[] = ['green', 'yellow', 'red']

const availabilityCopy: Record<
  Availability,
  { label: string; detail: string }
> = {
  green: {
    label: 'Green',
    detail: 'Commonly available',
  },
  yellow: {
    label: 'Yellow',
    detail: 'Needs staff follow-up',
  },
  red: {
    label: 'Red',
    detail: 'Usually harder to access',
  },
}

export function ToolkitPage() {
  return (
    <section className="page toolkit-page">
      <header className="toolkit-page__hero">
        <h1 className="page__title toolkit-page__title">Critical Questions</h1>
        <p className="page__description toolkit-page__description">
          This is a field guide for better questions: what to ask, what to look
          for, and where a first answer may already be waiting. Each table
          begins with the questions most likely to be within reach. These are
          the “green” items. You can also see other items, which are not so
          easily available in all governments. As a steward, you can advocate
          for your government to produce these.
        </p>
      </header>

      <div className="toolkit-page__legend" aria-label="Availability legend">
        {availabilityOrder.map((availability) => (
          <div
            key={availability}
            className={`toolkit-legend__item toolkit-legend__item--${availability}`}
          >
            <span
              className={`toolkit-legend__dot toolkit-legend__dot--${availability}`}
              aria-hidden="true"
            />
            <div>
              <p className="toolkit-legend__label">
                {availabilityCopy[availability].label}
              </p>
              <p className="toolkit-legend__detail">
                {availabilityCopy[availability].detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="toolkit-page__sections">
        {toolkit.sections.map((section) => (
          <section
            key={section.clock}
            className={`toolkit-section toolkit-section--${section.clock}`}
            aria-labelledby={`toolkit-section-${section.clock}`}
          >
            <div className="toolkit-section__header">
              <h2
                id={`toolkit-section-${section.clock}`}
                className="toolkit-section__title"
              >
                {section.clockLabel}
              </h2>
            </div>

            <div className="toolkit-section__tables">
              {section.questions.map((question) => (
                <ToolkitQuestionTable
                  key={`${section.clock}-${question.keyQuestion}`}
                  clock={section.clock}
                  question={question}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

type ToolkitQuestionTableProps = {
  clock: ToolkitSection['clock']
  question: ToolkitQuestion
}

function ToolkitQuestionTable({
  clock,
  question,
}: ToolkitQuestionTableProps) {
  const [showAll, setShowAll] = useState(false)
  const groupedRows = groupRowsByAvailability(question.rows)
  const greenRows = groupedRows.green
  const hiddenRows = [...groupedRows.yellow, ...groupedRows.red]
  const visibleRows = showAll ? [...greenRows, ...hiddenRows] : greenRows
  const hasAdditionalRows = hiddenRows.length > 0
  const tableId = createSlug(`${clock}-${question.keyQuestion}`)

  return (
    <article className="toolkit-table-card">
      <div className="toolkit-table-card__header">
        <div className="toolkit-table-card__heading">
          <p className="toolkit-table-card__label">Key question</p>
          <h3 className="toolkit-table-card__title">{question.keyQuestion}</h3>
        </div>

        {hasAdditionalRows ? (
          <button
            type="button"
            className="toolkit-table-card__toggle"
            onClick={() => setShowAll((current) => !current)}
            aria-expanded={showAll}
            aria-controls={tableId}
          >
            {showAll ? 'Show only green questions' : '+ Show all questions'}
          </button>
        ) : null}
      </div>

      {question.note ? (
        <p className="toolkit-table-card__note">{question.note}</p>
      ) : null}

      <div className="toolkit-table-card__meta">
        <p className="toolkit-table-card__summary">
          Showing {visibleRows.length} of {question.rows.length} questions
        </p>
        {!showAll && hasAdditionalRows ? (
          <p className="toolkit-table-card__summary">
            Yellow and red questions stay tucked away until you open them.
          </p>
        ) : null}
      </div>

      <div className="toolkit-table-card__table-wrap">
        <table id={tableId} className="toolkit-table">
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">What to look for</th>
              <th scope="col">Where to find it</th>
              <th scope="col">Availability</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={`${row.question}-${row.availability}`}>
                <th scope="row" data-label="Question">
                  <div className="toolkit-table__question">
                    <span>{row.question}</span>
                    {row.glossaryTerms.length > 0 ? (
                      <span className="toolkit-table__terms">
                        Related terms:{' '}
                        {row.glossaryTerms.map((termKey, index) => (
                          <span key={termKey}>
                            {index > 0 ? ', ' : null}
                            <GlossaryTerm termKey={termKey} />
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </div>
                </th>
                <td data-label="What to look for">{row.whatToLookFor}</td>
                <td data-label="Where to find it">{row.whereToFind}</td>
                <td data-label="Availability">
                  <span
                    className={`toolkit-availability toolkit-availability--${row.availability}`}
                  >
                    <span
                      className={`toolkit-availability__dot toolkit-availability__dot--${row.availability}`}
                      aria-hidden="true"
                    />
                    <span>{availabilityCopy[row.availability].label}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

function groupRowsByAvailability(rows: ToolkitRow[]) {
  return rows.reduce<Record<Availability, ToolkitRow[]>>(
    (groups, row) => {
      groups[row.availability].push(row)
      return groups
    },
    {
      green: [],
      yellow: [],
      red: [],
    },
  )
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
