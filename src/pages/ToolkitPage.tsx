import { useState } from 'react'

import toolkitSource from '../../content/toolkit.json'

import { ClockDial } from '../components/ClockDial'
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
      <div className="toolkit-page__header">
        <h1 className="toolkit-page__title">Critical Questions</h1>
        <p className="toolkit-page__description">
          This is a field guide for better questions: what to ask, what to look
          for, and where a first answer may already be waiting. Each table
          begins with the questions most likely to be within reach. These are
          the "green" items — commonly available from your finance staff or
          annual reports. Yellow and red items require more follow-up but are
          worth advocating for.
        </p>
      </div>

      <div className="toolkit-page__legend-band" aria-label="Availability legend">
        <span className="toolkit-legend-band__kicker">Availability</span>
        <div className="toolkit-legend-band__items">
          {availabilityOrder.map((av) => (
            <div key={av} className="toolkit-legend-band__item">
              <span
                className={`toolkit-availability__dot toolkit-availability__dot--${av}`}
                aria-hidden="true"
              />
              <span className={`toolkit-legend-band__label toolkit-legend-band__label--${av}`}>
                {availabilityCopy[av].label}
              </span>
              <span className="toolkit-legend-band__detail">
                {availabilityCopy[av].detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="toolkit-page__sections">
        {toolkit.sections.map((section) => {
          const totalRows = section.questions.reduce(
            (n, q) => n + q.rows.length,
            0,
          )
          return (
            <section
              key={section.clock}
              className={`toolkit-section toolkit-section--${section.clock}`}
              aria-labelledby={`toolkit-section-${section.clock}`}
            >
              <div className="toolkit-section__header">
                <div className="toolkit-section__header-left">
                  <ClockDial clock={section.clock} size={42} visited={true} />
                  <h2
                    id={`toolkit-section-${section.clock}`}
                    className="toolkit-section__title"
                  >
                    {section.clockLabel}
                  </h2>
                </div>
                <div className="toolkit-section__header-counts">
                  <span className="toolkit-section__count">
                    {section.questions.length}{' '}
                    {section.questions.length === 1 ? 'question' : 'questions'}
                  </span>
                  <span className="toolkit-section__count">{totalRows} rows</span>
                </div>
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
          )
        })}
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
      <div className="toolkit-table-card__heading">
        <p className="toolkit-table-card__label">Key question</p>
        <h3 className="toolkit-table-card__title">{question.keyQuestion}</h3>
      </div>

      {question.note ? (
        <p className="toolkit-table-card__note">{question.note}</p>
      ) : null}

      {hasAdditionalRows ? (
        <div className="toolkit-table-card__toggle-row">
          <button
            type="button"
            className="toolkit-table-card__toggle"
            onClick={() => setShowAll((current) => !current)}
            aria-expanded={showAll}
            aria-controls={tableId}
          >
            {showAll
              ? `Show green only (${greenRows.length})`
              : `+ Show all questions (${question.rows.length})`}
          </button>
        </div>
      ) : null}

      <div className="toolkit-table-card__table-wrap">
        <table id={tableId} className="toolkit-table">
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '17%' }} />
          </colgroup>
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
              <tr
                key={`${row.question}-${row.availability}`}
                className={
                  row.availability !== 'green'
                    ? `toolkit-table__row--${row.availability}`
                    : undefined
                }
              >
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
