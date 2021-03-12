import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom'
import { useTransition, animated } from 'react-spring'

function LandingPage() {
const location = useLocation()
  const transitions = useTransition(location, location => location.pathname, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  })
  return transitions.map(({ item: location, props, key }) => (
    <animated.div key={key} style={props}>
        <div id="transFirst"></div>
        <div id="transSec"></div>
        <div id="transText">
            amor
        </div>
      <Switch location={location}>
        <Route path="/" exact component={A} />
        <Route path="/a" component={A} />
        <Route path="/b" component={B} />
        <Route path="/c" component={C} />
      </Switch>
    </animated.div>
  ));
  }