import { useState, useEffect, useRef }from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase.config'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'

import Loading from '../Components/Loading'


import {v4 as uuidv4} from 'uuid'
import { toast } from 'react-toastify'



const AddNewListing = () => {
  // eslint-disable-next-line no-unused-vars
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 43.6446001,
    longtitude: 79.4285071,
  })

  const {type,name,bedrooms,bathrooms,parking,furnished,address,offer,regularPrice,discountedPrice,images,latitude,longtitude} = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(() => {
    if(isMounted){//remove memory leaked
      onAuthStateChanged(auth,(user) => {
        if(user){
          setFormData({...formData, userRef: user.uid}) 

        } else {
          navigate('/sign-in')
        }
      })
    }
    return () => {
      isMounted.current = false //remove memory leaked
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if(parseInt(discountedPrice) > parseInt(regularPrice)){
      setLoading(false)
      toast.error('Discount Price is more than Regular Price')
      return
    }

    if(images.length > 6){
      setLoading(false)
      toast.error('No more than 6 images')
    }

    let geolocation = {}
    let location;

    if(geolocationEnabled) {
      const response = await fetch (`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)

      const data = await response.json()

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0 
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0 
      location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address

      if (location === undefined || location.includes('undefined')){
        setLoading(false)
        // toast.error('Please enter a valid addrress')
      }

    } else {
      geolocation.lat = latitude;
      geolocation.lng = longtitude;
      // location = address;
    }
    
    // store image in firebase
    const storeImage = async (img) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const filename = `${auth.currentUser.uid}-${img.name}-${uuidv4()}`

        const storageReference = ref(storage, 'images/' + filename)

        // create upload task
        const uploadTask = uploadBytesResumable(storageReference, img);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break
              }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            reject(error)
            toast.error('Image is not compatible')
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               resolve(downloadURL);
            });
          }
        );
      })
    }

    const imageUrls = await Promise.all(
      [...images].map((img) => storeImage(img))
    ).catch(() => {
      setLoading(false)
      // toast.error('Images Not Uploaded')
      return
    })

    const formD2 = {
      ...formData, //take everything from formdata
      imageUrls, 
      geolocation,
      timestamp: serverTimestamp()
    }

    formD2.location = address
    // delete what's not required
    delete formD2.images
    delete formD2.address
    !formD2.offer && delete formD2.discountedPrice

    const docRef = await addDoc(collection(db, 'listings'),formD2)

    setLoading(false)
    toast.success('Listing saved')
    navigate(`/category/${formD2.type}/${docRef.id}`) 
  }

  const onMutate = (e) => {
    let boolean = null

    if(e.target.value === 'true') {
      boolean = true
    }

    if(e.target.value === 'false'){
      boolean = false
    }

    // files
    if(e.target.files){
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    // text/booleans/numbers
    if(!e.target.files){
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value, 
        //?? if the value on the left is null then use the value on the right
      }))
    }

  }

  if(loading){
    return <Loading />

  }
  return (
    <>
      <main className='h-full md:h-screen'>
        <form onSubmit={onSubmit}>
          <div className='grid md:grid-cols-3 text-emerald-900 container mx-auto w-full'>
          
            <label className='py-4 px-2 font-semibold md:text-2xl col-span-1'>Rent or Sales</label> 
            <div className='w-full p-4 md:col-span-2'>
              <button id='type' value='sell' onClick={onMutate} className={type === 'sell' ? 'bg-green-200 md:px-4 py-2 px-6 justify-self-center md:mx-4 mx-2 rounded-2xl md:w-36 font-bold' : 'bg-gray-200 md:px-4 py-2 px-6 justify-self-center md:mx-4 mx-2 rounded-2xl md:w-36'}>Sell</button>
              <button id='type' value='rent' onClick={onMutate} className={type === 'rent' ? 'bg-green-200 md:px-4 py-2 px-6 justify-self-center md:mx-4 mx-2 rounded-2xl md:w-36 font-bold' : 'bg-gray-200 md:px-4 py-2 px-6 justify-self-center md:mx-4 mx-2 rounded-2xl md:w-36'}>Rent</button>
            </div>
          
            <label className='py-4 px-2 font-semibold md:text-2xl col-span-1'>Name</label> 
            <input 
              className='md:col-span-2 p-2 m-2 w-full border-2 rounded'
              type="text" 
              id='name' 
              value={name} 
              onChange={onMutate} 
              maxLength='40' 
              minLength='10' 
              required />  

            <label className='py-4 px-2 font-semibold md:text-2xl col-span-1'>Bedrooms / Bathrooms </label> 
            <div className='flex flex-col py-2 text-center'>
              <label>Bedrooms</label>
              <label>Bathrooms</label>
            </div>
            <div className='flex flex-col justify-center text-center'>
              <input 
                className='mx-2 mb-1 w-16 border rounded text-center'
                type='number'
                id='bedrooms' 
                value={bedrooms} 
                onChange={onMutate} 
                max='40' 
                min='1' 
                required />  
              <input 
                className='mx-2 w-16 border rounded text-center'
                type='number'
                id='bathrooms' 
                value={bathrooms} 
                onChange={onMutate} 
                max='40' 
                min='1' 
                required />  
            </div>

            <label className='py-4 px-2 font-semibold md:text-2xl col-span-1'>Parking / Furnished </label> 
            <div className='flex flex-col py-2 text-center'>
              <label>Parking</label>
              <label>Furnished</label>
            </div>
            <div>
              <div className='flex flex-row text-sm items-center justify-center my-1'>
                <button id='parking' value='true' onClick={onMutate} className={parking === true ? 'bg-green-200 md:px-2 py-1 px-2 justify-self-center md:mx-2 mx-1 rounded-2xl md:w-36 font-bold' : 'bg-gray-200 md:px-2 py-1 px-2 justify-self-center md:mx-2 mx-1 rounded-2xl md:w-36'}>Yes</button>
                <button id='parking' value='true' onClick={onMutate} className={parking === false ? 'bg-green-200 md:px-2 py-1 px-2 justify-self-center md:mx-2 mx-1 rounded-2xl md:w-36 font-bold' : 'bg-gray-200 md:px-2 py-1 px-2 justify-self-center md:mx-2 mx-1 rounded-2xl md:w-36'}>No</button>
              </div>
              <div className='flex flex-row text-sm items-center justify-center my-1'>
                <button id='furnished' value='true' onClick={onMutate} className={furnished === true ? 'bg-green-200 md:px-2 py-1 px-2 justify-self-center md:mx-2 mx-1 rounded-2xl md:w-36 font-bold' : 'bg-gray-200 md:px-2 py-1 px-2 justify-self-center md:mx-2 mx-1 rounded-2xl md:w-36'}>Yes</button>
                <button id='furnished' value='false' onClick={onMutate} className={furnished === false ? 'bg-green-200 md:px-2 py-1 px-2 justify-self-center md:mx-2 mx-1 rounded-2xl md:w-36 font-bold' : 'bg-gray-200 md:px-2 py-1 px-2 justify-self-center md:mx-2 mx-1 rounded-2xl md:w-36'}>No</button>
              </div>
            </div>

            <label className='py-4 px-2 font-semibold md:text-2xl col-span-1'>Address</label> 
            <input 
              className='md:col-span-2 p-2 m-2 w-full border-2 rounded'
              type="text" 
              id='address' 
              value={address} 
              onChange={onMutate} 
              required />

            {!geolocationEnabled && (
              <div className='col-span-3'>
                <label className='py-4 px-2 font-semibold md:text-2xl'>Latitude</label> 
                <input 
                  className='p-2 m-2 w-full border-2 rounded'
                  type="number" 
                  id='latitude' 
                  value={latitude} 
                  onChange={onMutate} 
                  required />
                <label className='py-4 px-2 font-semibold md:text-2xl'>Longtitude</label> 
                <input 
                  className='p-2 m-2 w-full border-2 rounded'
                  type="text" 
                  id='longtitude' 
                  value={longtitude} 
                  onChange={onMutate} 
                  required />
              </div>
            )}

            <label className='py-4 px-2 font-semibold md:text-2xl col-span-1'>Offer</label> 
            <div className='w-full p-4 md:col-span-2'>
              <button id='offer' value='true' onClick={onMutate} className={offer === true ? 'bg-green-200 md:px-4 py-2 px-6 justify-self-center md:mx-4 mx-2 rounded-2xl md:w-36 font-bold' : 'bg-gray-200 md:px-4 py-2 px-6 justify-self-center md:mx-4 mx-2 rounded-2xl md:w-36'}>Yes</button>
              <button id='offer' value='false' onClick={onMutate} className={offer === false ? 'bg-green-200 md:px-4 py-2 px-6 justify-self-center md:mx-4 mx-2 rounded-2xl md:w-36 font-bold' : 'bg-gray-200 md:px-4 py-2 px-6 justify-self-center md:mx-4 mx-2 rounded-2xl md:w-36'}>No</button>
            </div>
            
            <label className='py-4 px-2 font-semibold md:text-2xl col-span-1'>Regular Price</label> 
            <input 
              className='md:col-span-1 p-2 m-2 w-full border-2 rounded'
              type="number" 
              id='regularPrice' 
              value={regularPrice} 
              onChange={onMutate} 
              required />
            {type === 'rent' ? (
            <div className='py-4 px-2 font-semibold md:text-2xl col-span-1 text-center'> $ Per Month</div>)
            : <div></div>}

            {offer && (
              <>
              <label className='py-4 px-2 font-semibold md:text-2xl col-span-1'>Discounted Price</label> 
              <input 
              className='md:col-span-1 p-2 m-2 w-full border-2 rounded'
              type="number" 
              id='discountedPrice' 
              value={discountedPrice} 
              onChange={onMutate} 
              required={offer} />
              <div></div>
              </>
            )}

          <div>
            <label className='py-4 px-2 font-semibold md:text-2xl col-span-1'>Images</label>
            <p className=' px-2 text-sm text-green-800 bg-gray-200'>Max 6 images - 1st image will be cover</p>
          </div>
          <div>
            <input 
            className='md:col-span-1 p-2 m-2 w-full border-2 rounded' 
            type="file" 
            id="images" 
            onChange={onMutate} 
            max='6' 
            accept='.jpg, .png, .jpeg' 
            multiple 
            required />
          </div>
        </div>
        
        <div className='w-full flex justify-center items-center mt-4'>
          <button className='w-48 bg-green-900 p-2 rounded-xl text-emerald-100 font-semibold'>Create Listing</button>
        </div>
          
        </form>
      </main>

    </>

  )
}

export default AddNewListing