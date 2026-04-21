import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import ChatBox from "./pages/ChatBox";
import {useUser, useAuth} from '@clerk/react'
import Layout from './pages/Layout';
import toast, {Toaster} from 'react-hot-toast';
import { useEffect, useRef } from "react";
import { useDispatch} from 'react-redux'
import { fetchConnections } from "./features/connections/connectionsSlice.js";
import { addMessages } from "./features/messages/messagesSlice.js";
import Notification from "./components/Notification.jsx";
import { fetchUser } from "./features/user/userSlice.js";

const App = () => {

  const {user} = useUser();
  const {getToken} = useAuth();
  const location = useLocation();
  const pathnameRef = useRef(location.pathname);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token))
        dispatch(fetchConnections(token))
      }
    }
    fetchData()
  }, [user, getToken, dispatch]);

  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id);

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data)

        if (pathnameRef.current === ('/messages/' + message.from_user_id._id)) {
          dispatch(addMessages(message))
        }else{
          toast.custom((t) => (
            <Notification t={t} message={message}/>
          ), {position: "bottom-right"})
        }
      }
      return () => {
        eventSource.close()
      }
    }
  }, [user, dispatch, location])

  return(
    <>
    <Toaster/>
    <Routes>
      <Route path="/" element={ !user ? <Login/> : <Layout/>}>
      <Route index element={<Feed/>}/>
      <Route path="messages" element={<Messages/>}/>
      <Route path="messages/:userId" element={<ChatBox/>}/>
      <Route path="connections" element={<Connections/>}/>
      <Route path="discover" element={<Discover/>}/>
      <Route path="profile" element={<Profile/>}/>
      <Route path="profile/:profileId" element={<Profile/>}/>
      <Route path='create-post' element={<CreatePost/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App;