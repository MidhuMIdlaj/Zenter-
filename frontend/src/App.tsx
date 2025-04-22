import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import {  setLoading } from './store/AdminAuthSlice';
import routes from './routers';
import { persistor, store } from './store/Store';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(false));
    persistor.flush().then(() => {
      console.log('Persisted state flushed');
    });
  }, [dispatch]);
  return <>{children}</>;
};

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AuthInitializer>
            <AppRoutes />
          </AuthInitializer>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;