'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import css from './SignUpPage.module.css';

import { register, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';


export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore(state => state.setUser);


  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      setIsLoading(true);
      await register({ email, password });

const user = await getMe();
setUser(user);

router.push('/profile');

    } catch {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
    <h1 className={css.formTitle}>Sign up</h1>
  <form className={css.form} action={handleSubmit}>


    <div className={css.formGroup}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        className={css.input}
        required
      />
    </div>

    <div className={css.formGroup}>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        className={css.input}
        required
      />
    </div>

    <div className={css.actions}>
      <button
        type="submit"
        className={css.submitButton}
        disabled={isLoading}
      >
        Register
      </button>
    </div>

    {error && <p className={css.error}>Error</p>}
  </form>
</main>

  );
}
