import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {id: 1, name: "Test User", image: "logo192.png", places: 3},
    {id: 2, name: "Test User", image: "001.png", places: 3}
  ]

  return (
    <UsersList 
      items={USERS}
    />
  );
};

export default Users;
