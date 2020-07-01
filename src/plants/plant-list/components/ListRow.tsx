import React, { ReactElement } from 'react'
import { observer } from 'mobx-react'
import Card from '@material-ui/core/Card'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CheckIcon from '@material-ui/icons/Done'
import FertilizeIcon from '@material-ui/icons/Eco'
import OptionsIcon from '@material-ui/icons/MoreVert'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { InspectorMode, Plant, PlantEventType } from '../../../models'
import { getDatabase } from '../../../firebase'
import { plantStore } from '../../../injectables'
import { calculateDays, formatDays, formatDate } from './plantHelpers'
import WaterIcon from '../../../assets/WateringCanIcon'
import WaterFertilizeIcon from '../../../assets/WateringCanLeafIcon'

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
      '&:hover': {
        backgroundImage: 'none',
      },
    },
    wateringNumber: {
      opacity: 0.3,
      fontSize: 72,
      fontWeight: 800,
    },
  })
)

const buttons = [
  {
    tooltip: 'Water not needed today',
    eventType: PlantEventType.CHECK,
    successMessage: 'Plant successfully checked',
    icon: <CheckIcon />,
  },
  {
    tooltip: 'Fertilize plant today',
    eventType: PlantEventType.FERTILIZE,
    successMessage: 'Plant successfully fertilized',
    icon: <FertilizeIcon />,
  },
  {
    tooltip: 'Water plant (with fertilizer) today',
    eventType: PlantEventType.WATER_WITH_FERTILIZER,
    successMessage: 'Plant successfully watered with fertilizer',
    icon: <WaterFertilizeIcon />,
  },
  {
    tooltip: 'Water plant today',
    eventType: PlantEventType.WATER,
    successMessage: 'Plant successfully watered',
    icon: <WaterIcon />,
  },
]

interface ListRowProps {
  plant: Plant
}

export const ListRow = observer(
  ({ plant }: ListRowProps): ReactElement => {
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
    const { setInspectorMode, setSelectedPlantID } = plantStore

    return (
      <div
        className={`plant-list-row-container`}
        onClick={() => {
          setSelectedPlantID(id)
          setInspectorMode(InspectorMode.VIEW)
        }}
      >
        <Card>
          <div
            className={`${classes.root} ${isFertilized ? classes.fertilized : ''} plant-list-row`}
          >
            <div className="list-row__text">
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
                <Hidden smDown>
                  {`Last watered: ${
                    !!lastWateredDate ? formatDate(lastWateredDate) : `Never`
                  } | Last fertilized: ${
                    !!lastFertilizedDate ? formatDate(lastFertilizedDate) : `Never`
                  }`}
                </Hidden>
                <Hidden mdUp>
                  {!!lastWateredDate ? `Watered ${formatDays(lastWateredDate)}` : 'Never watered'}
                  <Hidden xsDown>
                    {!!lastFertilizedDate
                      ? ` | Fertilized ${formatDays(lastFertilizedDate)}`
                      : ' | Never fertilized'}
                  </Hidden>
                </Hidden>
              </Typography>
            </div>
            <div className="list-row__buttons">
              <Hidden xsDown>
                <div className="list-row__watering-days-number">
                  <Typography className={classes.wateringNumber} display="inline" noWrap>
                    {!!lastWateredDate ? calculateDays(moment(lastWateredDate?.toDate())) : '?'}
                  </Typography>
                </div>
                <Hidden smDown>
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
                </Hidden>
              </Hidden>
              <Hidden mdUp>
                <IconButton>
                  <OptionsIcon />
                </IconButton>
              </Hidden>
            </div>
          </div>
        </Card>
      </div>
    )
  }
)
