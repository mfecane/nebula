import React from 'react'
import reducer, { initialState } from 'ts/reducer'

import ShaderList from 'ts/components/shader-list'
import ShaderDetails from 'ts/components/shader-details'

import StateContext from 'ts/state-context'

export default () => {
  const [state, dispatch] = React.useReducer(reducer, initialState())

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <ShaderList />
      <ShaderDetails />
    </StateContext.Provider>
  )
}
