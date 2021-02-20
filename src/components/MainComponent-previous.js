import React, { useEffect } from 'react';
import Directory from './DirectoryComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { postComment, fetchCampsites, fetchComments, fetchPromotions } from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        partners: state.partners,
        promotions: state.promotions
    };
};

const mapDispatchToProps = {
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text)),
    fetchCampsites: () => (fetchCampsites()),
    resetFeedbackForm: () => (actions.reset('feedbackForm')),
    fetchComments: () => (fetchComments()),
    fetchPromotions: () => (fetchPromotions())
};

const Main = ({fetchCampsites, fetchComments, fetchPromotions, campsites, promotions, postComment, partners, comments, resetFeedbackForm, location}) => {

    useEffect(() => {
        console.log('hit')
        fetchCampsites();   
        fetchComments();
        fetchPromotions();

    }, [])

        const HomePage = () => {
            return (
                <Home 
                campsite={campsites.campsites.filter(campsite => campsite.featured)[0]}
                campsitesLoading={campsites.isLoading}
                campsitesErrMess={campsites.errMess}
                promotion={promotions.promotions.filter(promotion => promotion.featured)[0]}
                promotionLoading={promotions.isLoading}
                promotionErrMess={promotions.errMess}
                partner={partners.filter(partner => partner.featured)[0]}
                />
            );
        }

        const CampsiteWithId = ({match}) => {
            return (
                <CampsiteInfo 
                    campsite={campsites.campsites.filter(campsite => campsite.id === +match.params.campsiteId)[0]}
                    campsitesLoading={campsites.isLoading}
                    campsitesErrMess={campsites.errMess}
                    comments={comments.comments.filter(comment => comment.campsiteId === +match.params.campsiteId)}
                    commentsErrMess={comments.errMess}
                    postComment={postComment}
                />
            );
        }


        return (
            <div>
                <Header />
                <TransitionGroup>
                    <CSSTransition key={location.key} classNames="page" timeout={300}>
                <Switch>
                    <Route path="/home" component={HomePage} />
                    <Route exact path='/directory' render={() => <Directory campsites={campsites} /> } />
                    <Route path='/directory/:campsiteId' component={CampsiteWithId} />
                    <Route exact path='/aboutus' render={() => <About partners={partners} /> } />
                    <Route exact path='/contactus' render={() => <Contact resetFeedbackForm={resetFeedbackForm} />} />
                    <Redirect to='/home' />
                </Switch>
                </CSSTransition>
                </TransitionGroup>
                <Footer />
            </div>
        )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));