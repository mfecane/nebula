import React from 'react'
import RangeSlider from 'ts/components/common/range-slider'

const ShaderParameter = ({ name }) => {
  const handleChange = () => {}

  return (
    <div>
      <RangeSlider label={name} value={0} onChange={handleChange} />
    </div>
  )
}

export default ShaderParameter
