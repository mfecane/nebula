import React, { useEffect } from 'react'
import reducer, { initialState } from 'ts/reducer'

import ShaderList from 'ts/components/shader-list'
import ShaderDetails from 'ts/components/shader-details'
import ErrorContainer from 'ts/components/error-container'
import StateContext from 'ts/state-context'
import ShaderFpsBadge from 'ts/components/shader-fps-badge'

import { init, setRenderer, setErrorCallback } from 'ts/renderer-manager'
import SideBar from 'ts/components/side-bar'
import { PAGES } from 'ts/pages'

const initApp = function (dispatch: React.Dispatch<any>) {
  setErrorCallback((e: Error) => {
    dispatch({ type: 'setError', payload: e })
  })

  init()

  const id = +localStorage.getItem('renderer_id')
  if (id) {
    setRenderer(id)
    dispatch({
      type: 'setShader',
      payload: id,
    })
  }
}

export default (): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialState())

  useEffect(() => {
    initApp(dispatch)
  }, [])

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <SideBar>
        {state.page === PAGES.PAGE_LIST ? <ShaderList /> : null}
        {state.page === PAGES.PAGE_DETAILS ? <ShaderDetails /> : null}
      </SideBar>
      <ErrorContainer />
      <ShaderFpsBadge />
    </StateContext.Provider>
  )
}
