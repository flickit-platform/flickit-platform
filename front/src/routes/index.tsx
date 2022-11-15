import React from "react";
import { Route, Routes as RrdRoutes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Layout from "../layouts/Layout";
import Redirect from "./Redirect";
import GettingThingsReadyLoading from "../components/shared/loadings/GettingThingsReadyLoading";
import PageNotFoundError from "../components/shared/errors/PageNotFoundError";
import AuthRoutes from "./AuthRoutes";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

const SignInScreen = React.lazy(() => import("../screens/SignInScreen"));
const SignUpScreen = React.lazy(() => import("../screens/SignUpScreen"));
const ProfileScreen = React.lazy(() => import("../screens/ProfileScreen"));
const ActivationSuccessfulScreen = React.lazy(
  () => import("../screens/ActivationSuccessfulScreen")
);

const AssessmentReportScreen = React.lazy(
  () => import("../screens/AssessmentReportScreen")
);
const SubjectReportScreen = React.lazy(
  () => import("../screens/SubjectReportScreen")
);
const SpacesScreen = React.lazy(() => import("../screens/SpacesScreen"));
const SpaceSettingScreen = React.lazy(
  () => import("../screens/SpaceSettingScreen")
);
const AssessmentsScreen = React.lazy(
  () => import("../screens/AssessmentsScreen")
);
const MetricsScreen = React.lazy(() => import("../screens/MetricsScreen"));
const MetricsReviewScreen = React.lazy(
  () => import("../screens/MetricsReviewScreen")
);
const MetricScreen = React.lazy(() => import("../screens/MetricScreen"));
const QuestionnairesScreen = React.lazy(
  () => import("../screens/QuestionnairesScreen")
);

const Routes = () => {
  return (
    <React.Suspense fallback={<GettingThingsReadyLoading />}>
      <RrdRoutes>
        <Route path="/" element={<Redirect />} />
        <Route
          element={
            <AuthLayout>
              <AuthRoutes />
            </AuthLayout>
          }
        >
          <Route path="/sign-in" element={<SignInScreen />} />
          <Route path="/sign-up" element={<SignUpScreen />} />
          <Route
            path="/account/active/:uid/:token"
            element={<ActivationSuccessfulScreen />}
          />
        </Route>

        <Route
          element={
            <AppLayout>
              <PrivateRoutes />
            </AppLayout>
          }
        >
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/spaces" element={<SpacesScreen />} />
          <Route path="/:spaceId/setting" element={<SpaceSettingScreen />} />
          <Route path="/:spaceId/assessments" element={<AssessmentsScreen />} />
          <Route
            path="/:spaceId/assessments/:assessmentId/insights"
            element={<AssessmentReportScreen />}
          />
          <Route
            path="/:spaceId/assessments/:assessmentId/insights/:subjectId"
            element={<SubjectReportScreen />}
          />
          <Route
            path="/:spaceId/assessments/:assessmentId/questionnaires"
            element={<QuestionnairesScreen />}
          />
          <Route
            path="/:spaceId/assessments/:assessmentId/questionnaires/:questionnaireId/review"
            element={<MetricsReviewScreen />}
          />
          <Route
            path="/:spaceId/assessments/:assessmentId/questionnaires/:questionnaireId"
            element={<MetricsScreen />}
          >
            <Route path="" element={<MetricScreen />} />
            <Route path=":metricIndex" element={<MetricScreen />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFoundError />} />
      </RrdRoutes>
    </React.Suspense>
  );
};

export default Routes;
