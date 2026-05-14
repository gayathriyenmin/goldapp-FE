import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Coins, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from '../../components/common';
import { useAuthStore } from '../../store';
import { authService } from '../../store/services';
import { ROUTES } from '../../constants';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import logo from '../../assets/logo_sg.png'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin123',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      login(response.data.user, response.data.accessToken);
      toast.success(response.message || 'Logged in successfully');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl  mb-6">
            {/* <Coins className="text-background" size={40} /> */}
            <img src={logo} alt="Logo" className="w-20 h-20 rounded-xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-text-light tracking-tight">
            Gold<span className="text-primary">Save</span>
          </h1>
          <p className="text-slate-400 mt-2">Enterprise Admin Portal</p>
        </div>

        <Card className="shadow-2xl border-white/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Input
                label="Email Address"
                placeholder="name@company.com"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                className="pl-11"
              />
              <Mail className="absolute left-4 top-[38px] text-slate-500" size={18} />
            </div>

            <div className="relative">
              <Input
                label="Password"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={errors.password?.message}
                className="pl-11 pr-11"
              />
              <Lock className="absolute left-4 top-[38px] text-slate-500" size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-slate-500 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-400 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-white/10 bg-background text-primary focus:ring-primary" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:underline font-medium">Forgot password?</a>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg shadow-lg shadow-primary/20" 
              isLoading={isLoading}
            >
              Sign In to Dashboard
            </Button>
          </form>
        </Card>
        
        <p className="text-center mt-8 text-slate-500 text-sm">
          Secure Login Powered by GoldSave Finance
        </p>
      </motion.div>
    </div>
  );
};
