import React from 'react'

import StateContext from 'state-context'


export default ()=>{
  return <StateContext.provider>
    <ShaderList/>
  </StateContext.provider>
}
