import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../features/auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { normalizeError } from '../../lib/api';
import type { AxiosError } from 'axios';

// assets (same as Sign In)
import Logo from '../../assets/icons/Logo.png';
import LoginImage from '../../assets/icons/login/logInImage.png';
import Vector11 from '../../assets/icons/login/Vector 11.png';
import GoogleIcon from '../../assets/icons/login/Google.png';

const schema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])/, 'Password must include at least one lowercase letter')
    .regex(/^(?=.*[A-Z])/, 'Password must include at least one uppercase letter')
    .regex(/^(?=.*\d)/, 'Password must include at least one number')
    .regex(/^(?!.*\s)/, 'Password must not contain spaces'),
});

type FormValues = z.infer<typeof schema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register: doRegister } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onChange' });

  const passwordValue = watch('password') || ''; // Ensure passwordValue is always a string

  const passwordValidationFeedback = [
    {
      rule: /.{8,}/,
      message: 'At least 8 characters',
    },
    {
      rule: /^(?=.*[a-z])/,
      message: 'At least one lowercase letter',
    },
    {
      rule: /^(?=.*[A-Z])/,
      message: 'At least one uppercase letter',
    },
    {
      rule: /^(?=.*\d)/,
      message: 'At least one number',
    },
    {
      rule: /^(?!.*\s)/,
      message: 'No spaces allowed',
    },
  ];

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
    <main className="relative min-h-screen grid md:grid-cols-2 bg-white">
      {/* Top-left logo */}
      <div className="pointer-events-none absolute left-[34px] top-8 md:left-[60px] md:top-10 z-20">
        <img src={Logo} alt="Maglo" className="h-6 w-auto" />
      </div>

      {/* Left: Form */}
      <section className="relative flex items-center justify-center px-6 py-12 md:px-[135px]">
        <div className="w-full max-w-md space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-[#1B212D] font-['Kumbh_Sans']">Create new account</h1>
            <p className="text-base text-[#929EAE] font-['Kumbh_Sans']">Welcome back! Please enter your details</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col items-start gap-[5px]">
              <div className="self-stretch pr-2.5 py-2.5 inline-flex justify-start items-start gap-2.5">
                <label htmlFor="fullName" className="text-sm font-medium text-[#1B212D] font-['Kumbh_Sans']">Full Name</label>
              </div>
              <input
                id="fullName"
                placeholder="John Doe"
                className={`w-full rounded-[10px] outline-1 outline-offset-[-1px] outline-zinc-100 pl-5 pr-6 pt-3.5 pb-4 text-sm text-[#1B212D] font-['Kumbh_Sans'] placeholder:text-[#929EAE] focus:outline-none focus:ring-2 ${errors.fullName ? 'ring-red-400' : 'ring-[#C8EE44]'} disabled:opacity-60`}
                disabled={isSubmitting}
                {...register('fullName')}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-600 font-['Kumbh_Sans']">{errors.fullName.message}</p>}
            </div>

            <div className="flex flex-col items-start gap-[5px]">
              <div className="self-stretch pr-2.5 py-2.5 inline-flex justify-start items-start gap-2.5">
                <label htmlFor="email" className="text-sm font-medium text-[#1B212D] font-['Kumbh_Sans']">Email</label>
              </div>
              <input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className={`w-full rounded-[10px] outline-1 outline-offset-[-1px] outline-zinc-100 pl-5 pr-6 pt-3.5 pb-4 text-sm text-[#1B212D] placeholder:text-[#929EAE]  font-['Kumbh_Sans'] focus:outline-none focus:ring-2 ${errors.email ? 'ring-red-400' : 'ring-[#C8EE44]'} disabled:opacity-60`}
                disabled={isSubmitting}
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600 font-['Kumbh_Sans']">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col items-start gap-[5px]">
              <div className="self-stretch pr-2.5 py-2.5 inline-flex justify-start items-start gap-2.5">
                <label htmlFor="password" className="text-sm font-medium text-[#1B212D] font-['Kumbh_Sans']">Password</label>
              </div>
              <input
                id="password"
                type="password"
                placeholder="•••••••"
                className={`w-full rounded-[10px] outline-1 outline-offset-[-1px] outline-zinc-100 pl-5 pr-6 pt-3.5 pb-4 text-sm text-[#1B212D] placeholder:text-[#929EAE] font-['Kumbh_Sans'] focus:outline-none focus:ring-2 ${errors.password ? 'ring-red-400' : 'ring-[#C8EE44]'} disabled:opacity-60`}
                disabled={isSubmitting}
                {...register('password')}
              />
              <ul className="mt-2 text-xs text-[#929EAE] font-['Kumbh_Sans'] space-y-1">
                {passwordValidationFeedback.map(({ rule, message }) => (
                  <li
                    key={message}
                    className={rule.test(passwordValue) ? 'text-green-600' : 'text-red-600'}
                  >
                    {message}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3.5 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-[10px] bg-[#C8EE44] text-[#1B212D] font-['Kumbh_Sans'] font-semibold py-3.5 hover:brightness-95 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Creating…' : 'Create Account'}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                className="w-full rounded-[10px] outline-1 outline-offset-[-1px] font-['Kumbh_Sans'] outline-neutral-200 px-5 py-3 inline-flex items-center justify-center gap-2.5 hover:bg-gray-50 transition disabled:opacity-60"
              >
                <img src={GoogleIcon} alt="Google" className="h-6 w-6" />
                <span className="text-[#78778B] text-base font-['Kumbh_Sans'] font-semibold">Sign up with Google</span>
              </button>
            </div>
          </form>

          <div className="relative pt-2 justify-center text-center">
            <p className="text-sm text-[#929EAE] font-['Kumbh_Sans']">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#1B212D] font-medium font-['Kumbh_Sans'] inline-block relative">
                <span className="font-['Kumbh_Sans']">Sign in</span>
                {/* Decorative vector underline under the link (43x5px) */}
                <img
                  src={Vector11}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-1 right-0 w-[43px] h-[5px]"
                />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Right: Image with overlay */}
      <aside className="relative hidden md:block min-h-screen">
        <img src={LoginImage} alt="Sign up illustration" className="absolute inset-0 h-full w-full object-cover" />
        {/* Subtle dark overlay to improve contrast */}
        <div className="absolute inset-0 bg-[#1B212D] opacity-10" />
      </aside>
    </main>
  );
}
