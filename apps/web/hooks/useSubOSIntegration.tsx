import { useState, useEffect, useCallback, useRef } from 'react';
import { configureSubOS, Plan } from 'subos-frontend';
import { useAppState } from 'store/app.context';
import { CancellationModeEnum } from '@config';
import { BILLABLEMETRIC_CODE_ENUM } from '@impler/shared';

export const useSubOSIntegration = () => {
  const { profileInfo } = useAppState();

  // SubOS components and utilities
  const [subOSComponents, setSubOSComponents] = useState<{
    PlanSelector: any;
    PlanCard: any;
  } | null>(null);
  const [subOSHooks, setSubOSHooks] = useState<{
    useCustomerPortal: any;
  } | null>(null);
  const [subOSApis, setSubOSApis] = useState<{
    plansApi: any;
    subscriptionApi: any;
    transactionApi?: any;
  } | null>(null);

  // Configuration state
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [subscription, setSubscription] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Track if initial data has been fetched
  const initialFetchDone = useRef(false);
  const initializingSubOS = useRef(false);

  // Initialize SubOS
  const initializeSubOS = useCallback(async () => {
    if (initializingSubOS.current || isConfigured) return;

    initializingSubOS.current = true;
    try {
      setLoading(true);
      setError(null);

      // Configure SubOS using environment variables with fallbacks
      configureSubOS({
        apiEndpoint: process.env.NEXT_PUBLIC_SUBOS_API_ENDPOINT,
        projectId: process.env.NEXT_PUBLIC_SUBOS_PROJECT_ID,
        stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        appName: process.env.NEXT_PUBLIC_APP_NAME || 'Impler',
        appEnvironment: process.env.NODE_ENV,
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        debug: process.env.NODE_ENV === 'development',
      });

      // Import SubOS module
      const subos = await import('subos-frontend');

      // Extract components
      const components = {
        PlanSelector: subos.PlanSelector,
        PlanCard: subos.PlanCard,
      };

      // Extract hooks
      const hooks = {
        useCustomerPortal: subos.useCustomerPortal,
      };

      // Extract APIs
      const apis = {
        plansApi: subos.plansApi,
        subscriptionApi: subos.subscriptionApi,
        transactionApi: subos.transactionApi,
      };

      setSubOSComponents(components);
      setSubOSHooks(hooks);
      setSubOSApis(apis);
      setIsConfigured(true);
    } catch (err) {
      console.error('Failed to initialize SubOS:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
      initializingSubOS.current = false;
    }
  }, [isConfigured]);

  // Fetch subscription with retry logic
  const fetchSubscription = useCallback(
    async (retryCount = 0): Promise<any> => {
      if (!subOSApis?.subscriptionApi || !isConfigured || !profileInfo?.email) {
        return null;
      }

      try {
        const subscriptionData = await subOSApis.subscriptionApi.getActiveSubscription(profileInfo.email);

        if (subscriptionData?.data) {
          setSubscription(subscriptionData.data);
        }

        return subscriptionData;
      } catch (err) {
        console.error('Error fetching subscription:', err);
        if (retryCount < 2 && err instanceof Error && err.message.includes('network')) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));

          return fetchSubscription(retryCount + 1);
        }
        setError(err instanceof Error ? err.message : String(err));

        return null;
      }
    },
    [subOSApis, isConfigured, profileInfo?.email]
  );

  // Handle plan selection and checkout
  const selectPlan = useCallback(
    async (plan: Plan) => {
      if (!subOSApis?.plansApi || !profileInfo?.email) return null;

      try {
        setSelectedPlan(plan);
        const response = await subOSApis.plansApi.createPaymentSession(plan.code, {
          returnUrl: `${window.location.origin}/subscription_status`,
          externalId: profileInfo.email,
          billableMetricCode: BILLABLEMETRIC_CODE_ENUM.ROWS,
        });

        const checkoutUrl = response?.data?.checkoutUrl || response?.data?.url;
        if (response?.success && checkoutUrl) {
          window.location.href = checkoutUrl;

          return response;
        }

        return null;
      } catch (err) {
        console.error('Error selecting plan:', err);
        setError(err instanceof Error ? err.message : String(err));

        return null;
      }
    },
    [subOSApis, profileInfo?.email]
  );

  // Fetch transactions
  const fetchTransactions = useCallback(
    async (page = 1, limit = 10) => {
      if (!subOSApis?.transactionApi || !isConfigured || !profileInfo?.email) {
        return [];
      }

      try {
        const response = await subOSApis.transactionApi.getTransactions(profileInfo.email, { page, limit });

        return response?.data || [];
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err instanceof Error ? err.message : String(err));

        return [];
      }
    },
    [subOSApis, isConfigured, profileInfo?.email]
  );

  // Handle subscription cancellation
  const cancelSubscription = useCallback(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    async ({ reasons }: { reasons: string[] }) => {
      if (!subOSApis?.subscriptionApi || !isConfigured || !profileInfo?.email) {
        throw new Error('SubOS API not properly configured or email not available');
      }

      try {
        const response = await subOSApis.subscriptionApi.cancelSubscription(profileInfo.email, {
          cancellationMode: CancellationModeEnum.END_OF_PERIOD,
        });

        return response.data;
      } catch (err) {
        console.error('Error cancelling subscription:', err);
        setError(err instanceof Error ? err.message : String(err));
        throw err;
      }
    },
    [subOSApis, isConfigured, profileInfo?.email]
  );

  // Initialize on mount
  useEffect(() => {
    initializeSubOS();
  }, [initializeSubOS]);

  // Fetch initial data when configured
  useEffect(() => {
    if (isConfigured && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchSubscription();
    }
  }, [isConfigured, fetchSubscription]);

  return {
    // Configuration state
    isConfigured,
    loading,
    error,

    // SubOS resources
    components: subOSComponents,
    hooks: subOSHooks,
    apis: subOSApis,

    // Data
    subscription,
    selectedPlan,

    // Actions
    fetchSubscription,
    fetchTransactions,
    selectPlan,
    cancelSubscription,

    // Utilities
    reinitialize: initializeSubOS,
    clearError: () => setError(null),
  };
};
