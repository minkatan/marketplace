import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ListingItems from '../Components/ListingItems'

import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'


const Profile = () => {
  const navigate = useNavigate()
  const auth = getAuth()
  const [loading , setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [change, setChange] = useState(false)
  
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(listingsRef, where('userRef', '==' , auth.currentUser.uid), orderBy('timestamp', 'desc'))

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
    }
    
    fetchUserListings()
    
  },[auth.currentUser.uid])

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData

  const onChange = (e) => {
    setFormData((prevstate) => ({
      ...prevstate,
      [e.target.id]: e.target.value
    }))
  }

  const onDelete = async (id) => {
    // delete from firebase
    if(window.confirm('Are You sure you want to delete?')){
      await deleteDoc(doc(db, 'listings', id))

      // refresh the listing
      const updatedListings = listings.filter((listing) => listing.id !== id)
      setListings(updatedListings)
      toast.success('Listing Deleted')
    }
  }

  const onEdit = (id) => navigate(`/update-listing/${id}`)

  const onClick = async () => {
    setChange((prevState) => !prevState)

    try {
      if(auth.currentUser.displayName !== name){
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name: name,
        })
        toast.success('username saved')
      }
    } catch (error) {
      toast.error(error)
    }

  }

  return (
    <>
    <main className='mx-auto container mt-8 p-4'>
      <div className='flex flex-col gap-y-2 md:text-xl text-emerald-900 bg-green-50 px-2'>
        <div className='flex flex-row justify-between'>
          <form className='w-full py-4 rounded px-2'>
            Username : 
              <input type="text" name="name" id="name" className={!change ? 'md:ml-2 md:p-2' : 'md:ml-2 p-2 bg-neutral-600 text-emerald-200 outline-none rounded'} disabled={!change} value={name} onChange={onChange} />
          </form>
        <button type='button' onClick={onClick} className='bg-emerald-200 md:p-2 md:rounded-xl md:shadow-xl md:my-4 w-1/2'>{change ? 'saved' : 'update username'}</button>
        </div>
        <p className='w-full py-4 rounded px-2'>User Email : <span className='ml-2 p-2'>{email}</span></p>
      </div>
      <div>
      </div>


        <Link to='/add-listing' className='flex flex-row items-center w-full mt-8 text-emerald-900 text-xl gap-x-2 bg-green-50 p-2'>
          <img src={homeIcon} alt="home" />
          <p>Add new listing</p>
          <img src={arrowRight} alt="arrow-right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className='bg-green-200 text-xl text-center my-4 text-emerald-900 font-semibold'>{listings.length > 1 ? 'My Listings' : 'My Listing'}</p>
              <div className=''>
                {listings.map((items) => (
                <ListingItems key={items.id} listing={items.data} id={items.id} 
                onDelete={() => onDelete(items.id)}
                onEdit={() => onEdit(items.id)}
                ></ListingItems>  
                ))}
              </div>
          </>
        )}

    </main>
    </>
  )
}

export default Profile