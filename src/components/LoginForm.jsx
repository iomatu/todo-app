import { useState, useEffect } from 'react'
import { signIn, signUp, checkUsername } from '../services/auth'

export default function LoginForm({ onLogin }) {
    const [mode, setMode] = useState('login') // login or signup
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameStatus, setUsernameStatus] = useState(null) // null, 'available', 'taken', 'checking'
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // ユーザー名のリアルタイム重複チェック
    useEffect(() => {
        if (mode !== 'signup' || username.length < 2) {
            setUsernameStatus(null)
            return
        }
        setUsernameStatus('checking')
        const timer = setTimeout(async () => {
            const available = await checkUsername(username)
            setUsernameStatus(available ? 'available' : 'taken')
        }, 500)
        return () => clearTimeout(timer)
    }, [username, mode])

    async function handleSubmit(e) {
        e.preventDefault()
        if (!username.trim() || !password.trim()) return
        if (mode === 'signup' && usernameStatus !== 'available') return

        setLoading(true)
        setError('')

        if (mode === 'login') {
            const { user, error } = await signIn(username, password)
            if (error) {
                setError('ユーザー名またはパスワードが違います')
            } else {
                onLogin(user)
            }
        } else {
            const { user, error } = await signUp(username, password)
            if (error) {
                setError('登録に失敗しました。もう一度お試しください')
            } else {
                onLogin(user)
            }
        }
        setLoading(false)
    }

    return (
        <div className="login-wrapper">
            <div className="login-box">
                <h1 className="login-title">ToDo アプリ</h1>
                <p className="login-subtitle">
                    {mode === 'login' ? 'ログイン' : '新規登録'}
                </p>

                <form className="task-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ユーザー名</label>
                        <div className="username-input-row">
                            <input
                                type="text"
                                placeholder="英数字・アンダースコアのみ"
                                value={username}
                                onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                                autoFocus
                            />
                            {mode === 'signup' && username.length >= 2 && (
                                <span className={`username-status ${usernameStatus}`}>
                                    {usernameStatus === 'checking' && '確認中...'}
                                    {usernameStatus === 'available' && '✅ 使用可能'}
                                    {usernameStatus === 'taken' && '❌ 使用済み'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>パスワード</label>
                        <input
                            type="password"
                            placeholder="パスワードを入力"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || (mode === 'signup' && usernameStatus !== 'available')}
                    >
                        {loading ? '処理中...' : mode === 'login' ? 'ログイン' : '登録する'}
                    </button>
                </form>

                <button
                    className="login-switch"
                    onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
                >
                    {mode === 'login' ? 'アカウントを作成する' : 'ログインに戻る'}
                </button>
            </div>
        </div>
    )
}