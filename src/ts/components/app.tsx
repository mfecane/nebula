import React, { useEffect } from 'react'
import reducer, { initialState } from 'ts/reducer'

import ShaderList from 'ts/components/shader-list'
import ShaderDetails from 'ts/components/shader-details'

import StateContext from 'ts/state-context'
import { init, setRenderer } from 'ts/renderer-manager'

export default () => {
  const [state, dispatch] = React.useReducer(reducer, initialState())

  useEffect(() => {
    init()
    const id = +localStorage.getItem('renderer_id')
    if (!id) {
      return
    }
    setRenderer(id)
    dispatch({
      type: 'setShader',
      payload: id,
    })
  }, [])

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <ShaderList />
      <ShaderDetails />
    </StateContext.Provider>
  )
}
