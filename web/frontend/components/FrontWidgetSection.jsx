import React from 'react';
import { LegacyCard, Grid, Button } from '@shopify/polaris';

const FrontWidgetSection = ({ isStatusActive, toggleActivation }) => {
  return (
    <LegacyCard sectioned>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 10, xl: 4 }}>
            <p>The store front widget is {isStatusActive ? 'Activated' : 'Deactivated'}</p>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 2, xl: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button onClick={toggleActivation}> 
                {isStatusActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </Grid.Cell>
        </Grid>
    </LegacyCard>
  );
};

export default FrontWidgetSection;
