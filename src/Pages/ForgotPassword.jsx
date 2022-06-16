import {useState} from 'react'
import { Link } from 'react-router-dom'
import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')

  const onChange = (e) => {
    setEmail(e.target.value)
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      
      toast.success('Email Sent')
    } catch (error) {
      const msg = error.code

      toast.error(msg)
    }

  }

  return (
    <>
      <header className='text-center mx-4 mt-24 p-4 md:text-6xl text-2xl text-green-800 font-semibold'>
        Forgot Password
      </header>
      <main className='mx-8 mt-4'>
        <form onSubmit={onSubmit} className='text-emerald-900 flex flex-col justify-center items-center text-xl w-full'>
            <input type="email" name="email" id="email" placeholder='Email' value={email} onChange={onChange} className="md:w-1/3 w-full rounded-xl p-2 border border-green-600 mb-4 outline-none"/>
            <button className='flex flex-row bg-emerald-900 rounded-full px-4 py-2 shadow shadow-emerald-900/50 text-green-100 md:w-1/3 w-full items-center justify-center'>
                Reset Password
                <ArrowRightIcon className="fill-green-100" />
            </button>
        </form>

        <div className='flex flex-row container mx-auto justify-evenly items-center text-center mt-8 font-semibold text-green-500'>
            <Link to='/sign-up' className='text-emerald-900'>
              Sign Up Instead
            </Link>
            <Link to='/sign-in'>
              Sign In
            </Link>
          </div>
      </main>
    </>
  )
}

export default ForgotPassword