import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import RouterOutlet from '../src/RouterOutlet';

const RoutedApp = () => {
  const routes = [];
  return (
    <Router>
      <RouterOutlet routes={routes} />
    </Router>
  );
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RoutedApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
