import React from 'react';

import UserItem from './UserItem';
import './UsersList.css';
import Card from '../../shared/components/UIElements/Card';

const UsersList = props => {

    if (props.items?.length === 0 ?? true) {
        return (
            <Card className='center'>
                <h2>No users found.</h2>
            </Card>
        )
    }

    return (
        <ul className='users-list'>
            {props.items.map(user => {
                return (
                    <UserItem 
                        key={user.id} 
                        id={user.id} 
                        image={user.image} 
                        name={user.name} 
                        placeCount={user.places} 
                    />
                );
            })}
        </ul>
    )
};

export default UsersList;