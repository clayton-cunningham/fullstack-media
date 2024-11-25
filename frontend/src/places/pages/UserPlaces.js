import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = () => {
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  
  useEffect(() => {
    const getPlaces = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5000/api/places/user/" + userId,
        );
        setLoadedPlaces(response.places);
      } catch (e) { }
    }

    getPlaces();
  }, [sendRequest])

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading &&
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      }
      <PlaceList items={loadedPlaces} />
    </React.Fragment>
  );
};

export default UserPlaces;
