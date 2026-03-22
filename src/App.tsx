import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { LanguageProvider } from '@/i18n';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { LoansListPage } from '@/pages/LoansListPage';
import { LoanFormPage } from '@/pages/LoanFormPage';
import { LoanDashboardPage } from '@/pages/LoanDashboardPage';
import { NewPaymentPage } from '@/pages/NewPaymentPage';
import { ReviewPaymentPage } from '@/pages/ReviewPaymentPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { PaymentDetailPage } from '@/pages/PaymentDetailPage';
import { CloudSettingsPage } from '@/pages/CloudSettingsPage';
import { ChartsPage } from '@/pages/ChartsPage';
import { LanguageSettingsPage } from '@/pages/LanguageSettingsPage';
import { OAuthCallbackPage } from '@/pages/OAuthCallbackPage';
import { LoadingSpinner } from '@/components/ui/EmptyState';

function AppRoutes() {
  const { isLoggedIn, loading } = useAuth();

  // OAuth callback - always accessible (popup redirect)
  if (window.location.pathname === '/oauth-callback') {
    return <OAuthCallbackPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/loans" element={<LoansListPage />} />
        <Route path="/loans/new" element={<LoanFormPage />} />
        <Route path="/loans/:id" element={<LoanDashboardPage />} />
        <Route path="/loans/:id/edit" element={<LoanFormPage />} />
        <Route path="/loans/:id/new-payment" element={<NewPaymentPage />} />
        <Route path="/loans/:id/review-payment" element={<ReviewPaymentPage />} />
        <Route path="/loans/:id/history" element={<HistoryPage />} />
        <Route path="/loans/:id/payment/:paymentId" element={<PaymentDetailPage />} />
        <Route path="/loans/:id/charts" element={<ChartsPage />} />
        <Route path="/settings/cloud" element={<CloudSettingsPage />} />
        <Route path="/settings/language" element={<LanguageSettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/loans" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AppRoutes />
              <ToastContainer />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
