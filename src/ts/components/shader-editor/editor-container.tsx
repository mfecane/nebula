import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  flex: 1 0 auto;
  min-height: 0;

  .panel {
    flex: 0 1 calc(50% - 8px);
    overflow: hidden;
    height: 0;
    min-height: 100%;

    &.left {
      background: #162028;
    }

    &.right {
      background: black;
    }
  }

  .gutter {
    flex: 0 1 16px;
    background: #162028;
    cursor: e-resize;
    display: flex;
    align-items: center;
    justify-content: center;

    .handle {
      display: block;
      width: 8px;
      height: 30px;
      background: #a2c6d5;
    }
  }
`

const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max)
}

interface Props {
  left: JSX.Element
  right: JSX.Element
}

const EditorContainer = ({ left, right }: Props): JSX.Element => {
  // TODO ::: useReducer
  const [ratio, setRatio] = useState(0.5)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const mainRef = useRef(null)

  let clicked = false
  let _ratio = ratio

  const updateRatio = (value: number) => {
    leftRef.current.style.flexBasis = `calc(${value * 100}% - 8px)`
    rightRef.current.style.flexBasis = `calc(${(1 - value) * 100}% - 8px)`
    const resizeEvent = new Event('resize-event')
    window.dispatchEvent(resizeEvent)
  }

  useEffect(() => {
    updateRatio(ratio)
  }, [ratio])

  useEffect(() => {
    updateRatio(0.4)
  }, [])

  const dragStart: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === 0) {
      e.preventDefault()
      clicked = true
    }
  }

  const dragMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (clicked) {
      _ratio = e.clientX / mainRef.current.clientWidth
      _ratio = clamp(_ratio, 0.1, 0.9)
      const resizeEvent = new Event('resize-event')
      window.dispatchEvent(resizeEvent)
      updateRatio(_ratio)
    }
  }

  const dragEnd: MouseEventHandler<HTMLDivElement> = () => {
    clicked = false
    setRatio(_ratio)
  }

  return (
    <Wrapper
      onMouseMove={dragMove}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
      ref={mainRef}
    >
      <div className="panel left" ref={leftRef}>
        {left}
      </div>
      <div className="gutter" onMouseDown={dragStart}>
        <i className="handle icon-vertical-dots"></i>
      </div>
      <div className="panel right" ref={rightRef}>
        {right}
      </div>
    </Wrapper>
  )
}

export default EditorContainer
