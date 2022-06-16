import {useState, useEffect} from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

const ContactUser = () => {
  const [message, setMessage] = useState('')
  const [landlord, setLandlord] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        setLandlord(docSnap.data())
      }else{
        toast.error('Could not get landlord data')
      }
    }

    getLandlord()

  }, [params.landlordId])

  const onChange = (e) => setMessage(e.target.value)

  return (
    <>
      {landlord !== null && (
        <main className='h-screen'>
          <form>
            <div className='flex flex-col container mx-auto my-8 p-8'>
              <label htmlFor="message" className='text-xl text-emerald-900 font-bold mb-2'>Message</label>
              <textarea name="message" id="message" rows="20" value={message} onChange={onChange} className='bg-emerald-50 border-emerald-900 border-x-2 border-t-2 outline-none p-4'></textarea>
              <div className='text-emerald-900 bg-green-200 flex justify-center border-b-2 border-x-2 border-emerald-900 shadow-xl shadow-emerald-900/50 text-xl font-semibold p-2'>
                <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                  <button type='button'>Send Message</button>
                </a>
              </div>
            </div>
          </form>
        </main>
      )}
    </>
  )
}

export default ContactUser