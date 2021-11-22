import { Route, Switch, useHistory } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import "./App.css";
import Login from "./views/pages/login/Login";

import Lists from "./views/pages/List/List";
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";

const config = {
  clientId: process.env.REACT_APP_CLIENT_ID,
  issuer: process.env.REACT_APP_ISSUER,
  redirectUri: window.location.origin + "/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: false,
};
const oktaAuth = new OktaAuth(config);

const App = () => {
  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    const originalUriWithoutBasePath = originalUri.replace(
      history.createHref({}),
      "/"
    );

    history.replace(
      toRelativeUrl(originalUriWithoutBasePath, window.location.origin)
    );
  };

  const onAuthRequired = function () {
    history.push("/login");
  };

  const oktaSignInConfig = {
    baseUrl: process.env.REACT_APP_BASE_URL,
    clientId: process.env.REACT_APP_CLIENT_ID,
    redirectUri: window.location.origin + "/login/callback",
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Security
          oktaAuth={oktaAuth}
          restoreOriginalUri={restoreOriginalUri}
          onAuthRequired={onAuthRequired}
        >
          <Switch>
            <Route
              path="/login"
              render={() => <Login config={oktaSignInConfig} />}
            />
            <SecureRoute path="/" exact={true} component={Lists} />
            <Route path="/login/callback" component={LoginCallback} />
          </Switch>
        </Security>
      </StyledEngineProvider>
    </>
  );
};

export default App;
