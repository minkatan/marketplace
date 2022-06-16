import { useLocation } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    let locate = useLocation().pathname

    if(locate === '/') {
        locate = 'Categories'
    }else if(locate.length < 12) {
        locate = locate.substring(1)
    }else if (locate.includes('rent')) {
        locate = 'Rent'
    }else if (locate.includes('sell')) {
        locate = 'Sales'
    }else if (locate.includes('contact')) {
        locate = 'Contact User'
    }else if (locate.includes('update')) {
        locate = 'Update Listing'
    }else if (locate.includes('add')) {
        locate = 'New Listing'
    }

    const auth = getAuth()
    const navigate = useNavigate()
    const user = auth.currentUser;

    const onLogout = () => {
        auth.signOut()
        navigate('/sign-in')
      }
    
      if(!user) {
        return <></>
    } else {

        return (
            <header className='flex flex-row flex-wrap justify-between p-4 bg-emerald-100'>
                <h1 className='text-emerald-900 text-4xl font-bold capitalize'>
                    {locate}
                </h1>
                {locate === 'Sign-in' || locate === 'Sign-up' ? '' :
                <button 
                    type='button' 
                    onClick={onLogout} 
                    className='bg-emerald-200 p-2 rounded-xl shadow-xl'>Logout
                </button>
                } 
            </header>
        )
    }
}

export default Navbar

// function capitalizeFirstLetter (str) {
//     return str.charAt(0).toUpperCase() + str.slice(1);
// }