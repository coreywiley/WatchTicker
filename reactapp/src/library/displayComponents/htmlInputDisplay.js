import React, { Component } from 'react';
import {Editor, EditorState, RichUtils, ContentState, convertToRaw, convertFromRaw} from 'draft-js';

//Expects to work with a TextField

class HTMLInputDisplay extends React.Component {
        constructor(props) {
          super(props);
          console.log("Value", this.props.value)

          var editorState = EditorState.createEmpty();
          if (this.props.value != '') {
            var json_data = JSON.parse(this.props.value);
            var contentState = convertFromRaw(json_data)
            var editorState = EditorState.createWithContent(contentState)
          }

        this.state = {
          editorState: editorState,
        };

          this.onChange = this.onChange.bind(this);
          this.focus = () => this.refs.editor.focus();
          this.handleKeyCommand = (command) => this._handleKeyCommand(command);
          this.onTab = (e) => this._onTab(e);
          this.toggleBlockType = (type) => this._toggleBlockType(type);
          this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
        }

        onChange(editorState) {
          this.setState({editorState})
          var rawData = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
          var newState = {};
          newState[this.props.name] = rawData;

          this.props.setFormState(newState)
        }

        _handleKeyCommand(command) {
          const {editorState} = this.state;
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
            this.onChange(newState);
            return true;
          }
          return false;
        }

        _onTab(e) {
          const maxDepth = 4;
          this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
        }

        _toggleBlockType(blockType) {
          this.onChange(
            RichUtils.toggleBlockType(
              this.state.editorState,
              blockType
            )
          );
        }

        _toggleInlineStyle(inlineStyle) {
          this.onChange(
            RichUtils.toggleInlineStyle(
              this.state.editorState,
              inlineStyle
            )
          );
        }

        render() {
          const {editorState} = this.state;

          // If the user changes block type before entering any text, we can
          // either style the placeholder or hide it. Let's just hide it now.
          let className = 'RichEditor-editor';
          var contentState = editorState.getCurrentContent();
          if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
              className += ' RichEditor-hidePlaceholder';
            }
          }

          return (
            <div>
                <Editor
                  blockStyleFn={getBlockStyle}
                  customStyleMap={styleMap}
                  editorState={editorState}
                />
            </div>
          );
        }
      }

      // Custom overrides for "code" style.
      const styleMap = {
        CODE: {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
          fontSize: 16,
          padding: 2,
        },
      };

      function getBlockStyle(block) {
        switch (block.getType()) {
          case 'blockquote': return 'RichEditor-blockquote';
          default: return null;
        }
      }



export default HTMLInputDisplay;
