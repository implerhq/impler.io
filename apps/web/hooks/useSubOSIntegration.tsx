import { useState, useEffect, useCallback, useRef } from 'react';
import { configureSubOS, Plan } from 'subos-frontend';
import { useAppState } from 'store/app.context';
import { CancellationModeEnum } from '@config';
import { BILLABLEMETRIC_CODE_ENUM } from '@impler/shared';

interface SubOSComponents {
  PlanSelector: any;
  PlanCard: any;
}

interface SubOSHooks {
  useCustomerPortal: any;
}

interface SubOSApis {
  plansApi: any;
  subscriptionApi: any;
  transactionApi?: any;
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
interface ITransactionParams {
  page?: number;
  limit?: number;
}

interface CancelSubscriptionParams {
  reasons: string[];
}

const MAX_RETRY_ATTEMPTS = 2;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_TRANSACTION_LIMIT = 10;
const DEFAULT_APP_NAME = 'Impler';
const DEFAULT_APP_VERSION = '1.0.0';

export const useSubOSIntegration = () => {
  const { profileInfo } = useAppState();

  const [subOSComponents, setSubOSComponents] = useState<SubOSComponents | null>(null);
  const [subOSHooks, setSubOSHooks] = useState<SubOSHooks | null>(null);
  const [subOSApis, setSubOSApis] = useState<SubOSApis | null>(null);

  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [subscription, setSubscription] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const initialFetchDone = useRef(false);
  const initializingSubOS = useRef(false);

  const handleError = useCallback((err: unknown, context: string) => {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`${context}:`, err);
    setError(errorMessage);

    return errorMessage;
  }, []);

  const isNetworkError = (err: unknown): boolean => {
    return err instanceof Error && err.message.includes('network');
  };

  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

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

      // Configure/Initilize SubOS
      configureSubOS({
        apiEndpoint: process.env.NEXT_PUBLIC_SUBOS_API_ENDPOINT,
        projectId: process.env.NEXT_PUBLIC_SUBOS_PROJECT_ID,
        stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        appName: process.env.NEXT_PUBLIC_APP_NAME || DEFAULT_APP_NAME,
        appEnvironment: process.env.NODE_ENV,
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || DEFAULT_APP_VERSION,
        debug: process.env.NODE_ENV === 'development',
      });

      const subos = await import('subos-frontend');

      setSubOSComponents({
        PlanSelector: subos.PlanSelector,
        PlanCard: subos.PlanCard,
      });

      setSubOSHooks({
        useCustomerPortal: subos.useCustomerPortal,
      });

      setSubOSApis({
        plansApi: subos.plansApi,
        subscriptionApi: subos.subscriptionApi,
        transactionApi: subos.transactionApi,
      });

      setIsConfigured(true);
    } catch (err) {
      handleError(err, 'Failed to initialize SubOS');
    } finally {
      setLoading(false);
      initializingSubOS.current = false;
    }
  }, [isConfigured, handleError]);

  const fetchSubscription = useCallback(
    async (retryCount = 0): Promise<any> => {
      if (!subOSApis?.subscriptionApi || !isConfigured || !profileInfo?.email) {
        return null;
      }

      try {
        const response = await subOSApis.subscriptionApi.getActiveSubscription(profileInfo.email);

        if (response?.data) {
          setSubscription(response.data);
        }

        return response;
      } catch (err) {
        // Retry logic for network errors
        if (retryCount < MAX_RETRY_ATTEMPTS && isNetworkError(err)) {
          await delay(DEFAULT_RETRY_DELAY * (retryCount + 1));

          return fetchSubscription(retryCount + 1);
        }

        handleError(err, 'Error fetching subscription');

        return null;
      }
    },
    [subOSApis, isConfigured, profileInfo?.email, handleError]
  );

  const cancelSubscription = useCallback(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    async ({ reasons }: CancelSubscriptionParams) => {
      if (!subOSApis?.subscriptionApi || !isConfigured || !profileInfo?.email) {
        throw new Error('SubOS API not properly configured or email not available');
      }

      try {
        const response = await subOSApis.subscriptionApi.cancelSubscription(profileInfo.email, {
          cancellationMode: CancellationModeEnum.END_OF_PERIOD,
        });

        return response.data;
      } catch (err) {
        handleError(err, 'Error cancelling subscription');
        throw err;
      }
    },
    [subOSApis, isConfigured, profileInfo?.email, handleError]
  );

  const selectPlan = useCallback(
    async (plan: Plan) => {
      // Validation
      if (!subOSApis?.plansApi || !profileInfo?.email) {
        return null;
      }

      try {
        setSelectedPlan(plan);

        const response = await subOSApis.plansApi.createPaymentSession(plan.code, {
          returnUrl: `${window.location.origin}/subscription_status`,
          externalId: profileInfo.email,
          billableMetricCode: BILLABLEMETRIC_CODE_ENUM.ROWS,
        });

        // Extract checkout URL
        const checkoutUrl = response?.data?.checkoutUrl || response?.data?.url;

        if (response?.success && checkoutUrl) {
          window.location.href = checkoutUrl;

          return response;
        }

        return null;
      } catch (err) {
        handleError(err, 'Error selecting plan');

        return null;
      }
    },
    [subOSApis, profileInfo?.email, handleError]
  );

  const fetchTransactions = useCallback(
    async (page = 1, limit = DEFAULT_TRANSACTION_LIMIT) => {
      // Validation
      if (!subOSApis?.transactionApi || !isConfigured || !profileInfo?.email) {
        return [];
      }

      try {
        const response = await subOSApis.transactionApi.getTransactions(profileInfo.email, { page, limit });

        return response?.data || [];
      } catch (err) {
        handleError(err, 'Error fetching transactions');

        return [];
      }
    },
    [subOSApis, isConfigured, profileInfo?.email, handleError]
  );

  useEffect(() => {
    initializeSubOS();
  }, [initializeSubOS]);

  useEffect(() => {
    if (isConfigured && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchSubscription();
    }
  }, [isConfigured, fetchSubscription]);

  return {
    isConfigured,
    loading,
    error,

    // SubOS Resources
    components: subOSComponents,
    hooks: subOSHooks,
    apis: subOSApis,

    // Data State
    subscription,
    selectedPlan,

    // Subscription Actions
    fetchSubscription,
    cancelSubscription,

    // Plan Actions
    selectPlan,

    // Transaction Actions
    fetchTransactions,

    // Utility Actions
    reinitialize: initializeSubOS,
    clearError,
  };
};
