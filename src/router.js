import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import App from './App'
import Test from './pages/test'
import TestHome from './pages/testHome'
import TestBjInfo from './pages/testBjInfo'
import TestDataTj from './pages/testDataTj'
import TestFixedSet from './pages/testFixedSet'
import Login from './pages/login'
import Home from './pages/home'
import User from './pages/user'
import ActTable from './pages/actTable'
import Details from './pages/details'

export default class Router extends React.Component {
	render() {
		return(
			<HashRouter>
                <App>                  
                    <Switch>                  
                        <Route path="/login"  component={Login}/>
                        <Route path="/test" component={Test}/>
                        <Route path='/' render={()=>
                            <Switch>
                                <Route path='/test' component={Test}/>
                                <Route path='/testHome' component={TestHome}/>
                                <Route path='/testBjInfo' component={TestBjInfo}/>
                                <Route path='/testDataTj' component={TestDataTj}/>
                                <Route path='/testFixedSet' component={TestFixedSet}/>
                                <Route path='/home' component={Home} />
                                <Route path='/user' component={User} />
                                <Route path="/:menuId" component={ActTable} exact />
                                <Route path='/create/:menuId' component={Details} exact/>
                                <Route path="/:menuId/:code" component={Details} exact />
                                <Redirect to="/test" />
                            </Switch>
                        }/>
                    </Switch>
                </App>
            </HashRouter>
		)
	}
}