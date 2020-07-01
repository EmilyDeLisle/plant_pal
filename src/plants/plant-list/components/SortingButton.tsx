import React from 'react'
import Button from '@material-ui/core/Button'
import DescendingIcon from '@material-ui/icons/ExpandMore'
import AscendingIcon from '@material-ui/icons/ExpandLess'
import { SortingMode, SortingDirection } from '../../../models'

export interface SortingButtonProps {
  selected: boolean
  mode: SortingMode
  direction: SortingDirection
  handleChangeMode: (mode: SortingMode) => void
  handleChangeDirection: (mode: SortingDirection) => void
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
}: SortingButtonProps) => {
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
