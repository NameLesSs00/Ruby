import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { authApi, decodeJwt, getDefaultRouteForRole } from '../modules/auth';
import { showToast } from '../lib/sonner';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast.warning('يرجى إدخال البريد الإلكتروني أو اسم المستخدم');
      return;
    }

    if (!password) {
      showToast.warning('يرجى إدخال كلمة المرور');
      return;
    }

    setIsLoading(true);

    try {
      const tokens = await authApi.login({
        email: email.trim(),
        password,
      });

      const decoded = decodeJwt(tokens.accessToken);
      const targetRoute = getDefaultRouteForRole(decoded?.role);

      showToast.success('تم تسجيل الدخول بنجاح', 'أهلاً بك في أكاديمية روبي للسباحة');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      navigate(targetRoute, { replace: true });
    } catch (error: unknown) {
      showToast.apiError(error, 'بيانات الدخول غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-decor login-bg-decor-1" />
      <div className="login-bg-decor login-bg-decor-2" />

      <div className="login-card">
        <div className="login-header">
          <img
            src={logoImg}
            alt="أكاديمية روبي للسباحة - Ruby Swimming Academy"
            className="login-logo-img"
          />
          <h1 className="login-title">تسجيل الدخول للنظام</h1>
          <p className="login-subtitle">نظام إدارة أكاديمية روبي للسباحة</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              البريد الإلكتروني / اسم المستخدم
            </label>
            <div className="input-wrapper">
              <input
                id="email-input"
                type="text"
                className="form-input"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              كلمة المرور
            </label>
            <div className="input-wrapper">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input has-icon-end"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>جاري التحقق وتسجيل الدخول...</span>
              </>
            ) : (
              <span>دخول النظام</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
