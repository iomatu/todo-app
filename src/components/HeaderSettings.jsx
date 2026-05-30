export default function HeaderSettings({ warningHours, onChange }) {
  const isDays = warningHours % 24 === 0
  const displayValue = isDays ? warningHours / 24 : warningHours
  const displayUnit = isDays ? 'days' : 'hours'

  function handleValueChange(e) {
    const v = Number(e.target.value)
    if (!v || v < 1) return
    onChange(displayUnit === 'days' ? v * 24 : v)
  }

  function handleUnitChange(e) {
    const unit = e.target.value
    if (unit === 'days') {
      onChange(Math.max(1, Math.round(warningHours / 24)) * 24)
    } else {
      onChange(warningHours)
    }
  }

  return (
    <div className="header-settings">
      <label>⚠️ 警告</label>
      <input
        type="number"
        min="1"
        value={displayValue}
        onChange={handleValueChange}
      />
      <select value={displayUnit} onChange={handleUnitChange}>
        <option value="hours">時間前</option>
        <option value="days">日前</option>
      </select>
    </div>
  )
}