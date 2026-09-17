export function StreetSectionSvg({ viewBox }: { viewBox: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      role="img"
      aria-label="A blueprint of a typical street section: three buildings with spread footings, wall thicknesses, floor slabs, a parapet and a colonnade above a cut grade line; below it a dense network of buried works — water main and valve chamber, a duct bank, a gas line, foundation piles, a deep trunk, a sanitary sewer in a precast manhole, a storm sewer, a box culvert and a buried tank; a title block names the three clocks"
    >
      <title>Much of what is important in local government lies beneath the surface, including in finance</title>

      {/* Sheet field and earth */}
      <rect width="640" height="300" fill="#1F4E79" />
      <rect x="14" y="170" width="612" height="82" fill="#163A5A" />

      {/* Sheet borders */}
      <g fill="none" stroke="#C5CED4" strokeWidth="1">
        <rect x="10" y="10" width="620" height="280" />
      </g>
      <g fill="none" stroke="#C5CED4" strokeWidth="0.75">
        <rect x="14" y="14" width="612" height="272" />
      </g>

      {/* Centerlines */}
      <g fill="none" stroke="#C5CED4" strokeWidth="0.6" strokeDasharray="4 3">
        <path d="M115 64V170M285 64V170M462 64V170" />
      </g>

      {/* Buildings — walls, footings, slabs, gable, colonnade */}
      <g fill="none" stroke="#F7F9FA" strokeWidth="1.2" strokeLinejoin="miter">
        <path d="M60 170V106M64 170V106M166 170V106M170 170V106" />
        <path d="M64 138H166" />
        <path d="M64 106H166" />
        <path d="M54 106H176" />
        <path d="M54 106L115 80L176 106" />
        <path d="M52 176H178V188H52Z" />
        <path d="M60 170V176M64 170V176M166 170V176M170 170V176" />

        <path d="M230 170V86M234 170V86M336 170V86M340 170V86" />
        <path d="M234 142H336M234 114H336M234 86H336" />
        <path d="M228 86V78H342V86" />
        <path d="M222 176H348V188H222Z" />
        <path d="M230 170V176M234 170V176M336 170V176M340 170V176" />

        <path d="M392 176H528V188H392Z" />
        <path d="M396 170H524M400 166H520M404 162H516M400 170V166M520 170V166" />
        <path d="M414 162V116M418 162V116M438 162V116M442 162V116M460 162V116M464 162V116M482 162V116M486 162V116M506 162V116M510 162V116" />
        <path d="M408 116H520M408 108H520" />
        <path d="M404 108L462 80L520 108" />
        <path d="M404 170V162M516 170V162" />
      </g>

      {/* Window openings and door */}
      <g fill="none" stroke="#F7F9FA" strokeWidth="0.8">
        <path d="M80 146H98V164H80ZM132 146H150V164H132Z" />
        <path d="M80 114H98V130H80ZM132 114H150V130H132Z" />
        <path d="M106 144H124V170H106Z" />
        <path d="M115 80V88" />

        <path d="M244 148H262V164H244ZM274 148H292V164H274ZM304 148H322V164H304Z" />
        <path d="M244 120H262V136H244ZM274 120H292V136H274ZM304 120H322V136H304Z" />
        <path d="M244 92H262V108H244ZM274 92H292V108H274ZM304 92H322V108H304Z" />
        <path d="M274 150H292V170H274Z" />
      </g>

      {/* Cut grade line — heaviest */}
      <g fill="none" stroke="#F7F9FA" strokeWidth="2">
        <path d="M14 170H626" />
      </g>

      {/* Underground works — pipes, structures */}
      <g fill="none" stroke="#F7F9FA" strokeWidth="1.2">
        <circle cx="96" cy="204" r="8" />
        <path d="M72 226H120V248H72Z" />
        <path d="M76 230H116V244H76Z" />
        <circle cx="96" cy="237" r="5" />
        <path d="M140 192H200V220H140Z" />
        <circle cx="150" cy="200" r="4" /><circle cx="164" cy="200" r="4" /><circle cx="178" cy="200" r="4" /><circle cx="192" cy="200" r="4" />
        <circle cx="150" cy="212" r="4" /><circle cx="164" cy="212" r="4" /><circle cx="178" cy="212" r="4" /><circle cx="192" cy="212" r="4" />
        <circle cx="210" cy="224" r="5" />
        <path d="M150 232H330M150 242H330M150 232V242M330 232V242" />
        <circle cx="370" cy="210" r="12" />
        <path d="M352 170V232M356 170V232M384 170V232M388 170V232" />
        <path d="M348 232H392V240H348Z" />
        <circle cx="500" cy="206" r="12" />
        <path d="M424 222H476V246H424Z" />
        <path d="M428 226H472V242H428Z" />
        <path d="M550 210H594A14 14 0 0 1 594 238H550A14 14 0 0 1 550 210Z" />
        <path d="M550 224H594" />
      </g>

      {/* Laterals, risers, piles */}
      <g fill="none" stroke="#F7F9FA" strokeWidth="0.8">
        <path d="M96 212V226" />
        <path d="M96 188V196" />
        <path d="M240 188V216M244 188V216M284 188V216M288 188V216M330 188V216M334 188V216" />
        <path d="M310 188V232" />
        <path d="M450 188V222" />
        <path d="M500 188V194" />
        <path d="M476 234H488V218" />
        <path d="M190 228V246M262 228V246M300 228V246" />
      </g>

      {/* Centerlines — dash-dot */}
      <g fill="none" stroke="#C5CED4" strokeWidth="0.6" strokeDasharray="9 3 2 3">
        <path d="M76 204H116M96 190V218" />
        <path d="M344 210H396M370 192V228" />
        <path d="M478 206H522M500 190V222" />
        <path d="M194 224H226" />
      </g>

      {/* Dimension line and arrows */}
      <g fill="none" stroke="#C5CED4" strokeWidth="0.6">
        <path d="M512 206H586" />
        <path d="M578 170V206" />
        <path d="M574 174L582 166M574 210L582 202" />
      </g>
      <g fill="#C5CED4" fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize={9} textAnchor="end">
        <text x="572" y="192">1.10</text>
      </g>

      {/* Manhole cover — single pure white mark */}
      <g fill="#FFFFFF" stroke="none">
        <path d="M348 165H392V170H348Z" />
      </g>
      {/* Datum triangle */}
      <g fill="#F7F9FA" stroke="none">
        <path d="M604 164L614 164L609 170Z" />
      </g>

      {/* Caption */}
      <g fill="#F7F9FA" fontFamily="'IBM Plex Mono', ui-monospace, monospace" textAnchor="start">
        <text x="24" y="34" fontSize={12} fontWeight="600" letterSpacing="0.02em">MUCH OF WHAT IS IMPORTANT IN LOCAL GOVERNMENT</text>
        <text x="24" y="50" fontSize={12} fontWeight="600" letterSpacing="0.02em">LIES BENEATH THE SURFACE, INCLUDING IN FINANCE</text>
      </g>

      {/* Title block */}
      <g fill="none" stroke="#C5CED4" strokeWidth="0.75">
        <path d="M14 252H626M300 252V286M400 252V286M508 252V286" />
      </g>
      <g fontFamily="'IBM Plex Mono', ui-monospace, monospace" textAnchor="start">
        <text x="24" y="268" fontSize={11} fontWeight="600" fill="#F7F9FA" letterSpacing="0.03em">THE THREE CLOCKS OF PUBLIC FINANCE</text>
        <text x="24" y="281" fontSize={9} fill="#C5CED4" letterSpacing="0.04em">STREET SECTION — ASSETS HELD IN TRUST</text>
        <text x="350" y="267" fontSize={9} fill="#C5CED4" textAnchor="middle">01</text>
        <text x="350" y="281" fontSize={10} fill="#F7F9FA" textAnchor="middle">ANNUAL</text>
        <text x="454" y="267" fontSize={9} fill="#C5CED4" textAnchor="middle">02</text>
        <text x="454" y="281" fontSize={10} fill="#F7F9FA" textAnchor="middle">TRAJECTORY</text>
        <text x="567" y="267" fontSize={9} fill="#C5CED4" textAnchor="middle">03</text>
        <text x="567" y="281" fontSize={10} fill="#F7F9FA" textAnchor="middle">GENERATIONAL</text>
      </g>
    </svg>
  )
}
