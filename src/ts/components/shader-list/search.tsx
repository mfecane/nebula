import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from 'ts/hooks/use-store'

const Search = () => {
  const {
    state: { search },
    doSearch,
  } = useStore()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    const search = e.target.value
    doSearch(search)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/search')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={search || ''} onChange={handleSearch} />
      </form>
    </div>
  )
}

export default Search
