import React from "react";
import { Switch, Route } from "react-router-dom";

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/explorer.github.io/" exact component={Dashboard} />
    <Route path="/explorer.github.io/repository/:repository+" component={Repository} />
  </Switch>
)

export default Routes;
