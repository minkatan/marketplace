import {useState, useEffect}from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {toast} from 'react-toastify'

import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
// Import Swiper styles
import 'swiper/css/bundle';

import { getDoc, doc } from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'

import Loading from '../Components/Loading'
import Map from '../Components/Map'

import shareIcon from '../assets/svg/shareIcon.svg'

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const ItemListing = () => {
  const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db , 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false)
            }
        }
        
        fetchListing()
        
        
    },[navigate,params.listingId])
    
    if(loading){
        return <Loading />
    }

    return (
        <main className='flex flex-col h-screen md:container mx-auto my-4 text-emerald-900'>
            <Swiper slidesPerView={1} pagination={{clickable:true}} className='w-full h-64'>
                {listing.imageUrls.map((url,index) => (
                    <SwiperSlide key={index} className=''>
                        <div 
                        className='w-full h-full'
                        style={{background: `url(${listing.imageUrls[index]}) center no-repeat`,
                                backgroundSize: 'cover',}}>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='mt-4 md:text-3xl text-xl font-semibold relative flex flex-wrap items-center'>
                <div>
                    <span className='uppercase bg-green-100 mx-1 p-1 rounded shadow shadow-green-900'>
                        FOR {listing.type} 
                    </span>
                    {listing.name} - 
                    ${listing.offer ? decimalNumber(listing.discountedPrice) : decimalNumber(listing.regularPrice)}{listing.type === 'rent' && '/month'}
                </div>
                <div onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    setShareLinkCopied(true)
                    setTimeout(() => {
                        setShareLinkCopied(false)
                    },2000)

                    if(shareLinkCopied){
                        toast.success('Link Copied')
                    }
                }} className="ml-4 cursor-pointer bg-emerald-100 rounded-full p-1 shadow shadow-emerald-600/50">
                    <img src={shareIcon} alt="sharelink" />
                </div>
            </div>
            <div className='mt-2'>
                {listing.location}
            </div>
            <div className='flex flex-row flex-wrap mt-4 text-sm gap-x-6 gap-y-2'>
                <div className='bg-emerald-700 text-green-300 rounded py-1 px-2'>
                    {listing.bedrooms === 1 ? 'Bedroom : 1' : `Bedrooms :  ${listing.bedrooms}`}
                </div>
                <div className='bg-emerald-700 text-green-300 rounded py-1 px-2'>
                    {listing.bathrooms === 1 ? 'Bathroom : 1' : `Bathrooms :  ${listing.bathrooms}`}
                </div>
                <div className={listing.furnished ? 'bg-emerald-700 text-green-300 rounded py-1 px-2' : 'bg-stone-700 text-neutral-300 rounded py-1 px-2'}>Furnished : {listing.furnished ? 'Yes' : 'No'}</div>
                <div className={listing.parking ? 'bg-emerald-700 text-green-300 rounded py-1 px-2' : 'bg-stone-700 text-neutral-300 rounded py-1 px-2'}>Parking : {listing.parking ? 'Yes' : 'No'}</div>
                <div className={listing.offer ? 'bg-red-700 text-rose-200 rounded py-1 px-2' : ''}>
                    {listing.offer ? 
                    'Discount : $' : ''}
                    {listing.offer && (listing.regularPrice - listing.discountedPrice)}
                </div>
            </div>
            
            <div className='h-80 w-full my-4 md:py-8'>
                <Map lat={listing.geolocation.lat} lng={listing.geolocation.lng} />
            </div>
            
            <div className='flex justify-center'>
                {auth.currentUser?.uid !== listing.userRef && (
                <Link 
                    to={`/contact/${listing.userRef}?listingName=${listing.name}`} 
                    className='w-48 bg-green-900 p-2 rounded-xl text-emerald-100 font-semibold text-center'
                >
                    Contact Landlord
                </Link>
                )}    
            </div>
        </main>

    )
}

export default ItemListing

function decimalNumber(number){
    number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return number
}
