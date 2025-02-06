
import { NavLink } from 'react-router-dom';
import K from '../constants'




const SideBar = () => {
    
    return (
        <div>
            <div className='space-y-8 '>
                {
                    K.NAVLINKS.map((navlinks, index) => {
                        return (
                            <div key={index} className='  pl-6'>

                                <div className='space-x-7 flex  '>
                                    <span className='w-3 h-3 text-[#b8b5b5] pt-1 '>{navlinks.icon} </span>
                                  <NavLink to={navlinks.path}>
                                  <h1 className='text-[#464444] text-md'>{navlinks.text} </h1>
                                    </NavLink>  
                                </div>
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}

export default SideBar