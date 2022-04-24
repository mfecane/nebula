import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'

const Wrapper = styled.div`
  position: relative;
  margin: 0 8px;
`

const SearchInut = styled.input`
  height: 36px;
  min-width: 200px;
  background-color: #2a3643;
  padding: 0 0 0 40px;
  border-radius: 3px;
  color: white;
  font-size: 18px;
  font-weight: bold;
`

const Search = (): JSX.Element => {
  const {
    state: { search },
    doSearch,
  } = useStore()
  const navigate = useNavigate()

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const search = e.target.value
    doSearch(search)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    navigate('/search')
  }

  return (
    <div>
      <Wrapper>
        <form onSubmit={handleSubmit} className="search-bar">
          <SearchInut
            type="text"
            value={search || ''}
            onChange={handleSearch}
          />
        </form>
      </Wrapper>
    </div>
  )
}

export default Search
