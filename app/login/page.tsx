'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TabSwitcher } from '@/features/auth/TabSwitcher';
import { LoginForm } from '@/features/auth/LoginForm';

type Tab = 'signin' | 'signup';

const LoginPage = () => {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('И-мэйл эсвэл нууц үг буруу байна');
      } else {
        router.push('/');
      }
    } catch {
      setError('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error === 'Email already registered'
            ? 'Энэ и-мэйл бүртгэлтэй байна'
            : data.error,
        );
        return;
      }

      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError('Бүртгэл амжилттай. Нэвтэрнэ үү.');
      } else {
        router.push('/');
      }
    } catch {
      setError('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-[var(--font-syne)] text-3xl font-bold tracking-tight text-foreground">
            Opportunity AI
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Боломжуудын нээлт
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <TabSwitcher tab={tab} setTab={setTab} setError={setError} />

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <LoginForm
            tab={tab}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleSubmit={tab === 'signin' ? handleSignIn : handleSignUp}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
