import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProfileIcon from "./../avatar.png"
import { app } from '../firebase';
import { signInFailed, signInStart, signinSuccess } from '../redux/userSlice';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fileRef = useRef()
    const { loading, error, currentUser } = useSelector(state => state.user)

    const [image, setImage] = useState(undefined)
    const [imagePercent, setImagePercent] = useState()
    const [imageUploading, setImageUploading] = useState(false)
    const [imageErr, setImageErr] = useState(false)
    const [uploadedURL, setUploadedURL] = useState(null)

    const [user, setUser] = useState(
        {
            username: '',
            email: '',
            password: '',
            profilePicture: ''
        }
    )

    useEffect(() => {
        if (currentUser) {
            setUser({
                ...user,
                username: currentUser.username,
                email: currentUser.email,
                profilePicture: currentUser.profilePicture
            })
        }

    }, [currentUser])

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

    useEffect(() => {
        if (uploadedURL) {
            setTimeout(() => {
                setUploadedURL(null)
            }, 4000);
        }
    }, [uploadedURL])

    // Image upload handling
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

    // Form submission handling
    const handleSubmit = async e => {
        e.preventDefault()
        const userId = currentUser._id
        console.log(user);

        if (!user.username || !user.email) {
            dispatch(signInFailed("Error"))
            return
        }

        try {
            dispatch(signInStart())
            const updated = await axios.put(`/api/user/update/${userId}`, user)
            dispatch(signinSuccess(updated.data.rest))
            toast.success('User Updated Successfully!', {
                id: 'notificaion'
            });
        } catch (error) {
            console.log(error);
            toast.error('User can\'t be Updated !', {
                id: 'notificaion'
            });
            dispatch(signInFailed(500, "Something went wrong!"))
        }
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

            <Toaster
                position='top-right'
                id="notification"
            />
        </div>
    )
}

export default Profile