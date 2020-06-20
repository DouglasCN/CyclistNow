import { Route, BrowserRouter } from "react-router-dom";
import React from "react";

import Home from './pages/Home';
import CreateUser from './pages/CreateUser';
import Main from './pages/Main';
import Detail from './pages/Detail';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={CreateUser} path="/create-user" exact/>
            <Route component={Main} path="/main" exact/>
            <Route component={Detail} path="/detail/:id" exact/>
        </BrowserRouter>
    );
}

export default Routes;