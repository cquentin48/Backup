import React from 'react';
import type Computer from '../../model/computer';

import ComputerMainInfos from './mainInfos';
import ComputerElements from './computerElements';

interface ComputerPageProps {
    // TODO : put them inside a class
    computer: Computer

}

class ComputerPage extends React.Component<ComputerPageProps> {
    render (): JSX.Element {
        const computer = this.props.computer;
        return (
            <div>
                <ComputerMainInfos computer={computer}/>
                <ComputerElements computer={computer}/>
            </div>
        );
    }
}

export default ComputerPage;
