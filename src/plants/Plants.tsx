import React, { ReactElement, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
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
                    <Typography variant="h5" color="primary">
                      Plants needing attention
                    </Typography>
                    <PlantList plants={plantsToWaterList} />
                  </div>
                )}
                {plantsRemainingList.length > 0 && (
                  <>
                    <Typography variant="h4" color="primary">
                      Plants
                    </Typography>
                    <PlantList plants={plantsRemainingList} />
                  </>
                )}
              </div>
            </div>
            <InspectorPanel />
          </div>
        </div>
      )
    }
  )
)
