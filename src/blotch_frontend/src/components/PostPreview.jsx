import React from "react";
// import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { HeartIcon, CommentIcon, WhiteHeartIcon } from "./Icons";
import AlertCircleOutline from '../../assets/alert-circle-outline.svg';
import Comment from './Comment';

import Modal from "./Modal";
import ProfilePreview from "./ProfilePreview";
import ReportMenu from "./ReportMenu";
import { getPortalFromPrincipal, arrayBufferToBase64 } from "../utils/index";
import { portal } from "../../../declarations/portal/index";

const Wrapper = styled.div`
	margin-top: 1rem;
	cursor: pointer;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 1.5rem;
	padding-bottom: 100px;

	img {
		width: 250px;
		height: 250px;
		object-fit: cover;
	}

	.container-overlay {
		position: relative;
	}

	.container-overlay:hover .overlay {
		display: block;
	}

	.overlay {
		border-radius: 4px;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		width: 250px;
		height: 250px;
		display: none;
	}

	.overlay-content {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-weight: 500;
		font-size: 1.1rem;
	}

	svg {
		fill: ${(props) => props.theme.white};
		position: relative;
		top: 4px;
	}

	span {
		display: flex;
		display: block;
		align-items: center;
		padding-right: 0.5rem;
	}

	span:first-child {
		margin-right: 1rem;
	}

	@media screen and (max-width: 1000px) {
		img, .overlay {
		width: 233px;
		height: 233px;
	}

	@media screen and (max-width: 800px) {
		img, .overlay {
		width: 200px;
		height: 200px;
	}

	@media screen and (max-width: 700px) {
		grid-template-columns: 1fr 1fr;

		img, .overlay {
			height: 240px;
			width: 100%;
	}

	@media screen and (max-width: 500px) {
		grid-gap: 1rem;

		img, .overlay {
			height: 200px;
			width: 100%;
	}

	@media screen and (max-width: 400px) {
		img, .overlay {
			height: 170px;
			width: 100%;
	}
	}
`;

const ModalWrapper = styled.div`
	.modalContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		jusitfy-content: center;
	}

	.overlay {
		display: None;
	}

	.reportContainer {
		display: flex;
		flex-align: center;
		justify-content: center;
		width: 30px;
	}

	.postContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		max-width: 75vw;
		max-height: 75vh;
	}

	.postImageContainer {
        border-radius: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.postImage {
		min-width: 500px;
		min-height: 500px;
		max-width: 500px;
		max-height: 500px;
		object-fit: cover;
		padding: 5%;
	}

	textarea {
    padding: 3px;
		resize: none;
		width: 300px;
		margin-top: 5%;
		border-radius: 7px;
	}

	p {
		color: white;
	}

	h3:hover {
		cursor: pointer;
		color: black;
	}

	h3 {
		color: white;
	}

	.comments {
		width: 30vw;
		height: 40vh;
		overflow: auto;
	}

	.numLikers {
		color: white;
	}

	.liked {
		color: red;
	}
`;

class Post extends React.Component {
	constructor(props) {
		super(props);
	}

	getImageFromPost(post) {
		console.log('getting image');
		console.log(post);
		let picArray = post['content'].media;
		let picString = arrayBufferToBase64(picArray);
		const imgSrc = "data:image/png;base64," + picString.toString('base64');
		return imgSrc;
	}

	getLikesFromPost(post) {
		let likes = post.numLikers + ""
		return likes;
	}

	render() {
		let post = this.props.post;
		return (
			<>
			<div
				className="container-overlay"
				onClick={() => {this.props.showPost(post)}}
			>
				<img className='postImage' src={this.getImageFromPost(post)} alt="post" />
				<div className="overlay">
					<div className="overlay-content">
					<span>
						<HeartIcon /> {this.getLikesFromPost(post)}
					</span>
					<span>
						<CommentIcon /> {post.comments.length}
					</span>
					</div>
				</div>
			</div>
			</>
		);
	}

}

var myPortal;
class PostPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			comments: [],
			showModal: false,
			showReport: false,
			activePost: {},
			isLiked: false
		};
	}

	// getPost = (postID) => {
	// 	portal.getPost(postID).then(post => {
	// 		let postObject = post['ok'];
	// 		postObject['ID'] = postID;
	// 		this.setState(prevState => ({'posts': [...prevState.posts, postObject]}), () => {
	// 		});
	// 	});
	// }

	// getPosts = () => {
	// 	portal.getPostIDs().then(posts => {
	// 		for(let i = 0; i < posts.length; i++) {
	// 			this.getPost(posts[i]);
	// 		}
	// 	});
	// }

	getPortal = () => {
		if(this.props.myPortalPrincipal != '') {
			myPortal = getPortalFromPrincipal(this.props.myPortalPrincipal);
		}
	}

	showReport(post) {
		console.log('show report');
		this.setState({showReport: true, showModal: false});
	}

	cancelReport() {
		console.log('cancel report');
		this.setState({showReport: false, showModal: true});
	}

	submitReport() {
		console.log('submit report');
		myPortal.reportPost(this.state.activePost.ID).then(response => {
			console.log(response);
		})
		this.setState({showReport: false, showModal: true});
	}

	showPost(post) {
		this.setState({'isLiked': false});
		myPortal.getLikedPosts().then(likedPosts => {
			for(let i = 0; i < likedPosts.length; i++) {
				if(likedPosts[i].id == post.ID.id) {
					this.setState({'isLiked': true});
				}
			}
		});
		let formattedComments = [];
		for(let i = 0; i < post.comments.length; i++) {
			let commenterPortal = getPortalFromPrincipal(post.comments[i].posterPortalPrincipal);
			commenterPortal.getProfile().then(p => {
				let username = p['username'];
				let avatarArray = p['avatar'];
				let avatarString = arrayBufferToBase64(avatarArray);
				const imgSrc = "data:image/png;base64," + avatarString.toString('base64');
				formattedComments[i] = {text: post.comments[i].content, username: username, avatar: imgSrc};
				this.setState({showModal: true, activePost: post, comments: formattedComments});
			});
		}
		if(post.comments.length == 0) {
			this.setState({showModal: true, activePost: post, comments: []});
		}
	}

	hidePost() {
		this.setState({showModal: false});
	}
	
	toggleLike() {
		if(this.state.isLiked == true) {
			myPortal.unlikePost(this.state.activePost.ID);
			let newActivePost = this.state.activePost;
			newActivePost.numLikers -= 1n;
			this.setState({activePost: newActivePost, 'isLiked': false});
		} else {
			myPortal.likePost(this.state.activePost.ID);
			let newActivePost = this.state.activePost;
			newActivePost.numLikers += 1n;
			this.setState({activePost: newActivePost, 'isLiked': true});
		}
	}

	comment() {
		const commentText = document.getElementById('commentBox').value;
		myPortal.createComment(this.state.activePost.ID, commentText).then(() => {
			myPortal.getProfile().then(p => {
				let username = p['username'];
				let avatarArray = p['avatar'];
				let avatarString = arrayBufferToBase64(avatarArray);
				const imgSrc = "data:image/png;base64," + avatarString.toString('base64');
				let newComments = this.state.comments;
				newComments.push({text: commentText, username: username, avatar: imgSrc});
				this.setState({comments: newComments});
				document.getElementById('commentBox').value = '';
			});
		});
	}

	componentDidUpdate() {
		if(this.props.myPortalPrincipal != '') {
			this.getPortal();
		}
	}

	render() {
		let i = 0;
		return (
			<>
			<Wrapper>
			{this.props.postObjects?.map((post) => (
				<Post key={post.postTime} post={post} showPost={() => {this.showPost(post)}}></Post>
			))}
			</Wrapper>
			<ModalWrapper>
				{this.state.showModal && 
				<>
					<Modal>
						<div className='modalContainer'>
							<div className='reportContainer'>
								<AlertCircleOutline onClick={() => {this.showReport(this.state.activePost);}}/>
							</div>
							<div style={{}}>
								<div className='postContainer'>
									<div className='postImageContainer'>
										<ProfilePreview
											portalPrincipal={this.state.activePost.ID.portalPrincipal}
											myPortalPrincipal={this.props.myPortalPrincipal}></ProfilePreview>
										<Post className='modalImage' post={this.state.activePost} showPost={() => {this.hidePost()}}></Post>
										<WhiteHeartIcon onClick={() => {this.toggleLike()}} />
										<div className={(this.state.isLiked ? "liked " : "") + "numLikers"}>{this.state.activePost.numLikers + ""}</div>
									</div>
									<div className='commentSection'>
										<div className='comments'>
											{this.state.comments.map(comment => (
												<Comment key={i++} avatar={comment.avatar} username={comment.username} text={comment.text}></Comment>
											))}
										</div>
										<textarea id='commentBox' placeholder="Add comment"></textarea>
										<h3 onClick={() => {this.comment(this.state.activePost)}} className='commentButton'>Comment</h3>
										<br></br>
										<br></br>
										<p>{this.state.activePost.content.description}</p>
									</div>
								</div>
							</div>
						</div>
					</Modal>
				</>
				}
			</ModalWrapper>
			{ this.state.showReport && 
				<Modal>
					<ReportMenu cancel={() => {this.cancelReport()}} submit={() => {this.submitReport()}}></ReportMenu>
				</Modal>
			}
			</>
		);
	}
};

export default PostPreview;
