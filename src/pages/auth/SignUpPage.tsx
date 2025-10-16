import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../features/auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { normalizeError } from '../../lib/api';
import type { AxiosError } from 'axios';

const schema = z.object({
  fullName: z.string().min(2, 'Ad Soyad en az 2 karakter'),
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Şifre en az bir küçük, bir büyük harf ve bir sayı içermeli'),
});

type FormValues = z.infer<typeof schema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register: doRegister } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onBlur' });

  async function onSubmit(values: FormValues) {
    try {
      await doRegister(values);
      toast.success('User registered successfully');
      navigate('/signin');
    } catch (err) {
      // Field-level error mapping if API returns details array
      const ax = err as AxiosError<any>;
      const details = (ax.response?.data as any)?.details as Array<{ field: keyof FormValues; message: string }>|undefined;
      if (details?.length) {
        details.forEach((d) => setError(d.field, { type: 'server', message: d.message }));
      }
      toast.error(normalizeError(err));
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <section className="flex items-center justify-center p-8">
        <div className="w-full sm:max-w-md space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-semibold">Create new account</h1>
            <p className="text-sm text-gray-600">Welcome! Please enter your details</p>
          </header>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
              <input
                id="fullName"
                placeholder="John Doe"
                className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-400' : 'focus:ring-brand-500'}`}
                disabled={isSubmitting}
                {...register('fullName')}
              />
              {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
            </div>
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
              {!errors.password && (
                <p className="text-xs text-gray-500">Min 8 karakter, en az bir küçük, bir büyük harf ve bir sayı.</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
              type="submit"
              disabled={isSubmitting}
                className="flex-1 rounded-xl bg-brand-500 text-gray-900 font-medium py-2 hover:brightness-95 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Creating…' : 'Create Account'}
              </button>
              <button
                type="button"
                className="rounded-xl border px-3 py-2 text-sm"
                disabled={isSubmitting}
                onClick={() => {
                  // demo values
                  setValue('fullName', 'Maglo Demo');
                  setValue('email', 'demo@okandemo.com');
                  setValue('password', 'asdfasdfasdf');
                }}
              >
                Use demo data
              </button>
            </div>
          </form>
          <p className="text-sm text-gray-600">Already have an account? <Link className="font-medium underline" to="/signin">Sign in</Link></p>
        </div>
      </section>
      <aside className="hidden md:block bg-gray-100" />
    </main>
  );
}
