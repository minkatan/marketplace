import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { db } from "../firebase.config"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "react-toastify"
import googleIcon from '../assets/svg/googleIcon.svg'

const OAuth = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const googleClick = async() => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // check for user in bd
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if(!docSnap.exists()){
                // create user
                await setDoc(doc(db, 'users', user.uid),{
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                    
                })
            }
            navigate('/')

        } catch (error) {
            const msg = error.code
            
            toast.error(msg)
        }
    }

    return (
    <div className="flex justify-center items-center pb-4">
        <button type="button" className="flex flex-row items-center justify-center mt-8 bg-emerald-100 rounded shadow shadow-emerald-400 py-3 px-6" onClick={googleClick}>
            <p className="mr-4 ">
            {location.pathname === '/sign-up' ? 'Sign Up With' : 'Sign In With'}</p>
                <img src={googleIcon} alt="googleIcon" className="w-8 h-8" />
        </button>
    </div>
  )
}

export default OAuth