import React from 'react';
// import logo from './logo.svg';


import Menu from './MenuComponent';
import DishDetail from './DishdetailComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import About from "./AboutComponent";
import Favorites from './FavoriteComponent';
import { Switch, Route, Redirect,withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, postFeedback, fetchDishes, fetchComments, fetchPromos, fetchLeaders, loginUser, logoutUser, fetchFavorites, googleLogin, postFavorite, deleteFavorite,Login } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders,
    favorites: state.favorites,
    auth: state.auth
  }
}
const mapDispatchToProps = dispatch => ({
  
  postComment: (dishId, rating, comment) => 
  dispatch(postComment(dishId, rating, comment)),
  postComment: (dishId, rating, comment) => dispatch(postComment(dishId, rating, comment)),
  fetchDishes: () => { dispatch(fetchDishes())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),

  postFeedback: (feedback) => dispatch(postFeedback(feedback)),
  loginUser: (creds) => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
  fetchFavorites: () => dispatch(fetchFavorites()),
  googleLogin: () => dispatch(googleLogin()),
  FacebookLogin: () => dispatch(Login()),
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))

});

class Main extends React.Component {
  
  //     onDishSelect(dishId) {
  //       this.setState({ selectedDish: dishId});
  // }
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchLeaders();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchFavorites();
  }
  componentWillUnmount() {
    this.props.logoutUser();
  }
  
  render() {

    const HomePage = () => {
      return(
          <Home
          dish={this.props.dishes.dishes.filter((dish)=> dish.featured)[0]}
          dishesLoading={this.props.dishes.isLoading}
          dishesErrMess={this.props.dishes.errMess}

          promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
              promoLoading={this.props.promotions.isLoading}
              promoErrMess={this.props.promotions.errMess}
          
          leader={this.props.leaders.leaders.filter((leader)=> leader.featured)[0]}
          leadersLoading={this.props.leaders.isLoading}
          leadersErrMess={this.props.leaders.errMess}
          />
      );
    }

    
    const DishWithId = ({match}) => {
      return(
        (this.props.auth.isAuthenticated && this.props.favorites.favorites)
        ?
        <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish._id === match.params.dishId)[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dish === match.params.dishId)}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          
          favorite={this.props.favorites.favorites.dishes.some((dish) => dish === match.params.dishId)}
          postFavorite={this.props.postFavorite}
          />
        :
        <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish._id === match.params.dishId)[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dish === match.params.dishId)}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          favorite={false}
          postFavorite={this.props.postFavorite}
          />
      );
    };

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        this.props.auth.isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{
              pathname: '/home',
              state: { from: props.location }
            }} />
      )} />

    );
    const Aboutus =() => {
      return(
        <About leaders={this.props.leaders.leaders}
        isLoading={this.props.leaders.isLoading}
            errMess={this.props.leaders.errMess}/>

      );
    }
    return (
      <div>
        <Header
        auth={this.props.auth} 
        loginUser={this.props.loginUser} 
        logoutUser={this.props.logoutUser}
        googleLogin={this.props.googleLogin}
        facebookLogin={this.props.FacebookLogin}
        />

        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
              <Switch>
                  <Route path='/home' component={HomePage} />
                  <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
                  <Route path='/menu/:dishId' component={DishWithId} />
                  <PrivateRoute exact path="/favorites" component={() => <Favorites favorites={this.props.favorites} dishes={this.props.dishes} deleteFavorite={this.props.deleteFavorite} />} />
              
                  <Route path='/contactus' component={()=> <Contact 
                  postFeedback={this.props.postFeedback}
                  resetFeedbackForm={this.props.resetFeedbackForm}
                  />} />
                  <Route path='/aboutus' component={Aboutus}/>
                  <Redirect to="/home" />
              </Switch> 
          </CSSTransition>
        </TransitionGroup>
          
        <Footer/>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main));