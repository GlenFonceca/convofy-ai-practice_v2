import { Home } from "./pages/Home.jsx";
import { SignUp } from "./pages/SignUp.jsx";
import { Login } from "./pages/Login.jsx";
import { Notifications } from "./pages/Notifications.jsx";
import { CallPage } from "./pages/CallPage.jsx";
import { ChatPage } from "./pages/ChatPage.jsx";
import { OnBoardingPage } from "./pages/OnBoardingPage.jsx";

import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import PageLoader from "./components/PageLoader.jsx";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import FriendsPage from "./pages/FriendsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PracticeWithAiPage from "./pages/PracticeWithAiPage.jsx";
import SpeechAnalysisPage from "./pages/SpeechAnalysisPage.jsx";
import TestHistoryPage from "./pages/TestHistoryPage.jsx";
import PremiumUpgrade from "./pages/PremiumUpgrade.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";

const App = () => {
  
  const { isLoading, authUser } = useAuthUser();

  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  const isPremium = authUser?.isPremium;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen " data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Home />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUp />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Notifications />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <ProfilePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/practice-with-ai"
          element={
            isAuthenticated && isOnboarded && isPremium? (
              <Layout showSidebar={true}>
                <PracticeWithAiPage />
              </Layout>
            )
            : isAuthenticated && isOnboarded && !isPremium ? <Navigate to="/premium-upgrade"/>
            : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/speech-analysis"
          element={
            isAuthenticated && isOnboarded && isPremium ? (
              <Layout showSidebar={true}>
                <SpeechAnalysisPage />
              </Layout>
            ) : isAuthenticated && isOnboarded && !isPremium ? <Navigate to="/premium-upgrade"/>
            : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/test-history"
          element={
            isAuthenticated && isOnboarded && isPremium? (
              <Layout showSidebar={true}>
                <TestHistoryPage />
              </Layout>
            ) : isAuthenticated && isOnboarded && !isPremium ? <Navigate to="/premium-upgrade"/>
            : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/premium-upgrade"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <PremiumUpgrade />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/payment-success"
          element={
              <Layout showSidebar={false} showNavbar={false}>
                <PaymentSuccess />
              </Layout>
          }
        />
        <Route
          path="/payment-failed"
          element={
              <Layout showSidebar={false} showNavbar={false}>
                <PaymentFailed />
              </Layout>
          }
        />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
