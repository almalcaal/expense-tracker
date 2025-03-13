import { Navigate, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { HomeScreen } from "./screens/Home.screen.jsx";
import { LoginScreen } from "./screens/Login.screen.jsx";
import { SignUpScreen } from "./screens/SignUp.screen.jsx";
import { TransactionFormScreen } from "./screens/TransactionForm.screen.jsx";
import { NotFoundScreen } from "./screens/NotFound.screen.jsx";
import { Header } from "./components/common/Header.component.jsx";

import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query.js";

function App() {
  const authUser = false;
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);

  console.log("loading:", loading);
  console.log("authenticatedUser:", data);
  console.log("error:", error);

  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path="/"
          index={true}
          element={data?.authUser ? <HomeScreen /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!data?.authUser ? <LoginScreen /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!data?.authUser ? <SignUpScreen /> : <Navigate to="/" />}
        />
        <Route
          path="/transaction/:transactionId"
          element={
            !data?.authUser ? (
              <TransactionFormScreen />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
