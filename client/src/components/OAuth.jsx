import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInFailed, signinSuccess } from "../redux/userSlice";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"

const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const handleGoogleSignin = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const { displayName, email, photoURL } = result.user

            const user = await axios.post('/api/auth/google', {
                displayName, email, photoURL
            })
            console.log(user.data.userData);

            dispatch(signinSuccess(user.data.userData))
            navigate("/")
        } catch (error) {
            console.log(error);
            dispatch(signInFailed(error?.response?.data?.message || error?.message || "Something went Wrong!"))
            console.log(error);

            toast.error(error?.response?.data?.message || error?.message, {
                id: 'notificaion'
            });
        }
    }
    return (
        <div>
            <button type='button' className='form_btn_2 hover:opacity-80 transition-all'
                onClick={handleGoogleSignin}>CONTINUE WITH GOOGLE</button>
            <Toaster position="top-right" />
        </div>
    )
}

export default OAuth