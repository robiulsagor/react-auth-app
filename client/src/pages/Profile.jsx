import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProfileIcon from "./../avatar.png"
import { app } from '../firebase';

const Profile = () => {
    const navigate = useNavigate()
    const fileRef = useRef()
    const { loading, error, currentUser } = useSelector(state => state.user)
    const [user, setUser] = useState(
        {
            username: currentUser.username,
            email: currentUser.email,
            password: '',
            profilePicture: currentUser.profilePicture
        }
    )
    const [image, setImage] = useState(undefined)
    const [imagePercent, setImagePercent] = useState()
    const [imageUploading, setImageUploading] = useState(false)
    const [imageErr, setImageErr] = useState(false)
    const [uploadedURL, setUploadedURL] = useState(null)

    useEffect(() => {
        if (!currentUser) {
            navigate("/signin")
        }
    }, [])

    useEffect(() => {
        if (image) {
            handleImageUpload(image)
        }
    }, [image])

    const handleImageUpload = async () => {
        console.log(image);
        const storage = getStorage(app);
        const imageName = new Date().getTime() + image.name
        const storageRef = ref(storage, imageName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on('state_changed', (snapshot) => {
            setImageUploading(true)
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setImagePercent(progress)
            console.log(user.profilePicture);
        },
            (error) => {
                setImageErr(error)
                console.log(error);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUploadedURL(downloadURL)
                    setImageUploading(false)
                    setUser({ ...user, profilePicture: downloadURL })
                });
            }

        )
    }

    const handleSubmit = async e => {
        e.preventDefault()
        console.log(user);
    }

    return (
        <div className=' max-w-xl mx-auto text-center px-5'>
            <h2 className='text-center text-3xl font-bold max-sm:text-xl'>Profile</h2>

            <form onSubmit={handleSubmit}
                className=' flex flex-col mt-10 form max-sm:mt-4 '
                encType='multipart/form-data'
            >

                {error && (<div className='mb-5'>
                    <p className='text-red-400'>{error} </p>
                </div>)}

                <input type="file" ref={fileRef} className='hidden' accept='image/*' onChange={e => setImage(e.target.files[0])} />

                <div className='  flex flex-col gap-3 items-center justify-center pb-2'>
                    <img src={user.profilePicture ? user.profilePicture : currentUser?.profilePicture || ProfileIcon} alt="profile pic" className='w-20 h-20 rounded-full bg-red-900 cursor-pointer hover:opacity-80 transition-all'
                        onClick={() => fileRef.current.click()} />

                    {/* image uploading status */}
                    {imageUploading ? "Uploading Image: " + imagePercent + "%" : imageErr ?
                        <p className='text-red-600'>Image Uploading Error. </p> : uploadedURL && <p className='text-green-700'>Image Uploaded Successfully!</p>
                    }
                </div>

                <input type="text" value={user.username} name="username"
                    onChange={e => setUser({ ...user, username: e.target.value })}
                    placeholder='Username'

                />
                <input type="email" value={user.email} name="email"
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    placeholder='Email'
                />
                <input type="password" value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                    placeholder='Password'
                />

                <button disabled={loading || imageUploading} type='submit' className='form_btn_1  hover:bg-slate-600 transition-all flex items-center justify-center disabled:opacity-40'>
                    {loading ? (
                        <>
                            <p
                                className="animate-spin h-5 w-5 mr-3 text-white border-2 border-white border-r-0 rounded-full">
                            </p>
                            Loading
                        </>
                    ) : "UPDATE"}
                </button>
            </form>

            <div className='text-red-600 flex items-center justify-between mt-4'>
                <p>Delete Account</p>
                <p>Sign Out</p>
            </div>
        </div>
    )
}

export default Profile