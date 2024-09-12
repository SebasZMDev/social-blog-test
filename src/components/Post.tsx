import './ComStyles.css';
import { IoMdAdd } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";
import { IoMdRepeat } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router-dom';
import ImgPreview from './ImgPreview';
import { useEffect, useState } from 'react';
import { IDContext, PostData, useUser } from '../App';
import { getUserInfo } from '../hooks/getUserInfo';
import { useSave } from '../hooks/useSave';


type Props = {
  id: string;
  userID: string;
  eparent: [PUsername:string, PostID:string] | null;
  content: string;
  media: string[] | null;
  score: IDContext[] | null;
  negscore: IDContext[] | null,
  repost: number;
  comments: PostData[];
  fecha: string;
};



const Post = ({ id, userID, eparent, content, media, repost, comments, fecha }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPostPreviewPage = location.pathname === '/pages/PostPreview';
  const {saveCurrentUser, saveUsersList} = useSave();
  const {user, usersList} = useUser();
  const [imgPrevDisplay,setImgPrevDisplay] = useState<boolean>(false)
  const [imgSrc,setImgSrc] = useState<string>('')
  const {getUsername, getUserPFP, getUserThisPost} = getUserInfo();
  const postData = getUserThisPost(userID, id)
  const [coloUp, setColorUp] = useState<boolean>(false)
  const [colorDown, setColorDown] = useState<boolean>(false)
  const [RePosted, setReposted] = useState<boolean>(false)

  const Preview = () => {
    if (!isPostPreviewPage) {
      navigate(`/pages/PostPreview/${postData?.userID}/${postData?.id}`, {
        state: {
          id,
          userID,
          eparent
        }
      });
    }
  }

  const OpenImgPreview = (imgSrc:string) => {
    setImgSrc(imgSrc)
    setImgPrevDisplay(true)
  }

  const CloseImgPreview = () => {
    setImgSrc('')
    setImgPrevDisplay(false)
  }

  const VoteUpPost = () => {
    if (!postData || !postData.score || !postData.negscore) {
      return;
    }
    const alreadyLiked = postData?.score?.some(
      (element) => element.PUsername === user?.username && element.PostID === id
    );
    const alreadyDisliked = postData?.negscore?.some(
      (element) => element.PUsername === user?.username && element.PostID === id
    );
    if (alreadyDisliked){
      if (user) {
       const UpdatedList = postData.negscore.filter(
        (element)=> !(element.PUsername === user.username && element.PostID === id)
       )
       postData.negscore = UpdatedList
      }
      setColorDown(false)
    }
    if (alreadyLiked){
      if (user) {
        const UpdatedList = postData.score.filter(
          (element) => !(element.PUsername === user.username && element.PostID === id)
        );
        postData.score = UpdatedList;

        const updatedUserLikes = user.userInfo.likes?.filter((like) => !(like.PUsername === user.username && like.PostID === id));
        user.userInfo.likes = updatedUserLikes?updatedUserLikes:null;

        setColorUp(false)

        saveCurrentUser(user);
        const updatedList = usersList?.map((item) => item.id === user.id ? user : item) || [];
        saveUsersList(updatedList);
      }
    }else{
      const newLike: IDContext = {
        PUsername: user?.username||'',
        PostID: id
      }
      if (user){
        const PostLikes = [...(postData?.score || []), newLike ]
        postData.score = PostLikes

        const updatedUserLikes = [...(user.userInfo.likes || []), newLike];
        user.userInfo.likes = updatedUserLikes;

        setColorUp(true)

        saveCurrentUser(user)
        const updatedList = usersList?.map(item => item.id === user.id ? user : item) || [];
        saveUsersList(updatedList)
      }
    }
  }

  const VoteDownPost = () => {
    if (!postData||!postData.negscore||!postData.score){
      return
    }
    const alreadyDisliked = postData.negscore.some(
      (element)=>element.PUsername === user?.username && element.PostID === id
    );
    const alreadyLiked = postData.score.some(
      (element)=>element.PUsername === user?.username && element.PostID === id
    );
    if (alreadyLiked){
      if (user){
        const UpdatedList = postData.score.filter(
          (element)=>(element.PUsername === user.username && element.PostID === id)
        );
        setColorUp(false)
        postData.score = UpdatedList
      }
    }
    if (alreadyDisliked){
      if (user) {
        const UpdatedList = postData.negscore.filter(
          (element) => !(element.PUsername === user.username && element.PostID === id)
        );
        postData.negscore = UpdatedList;

        setColorDown(false)

        saveCurrentUser(user);
        const updatedList = usersList?.map((item) => item.id === user.id ? user : item) || [];
        saveUsersList(updatedList);
      }
    }else{
      const newDislike: IDContext = {
        PUsername: user?.username||'',
        PostID: id
      }
      if (user){
        const PostDislikes = [...(postData?.negscore || []), newDislike ]
        postData.negscore = PostDislikes

        // quita el like
        const UpdatedList = postData.score.filter(
          (element) => !(element.PUsername === user.username && element.PostID === id)
        );
        postData.score = UpdatedList;

        // quita el like del usuario
        const updatedUserLikes = user.userInfo.likes?.filter((like) => !(like.PUsername === user.username && like.PostID === id));
        user.userInfo.likes = updatedUserLikes?updatedUserLikes:null;

        setColorDown(true)

        saveCurrentUser(user);
        const updatedList = usersList?.map((item) => item.id === user.id ? user : item) || [];
        saveUsersList(updatedList);
      }

    }
}

useEffect (()=>{
  if (user && postData?.score && postData.negscore){
    const Liked = postData.score.some(
      (element)=>(element.PUsername === user.username && element.PostID === id)
    );
    const Disliked = postData.negscore.some(
      (element)=>(element.PUsername === user.username && element.PostID === id)
    );
    if (Liked) {setColorUp(true)}
    if (Disliked) {setColorDown(true)}
  }
})


  return (
<div className='post-container' onClick={Preview}>
  <div className='post-display-top'>
    <div style={{ display: 'grid', alignItems: 'center', justifyItems: 'center' }}>
      <img className='post-pfp' src={getUserPFP(user?.id || '')} />
    </div>
    <div className='post-username'>
      <h4>{getUsername(user?.id || '')}</h4>
      <h6>{fecha}</h6>
    </div>
  </div>
  <div>
    <div className='post-text'>{content}</div>
    <div className='post-media'>
      {media ? media.map((img, index) => (
        <img
          onClick={(e) => {
            e.stopPropagation();
            OpenImgPreview(img);
          }}
          className='post-media-item'
          style={{ width: media.length < 2 ? '200%' : '', height: media.length < 2 ? '200%' : '' }}
          key={index}
          src={img}
          alt={`media-${index}`}
        />
      )) : ''}
    </div>
  </div>
  <div className='post-display-bottom'>
    <div className='post-score'>
      <IoMdAdd style={coloUp ? { color: 'green' } : {}} onClick={(e) => { e.stopPropagation(); VoteUpPost();}} className='post-buttons' />
      <h4 onClick={(e) => { e.stopPropagation(); }}>{postData?.score ? postData?.score.length - (postData.negscore ? postData.negscore.length : 0) : 0}</h4>
      <IoMdRemove style={colorDown? {color: 'red'}:{}} onClick={(e) => { e.stopPropagation(); VoteDownPost();}} className='post-buttons' />
    </div>
    <div className='post-score'>
      <IoMdRepeat className='post-buttons' />
      <h4>{repost}</h4>
    </div>
    <div className='post-score'>
      <FaComment className='post-buttons' />
      <h4>{comments ? comments.length : 0}</h4>
    </div>
    <IoMdShare className='post-buttons' />
  </div>
  {imgPrevDisplay && <ImgPreview imgSrc={imgSrc} closeImg={CloseImgPreview} />}
</div>

  );
};

export default Post;
