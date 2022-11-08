import React from "react";
import { Route, Routes as RrdRoutes } from "react-router-dom";
import { PageNotFound } from "../components/errors/PageNotFound";
import { GettingThingsReadyLoading } from "../components";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "./Layout";
import Redirect from "./Redirect";

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

const Routes = () => {
  return (
    <React.Suspense fallback={<GettingThingsReadyLoading />}>
      <RrdRoutes>
        <Route element={<Layout />}>
          <Route path="/" element={<Redirect />} />
          <Route path="/sign-in" element={<SignInScreen />} />
          <Route path="/sign-up" element={<SignUpScreen />} />
          <Route
            path="/account/active/:uid/:token"
            element={<ActivationSuccessfulScreen />}
          />

          <Route element={<ProtectedRoutes />}>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/spaces" element={<SpacesScreen />} />
            <Route path="/:spaceId/setting" element={<SpaceSettingScreen />} />
            <Route
              path="/:spaceId/assessments"
              element={<AssessmentsScreen />}
            />
            <Route
              path="/:spaceId/assessments/:assessmentId"
              element={<AssessmentReportScreen />}
            />
            <Route
              path="/:spaceId/assessments/:assessmentId/:subjectId"
              element={<SubjectReportScreen />}
            />
            <Route
              path="/:spaceId/assessments/:assessmentId/:subjectId/:categoryId/review"
              element={<MetricsReviewScreen />}
            />
            <Route
              path="/:spaceId/assessments/:assessmentId/:subjectId/:categoryId"
              element={<MetricsScreen />}
            >
              <Route path="" element={<MetricScreen />} />
              <Route path=":metricIndex" element={<MetricScreen />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </RrdRoutes>
    </React.Suspense>
  );
};

export default Routes;
