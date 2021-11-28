import React from "react";
import { Redirect } from "react-router-dom";
import OktaSignInWidget from "./OktaSignInWidget.js";
import { useOktaAuth } from "@okta/okta-react";

const Login = ({ config }) => {
  const { oktaAuth, authState } = useOktaAuth();

  const onSuccess = (tokens) => {
    oktaAuth.handleLoginRedirect(tokens);
  };

  const onError = (err) => {};

  if (!authState) return null;

  return authState.isAuthenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
    <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />
  );
};
export default Login;
