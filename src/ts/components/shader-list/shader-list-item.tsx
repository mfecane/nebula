import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ShaderModel } from 'ts/model/shader-model'

const Wrapper = styled.div`
  position: relative;
  min-height: 300px;
  cursor: pointer;

  &:hover {
    background-color: rgba(90, 167, 234, 0.142);
  }

  h2 {
    font-weight: bold;
    font-size: 20px;
    display: inline-block;
  }

  .canvasConatiner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .author {
    margin-left: 5px;
    color: #447095;
    display: inline-block;
  }
`

const Header = styled.div`
  background-color: ${({ error }) => {
    if (error) return '#e30000'
    return '#000000'
  }};
  padding: 20px 30px;
  position: relative;
  z-index: 5;
`

const ShaderListItem = ({ item }): JSX.Element => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const renderer = useRef(null)

  // console.log('ShaderListItem', item)

  useEffect(() => {
    if (renderer.current) {
      renderer.current.destroy()
    }

    const shaderModel = new ShaderModel()
    shaderModel.setSource(item.code)
    renderer.current = shaderModel.createRenerer(containerRef.current)
    renderer.current.renderFrame()

    if (renderer.current)
      return () => {
        renderer.current.destroy()
      }
  }, [])

  return (
    <Wrapper>
      <Header error={item.error}>
        <h2>
          <Link to={`/shader/${item.id}`}>{item.name}</Link>
        </h2>
        {item.user && (
          <span className="author">
            {' '}
            by <Link to={`/list/user/${item.user.uid}`}>{item.user.name}</Link>
          </span>
        )}
      </Header>

      <div></div>
      <div className="canvasConatiner" ref={containerRef}></div>
    </Wrapper>
  )
}

export default ShaderListItem
