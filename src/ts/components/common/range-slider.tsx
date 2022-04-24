import React, { useState } from 'react'
import styled from 'styled-components'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const Wrapper = styled.div`
  height: 42px;
  font-size: 16px;
  overflow-y: auto;
  max-height: 100%;
  max-width: 300px;
`

const Range = styled.input`
  margin-top: 10px;
  width: 100%;
  -webkit-appearance: none;
  background: transparent;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 10px;
    background: #ffffff;
    cursor: pointer;
    margin-top: -4px;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: #576886;
  }
`

const RangeSlider = ({ label, value, onChange }) => {
  const [_value, _setValue] = useState(value)

  const _onChange = (e) => {
    e.preventDefault()
    const value = e.target.value || 0
    _setValue(value)
    onChange(value)
  }

  return (
    <Wrapper>
      <Header>
        <div>{label}</div>
        <div>{_value}</div>
      </Header>
      <div>
        <Range
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={_value}
          onChange={_onChange}
        />
      </div>
    </Wrapper>
  )
}

export default RangeSlider
