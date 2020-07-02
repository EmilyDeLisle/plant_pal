import React, { ReactElement, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import { InspectorPanel, ListControls, PlantList, TopNavNar } from './plant-list'
import { plantStore } from '../injectables'

export const Plants = inject('plantStore')(
  observer(
    (props: RouteComponentProps): ReactElement => {
      const { plantsToWaterList, plantsRemainingList } = plantStore

      return (
        <div className="plants">
          <TopNavNar />
          <div className="plants__container">
            <div className="plants__lists-container">
              <ListControls />
              <div className="plants__lists">
                {plantsToWaterList.length > 0 && (
                  <div className="plants__attention-list">
                    <Typography color='textPrimary' variant="h5">Plants needing attention</Typography>
                    <PlantList plants={plantsToWaterList} />
                  </div>
                )}
                {plantsRemainingList.length > 0 && (
                  <>
                    <Typography color='textPrimary' variant="h4">Plants</Typography>
                    <PlantList plants={plantsRemainingList} />
                  </>
                )}
              </div>
            </div>
            <Hidden smDown>
              <InspectorPanel />
            </Hidden>
          </div>
        </div>
      )
    }
  )
)
