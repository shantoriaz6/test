import React from 'react'
import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/axios';

const EditVideo = () => {

    const {videoId} = useParams();
    const navigate = useNavigate()

    const [video, setVideo] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: ""
    });

    useEffect(() => {
     async function fetchvideo() {
        try {
            const res = await API.get(`/videos/${videoId}`);

            setVideo(res.data);
            setFormData({
                title: res.data.title || "",
                description: res.data.description || "",
                  thumbnail: res.data.thumbnail || "",
            });

        } catch (error) {
            console.error("error fetching video", error)
        }
     }
    fetchvideo();
     
    }, [videoId])


    const handleChange = (e) => {
        setFormData((prev) =>({
            ...prev,
            [e.target.name ] : e.target.value

        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.patch(`/videos/${videoId}`, formData)

            navigate(`/videos/${videoId}`);

        } catch (error) {
             console.error('Error updating video', error);
        }
    }

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this video?");

        if(!confirm) return;

        try {
            await API.delete(`/videos/${videoId}`);
            navigate("/");

        } catch (error) {
             console.error('Error deleting video', error);
        }
    };

    if(!video) return <p>Loading...</p>
    




  return (
    <div className='max-w-xl mx-auto p-4'>
        <h2 className='text-2xl font-bold mb-4'>Edit Video</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block font-semibold'>Title</label>

                <input 
                type="text" 
                name= "title"
                value={formData.title}
                onChange={handleChange}
                className= "w-full border px-3 py-2 rounded"
                
                />
            </div>

            <div>
                <label className='block font-semibold'>Description</label>

                <input 
                type="text" 
                name= "description"
                value={formData.description}
                onChange={handleChange}
                className= "w-full border px-3 py-2 rounded"
                
                />
            </div>

            <div>
                <label className='block font-semibold'>Thumbnail URL</label>

                <input 
                type="text" 
                name= "thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className= "w-full border px-3 py-2 rounded"
                
                />

                {formData.thumbnail && (
                    <img 
                    src={formData.thumbnail} 
                    alt="Thumbnail Preview"
                    className='mt-2 w-full max-h-48 object-cover rounded'
                    />
                )}
            </div>

            <div className='flex gap-4'>
                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>Save Changes</button>

                <button type='"button' onClick={handleDelete} className='bg-red-600 text-white px-4 py-2 rounded  hover:bg-red-700'>Delete Video</button>

            </div>

        </form>

    </div>
  )
}

export default EditVideo; 