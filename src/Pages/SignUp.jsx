import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import { db } from '../firebase.config'
import {toast} from 'react-toastify'

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import VisibilityIcon  from '../assets/svg/visibilityIcon.svg'
import OAuth from '../Components/OAuth'


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const { name, email, password } = formData
  
  const navigate = useNavigate()

  const onSubmit = async(e) => {
    e.preventDefault()

    try {
      
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth,email,password)
      const user = userCredential.user

      updateProfile(auth.currentUser,{
        displayName: name,
      })

      const formD2 = {...formData}
      delete formD2.password
      formD2.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formD2)

      navigate('/')
    } catch (error) {
      const msg = error.Code
      toast.error(msg)
    }

  }

  const onChange = e => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <>
      <div>
        <header className='text-center m-4 p-4 text-6xl text-green-800 font-semibold'>
          <p className='text-4xl md:text-6xl'>Sign Up Now</p>
        </header>

        <main className='px-4 mt-8 w-full'>
          <form className='text-emerald-900 flex flex-col justify-center items-center text-xl w-full ' onSubmit={onSubmit}>
            <input 
              type="name" 
              name="name" 
              id="name" 
              placeholder='Full Name' 
              value={name} onChange={onChange} 
              className="md:w-1/3 w-full rounded-xl p-2 border border-green-600 mb-4 outline-none"/>
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder='Email' 
              value={email} 
              onChange={onChange} 
              className="md:w-1/3 w-full rounded-xl p-2 border border-green-600 mb-4 outline-none"/>
            <div className='md:w-1/3 w-full flex flex-row relative border border-green-500  rounded-xl p-2 mb-2'>
              <input type={showPassword ? 'text' : 'password'} placeholder='Password' id='password' value={password} onChange={onChange} className="w-full outline-none"/>
              <img src={VisibilityIcon} alt="show-passsword" onClick={() => setShowPassword((prevState) => !prevState)} className="absolute right-3" />
            </div>


            <div className='flex flex-col items-center w-full text-green-100 mt-8'>
              <button className='flex flex-row items-center justify-center bg-emerald-900 rounded-full px-4 py-2 shadow md:w-1/3  shadow-emerald-900/50'>
                Sign Up
                <ArrowRightIcon className="fill-green-100" />
              </button>
            </div>
          </form>


          <div className='text-center mt-12 font-semibold text-green-500'>
            <Link to='/sign-in'>
              Sign In Instead
            </Link>
          </div>

          <OAuth />
        </main>
      </div>
    </>
  )
}

export default SignUp