import React, { useState } from 'react'
import InputBase from '@material-ui/core/InputBase'
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  })
)

interface SearchBarProps {
  handleSearch: (input: string) => void
}

export const SearchBar = ({ handleSearch }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('')
  const classes = useStyles()
  return (
    <div className={`${classes.search} search-bar__container`}>
      <div className={`${classes.searchIcon} search-bar__icon`}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Find a plant..."
        value={searchValue}
        onChange={({ target: { value }}) => {
          setSearchValue(value)
          handleSearch(value)
        }}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
      />
    </div>
  )
}
