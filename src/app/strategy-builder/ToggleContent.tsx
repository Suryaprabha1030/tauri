import React from 'react';
import Simulation from './simulation/SimulationPage';
import BackTesting from './backtesting/BackTestingPage';
import TabLayout from '@/components/shared/tablayout';
import config from '@/lib/config';
import Builder from './builder/BuilderPage';

interface ToggleContentProps {
  name:  string | undefined;
  id: number| null;
}

const ToggleContent: React.FC<ToggleContentProps> = (props) => {
  const { name, id } = props; // Destructuring props within the function body
  return (

       <TabLayout tabNames={config.strategyBuilder.tabNames}>
              <Builder
              name={name} id={id} />
              <Simulation
                name={name}
                id={id}
              />
              <BackTesting
                name={name}
                id={id}
              />
        </TabLayout> 

  );
}

export default ToggleContent;