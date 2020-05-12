import React from 'react';
import { Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components';
import history from './router/history';
import AppRouter from './router/AppRouter';
import theme from './theme';

const App = () => (
  <ThemeProvider theme={theme} >
    <Router history={history}>
      <AppRouter/>
    </Router>
  </ThemeProvider>
);

export default App;
