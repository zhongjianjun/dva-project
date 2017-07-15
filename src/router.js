import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';

import container from "./components/MainLayout/MainLayout.js";
import IndexPage from './routes/IndexPage.js';
import HandleApptCstmMng from "./routes/HandleApptCstmMng.js";
import SignCstmMng from "./routes/SignCstmMng.js";
import HouseApptMng from "./routes/HouseApptMng.js";
import MainLayout from "./routes/MainLayout.js";
import Login from "./components/Login/login.js";
import ProProcess from "./routes/ProProcess.js";
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={container} >
        <Route path="/mainLayout" component={MainLayout} />
        <Route path="/proProcess" component={ProProcess} />
        <Route path="/handleApptCstmMng" component={HandleApptCstmMng} />
        <Route path="/signCstmMng" component={SignCstmMng} />
        <Route path="/houseApptMng" component={HouseApptMng} />
        <IndexRoute component={IndexPage} />
      </Route>
      <Route path="/login" component={Login} />
    </Router>
  );
}

export default RouterConfig;
