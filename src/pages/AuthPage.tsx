import { useNavigate, useParams } from "react-router"
import "../styles/main.style.scss"
import SignIn from "../components/auths/SignIn"
import SignUp from "../components/auths/SignUp"

function AuthPage() {
  const { signType } = useParams()
  const navigate = useNavigate()

  function handleSignUpRedirect() {
    if (signType === "signup") navigate("/auth/signin")
    else navigate("/auth/signup")
  }

  return (
    <div className="container">
      <h1>auth page</h1>
      {
        signType == "signin" ?
          <SignIn />
         :
          <SignUp />
      }

      <button onClick={handleSignUpRedirect}>
      {
        signType === "signin" ?
          "Don't have an account? Sign up"
        :
          "Already have an account? Sign in"
      }
      </button>
    </div>
  )
}

export default AuthPage