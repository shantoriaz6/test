import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import API from '../services/axios'

const VideoDetails = () => {

    const {videoId} = useParams()
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [isLiked, setIsLiked] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    
    //fetch video and comment
    useEffect(() => {
      async function fetchData() {
        try {
            const [VideoRes, commentRes] = await Promise.all([
                API.get(`/videos/${videoId}`),
                 API.get(`/comment/${videoId}`)
            ])

            setVideo(VideoRes.data);
            setComments(commentRes.data);
            
        } catch (error) {
            console.error("Error loaading video or comments", error)
        }
      }
    
      fetchData();
    }, [videoId])



    //toggle like

    const handleToggleLike = async () => {
        try {
            await API.post(`/likes/toggle/v/${videoId}`)

            setIsLiked((prev)=> !prev)
        } catch (error) {
            console.error("Error togglink likr", error)
        }
    }

    //add comment

    const handleAddComment = async (e) => {
        e.preventDefault();
        if(!newComment.trim())
            return;

        try {
            const res = await API.post(`/comments/${videoId}`, {content: newComment});

            setComments([res.data, ...comments])
            setNewComment('');
        } catch (error) {
            console.error("error adding comment", error)
        }

    }
    

    const handleEditComment = async(commentId) => {
        try {
            await API.patch(`/comments/${commentId}`, {content:editedContent});

            setComments((prev) =>
            prev.map((c) =>(c._id ===commentId ? {...c, content:editedContent}:c)));
        } catch (error) {
            console.error("error editing comment", error)
        }
    }

    const handleDeleteComment = async(commentId) => {
        try {
            await API.delete(`/comments/${commentId}`)

            setComments((prev) => prev.filter((c) => c._id !== commentId));
        } catch (error) {
            console.error("error deleting comment",error)
        }
    };


  return (
    <div>
        if (!video) return <p>Loading...</p>;

        <h2>{video.title}</h2>
       <video controls width="100%">
        <source src= {video.videoFile?.url} type='video/mp4'/>
        </video>

        <p>{video.description}</p>
        <p>Views: {video.views}</p>
        <p>Duration: {video.duration}</p>
        <p>Published: {video?.isPublished? "yes": "no"}</p>

        <button onClick={handleToggleLike}>{isLiked ? "unlike" : "Like"}({video.likesCount || 0})</button>

        <hr/>

        <h3>Comments</h3>

        <form onSubmit={handleAddComment}>
            <input type="text"
            placeholder='Add your Comment here'
            value={newComment}
            onChange={(e) => {setNewComment(e.target.value)}}

            
            
            />
            <button type='submit'>post</button>

        </form>

        <ul>
            {comments.map((comment) => (
                
                     <li key ={comment._id}>
                    <strong>{comment.User?.fullName}</strong>

                    {editingCommentId === comment._id?(
                        <>
                        <input
                         value = {editedContent}
                         onChange = {(e) => setEditedContent(e.target.value)}
                        
                        />

                        <button onClick={() => handleEditComment(comment._id)}>save</button>

                        <button onClick={() => setEditingCommentId(null)}>Cancel</button>


                        </>
                    ):(
                        <>
                <p>{comment.content}</p>
                <button onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditedContent(comment.content);
                }}>Edit</button>
                <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
              </>
                    )}


                </li>
                ))}
        </ul>



    </div>
  )
}

export default VideoDetails;