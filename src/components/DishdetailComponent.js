import React,{Component} from 'react';

import { Card, CardImg,  CardText, CardBody,
    CardTitle,Breadcrumb , BreadcrumbItem,
    Button,Modal, ModalHeader, ModalBody, Row,
    Label, Col , CardImgOverlay } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm} from 'react-redux-form';
import { Loading } from './LoadingComponent';
// import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

//===================================================
// const required= (val) => val && val.length;
// const maxLength= (len) => (val) => !(val) || (val.length <= len);
// const minLength= (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component{

    constructor(props){
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleComment = this.handleComment.bind(this);

    
        this.state ={
            isModalOpen: false
        };
    }
    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
      }
      handleComment(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.comment);
      

    }
      render()
      {
        return(
            <React.Fragment>
            <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
           
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleComment(values)}>
                    <Row className="form-group">
                        <Label htmlFor="rating" md={6}>Rating</Label>
                        <Col md={{size:10}}>
                                    <Control.select type="select" name="rating" 
                                    model=".rating" className="form-control" 
                                    defaultValue={1}>    
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                    </Control.select>
                                </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="comment" md={4}>Comment</Label>
                                <Col md={10}>
                                    <Control.textarea type="textarea" id="comment" name="comment"
                                        rows="6" model=".comment" className="form-control" />
                                </Col>
                                </Row>
                                <Row className="form-group">
                                <Col md={{size: 10}}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                    </LocalForm>
                </ModalBody>
            </Modal>
           
            </React.Fragment>
        );
      }
}

    function  RenderDish( {dish, favorite, postFavorite}){
      
            return(
                <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }} >
                    <Card>
                        <CardImg top src={dish.image} alt={dish.name}/>
                        <CardImgOverlay>
                                <Button outline color="primary" onClick={() => favorite ? console.log('Already favorite') : postFavorite(dish._id)}>
                                    {favorite ?
                                        <span className="fa fa-heart"></span>
                                        : 
                                        <span className="fa fa-heart-o"></span>
                                    }
                                </Button>
                            </CardImgOverlay>
                        <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description} </CardText>
                        </CardBody>
                     </Card>



                </FadeTransform>
            
        );
      
    }

    function RenderComments({comments, postComment, dishId}) {
                
                const my_comments=comments.map((comment)=>{
                    // const date= new Date(comment.date)
                    return(
                     <Stagger in key={comment.id}>
                        <Fade in>
                        <li key={comment.id} >
                            <p >{comment.comment} </p>
                            <p>{comment.rating} stars ,
                            --{comment.author.firstname} {comment.author.lastname} 
                           </p>

                        </li>
                        </Fade>
                        </Stagger>   
                        
                    );
                    
                });
                return(
                        <div>
                            <h4>Comments</h4>
                            <ul className="list-unstyled">
                            
                            {my_comments}
                            <CommentForm
                            dishId={dishId} postComment={postComment}/>    
                            </ul>
                              
                             
                        </div>
                        
                   
                );
            
    }
    
    const DishDetail = (props) => {
        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null)
            return (
                <div className="container">
                <div className="row">
                    <Breadcrumb>

                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                    <RenderDish
            dish={props.dish}
            favorite={props.favorite}
            postFavorite={props.postFavorite}
          />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments}
                         postComment={props.postComment}
                        dishId={props.dish._id}
      />
                    </div>
                </div>
                </div>
            );
            else
            return(
                <div></div>
            );
}
  

export default DishDetail;