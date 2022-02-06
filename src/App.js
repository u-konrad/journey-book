import Layout from "./shared/components/Layout";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";

import PrivateRoute from "./shared/components/PrivateRoute";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import { useDispatch } from "react-redux";
import { favActions, userActions } from "./store/store";
import React, { useEffect } from "react";
import { setAlertWithTimeout } from "./store/alert-actions";
import CustomToast from "./shared/components/CustomToast";



function App() {
  const { token, login, logout, userId, username, loginState } = useAuth();
  const dispatch = useDispatch();

  const AddPost = React.lazy(()=>import("./pages/AddPages/AddPost"))
  const AddJourney = React.lazy(()=>import("./pages/AddPages/AddJourney"))
  const AddExp = React.lazy(()=>import("./pages/AddPages/AddExp"))
  const UserPage  = React.lazy(()=>import("./pages/UserPage/UserPage"))
  const RegisterPage =React.lazy(()=>import("./pages/AuthPages/RegisterPage"))
  const LoginPage =React.lazy(()=>import("./pages/AuthPages/LoginPage"))
  const ProfilePage =React.lazy(()=>import("./pages/AuthPages/ProfilePage"))
  const JourneyPage =React.lazy(()=>import("./pages/JourneyPage/JourneyPage"))
  const PostPage = React.lazy(()=>import("./pages/PostPage/PostPage"))
  const SearchPage =React.lazy(()=>import("./pages/SearchPage/SearchPage"))
  const NotFoundPage =React.lazy(()=>import("./pages/NotFoundPage"))


  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+"favorites", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.error);
        }
        let {
          favPosts,
          favUsers,
          favJourneys,
          favExps,
          profileImage,
          username,
        } = responseData.user;
        favPosts = favPosts.map((el) => el.item);
        favUsers = favUsers.map((el) => el.item);
        favJourneys = favJourneys.map((el) => el.item);
        favExps = favExps.map((el) => el.item);

        dispatch(
          favActions.updateFavs({ favPosts, favUsers, favJourneys, favExps })
        );
        dispatch(
          userActions.updateUser({ userImg: profileImage, userName: username })
        );
      } catch (err) {
        dispatch(
          setAlertWithTimeout({
            alertType: "danger",
            alertText: err.message,
          })
        );
      }
    };

    if (token) {
      fetchFavs();
    }
  }, [token,dispatch]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        loginState: loginState,
        token: token,
        userId: userId,
        username: username,
        login: login,
        logout: logout,
      }}
    >
      <Layout>
        <CustomToast />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/users/:userId" component={UserPage} />

          <PrivateRoute path="/posts/new" exact>
            <AddPost />
          </PrivateRoute>
          <PrivateRoute path="/posts/edit/:itemId">
            <AddPost mode="edit" />
          </PrivateRoute>
          <PrivateRoute path="/posts/new/:journeyId">
            <AddPost />
          </PrivateRoute>

          <PrivateRoute path="/journeys/new" exact>
            <AddJourney />
          </PrivateRoute>
          <PrivateRoute path="/journeys/edit/:itemId">
            <AddJourney mode="edit" />
          </PrivateRoute>

          <PrivateRoute path="/exps/new" exact>
            <AddExp />
          </PrivateRoute>
          <PrivateRoute path="/exps/edit/:itemId" exact>
            <AddExp mode="edit" />
          </PrivateRoute>
          <PrivateRoute path="/exps/new/:journeyId">
            <AddExp />
          </PrivateRoute>

          <PrivateRoute path="/profile">
            <ProfilePage />
          </PrivateRoute>
          <Route path="/posts/:itemId">
            <PostPage mode="post" />
          </Route>
          <Route path="/exps/:itemId">
            <PostPage mode="exp" />
          </Route>
          <Route path="/journeys/:journeyId" component={JourneyPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/search" component={SearchPage} />
          <Route path='*' component={NotFoundPage}/>

        </Switch>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
