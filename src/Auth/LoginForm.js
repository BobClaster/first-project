import React, {Component} from 'react';
import { Alert, Button, Jumbotron,  Form } from 'reactstrap';

import TextInput from '../_components/TextInput';

export default class LoginForm extends Component {
    state = {
        username: '',
        password: ''
    };

    handleInputChange = (event) => {
        const target = event.target,
            value = target.type ===
            'checkbox' ? target.checked : target.value,
            name = target.name;

        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.username, this.state.password);
    };

    render() {
        const errors = this.props.errors || {};

        return (
            <Jumbotron className="container">
                <Form onSubmit={this.onSubmit}>
                    <h1>Authentication</h1>
                    {
                        errors.non_field_errors?
                            <Alert color="danger">
                                {errors.non_field_errors}
                            </Alert>:""
                    }
                    <TextInput name="username" label="Username"
                               error={errors.username}
                               onChange={this.handleInputChange}/>
                    <TextInput name="password" label="Password"
                               error={errors.password} type="password"
                               onChange={this.handleInputChange}/>
                    <Button type="submit" color="primary" size="lg" >Login</Button>
                </Form>
            </Jumbotron>
        )
    }
}