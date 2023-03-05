import {
  Outlet,
  Link,
  useLoaderData,
  Form,
  redirect,
  NavLink,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import {getContacts, createContact} from '../contacts';
import {useEffect} from 'react';

// export async function rootLoader() {
//   const contacts = await getContacts();
//   return {contacts};
// }

export async function rootLoader({request}) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  console.log('%c ||||| q', 'color:yellowgreen', q);
  const contacts = await getContacts(q);
  return {contacts, q};
}

export async function rootAction() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
  return {contact};
}

export default function Root() {
  const {contacts, q} = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  useEffect(() => {
    document.getElementById('q').value = q;
  }, [q]);

  console.log('%c ||||| contacts', 'color:yellowgreen', contacts);
  return (
    <>
      <div id='sidebar'>
        <h1>React Router Contacts</h1>
        <div>
          <Form id='search-form' role='search'>
            <input
              id='q'
              aria-label='Search contacts'
              placeholder='Search'
              type='search'
              name='q'
              defaultValue={q}
              onChange={(event) => {
                submit(event.currentTarget.form);
              }}
            />
            <div id='search-spinner' aria-hidden hidden={true} />
            <div className='sr-only' aria-live='polite'></div>
          </Form>
          <Form method='post'>
            <button type='submit'>New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({isActive, isPending}) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        className={navigation.state === 'loading' ? 'loading' : ''}
        id='detail'
      >
        <Outlet />
      </div>
    </>
  );
}
