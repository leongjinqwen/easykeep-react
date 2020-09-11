import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useHistory } from "react-router-dom"
import { toast } from 'react-toastify';
import AddBizModal from '../components/AddBizModal';
import ShowAssessment from '../components/ShowAssessment';
import { ListItem } from '@material-ui/core';

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const params = useParams()
  const history = useHistory()

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/users/${params.userid}`,
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(result => {
      // console.log(result.data)
      setUser(result.data.user)
      setBusinesses(result.data.businesses)
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
      toast.error(error.response.data.message)
      history.push('/')
    })
  }, [])

  const addBiz = (item) => {
    setBusinesses([...businesses,item])
  }

  return (
    <>  

      {
        user ? 
        <h3>{user.username}</h3> 
        : null
      }
      <AddBizModal addBiz={addBiz} />
      {
        businesses.map((b) =>{
          return (
            <ListItem key={`business-${b.id}`}>
              <ShowAssessment business={b} />
            </ListItem>
          )
        })
      }
    </>
    )
}
export default ProfilePage;