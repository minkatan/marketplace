import { FiLoader} from "react-icons/fi";

const Loading = () => {
  return (
    <div className='flex flex-col h-screen justify-center items-center text-5xl text-green-500'>
        <FiLoader className='animate-ping w-48 h-48 mb-24' />
        Loading....
    </div>
  )
}

export default Loading