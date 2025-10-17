import { PLANCODEENUM } from '@config';
export interface WidgetAppearance {
  widget?: {
    backgroundColor?: string;
  };
  fontFamily?: string;
  borderRadius?: string;
  primaryButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    hoverBackground?: string;
    hoverTextColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    buttonShadow?: string;
  };
  secondaryButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    hoverBackground?: string;
    hoverTextColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    buttonShadow?: string;
  };
}

/**
 * Check if appearance configuration is allowed for the given plan
 * Throws error for starter plan users trying to use appearance features
 */
export function validateAppearanceAccess(planCode: string, userAppearance?: Partial<WidgetAppearance>): void {
  if (planCode === PLANCODEENUM.STARTER && userAppearance) {
    throw new Error(
      'Widget appearance customization is not available in your current plan (Starter). Please upgrade to Growth or Scale plan to customize the widget appearance.'
    );
  }
}

/**
 * Get appearance configuration based on plan
 * For starter plan: returns null (no appearance customization allowed)
 * For other plans: returns the provided appearance or default appearance
 */
export function getPlanAppearance(
  planCode: string,
  userAppearance?: Partial<WidgetAppearance>
): WidgetAppearance | null {
  // Validate access first
  validateAppearanceAccess(planCode, userAppearance);

  if (planCode === PLANCODEENUM.STARTER) {
    // Starter plan gets no appearance customization
    return null;
  }

  // For higher plans, use provided appearance or fall back to default
  if (userAppearance) {
    return userAppearance as WidgetAppearance;
  }

  // Default appearance for higher-tier plans
  return {
    widget: {
      backgroundColor: '#1c1917',
    },
    fontFamily: 'Inter, sans-serif',
    borderRadius: '12px',
    primaryButtonConfig: {
      backgroundColor: '#f59e0b',
      textColor: '#1c1917',
      hoverBackground: '#fbbf24',
      hoverTextColor: '#1c1917',
      borderColor: 'transparent',
      hoverBorderColor: 'transparent',
      buttonShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
    },
    secondaryButtonConfig: {
      backgroundColor: '#292524',
      textColor: '#fcd34d',
      hoverBackground: '#3c2d2a',
      hoverTextColor: '#fed7aa',
      borderColor: '#44403c',
      hoverBorderColor: '#f59e0b',
      buttonShadow: 'none',
    },
  };
}

/**
 * Check if a plan supports appearance customization
 */
export function planSupportsAppearance(planCode: string): boolean {
  return planCode !== PLANCODEENUM.STARTER;
}
