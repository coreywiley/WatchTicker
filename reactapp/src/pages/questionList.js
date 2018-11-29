import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ajaxWrapper from "base/ajax.js";
import {Card, Header, Button} from 'library';


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
  overflow: 'auto',
});

class OrderableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        questions: [],
        questions_archived: []
    };

    this.questionCallback = this.questionCallback.bind(this);
    this.updatePreviewData = this.updatePreviewData.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() {
    ajaxWrapper('GET','/api/home/question/?order_by=order',{}, this.questionCallback);
  }

  questionCallback(result) {
    var questions = [];
    var questions_archived = [];

    for (var index in result) {
      var question = result[index]['question']
      var card = <Card name={question['name']} link={'/editQuestion/' + question.id + '/'} button_type={'primary'} button={'Edit Question'} />
      if (question['archived']) {
        questions_archived.push({'content':card, 'id':question['id']})
      }
      else {
        questions.push({'content':card, 'id':question['id']})
      }

    }
    this.setState({questions: questions, questions_archived: questions_archived})

  }

  updatePreviewData(questions, questions_archived) {
    console.log("Updating Preview Data", questions, questions_archived)
    if (questions) {
      for (var index in questions) {
        ajaxWrapper('POST','/api/home/question/' + questions[index]['id'] + '/', {'preview_archived':false, preview_order:index}, console.log)
      }
    }
    if (questions_archived) {
      for (var index in questions_archived) {
        ajaxWrapper('POST','/api/home/question/' + questions_archived[index]['id'] + '/', {'preview_archived':true, preview_order:index}, console.log)
      }
    }
  }

  updateData() {
    var questions = this.state.questions;
    var questions_archived = this.state.questions_archived;
    for (var index in questions) {
      ajaxWrapper('POST','/api/home/question/' + questions[index]['id'] + '/', {'preview_archived':false, preview_order:index, 'archived':false, order:index}, console.log)
    }
    for (var index in questions_archived) {
      ajaxWrapper('POST','/api/home/question/' + questions_archived[index]['id'] + '/', {'preview_archived':true, preview_order:index, archived:true, order:index}, console.log)
    }
  }
    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        droppable: 'questions',
        droppable2: 'questions_archived'
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { questions_archived: items };
                this.updatePreviewData(null, items);
            }
            if (source.droppableId === 'droppable') {
                state = { questions: items };
                this.updatePreviewData(items, null);
            }



            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.updatePreviewData(result.droppable, result.droppable2);

            this.setState({
                questions: result.droppable,
                questions_archived: result.droppable2
            });
        }
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
          <div className="container">
            <Button type={'info'} href={'/editQuestion/'} text={'Add New Question'} />
            <Button type={'primary'} href={'/onboarding/'} target={"_blank"} text={'Preview Onboarding'} />
            <Button type={'success'} clickHandler={this.updateData} text={'Save Order'} />
            <Header size={3} text={'On Boarding Questions'} />
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {this.state.questions.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <br/>
                <br/>
                <Header size={3} text={'Archived Questions'} />
                <Droppable droppableId="droppable2" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {this.state.questions_archived.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            </div>
        );
    }
}



export default OrderableList
