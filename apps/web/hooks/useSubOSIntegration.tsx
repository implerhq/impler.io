import { useState, useEffect, useCallback, useRef } from 'react';
import { configureSubOS, Plan } from 'subos-frontend';
import { useAppState } from 'store/app.context';
import { CancellationModeEnum } from '@config';

export const useSubOSIntegration = () => {
  const { profileInfo } = useAppState();
  // SubOS components and utilities
  const [subOSComponents, setSubOSComponents] = useState<any>(null);
  const [subOSHooks, setSubOSHooks] = useState<any>(null);
  const [subOSApis, setSubOSApis] = useState<any>(null);
  const [subOSUtils, setSubOSUtils] = useState<any>(null);

  // Configuration state
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [plans, setPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [billingCycle, setBillingCycle] = useState<string>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Track if initial data has been fetched
  const initialFetchDone = useRef(false);
  const fetchingPlans = useRef(false);
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
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        appEnvironment: process.env.NODE_ENV,
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        debug: process.env.NODE_ENV === 'development',
      });

      // Import SubOS module
      const subos = await import('subos-frontend');

      // Extract components
      const components = {
        PlansGrid: subos.PlansGrid,
        BillingCycleToggle: subos.BillingCycleToggle,
        SubscriptionDetails: subos.SubscriptionDetails,
        TransactionList: subos.TransactionList,
        TransactionModal: subos.TransactionModal,
        PlanSelector: subos.PlanSelector,
        PlanCard: subos.PlanCard,
        UpgradeSummary: subos.UpgradeSummary,
        DashboardPage: subos.DashboardPage,
        Layout: subos.Layout,
        LoadingSpinner: subos.LoadingSpinner,
        PaymentSuccessView: subos.PaymentSuccessView,
        PaymentCancelView: subos.PaymentCancelView,
      };

      // Extract hooks
      const hooks = {
        usePlans: subos.usePlans,
        useSubscription: subos.useSubscription,
        useTransactions: subos.useTransactions,
        useCancelSubscription: subos.useCancelSubscription,
        useCustomerPortal: subos.useCustomerPortal,
        usePagination: subos.usePagination,
        // useEmailManagement: subos.useEmailManagement,
      };

      // Extract APIs
      const apis = {
        plansApi: subos.plansApi,
        subscriptionApi: subos.subscriptionApi,
        transactionApi: subos.transactionApi,
        customerApi: subos.customerApi,
        // checkoutApi: subos.checkoutApi,
      };

      // Extract utilities
      const utils = {
        filterPlansByBillingCycle: subos.filterPlansByBillingCycle,
        filterPlansByTier: subos.filterPlansByTier,
        formatDate: subos.formatDate,
        getPlanDescription: subos.getPlanDescription,
        getPlanFeatures: subos.getPlanFeatures,
        isPlanPopular: subos.isPlanPopular,
        getApiBaseUrl: subos.getApiBaseUrl,
        getProjectId: subos.getProjectId,
        getStripePublishableKey: subos.getStripePublishableKey,
        validateSubOSConfig: subos.validateSubOSConfig,
        ensureSubOSConfig: subos.ensureSubOSConfig,
      };

      setSubOSComponents(components);
      setSubOSHooks(hooks);
      setSubOSApis(apis);
      setSubOSUtils(utils);
      setIsConfigured(true);
    } catch (err) {
      console.error('Failed to initialize SubOS:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
      initializingSubOS.current = false;
    }
  }, [isConfigured]);

  const fetchPlans = useCallback(
    async (cycle?: string) => {
      const currentCycle = cycle || billingCycle;
      if (!subOSApis?.plansApi || !isConfigured || fetchingPlans.current) return;

      fetchingPlans.current = true;
      try {
        const response = await subOSApis.plansApi.getPlans();

        // Extract plans array from response (streamlined)
        const allPlans = response?.data || response?.plans || (Array.isArray(response) ? response : []);

        // Filter by billing cycle if utility is available
        const filteredPlans = subOSUtils?.filterPlansByBillingCycle
          ? subOSUtils.filterPlansByBillingCycle(allPlans, currentCycle)
          : allPlans;

        setPlans(filteredPlans);

        return filteredPlans;
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err instanceof Error ? err.message : String(err));

        return [];
      } finally {
        fetchingPlans.current = false;
      }
    },
    [subOSApis, subOSUtils, isConfigured, billingCycle]
  );

  // Fetch subscription using SubOS API
  const fetchSubscription = useCallback(
    async (retryCount = 0): Promise<any> => {
      if (!subOSApis?.subscriptionApi || !isConfigured) {
        // eslint-disable-next-line no-console
        console.log('SubOS APIs or configuration not initialized');

        return null;
      }

      if (!profileInfo?.email) {
        // eslint-disable-next-line no-console
        console.log('Profile email not available for subscription fetch');

        return null;
      }

      try {
        const subscriptionData = await subOSApis.subscriptionApi.getActiveSubscription(profileInfo.email);

        console.log(subscriptionData);
        // eslint-disable-next-line no-console
        console.log('Successfully fetched subscription data for:', profileInfo.email);

        // Only update state if we got valid data
        if (subscriptionData?.data) {
          setSubscription(subscriptionData.data);
        }

        return subscriptionData;
      } catch (err) {
        console.error('Error fetching subscription:', err);

        // Retry logic for network errors
        if (retryCount < 2 && err instanceof Error && err.message.includes('network')) {
          // eslint-disable-next-line no-console
          console.log(`Retrying subscription fetch (attempt ${retryCount + 1})`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));

          return fetchSubscription(retryCount + 1);
        }

        setError(err instanceof Error ? err.message : String(err));

        return null;
      }
    },
    [subOSApis, isConfigured, profileInfo?.email]
  );

  // Fetch transactions using SubOS API
  const fetchTransactions = useCallback(
    async (page = 1, limit = 10) => {
      if (!subOSApis?.transactionApi || !isConfigured) return;

      try {
        const transactionData = await subOSApis.transactionApi.getTransactions(profileInfo?.email, { page, limit });
        setTransactions(transactionData.data);

        return transactionData;
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err instanceof Error ? err.message : String(err));

        return [];
      }
    },
    [subOSApis, isConfigured, profileInfo?.email]
  );

  // Fetch single transaction by ID using SubOS API
  const fetchTransaction = useCallback(
    async (transactionId: string) => {
      if (!subOSApis?.transactionApi || !isConfigured || !profileInfo?.email) return null;

      try {
        // Try to use getTransaction method if available
        if (subOSApis.transactionApi.getTransaction) {
          const transactionData = await subOSApis.transactionApi.getTransaction(transactionId, profileInfo.email);

          return transactionData;
        }

        // Fallback: fetch all transactions and find the specific one
        const allTransactions = await subOSApis.transactionApi.getTransactions(profileInfo.email, {
          page: 1,
          limit: 100,
        });
        const transaction = allTransactions?.data?.find(
          (t: { _id: string; id: string }) => t._id === transactionId || t.id === transactionId
        );

        return transaction ? { data: transaction } : null;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching transaction:', err);
        setError(err instanceof Error ? err.message : String(err));

        return null;
      }
    },
    [subOSApis, isConfigured, profileInfo?.email]
  );

  // Handle plan selection and checkout
  const selectPlan = useCallback(
    async (plan: Plan) => {
      if (!subOSApis?.checkoutApi || !isConfigured) {
        return;
      }

      try {
        console.log('plan is this', plan);
        setSelectedPlan(plan);

        // Create checkout session using SubOS
        const response = await subOSApis.plansApi.createPaymentSession(plan.code, {
          billingCycle,
          returnUrl: `${window.location.origin}/subscription_success`,
          customerEmail: profileInfo?.email,
        });

        console.log('response is', response);
        const checkoutUrl = response?.data?.checkoutUrl || response?.data?.url;

        if (response?.success && checkoutUrl) {
          window.location.href = checkoutUrl;

          return response;
        }
      } catch (err) {
        console.error('Error selecting plan:', err);
        setError(err instanceof Error ? err.message : String(err));

        return null;
      }
    },
    [subOSApis, isConfigured, billingCycle, profileInfo?.email]
  );

  // Handle subscription cancellation
  const cancelSubscription = useCallback(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    async ({ reasons }: { reasons: string[] }) => {
      if (!subOSApis?.subscriptionApi || !isConfigured) {
        throw new Error('SubOS API not initialized or configured');
      }

      if (!profileInfo?.email) {
        throw new Error('User email not available');
      }

      try {
        const response = await subOSApis.subscriptionApi.cancelSubscription(profileInfo.email, {
          cancellationMode: CancellationModeEnum.END_OF_PERIOD,
        });
        console.log('Subscription cancelled successfully', response);

        return response.data;
      } catch (err) {
        console.error('Error cancelling subscription:', err);
        setError(err instanceof Error ? err.message : String(err));

        throw err;
      }
    },
    [subOSApis, isConfigured, fetchSubscription, profileInfo?.email]
  );

  // Handle billing cycle change
  const changeBillingCycle = useCallback(
    async (cycle: string) => {
      setBillingCycle(cycle);
      // Refetch plans with new billing cycle
      if (subOSApis?.plansApi && isConfigured && !fetchingPlans.current) {
        fetchingPlans.current = true;
        try {
          const response = await subOSApis.plansApi.getPlans();
          const allPlans = response?.data || response?.plans || (Array.isArray(response) ? response : []);
          const filteredPlans = subOSUtils?.filterPlansByBillingCycle
            ? subOSUtils.filterPlansByBillingCycle(allPlans, cycle)
            : allPlans;
          setPlans(filteredPlans);
        } catch (err) {
          console.error('Error fetching plans for billing cycle:', err);
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          fetchingPlans.current = false;
        }
      }
    },
    [subOSApis, subOSUtils, isConfigured]
  );

  // Initialize on mount
  useEffect(() => {
    initializeSubOS();
  }, [initializeSubOS]);

  // Fetch initial data when configured (only once)
  useEffect(() => {
    if (isConfigured && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchPlans();
      fetchSubscription();
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigured]);

  return {
    // Configuration state
    isConfigured,
    loading,
    error,
    // SubOS resources
    components: subOSComponents,
    hooks: subOSHooks,
    apis: subOSApis,
    utils: subOSUtils,
    // Data
    plans,
    subscription,
    transactions,
    billingCycle,
    selectedPlan,
    // Actions
    fetchPlans,
    fetchSubscription,
    fetchTransactions,
    fetchTransaction,
    selectPlan,
    cancelSubscription,
    changeBillingCycle,
    // Utilities
    reinitialize: initializeSubOS,
    clearError: () => setError(null),
  };
};
