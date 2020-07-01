import React, { ReactElement } from 'react'
import { observer } from 'mobx-react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DoneIcon from '@material-ui/icons/Done'
import EcoIcon from '@material-ui/icons/Eco'
import WateringCanIcon from './WateringCanIcon'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { Plant, PlantEventType } from '../../../models'
import { getDatabase } from '../../../firebase'
import { plantStore } from '../../../injectables'
import { calculateDays, formatDays } from './plantHelpers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#B3FEBF',
      '&:hover': {
        backgroundColor: '#DBFFE1',
        cursor: 'pointer',
      },
    },
    fertilized: {
      backgroundImage: 'linear-gradient(to right, #65F6D3 , #B3FEBF)',
    },
    wateringNumber: {
      opacity: 0.3,
    },
  })
)

const buttons = [
  {
    tooltip: 'Water not needed today',
    eventType: PlantEventType.CHECK,
    successMessage: 'Plant successfully checked',
    icon: <DoneIcon />,
  },
  {
    tooltip: 'Fertilize plant today',
    eventType: PlantEventType.FERTILIZE,
    successMessage: 'Plant successfully fertilized',
    icon: <EcoIcon />,
  },
  {
    tooltip: 'Water plant (with fertilizer) today',
    eventType: PlantEventType.WATER,
    successMessage: 'Plant successfully watered with fertilizer',
    icon: <WateringCanIcon />,
  },
  {
    tooltip: 'Water plant today',
    eventType: PlantEventType.WATER,
    successMessage: 'Plant successfully watered',
    icon: <WateringCanIcon />,
  },
]

interface ListRowProps {
  plant: Plant
  handleOpen: () => void
}

export const ListRow = observer(
  ({ plant, handleOpen }: ListRowProps): ReactElement => {
    const {
      id,
      name,
      lastWateredDate,
      lastFertilizedDate,
      toBeChecked,
      isFertilized,
      getAvgInterval,
    } = plant
    const classes = useStyles()
    const db = getDatabase()
    const avgWateringInterval = getAvgInterval(PlantEventType.WATER)
    const { setSelectedPlantID } = plantStore

    return (
      <div
        className={`plant-list-row-container`}
        onClick={() => {
          setSelectedPlantID(id)
          handleOpen()
        }}
      >
        <Card>
          <div
            className={`${classes.root} ${isFertilized ? classes.fertilized : ''} plant-list-row`}
          >
            <div className="list-row__text">
              <div className="list-row__watering-days-number">
                <Typography className={classes.wateringNumber} variant="h3" display="inline" noWrap>
                  {!!lastWateredDate ? calculateDays(moment(lastWateredDate?.toDate())) : '?'}
                </Typography>
              </div>
              <div className="list-row__plant-name">
                <Typography variant="h5" display="inline" color="primary" noWrap>
                  {name}
                </Typography>
              </div>
              <Typography color="textPrimary" display="inline" variant="body2">
                {!!avgWateringInterval && (
                  <strong>
                    {` Watered every ${avgWateringInterval !== 1 ? avgWateringInterval : ''} day${
                      avgWateringInterval !== 1 ? 's' : ''
                    } | `}
                  </strong>
                )}
                {`${
                  !!lastWateredDate ? `Watered ${formatDays(lastWateredDate)}` : `Never watered`
                } | ${
                  !!lastFertilizedDate
                    ? `Fertilized ${formatDays(lastFertilizedDate)}`
                    : `Never fertilized`
                }`}
              </Typography>
            </div>
            <div className="list-row__buttons">
              {buttons.map((button) => {
                return (
                  ((toBeChecked && button.eventType === PlantEventType.CHECK) ||
                    button.eventType !== PlantEventType.CHECK) && (
                    <Tooltip key={`button-${button.tooltip}-${id}`} title={button.tooltip}>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation()
                          db.modifyPlant(plant, button.eventType, undefined, () =>
                            console.log(button.successMessage)
                          )
                        }}
                      >
                        {button.icon}
                      </IconButton>
                    </Tooltip>
                  )
                )
              })}
            </div>
          </div>
        </Card>
      </div>
    )
  }
)
