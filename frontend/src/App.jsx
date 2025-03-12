import { Route, Routes } from "react-router-dom";

import { HomeScreen } from "./screens/Home.screen.jsx";
import { LoginScreen } from "./screens/Login.screen.jsx";
import { SignUpScreen } from "./screens/SignUp.screen.jsx";
import { TransactionFormScreen } from "./screens/TransactionForm.screen.jsx";
import { NotFoundScreen } from "./screens/NotFound.screen.jsx";
import { Header } from "./components/common/Header.component.jsx";

function App() {
  const authUser = false;

  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path="/" index={true} element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route
          path="/transaction/:transactionId"
          element={<TransactionFormScreen />}
        />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </>
  );
}

export default App;
