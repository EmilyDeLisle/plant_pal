import React, { useRef, useState } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import DescendingIcon from '@material-ui/icons/ExpandMore'
import AscendingIcon from '@material-ui/icons/ExpandLess'
import { SortingMode, SortingDirection } from '../../../models'

export interface SortingButtonProps {
  direction: SortingDirection
  handleChangeMode: (mode: SortingMode) => void
  handleChangeDirection: (mode: SortingDirection) => void
}

export interface SingleSortingButtonProps extends SortingButtonProps {
  selected: boolean
  mode: SortingMode
}

const titleMap = {
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
  direction,
  handleChangeMode,
  handleChangeDirection,
}: SortingButtonProps) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [selectedMode, setSelectedMode] = useState<SortingMode>(SortingMode.WATER)

  const iconMap = {
    [SortingDirection.ASC]: <AscendingIcon />,
    [SortingDirection.DESC]: <DescendingIcon />,
  }

  const handleMenuItemClick = (mode: SortingMode) => {
    handleChangeMode(mode)
    setSelectedMode(mode)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }

  return (
    <>
      <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
        <Button onClick={handleToggle}>{titleMap[selectedMode]}</Button>
        <Button
          color="primary"
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={() =>
            handleChangeDirection(
              direction === SortingDirection.ASC ? SortingDirection.DESC : SortingDirection.ASC
            )
          }
        >
          {iconMap[direction]}
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {Object.values(SortingMode).map((mode) => (
                    <MenuItem
                      key={mode}
                      selected={mode === selectedMode}
                      onClick={() => handleMenuItemClick(mode)}
                    >
                      {titleMap[mode]}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
