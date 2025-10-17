import { useMemo } from 'react';
import { usePlanDetails } from '@hooks/usePlanDetails';
import { getPlanAppearance, planSupportsAppearance, WidgetAppearance } from 'utils/appearance-access.utils';

/**
 * Hook to resolve widget appearance based on current user's subscription plan
 * Enforces strict restrictions for starter plan users
 */
export function usePlanAppearance(userAppearance?: Partial<WidgetAppearance>) {
  const { activePlanDetails } = usePlanDetails({});

  const resolvedAppearance = useMemo(() => {
    if (!activePlanDetails?.planCode) {
      // If no subscription data, default to starter plan behavior (no appearance)
      return null;
    }

    try {
      return getPlanAppearance(activePlanDetails.planCode, userAppearance);
    } catch (error) {
      // Return null for starter plan users who try to use appearance
      console.warn('Appearance access denied:', error);

      return null;
    }
  }, [activePlanDetails?.planCode, userAppearance]);

  const canCustomize = useMemo(() => {
    if (!activePlanDetails?.planCode) return false;

    return planSupportsAppearance(activePlanDetails.planCode);
  }, [activePlanDetails?.planCode]);

  return {
    appearance: resolvedAppearance,
    canCustomize,
    planCode: activePlanDetails?.planCode,
    isLoading: !activePlanDetails,
    error:
      canCustomize === false && userAppearance
        ? 'Widget appearance customization is not available in your current plan'
        : null,
  };
}
