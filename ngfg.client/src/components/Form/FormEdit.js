import React, {Component} from 'react';
import axios from 'axios';

import FormControl from '@material-ui/core/FormControl';
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormFieldCreationList from "./AdditionalComponent/FormFieldCreationList";

const API_URL = 'http://ngfg.com:8000/api';
const API_VERSION = 'v1';

class FormEdit extends Component {

    state = {
        "id": undefined,
        "name": undefined,
        "title": undefined,
        "resultUrl": undefined,
        "isPublished": undefined,
        "formFields": [],
        "addedFormFields": []
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.addedFields != this.props.addedFields) {
            let formFields = this.state.formFields;
            formFields.push(this.props.addedFields);
            this.setState({formFields});
        }
    }

    handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        });
    }

    handleTitleChange = (event) => {
        this.setState({
            title: event.target.value
        });
    }

    handleResultUrlChange = (event) => {
        this.setState({
           resultUrl: event.target.value
        });
    }

    handlePublish = () => {
        this.setState({
            isPublished: true
        }, this.saveForm);
    }

    getFormData = () => {
        axios.get(`${API_URL}/${API_VERSION}/forms/${this.props.formId}`, {
            withCredentials: true
        })
            .then(res => {
                let form = res.data;
                this.setState({
                    id: form.id,
                    name: form.name,
                    title: form.title,
                    resultUrl: form.resultUrl,
                    isPublished: form.isPublished})
            })
    }

    getFormFieldsData = () => {
        axios.get(`${API_URL}/${API_VERSION}/forms/${this.props.formId}/fields`, {
            withCredentials: true
        })
            .then(res=> {
                let formFields = res.data.formFields;
                console.log(formFields);
                this.setState({formFields: formFields});
            })
    }

    componentDidMount() {
        this.getFormData();
        this.getFormFieldsData();
    }

    saveFormFields = (formId, formField, position) => {
        axios.post(`${API_URL}/${API_VERSION}/forms/${formId}/fields/`, {
            fieldId: formField.field.id,
            question: formField.question,
            position: position
        },
            {withCredentials: true})
            .then ( res => {
                console.log(res);
                }
            )
            .catch(error => {
                console.log(error);
                }
            )
    }

    saveForm = () => {
        axios.post(`${API_URL}/${API_VERSION}/forms/`, {
                name: this.state.name,
                title: this.state.title,
                resultUrl: this.state.resultUrl,
                isPublished: this.state.isPublished
            },
            {withCredentials: true})
            .then( res => {
                    const formId = res.data.id;
                    Object.entries(this.state.formFields).map(([key, value]) => (
                        this.saveFormFields(formId, value, key)
                    ));
                }
            )
            .catch ( error => {
                console.log(error);
                }
            );
    }

    handleFieldRemoval = (position) => {
        this.props.removeField(position);
    }

    handleMoveUpField = (position, disabled) => {
        let formFields = this.state.formFields;
        if (!disabled) {
            formFields[position] = formFields.splice(position-1, 1, formFields[position])[0];
            this.setState({formFields: formFields});
        }
    }

    handleMoveDownField = (position, disabled) => {
        let formFields = this.state.formFields;
        if (!disabled) {
            formFields[position] = formFields.splice(position+1, 1, formFields[position])[0];
            this.setState({formFields: formFields});
        }
    }

    fetchQuestion = (position, question) => {
        let formFields = this.state.formFields;
        formFields[position].question = question;
        this.setState({formFields: formFields});
    }

    render() {
        return(
            <div className="form-container">
                <FormControl>
                    <div className="form-btn-container">
                        <Button onClick={this.handlePublish}
                                className="form-creation-btn"
                        >
                            Save & Publish
                        </Button>
                        <Button onClick={this.saveForm}
                                className="form-creation-btn"
                        >
                            Save
                        </Button>
                    </div>

                    <div className="form-creation-card">
                            <TextField
                            id="form-name"
                            className="form-creation-fields"
                            variant="outlined"
                            helperText="Enter Form Name"
                            type="text"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                        />
                        <TextField
                            className="form-creation-fields"
                            variant="outlined"
                            helperText="Enter Form Title"
                            size="small"
                            margin="dense"
                            type="text"
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                        />
                        <TextField
                            className="form-creation-fields"
                            variant="outlined"
                            helperText="Link Result URL"
                            size="small"
                            margin="dense"
                            type="url"
                            value={this.state.resultUrl}
                            onChange={this.handleResultUrlChange}
                        />
                        <div>
                            <FormFieldCreationList fields={this.state.formFields}
                                                   handleFieldRemoval={this.handleFieldRemoval}
                                                   handleMoveUp={this.handleMoveUpField}
                                                   handleMoveDown={this.handleMoveDownField}
                                                   fetchQuestion={this.fetchQuestion}/>
                        </div>
                    </div>
                </FormControl>
            </div>
        )
    }
}

export default FormEdit;