'use client';

import { GoogleReCaptchaProvider } from '@google-recaptcha/react';
import { ReactNode } from 'react';

interface RecaptchaProviderProps {
  children: ReactNode;
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  return (
    <GoogleReCaptchaProvider
      type="v3"
      siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}