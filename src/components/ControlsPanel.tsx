import React from 'react'

export type Algorithm = 'none' | 'grayscale' | 'canny' | 'orb' | 'match' | 'homography'

type Props = {
  algorithm: Algorithm
  onAlgorithmChange: (algo: Algorithm) => void
  params: Record<string, number>
  onParamChange: (key: string, value: number) => void
}

export function ControlsPanel({ algorithm, onAlgorithmChange, params, onParamChange }: Props): JSX.Element {
  return (
    <section aria-label="controls" style={{ display: 'grid', gap: 8 }}>
      <div>
        <label>
          Algorithm:
          <select value={algorithm} onChange={e => onAlgorithmChange(e.target.value as Algorithm)}>
            <option value="none">None</option>
            <option value="grayscale">Grayscale</option>
            <option value="canny">Canny</option>
            <option value="orb">ORB</option>
            <option value="match">Match</option>
            <option value="homography">Homography</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Canny threshold1: {params.canny1 ?? 80}
          <input type="range" min={0} max={255} value={params.canny1 ?? 80} onChange={e => onParamChange('canny1', Number(e.target.value))} />
        </label>
      </div>
      <div>
        <label>
          Canny threshold2: {params.canny2 ?? 160}
          <input type="range" min={0} max={255} value={params.canny2 ?? 160} onChange={e => onParamChange('canny2', Number(e.target.value))} />
        </label>
      </div>
      <div>
        <label>
          ORB features: {params.orbN ?? 500}
          <input type="range" min={100} max={2000} step={50} value={params.orbN ?? 500} onChange={e => onParamChange('orbN', Number(e.target.value))} />
        </label>
      </div>
    </section>
  )
}


