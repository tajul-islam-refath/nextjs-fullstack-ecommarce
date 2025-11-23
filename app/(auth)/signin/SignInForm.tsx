'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { SignInFormData, signInSchema } from '@/lib/validations/auth';
import { useSignIn } from '@/hooks/use-sign-in';
import {
  Form,
} from '@/components/ui/form';
import { CustomFormField } from '@/components/ui/custom-form-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';


export default function SignInForm() {
  const { handleSignIn, isLoading, error } = useSignIn();

  // Initialize form with zod resolver
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    await handleSignIn(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Sign in
          </CardTitle>
          <CardDescription>
            Enter your email and password to access the admin portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <CustomFormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="name@example.com"
                type="email"
                disabled={isLoading}
              />
              
              <CustomFormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="••••••••"
                type="password"
                disabled={isLoading}
              />

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 border-t pt-6">
          <div className="text-center text-xs text-muted-foreground">
            <p>Demo Credentials:</p>
            <p>admin-system@gmail.com / Admin@123</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
