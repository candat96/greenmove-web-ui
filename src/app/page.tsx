'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import LoginForm from '../components/LoginForm';


export default function Home() {
  const { data: session, status } = useSession();

  // Redirect to dashboard if already authenticated
  if (status === 'authenticated') {
    redirect('/dashboard');
  }

  // Show login form if not authenticated
  return <LoginForm />;
}