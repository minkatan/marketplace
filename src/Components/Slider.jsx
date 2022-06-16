import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import {db} from '../firebase.config'

import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
// Import Swiper styles
import 'swiper/css/bundle'

import Loading from '../Components/Loading'



SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const Slider = () => {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate= useNavigate()
    
    useEffect(() => {
        const fetchListing = async () => {

            const listingRef = collection(db,'listings')
            const q = query(listingRef, orderBy('timestamp'), limit(5))
            const querySnap = await getDocs(q)
    
            let listings = []
    
            querySnap.forEach((doc) => {
                return listings.push({
                    id:doc.id,
                    data: doc.data()
            })
        })

        setListings(listings)
        setLoading(false)
        }

        fetchListing()
    },[])

    if(loading) {
        return <Loading />
    }

    if(listings.length === 0){
        return<></>
    }

    return listings && (
        <>
            <h1 className='my-4 p-2 text-3xl font-bold text-emerald-900'>Recommded</h1>
          <Swiper slidesPerView={1} pagination={{clickable: true}} className='w-5/6 h-80 my-4 rounded-xl'>
              {listings.map(({data, id}) => (
                  <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)} className='w-full h-full'>
                    <div 
                        className='w-full h-full'
                        style={{background: `url(${data.imageUrls[1]}) center no-repeat`,
                                backgroundSize: 'cover'}}>
                        <p className='bg-neutral-500 text-neutral-100 absolute top-8 left-2 p-2 text-center rounded-full'>{data.name}</p>
                        <p className='bg-neutral-50 text-neutral-600 absolute top-24 left-2 p-2 text-center rounded-full'>${data.offer ? decimalNumber(data.discountedPrice) : decimalNumber(data.regularPrice)} {data.type === 'rent' && ' / month'}</p>
                        </div>
                  </SwiperSlide>
              ))}
          </Swiper>
        </>
    )
}

export default Slider

function decimalNumber(number){
    number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return number
}
