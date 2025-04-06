import React, {useContext, useEffect, useState} from 'react'
import { UserContext } from '../context/user.context';
import { useNavigate } from 'react-router-dom';

const UserAuth = ({children}) => {
    const {user} = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');


    useEffect(() => {
        if(user){
            setLoading(false);
        }

        if(!token || !user){
            navigate('/login');
        }

    }, [])

    if(loading){
        return <div>loading...</div>
    }

  return (
    <>
        {children}
    </>
  )
}

export default UserAuth