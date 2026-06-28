import { useState } from 'react'

export default function HeaderSettings({ warningHours, onChange }) {
  const totalHours = warningHours ?? 24
  const [days, setDays] = useState(Math.floor(totalHours / 24))
  const [hours, setHours] = useState(totalHours % 24)

  function handleDaysChange(e) {
    const d = Number(e.target.value)
    setDays(d)
    onChange(d * 24 + hours)
  }

  function handleHoursChange(e) {
    const h = Number(e.target.value)
    setHours(h)
    onChange(days * 24 + h)
  }

  return (
    <div className="header-settings">
      <label>⚠️ 警告</label>
      <select value={days} onChange={handleDaysChange}>
        {Array.from({ length: 32 }, (_, i) => (
          <option key={i} value={i}>{i}日</option>
        ))}
      </select>
      <select value={hours} onChange={handleHoursChange}>
        {Array.from({ length: 25 }, (_, i) => (
          <option key={i} value={i}>{i}時間</option>
        ))}
      </select>
      <span>前</span>
    </div>
  )
}