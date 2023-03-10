import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import Root, {rootLoader, rootAction} from './routes/root';
import ErrorPage from './error-page';
import Contact, {contactLoader} from './routes/contact';
import {destroyAction} from './routes/destroy';
import EditContact, {editAction} from './routes/edit';
import Index from './routes/index';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {index: true, element: <Index />},
      {
        path: 'contacts/:contactId',
        loader: contactLoader,
        element: <Contact />,
      },
      {
        path: 'contacts/:contactId/edit',
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
      {
        path: 'contacts/:contactId/destroy',
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
