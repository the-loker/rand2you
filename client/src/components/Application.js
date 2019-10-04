import React, { Component } from 'react';

class Application extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: ''
        }

    }

    componentDidMount() {
        fetch('http://localhost:3000/api/')
            .then(res => res.json())
            .then(res => this.setState({ title: res.title }));  
    }

    render() {

        document.title = this.state.title;
        
        return(
            <div className='wrapper'>
                <h1>hello</h1>   
            </div>
        );

    }

}

export default Application;