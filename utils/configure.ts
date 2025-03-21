'use client'
import { Amplify } from 'aws-amplify';

let outputs = {};
try {
  // Try relative path first
  outputs = require('../amplify_outputs.json');
} catch (e) {
  console.warn('Could not load amplify_outputs.json, trying fallback paths');
  try {
    // Try root path
    outputs = require('/amplify_outputs.json');
  } catch (e) {
    console.warn('Failed to load amplify outputs, using empty configuration');
  }
}

Amplify.configure(outputs, {ssr: true});

export default function ConfigureAmplify() {
  return null;
}