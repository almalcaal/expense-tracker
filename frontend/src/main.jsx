import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  // todo, update the uri on production
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(), // apollo client uses to cache query results after fetching them
  credentials: "include", // tells apollo client to send cookies along with every request to the server
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>
);
