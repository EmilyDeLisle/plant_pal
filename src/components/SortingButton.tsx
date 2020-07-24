import React, { useRef, useState } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import DescendingIcon from '@material-ui/icons/ExpandMore'
import AscendingIcon from '@material-ui/icons/ExpandLess'
import { SortingMode, SortingDirection } from '../models'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      zIndex: 1000
    },
  })
)

export interface SortingButtonProps {
  mode: SortingMode
  direction: SortingDirection
  handleChangeMode: (mode: SortingMode) => void
  handleChangeDirection: (mode: SortingDirection) => void
}

export interface SingleSortingButtonProps extends SortingButtonProps {
  selected: boolean
}

const titleMap = {
  [SortingMode.DAYS_TO_WATER]: 'Days to water',
  [SortingMode.NAME]: 'Name',
  [SortingMode.WATER]: 'Last watered',
  [SortingMode.FERTILIZE]: 'Last fertilized',
  [SortingMode.INTERVAL]: 'Watering interval',
}

const iconMap = {
  [SortingDirection.ASC]: <AscendingIcon />,
  [SortingDirection.DESC]: <DescendingIcon />,
}

export const SortingButton = ({
  selected,
  mode,
  direction,
  handleChangeMode,
  handleChangeDirection,
}: SingleSortingButtonProps) => {
  return (
    <div className="sorting-button">
      <Button
        variant={selected ? 'contained' : undefined}
        color="primary"
        endIcon={selected ? iconMap[direction] : undefined}
        onClick={() => {
          selected
            ? handleChangeDirection(
                direction === SortingDirection.ASC ? SortingDirection.DESC : SortingDirection.ASC
              )
            : handleChangeMode(mode)
        }}
      >
        {titleMap[mode]}
      </Button>
    </div>
  )
}

export const SplitSortingButton = ({
  mode,
  direction,
  handleChangeMode,
  handleChangeDirection,
}: SortingButtonProps) => {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedMode, setSelectedMode] = useState<SortingMode>(mode)
  const classes = useStyles()

  const iconMap = {
    [SortingDirection.ASC]: <AscendingIcon />,
    [SortingDirection.DESC]: <DescendingIcon />,
  }

  const handleMenuItemClick = (mode: SortingMode) => {
    handleChangeMode(mode)
    setSelectedMode(mode)
    setOpen(false)
  }

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = (event: React.MouseEvent<HTMLLIElement>): void => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <>
      <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClickMenu}>{titleMap[selectedMode]}</Button>
        <Button
          color="primary"
          size="small"
          onClick={() =>
            handleChangeDirection(
              direction === SortingDirection.ASC ? SortingDirection.DESC : SortingDirection.ASC
            )
          }
        >
          {iconMap[direction]}
        </Button>
      </ButtonGroup>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        MenuListProps={{ disablePadding: true }}
        onClose={handleCloseMenu}
      >
        <div className={classes.menu}>
          {Object.values(SortingMode).map((mode) => (
            <MenuItem
              key={mode}
              selected={mode === selectedMode}
              onClick={() => {
                handleMenuItemClick(mode)
                setAnchorEl(null)
              }}
            >
              {titleMap[mode]}
            </MenuItem>
          ))}
        </div>
      </Menu>
    </>
  )
}
