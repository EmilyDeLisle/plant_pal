import React, { ReactElement } from 'react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DoneIcon from '@material-ui/icons/Done'
import EcoIcon from '@material-ui/icons/Eco'
import WateringCanIcon from './WateringCanIcon'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Plant, PlantEventType } from '../../../models'
import { plantStore } from '../../../injectables'
import { formatDate } from './plantHelpers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
        cursor: 'pointer',
      },
    },
  })
)

interface ListRowProps {
  plant: Plant
  handleOpen: () => void
}

export const ListRow = ({ plant, handleOpen }: ListRowProps): ReactElement => {
  const {
    id,
    name,
    lastWateredDate,
    lastFertilizedDate,
    getAvgWateringInterval,
    toBeChecked,
  } = plant
  const classes = useStyles()
  const avgWateringInterval = getAvgWateringInterval()
  const { modifyPlant, setSelectedPlant } = plantStore

  return (
    <div
      className={`plant-list-row-container`}
      onClick={() => {
        setSelectedPlant(id)
        handleOpen()
      }}
    >
      <Card>
        <div className={`${classes.root} plant-list-row`}>
          <div>
            <Typography display="inline">{name}</Typography>
            {!!avgWateringInterval && (
              <Typography variant="body2" color="textSecondary" display="inline">
                {` - Watered every ${avgWateringInterval} day${avgWateringInterval !== 1 && 's'}`}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" display="inline">
              {` - Last watered: ${formatDate(lastWateredDate)}`}
            </Typography>
            <Typography variant="body2" color="textSecondary" display="inline">
              {` - Last fertilized: ${formatDate(lastFertilizedDate)}`}
            </Typography>
          </div>
          <div className="plant-list-row__buttons">
            {toBeChecked && (
              <Tooltip title="Water not needed today">
                <IconButton onClick={() => modifyPlant(id, PlantEventType.CHECK)}>
                  <DoneIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Water plant today">
              <IconButton onClick={() => modifyPlant(id, PlantEventType.WATER)}>
                <WateringCanIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fertilize plant today">
              <IconButton onClick={() => modifyPlant(id, PlantEventType.FERTILIZE)}>
                <EcoIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Card>
    </div>
  )
}
