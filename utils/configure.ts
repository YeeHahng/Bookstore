'use client'
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

// Configure Amplify with outputs and enable SSR
Amplify.configure(outputs, {ssr: true});

export default function ConfigureAmplify() {
  return null;
}