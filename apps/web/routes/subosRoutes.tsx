/**
 * Common routes and page exports for subos-frontend pages.
 *
 * This file intentionally avoids react-router-dom usage to keep Next.js free of that dependency.
 * It exports:
 * - subosRoutes: an array of { path, component } mappings
 * - Individual page components: PlansPage, CheckoutPage, OrderConfirmationPage, OrderSuccessPage, DashboardPage
 *
 * NOTE: If these deep import paths differ in your installed subos-frontend version,
 * adjust the import paths accordingly.
 */

/**
 * Re-exports for subos-frontend pages from the package public API.
 * Avoid deep internal paths to satisfy the package exports field.
 */

import { PlansPage, CheckoutPage, OrderConfirmationPage, OrderSuccessPage, DashboardPage } from 'subos-frontend';

export const subosRoutes = [
  { path: '/', redirectTo: '/plans' as const },
  { path: '/plans', component: PlansPage },
  { path: '/checkout', component: CheckoutPage },
  { path: '/order-confirmation/:orderId', component: OrderConfirmationPage },
  { path: '/order-success', component: OrderSuccessPage },
  { path: '/dashboard', component: DashboardPage },
] as const;

export { PlansPage, CheckoutPage, OrderConfirmationPage, OrderSuccessPage, DashboardPage };
