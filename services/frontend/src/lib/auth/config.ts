export const authConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'eu-central-1',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
  userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
  oauth: {
    domain: import.meta.env.VITE_COGNITO_DOMAIN || '',
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    redirectSignOut: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    responseType: 'code' as const,
  },
};

export const isMockAuth = import.meta.env.VITE_MOCK_AUTH === 'true';
