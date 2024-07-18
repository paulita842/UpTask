import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setContext} from 'apollo-link-context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
});

const authLink = setContext(async (_, {headers}) => {
  //leer el token
  const token = await AsyncStorage.getItem('token');

  // Retornar los headers con el token agregado
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default client;
