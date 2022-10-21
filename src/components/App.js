import {  useMemo, useState } from 'react';
import useLocalStorage from 'hooks/useLocalStorage';
import ContactsList from './ContactsList/ContactsList';
import Form from './Form/Form';
import Filter from './Filter/Filter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css';
import { nanoid } from 'nanoid';


export  function App() {
  const [contacts, setContacts] = useLocalStorage(
    'contacts',
    []
  );
  const [filter, setFilter] = useState('');

  const deleteContact = contactId => {
    const info = toast.info(`Contact deleted`, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });

    setContacts(prevState =>
      prevState.filter(contact => contact.id !== contactId)
    );

    return info;
  };

  const filterState = e => {
    const filter = e.target.value;
    setFilter(filter);
  };

  const filterContactsByName = useMemo(() => {
    const normalizeContacts = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeContacts)
    );
  }, [contacts, filter]);

  const formSubmitHandler = data => {
    if (isDuplicate(data)) {
      const error = toast.error(
        `${data.name} already exist`,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        }
      );
      return error;
    }
    const success = toast.success(`Contact added`, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });

    setContacts(prevState => [
      ...prevState,
      { id: nanoid(), ...data },
    ]);

    return success;
  };


  const isDuplicate = ({ name })=> {
 
    const result = contacts.find(
      contact => contact.name === name
    );
    return result;
  }


  return (
    
    <div className={styles.container}>
      <h1 className={styles.title}>Phonebook</h1>
      <Form onSubmit={formSubmitHandler} />
      <h2>Contacts:</h2>

      <ContactsList
        contacts={filterContactsByName}
        onDeleteContact={deleteContact}
      />
      <Filter filter={filter} filterState={filterState} />
      <ToastContainer />
    </div>
  );
}

