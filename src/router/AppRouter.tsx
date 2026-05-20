import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { 
  LoginScreen, 
  DashboardScreen, 
  CustomerListScreen, 
  CustomerDetailsScreen,
  SchemeManagementScreen, 
  PaymentManagementScreen,
  DueCustomersScreen,
  BannerOffersScreen,
  NotificationScreen
} from '../screen';
import { AdminLayout } from '../components/layout';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardScreen />} />
            <Route path={ROUTES.CUSTOMERS} element={<CustomerListScreen />} />
            <Route path={ROUTES.CUSTOMER_DETAILS} element={<CustomerDetailsScreen />} />
            <Route path={ROUTES.SCHEMES} element={<SchemeManagementScreen />} />
            <Route path={ROUTES.PAYMENTS} element={<PaymentManagementScreen />} />
            <Route path={ROUTES.INSTALLMENTS} element={<DueCustomersScreen />} />
            <Route path={ROUTES.BANNERS} element={<BannerOffersScreen />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<NotificationScreen />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
