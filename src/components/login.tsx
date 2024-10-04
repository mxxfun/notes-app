import React, { useState } from 'react';
import { signIn, signUp } from '../auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await signUp(email, password);
        console.log("Sign up successful");
      } else {
        await signIn(email, password);
        console.log("Sign in successful");
      }
      // Handle successful login/signup (e.g., redirect to home page)
    } catch (err) {
      console.error("Authentication error:", err);
      if (err instanceof Error) {
        setError(`Failed to ${isSignUp ? 'sign up' : 'log in'}: ${err.message}`);
      } else {
        setError(`Failed to ${isSignUp ? 'sign up' : 'log in'}. Please try again.`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</Button>
      <Button type="button" onClick={() => setIsSignUp(!isSignUp)} variant="outline">
        {isSignUp ? 'Switch to Log In' : 'Switch to Sign Up'}
      </Button>
    </form>
  );
};

export default Login;