import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'

const Footer = () => {
    const navigate = useNavigate()
    const locate = useLocation()
    
    const pathMatchRoute = (route) => {
        if(route === locate.pathname){
            return true
        }
    }

    return (
        <footer className='w-full z-[10000] sticky bottom-0 mt-8'>
                <ul className='flex flex-row justify-evenly bg-emerald-100 py-2'>
                    <li className='cursor-pointer' onClick={() => navigate('/')}>
                        <ExploreIcon className={pathMatchRoute('/') ? 'fill-emerald-900 md:w-10 md:h-10 w-8 h-8' : 'fill-green-400 md:w-10 md:h-10 w-8 h-8'}/>
                        <p className={pathMatchRoute('/') ? 'text-emerald-900 font-bold text-xs' : 'text-green-400 md:text-sm'}>Explore</p>
                    </li>
                    <li className='cursor-pointer' onClick={() => navigate('/offers')}>
                        <OfferIcon className={pathMatchRoute('/offers') ? 'fill-emerald-900 md:w-10 md:h-10 w-8 h-8' : 'fill-green-400 md:w-10 md:h-10 w-8 h-8'}/>
                        <p className={pathMatchRoute('/offers') ? 'text-emerald-900 font-bold text-xl' : 'text-green-400 text-sm'}>Offer</p>
                    </li>
                    <li className='cursor-pointer' onClick={() => navigate('/profile')}>
                        <PersonOutlineIcon className={pathMatchRoute('/profile') ? 'fill-emerald-900 md:w-10 md:h-10 w-8 h-8' : 'fill-green-400 md:w-10 md:h-10 w-8 h-8'}/>
                        <p className={pathMatchRoute('/profile') ? 'text-emerald-900 font-bold text-xl' : 'text-green-400 text-sm'}>Profile</p>
                    </li>
                </ul>
        </footer>
    )
}

export default Footer