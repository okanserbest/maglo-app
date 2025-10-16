import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../features/auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { normalizeError } from '../../lib/api';

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

type FormValues = z.infer<typeof schema>;

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onBlur' });

  async function onSubmit(values: FormValues) {
    try {
      await login(values);
      toast.success('Login successful');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = normalizeError(err);
      // Friendly hint for too-many-requests
      if (typeof err === 'object' && err && (err as any)?.response?.status === 429) {
        toast.error('Çok fazla deneme yaptınız. Lütfen 30 saniye sonra tekrar deneyin.');
      } else {
        toast.error(msg);
      }
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <section className="flex items-center justify-center p-8">
        <div className="w-full sm:max-w-md space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-semibold">Sign In</h1>
            <p className="text-sm text-gray-600">Welcome back! Please enter your details</p>
          </header>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-400' : 'focus:ring-brand-500'}`}
                disabled={isSubmitting}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input
                id="password"
                type="password"
                placeholder="•••••••"
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-400' : 'focus:ring-brand-500'}`}
                disabled={isSubmitting}
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-500 text-gray-900 font-medium py-2 hover:brightness-95 transition disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link className="font-medium underline" to="/signup">Sign up</Link>
          </p>
        </div>
      </section>
      <aside className="hidden md:block bg-gray-100" />
    </main>
  );
}
