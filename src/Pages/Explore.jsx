import React from 'react'
import {Link} from 'react-router-dom'
import Slider from '../Components/Slider'

import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

const Explore = () => {
  return (
    <>
      <main className='container m-auto h-screen'>
        <Slider />
        <h4 className='text-lg font-semibold text-emerald-900 my-2'>Categories</h4>
        <div className='flex flex-row justify-between items-center mt-4'>
          <div className='w-full md:h-64 px-2 flex justify-center'>
          <Link to='/category/rent' className='mb-4'>
            <img src={rentCategoryImage} alt="rent" className='rounded-xl h-5/6 md:h-full'/>
            <p className='text-emerald-900 font-semibold mt-2'>For Rent</p>
          </Link>
          </div>
          <div className='w-full md:h-64 px-2 flex justify-center'>
          <Link to='/category/sell' className='mb-4'>
            <img src={sellCategoryImage} alt="sell" className='rounded-xl h-5/6 md:h-full'/>
            <p className='text-emerald-900 font-semibold mt-2'>For Sale</p>
          </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default Explore