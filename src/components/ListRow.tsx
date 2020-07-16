import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react'
import Card from '@material-ui/core/Card'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import CheckIcon from '@material-ui/icons/Done'
import FertilizeIcon from '@material-ui/icons/Eco'
import OptionsIcon from '@material-ui/icons/MoreVert'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { InspectorMode, Plant, PlantEvent, PlantEventType } from '../models'
import { plantStore } from '../injectables'
import { formatDate, formatDays } from '../utils'
import WaterIcon from '../assets/WateringCanIcon'
import WaterFertilizeIcon from '../assets/WateringCanLeafIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      backgroundColor: '#B3FEBF',
    },
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
      fontSize: '64pt',
      fontWeight: 800,
      position: 'absolute',
      right: 0,
      top: '-0.3em',
      [theme.breakpoints.only('sm')]: {
        right: '1em',
      },
    },
  })
)



interface ListRowProps {
  plant: Plant
  handleModifyPlant: (
    event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement>,
    plant: Plant,
    plantEvent: PlantEvent
  ) => void
}

export const ListRow = observer(
  ({ plant, handleModifyPlant }: ListRowProps): ReactElement => {
    const {
      id,
      name,
      lastWateredDate,
      lastFertilizedDate,
      toBeChecked,
      isFertilized,
      checkedToday,
      daysToWater,
      getAvgInterval,
    } = plant
    const classes = useStyles()
    const avgWateringInterval = getAvgInterval(PlantEventType.WATER)
    const { setInspectorMode, setSelectedPlantID } = plantStore
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const buttons = [
      {
        tooltip: 'Water not needed today',
        icon: <CheckIcon />,
        plantEvent: {
          eventType: PlantEventType.CHECK,
          initialMessage: `Marking ${name} as not needing water today`,
          successMessage: `${name} successfully marked as not needing water today`,
          duplicateMessage: `${name} already marked as not needing water today`,
          errorMessage: `There was an error marking ${name} as not needing water today`,
        },
      },
      {
        tooltip: `Fertilize ${name} today`,
        icon: <FertilizeIcon />,
        plantEvent: {
          eventType: PlantEventType.FERTILIZE,
          initialMessage: `Fertilizing ${name}...`,
          successMessage: `${name} successfully fertilized`,
          duplicateMessage: `${name} already fertilized today`,
          errorMessage: `There was an error fertilizing ${name}`,
        },
      },
      {
        tooltip: `Water ${name} (with fertilizer) today`,
        icon: <WaterFertilizeIcon />,
        plantEvent: {
          eventType: PlantEventType.WATER_WITH_FERTILIZER,
          initialMessage: `Watering ${name} with fertilizer...`,
          successMessage: `${name} successfully watered with fertilizer`,
          duplicateMessage: `${name} already watered with fertilizer today`,
          errorMessage: `There was an error watering ${name} with fertilizer`,
        },
      },
      {
        tooltip: `Water ${name} today`,
        icon: <WaterIcon />,
        plantEvent: {
          eventType: PlantEventType.WATER,
          initialMessage: `Watering ${name}...`,
          successMessage: `${name} successfully watered`,
          duplicateMessage: `${name} already watered today`,
          errorMessage: `There was an error watering ${name}`,
        },
      },
    ]

    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
      setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = (event: React.MouseEvent<HTMLLIElement>): void => {
      event.stopPropagation()
      setAnchorEl(null)
    }

    const getWateringNumberMessage = (): string => {
      if (daysToWater === undefined) {
        return 'More watering events needed to calculate days to water'
      } else if (daysToWater < 1) {
        return `${-daysToWater} days past due for watering ${
          checkedToday ? ' (checked today)' : ''
        }`
      } else {
        return `${daysToWater} day${daysToWater !== 1 ? 's' : ''} until water due`
      }
    }

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
              <Typography variant="h5" color="primary" noWrap>
                {name}
              </Typography>
              <Typography color="textPrimary" variant="body2">
                {!!avgWateringInterval && (
                  <strong>
                    {` Watered every ${avgWateringInterval !== 1 ? avgWateringInterval : ''} day${
                      avgWateringInterval !== 1 ? 's' : ''
                    } | `}
                  </strong>
                )}
                <Hidden lgDown>
                  {`Last watered: ${
                    !!lastWateredDate ? formatDate(lastWateredDate) : 'Never'
                  } | Last fertilized: ${
                    !!lastFertilizedDate ? formatDate(lastFertilizedDate) : 'Never'
                  }`}
                </Hidden>
                <Hidden xlUp>
                  {!!lastWateredDate ? `Watered ${formatDays(lastWateredDate)}` : 'Never watered'}
                  <Hidden only={['xs', 'md']}>
                    {!!lastFertilizedDate
                      ? ` | Fertilized ${formatDays(lastFertilizedDate)}`
                      : ' | Never fertilized'}
                  </Hidden>
                </Hidden>
              </Typography>
            </div>

            <div className="list-row__buttons">
              <div className="list-row__watering-days-number">
                <Tooltip title={getWateringNumberMessage()} placement="left">
                  <Typography className={classes.wateringNumber} variant="h3">
                    {daysToWater !== undefined ? daysToWater : '?'}
                  </Typography>
                </Tooltip>
              </div>
              <Hidden mdDown>
                {buttons.map((button) => {
                  const { tooltip, plantEvent, icon } = button
                  const { eventType } = plantEvent
                  return (
                    ((toBeChecked && eventType === PlantEventType.CHECK) ||
                      eventType !== PlantEventType.CHECK) && (
                      <Tooltip key={`button-${tooltip}-${id}`} title={tooltip}>
                        <IconButton
                          onClick={(event) => handleModifyPlant(event, plant, plantEvent)}
                        >
                          {icon}
                        </IconButton>
                      </Tooltip>
                    )
                  )
                })}
              </Hidden>
              <Hidden lgUp>
                <IconButton
                  size="small"
                  edge="end"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleClickMenu(event)
                  }}
                >
                  <OptionsIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  MenuListProps={{ disablePadding: true }}
                  onClose={handleCloseMenu}
                >
                  <div className={classes.menu}>
                    {buttons.map((button) => {
                      const { tooltip, plantEvent, icon } = button
                      const { eventType } = plantEvent
                      return (
                        ((toBeChecked && eventType === PlantEventType.CHECK) ||
                          eventType !== PlantEventType.CHECK) && (
                          <MenuItem
                            key={`menuItem-${button.tooltip}-${id}`}
                            onClick={(event) => {
                              handleModifyPlant(event, plant, plantEvent)
                              handleCloseMenu(event)
                            }}
                          >
                            <>
                              {button.icon}
                              <span className="list-row__menu-item-text">{button.tooltip}</span>
                            </>
                          </MenuItem>
                        )
                      )
                    })}
                  </div>
                </Menu>
              </Hidden>
            </div>
          </div>
        </Card>
      </div>
    )
  }
)
