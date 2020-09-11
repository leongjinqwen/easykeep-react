import React, { useState,useEffect } from 'react';
import axios from 'axios';

const Homepage = () => {
  const [ users, setUsers ] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/users')
    .then(result => {
      setUsers(result.data.users)
    })
    .catch(error => {
      console.log('ERROR: ', error)
    })
  }, [])

  return (
    <>  
      {
        users.map(user=>{
          return (
            <li key={user.id}>
              {user.username}
            </li>
          )
        })
      }      
    </>
    )
}
export default Homepage;