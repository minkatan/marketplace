import { Link } from "react-router-dom"

import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg'
import {ReactComponent as EditIcon} from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathIcon from '../assets/svg/bathtubIcon.svg'

const ListingItems = ({listing, id, onEdit, onDelete}) => {

    return (
        <div className="md:my-4 md:mx-8 md:p-4 p-2 relative">
            <Link to={`/category/${listing.type}/${id}`} className="grid grid-cols-3 ">
                <img src={listing.imageUrls[0]} alt={listing.name} className="rounded-xl object-fill w-full h-full" />
            <div className="col-span-2 md:mx-8 mx-2 text-emerald-900">
                <p className="font-semibold md:text-xl md:pb-4 pb-2">{listing.name}</p>
                <div className="text-xs md:text-base relative">{listing.location}</div>
                <div className="flex md:flex-row flex-col text-center">
                    <span className="text-red-700 font-semibold text-sm md:text-base px-2 py-1 rounded-full line-through">
                            {listing.offer ? '$' : ''}{listing.offer && decimalNumber(listing.regularPrice)} 
                            {listing.type === 'rent' && ' / month'}
                    </span>
                    <span className="text-green-700 font-semibold text-sm md:text-base px-2 py-1 rounded-full">
                            ${listing.offer ? decimalNumber(listing.discountedPrice) : decimalNumber(listing.regularPrice)} 
                            {listing.type === 'rent' && ' / month'}
                    </span>
                </div>
                <div className="flex flex-row text-emerald-900 bg-neutral-200 text-xs md:text-base md:gap-x-4 gap-x-2 lg:w-1/2 justify-evenly items-center py-2">
                    <div className="flex items-center">
                        <img src={bedIcon} alt="bedroom" />
                        {listing.bedrooms === 1 ? '1 Bedroom' : `${listing.bedrooms} Bedrooms`}
                    </div>
                    <div className="flex items-center">
                        <img src={bathIcon} alt="bathroom" />
                        {listing.bathrooms === 1 ? '1 Bathroom' : `${listing.bathrooms} Bathrooms`}
                    </div>
                </div>
            </div>
            </Link>

            {onDelete && (
                <DeleteIcon className="fill-red-700 absolute top-2 right-1 cursor-pointer" onClick={() => onDelete(listing.id, listing.name)}/>
            )}

            {onEdit && (
                <EditIcon className="fill-blue-700 absolute top-2 right-6 cursor-pointer" onClick={() => onEdit(id)}/>
            )}
        </div>
    )
}

export default ListingItems

function decimalNumber(number){
    number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return number
}