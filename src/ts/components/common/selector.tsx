import React, { useState } from 'react'
import styled from 'styled-components'

interface Props {
  options: string[]
  onChange: (value: string) => void
  defaultOption?: string
}

const Wrapper = styled.div`
  color: white;
  background-color: #163246;
  position: relative;
  display: flex;
  min-width: 100px;
  padding: 6px 8px;
  border-radius: 3px;
  justify-content: space-between;

  .options {
    position: absolute;
    bottom: 100%;
    left: 0;
    min-width: 100%;
    background-color: #163246;
  }

  .tick {
    background-color: #1a6da8;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
  }

  .tickMark {
    display: block;
    background-color: white;
    transform: rotate(180deg);
    width: 12px;
    height: 12px;
  }
`

const Option = styled.div`
  cursor: pointer;
  padding: 6px 8px;
`

const Selector = ({ options, defaultOption, onChange }: Props): JSX.Element => {
  const [selected, setSelected] = useState(defaultOption || options[0])
  const [active, setActive] = useState(false)

  const handleClick = () => {
    setActive(!active)
  }

  const handleOptionClick = (value: string) => {
    setSelected(value)
    onChange(value)
  }

  const optionsJSX = options.map((item) => {
    return (
      <Option onClick={() => handleOptionClick(item)} key={item}>
        {item}
      </Option>
    )
  })

  return (
    <Wrapper onClick={handleClick}>
      {selected.toString()}
      <div className="tick">
        <i className="tickMark icon-arrow-up"></i>
      </div>
      <div className="options">{active && optionsJSX}</div>
    </Wrapper>
  )
}

export default Selector
