import React from 'react'

const Header = () => {
    const reloadPage=()=>{
        location.reload();
    }
  return (
    <div className='text-3xl py-5 w-full shadow-lg bg-black text-white' >
        <span className='p-2 border border-black rounded-lg  cursor-pointer' onClick={reloadPage}>
            🩺 Resume Doc
        </span>
    </div>
  )
}

export default Header