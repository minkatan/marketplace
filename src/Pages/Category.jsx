import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'  //parameters to route
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import {toast} from 'react-toastify'

import Loading from '../Components/Loading'
import ListingItems from '../Components/ListingItems'

const Category = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetched, setLastFetched] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingReference = collection(db, 'listings')
        // Create a query
        const categoryQuery = 
        query(
          listingReference, 
          where('type', '==', params.categoryName),
          orderBy('timestamp','desc'),
          limit(10)
          )
        // execute query
        const querySnaphot = await getDocs(categoryQuery)
        
        // update state
        const previousQuery = querySnaphot.docs[querySnaphot.docs.length - 1]
        setLastFetched(previousQuery)
        
        const listings = []

        querySnaphot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
        })
      })
      // set
        setListings(listings)
        setLoading(false)

      } catch (error) {
        const msg = error.code
        toast.error(msg)
      }
    }
    fetchListings()
  }, [params.categoryName])

  // pagination / load more function
  const fetchMore = async () => {
    try {
      const listingsRef = collection(db, 'listings')

      const q = query(
        listingsRef, where ('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetched),
        limit(10)
      )

      const querySnap = await getDocs(q)
      const previousQuery = querySnap.docs[querySnap.docs.length - 1]

      setLastFetched(previousQuery)

      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings((prevState) => [...prevState, ...listings])
      setLoading(false)

    } catch (error) {
      const msg = error.code
      toast.error(msg)
    }
  }

  return (
    <>
      <div className='p-4 text-4xl font-bold text-emerald-900 shadow shadow-emerald-900/40 border-n'>
        <p>
          {params.categoryName === 'rent' ? 'Places For Rent' : 'Places For Sale'}
        </p>
      </div>

      {loading ? (
        <Loading />
        ) : listings && listings.length > 0 ? (
          <>
            <main className='tracking-wide my-4 h-screen'>
              <div className='flex flex-col'>
                {listings.map((listing) => (
                  <ListingItems listing={listing.data} id={listing.id} key={listing.id}/>
                ))}
              </div>
                
            </main>

            <br />
            <br />
            {lastFetched && (
              <p 
              onClick={fetchMore}
              className='p-2 rounded-xl text-emerald-900 font-semibold text-center cursor-pointer'
              >
                Load More</p>
            )}

          </>
          ) : (
        <p className='mt-24 flex justify-center items-center text-3xl text-emerald-900'>No Listings for {params.categoryName}</p>
      )}
    </>
  )
}

export default Category