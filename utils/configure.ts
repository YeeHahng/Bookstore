'use client'
import { Amplify } from 'aws-amplify';

// Simple empty config as fallback
const emptyConfig = {
  auth: {
    user_pool_id: 'placeholder',
    aws_region: 'us-east-1',
    user_pool_client_id: 'placeholder'
  }
};

// Try to load the configuration
let amplifyConfig = emptyConfig;
try {
  // Try to dynamically import the config
  const configModule = require('../amplify_outputs.json');
  amplifyConfig = configModule.default || configModule;
  console.log('Loaded Amplify configuration');
} catch (e) {
  console.warn('Failed to load Amplify configuration, using placeholder');
}

// Configure Amplify
Amplify.configure(amplifyConfig, { ssr: true });

export default function ConfigureAmplify() {
  return null;
}