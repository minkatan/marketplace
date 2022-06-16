import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy, limit} from 'firebase/firestore'
import { db } from '../firebase.config'
import {toast} from 'react-toastify'

import Loading from '../Components/Loading'
import ListingItems from '../Components/ListingItems'


const Offer = () => {
  const [listingsRent, setRentListings] = useState(null)
  const [listingsSale, setSaleListings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingReference = collection(db, 'listings')
        // Create a query for offer - for sales
        const categoryQueryRent = 
        query(
          listingReference, 
          where('offer', '==', true),
          where('type', '==', 'rent'),
          orderBy('timestamp','desc'),
          limit(10)
          )

        // Create a query for offer - for sales
        const categoryQuerySale = 
        query(
          listingReference, 
          where('offer', '==', true),
          where('type', '==', 'sell'),
          orderBy('timestamp','desc'),
          limit(10)
          )
        
        // execute query
        const querySnaphotRent = await getDocs(categoryQueryRent)
        const querySnaphotSale = await getDocs(categoryQuerySale)

        const listingsRent = []
        const listingsSale = []

        querySnaphotRent.forEach((doc) => {
          return listingsRent.push({
            id: doc.id,
            data: doc.data(),
        })
      })
        querySnaphotSale.forEach((doc) => {
          return listingsSale.push({
            id: doc.id,
            data: doc.data(),
        })
      })
      // set
        setRentListings(listingsRent)
        setSaleListings(listingsSale)
        setLoading(false)

      } catch (error) {
        const msg = error.code
        toast.error(msg)
      }
    }
    fetchListings()
  }, [])

  return (
    <>
      {loading ? (
        <Loading />
        ) : listingsSale && listingsSale.length > 0 ? (
          <>
            <main className='tracking-wide my-4 container m-auto h-screen'>
              <div className='flex flex-col'>
                <h4 className='text-lg font-semibold text-emerald-900 my-2 bg-green-100 text-center'>Offers For Sales</h4>
                {listingsSale.map((listing) => (
                  <ListingItems listing={listing.data} id={listing.id} key={listing.id}/>
                ))}
              </div>
            </main>
          </>
        ) : listingsRent && listingsRent.length > 0 ? (
          <>
            <main className='tracking-wide my-4 container m-auto h-screen'>
              <div className='flex flex-col'>
              <h4 className='text-lg font-semibold text-emerald-900 my-2 bg-green-100 text-center'>Offers For Rent</h4>
                {listingsRent.map((listing) => (
                  <ListingItems listing={listing.data} id={listing.id} key={listing.id}/>
                ))}
              </div>
            </main>
          </>
          ) : (
          <p className='mt-24 flex justify-center items-center text-3xl text-emerald-900'>No active offers</p>
    )}
    </>
  )
}

export default Offer