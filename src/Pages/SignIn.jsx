import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'

import { getAuth,signInWithEmailAndPassword} from 'firebase/auth'

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import VisibilityIcon  from '../assets/svg/visibilityIcon.svg'
import OAuth from '../Components/OAuth'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const {email, password} = formData

  const navigate =useNavigate()

  const onSubmit = async(e) => {
    e.preventDefault()

    try {
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if(userCredential.user) {
        navigate('/')
      }
    } catch (error) {
      toast.error(error) 
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
          <p>Hello!</p> 
          <p className='text-4xl md:text-6xl'>Please Sign In</p>
        </header>

        <main className='px-4 mt-8 w-full '>
          <form onSubmit={onSubmit} className='text-emerald-900 flex flex-col justify-center items-center text-xl w-full'>
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder='Email' 
              value={email} onChange={onChange} 
              className="md:w-1/3 w-full rounded-xl p-2 border border-green-600 mb-4 outline-none"/>
            <div className='md:w-1/3 w-full flex flex-row relative border border-green-500  rounded-xl p-2 mb-2'>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder='Password' 
                id='password' 
                value={password} 
                onChange={onChange} 
                className="w-full outline-none"/>
              <img src={VisibilityIcon} alt="show-passsword" onClick={() => setShowPassword((prevState) => !prevState)} className="absolute right-3" />
            </div>


            <div className='flex flex-col items-end md:w-1/3 w-full text-green-100'>
            <Link to='/forgot' className='mb-8 text-emerald-900/70 text-base'>Forgot Password?</Link>
              <button className='flex flex-row bg-emerald-900 rounded-full px-4 py-2 shadow shadow-emerald-900/50'>
                Sign In
                <ArrowRightIcon className="fill-green-100" />
              </button>
            </div>
          </form>


          <div className='text-center mt-12 font-semibold text-green-500'>
            <Link to='/sign-up'>
              Sign Up Instead
            </Link>
          </div>

          <OAuth />
          
        </main>
      </div>
    </>
  )
}

export default SignIn