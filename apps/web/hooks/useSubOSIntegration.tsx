import { useState, useCallback, useRef, useEffect } from 'react';
import { configureSubOS } from 'subos-frontend';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const DEFAULT_APP_NAME = 'Impler';
const DEFAULT_APP_VERSION = '1.0.0';

export const useSubOSIntegration = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializingSubOS = useRef(false);

  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : String(err);
    setError(errorMessage);

    return errorMessage;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const initializeSubOS = useCallback(async () => {
    if (initializingSubOS.current || isConfigured) {
      return;
    }

    initializingSubOS.current = true;

    try {
      setLoading(true);
      setError(null);

      // Configure/Initialize SubOS
      configureSubOS({
        apiEndpoint: publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL,
        appName: publicRuntimeConfig.NEXT_PUBLIC_APP_NAME || DEFAULT_APP_NAME,
        appEnvironment: process.env.NODE_ENV,
        appVersion: publicRuntimeConfig.NEXT_PUBLIC_APP_VERSION || DEFAULT_APP_VERSION,
        debug: process.env.NODE_ENV === 'development',
      });

      setIsConfigured(true);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
      initializingSubOS.current = false;
    }
  }, [isConfigured, handleError]);

  // Initialize on mount
  useEffect(() => {
    initializeSubOS();
  }, [initializeSubOS]);

  return {
    loading,
    error,
    isConfigured,

    clearError,
  };
};
