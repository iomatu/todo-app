import { useState } from 'react'
import { updatePassword, deleteAccount } from '../services/auth'

export default function AccountSettings({ username, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPasswordMsg('')
    setPasswordError('')

    if (newPassword.length < 6) {
      setPasswordError('パスワードは6文字以上にしてください')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('新しいパスワードが一致しません')
      return
    }

    setLoading(true)
    const { error } = await updatePassword(newPassword)
    setLoading(false)

    if (error) {
      setPasswordError('パスワードの変更に失敗しました')
    } else {
      setPasswordMsg('パスワードを変更しました')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  async function handleDeleteAccount() {
    if (deleteInput !== username) return
    setLoading(true)
    await deleteAccount()
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>アカウント設定</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-section">
          <h3>パスワード変更</h3>
          <form className="task-form" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>新しいパスワード</label>
              <input
                type="password"
                placeholder="6文字以上"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>新しいパスワード（確認）</label>
              <input
                type="password"
                placeholder="もう一度入力"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            {passwordError && <p className="login-error">{passwordError}</p>}
            {passwordMsg && <p className="success-msg">{passwordMsg}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '変更中...' : 'パスワードを変更する'}
            </button>
          </form>
        </div>

        <div className="modal-section modal-section--danger">
          <h3>アカウント削除</h3>
          <p className="danger-note">
            アカウントを削除すると、すべてのタスク・メモ・カテゴリが完全に削除されます。この操作は取り消せません。
          </p>
          {!showDeleteConfirm ? (
            <button
              className="btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              アカウントを削除する
            </button>
          ) : (
            <div className="delete-confirm">
              <p className="danger-note">確認のためユーザー名「<strong>{username}</strong>」を入力してください</p>
              <input
                type="text"
                placeholder={username}
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
              />
              <div className="form-buttons" style={{ marginTop: '0.75rem' }}>
                <button
                  className="btn-danger"
                  disabled={deleteInput !== username || loading}
                  onClick={handleDeleteAccount}
                >
                  {loading ? '削除中...' : '完全に削除する'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput('') }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}