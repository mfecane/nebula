import React from 'react'
import RangeSlider from 'ts/components/common/range-slider'
import {
  setShaderParameter,
  getShaderParameter,
} from 'ts/model/shader-parameters'

const ShaderParameter = ({
  name,
  type,
  token,
}: {
  name: string
  token: string
}): JSX.Element => {
  const handleChange = (value: number) => {
    setShaderParameter(token, value)
  }

  switch (type) {
    case 'float':
      return (
        <div>
          <RangeSlider
            label={name}
            value={getShaderParameter(token)}
            onChange={handleChange}
          />
        </div>
      )
    default:
      return null
  }
}

export default ShaderParameter
