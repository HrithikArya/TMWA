import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

type FormValues = z.infer<typeof schema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" isLoading={isLoading} className="w-full mt-2">
        Sign in
      </Button>
    </form>
  );
};
