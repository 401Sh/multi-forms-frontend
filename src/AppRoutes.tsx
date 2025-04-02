import { Routes, Route } from "react-router"
import FormPage from "./pages/FormPage"
import HomePage from "./pages/HomePage"
import MySurveysPage from "./pages/MySurveysPage"
import ProfilePage from "./pages/ProfilePage"
import SurveyPage from "./pages/SurveyPage"
import SurveysHomePage from "./pages/SurveysHomePage"
import AuthPage from "./pages/AuthPage"
import SuccessFormResponse from "./components/forms/SuccessFormResponse"

function AppRoutes() {
  return (
    <Routes>
      {/* <Route element={<NavTabLayout />}> */}

      <Route index element={<HomePage />} />

      {/* <Route element={<AuthLayout />}>
        <Route path="register" element={<SignUpPage />} />
        <Route path="login" element={<SignInPage />} />
      </Route> */}
      <Route path="auth/:signType" element={<AuthPage />} />

      <Route path="profile" element={<ProfilePage />} />

      <Route path="surveys">
        <Route index element={<SurveysHomePage />} />
        <Route path="self" element={<MySurveysPage />} />

        <Route path=":surveyId" element={<SurveyPage />} />
        <Route path=":surveyId/form" element={<FormPage />} />
        <Route path=":surveyId/form/success" element={<SuccessFormResponse />} />
      </Route>
      {/* </Route> */}
      
    </Routes>
  )
}

export default AppRoutes
