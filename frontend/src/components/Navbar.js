import React from 'react'
import Switcher from './Switcher'
import { ReactComponent as noteIcon } from '../Assets/SVG/notes-icon.svg'

const Navbar = () => {
  return (
    <div className='bg-white h-14 flex justify-between dark:bg-[linear-gradient(-10deg,#2b5876_100%,_#4e4376_0%)]'>
        <img className='w-14 h-14 p-2 mt-[.1rem]' src={require('../Assets/SVG/notes-icon.svg').default} alt='mySvgImage' />
      <h2 className='font-poppins font-semibold dark:text-white text-[2rem]'>Project Management</h2>
      <span className='mt-2 mr-5 dark:shadow-sm'><Switcher></Switcher></span>
    </div>
  )
}

export default Navbar