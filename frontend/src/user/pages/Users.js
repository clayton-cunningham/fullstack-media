import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModel from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {

  const [loadedUsers, setLoadedUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users",
        );
        setLoadedUsers(response.users);
      } catch (e) { }
    }

    getUsers();
  }, [sendRequest])

  return (
    <React.Fragment>
      <ErrorModel error={error} onClear={() => clearError()}/>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedUsers &&
        <UsersList 
          items={loadedUsers}
        />
      }
    </React.Fragment>
  );
};

export default Users;
