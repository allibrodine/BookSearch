import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
//import Apollo
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

//establish connection to backend graphql server
const httpLink = createHttpLink({ uri: '/graphql' });

//middleware to retrieve token and combine it with httpLink
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: { ...headers, authorization: token ? `Bearer ${token}` : '', }
  };
});

const client = new ApolloClient({
  //combine token with link
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function App() {
  return (
    /*send all requests through Apollo server*/
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
