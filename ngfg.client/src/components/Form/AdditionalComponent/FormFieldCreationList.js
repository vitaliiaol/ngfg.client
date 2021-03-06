import React, {Component} from "react";
import CreateFormField from "../../Field/CreateFormField";
import {TextField} from "@material-ui/core";

class FormFieldCreationList extends Component {

    state = {
        questions: []
    }

    handleRemoveField = (position) => {
        this.props.handleFieldRemoval(position);
    }

    handleMoveUpClick = (position, disabled) => {
        this.props.handleMoveUp(position, disabled);
    }

    handleMoveDownClick = (position, disabled) => {
        this.props.handleMoveDown(position, disabled);
    }

    fetchQuestion = (event, position) => {
        let question = event.target.value;
        this.props.fetchQuestion(position, question);
    }

    renderErrorMessage = (elem, index) => {
        if (this.props.errors[index]) {
            return this.props.errors[index].question
        }
        return `Enter question for ${elem.field.name}`
    }

    render() {
        return(
            <React.Fragment>
            {
                this.props.fields.map((elem, index) =>
                        <div className="form-field-container">
                            <TextField variant="outlined"
                                       helperText={this.renderErrorMessage(elem, index)}
                                       size="small"
                                       type="text"
                                       className="form-creation-fields"
                                       value={elem.question}
                                       error={this.props.errors[index]}
                                       onChange={(event)=> this.fetchQuestion(event, index)}/>
                        <CreateFormField field={elem.field}
                                         id={elem.field.id}
                                         position={index}
                                         onRemoveClick={this.handleRemoveField}
                                         handleMoveUp={this.handleMoveUpClick}
                                         handleMoveDown={this.handleMoveDownClick}
                                         disableMoveUp={index===0 ? true : false}
                                         disableMoveDown={index===this.props.fields.length-1 ? true : false}
                        /></div>)
            }
            </React.Fragment>
        )
    }

}

export default FormFieldCreationList;