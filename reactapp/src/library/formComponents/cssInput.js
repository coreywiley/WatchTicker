import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {FormWithChildren, TextInput, Button} from 'library';

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


const css_props = [
    "accelerator",
"azimuth",
"background",
"backgroundAttachment",
"backgroundColor",
"backgroundImage",
"backgroundPosition",
"backgroundPositionX",
"backgroundPositionY",
"backgroundRepeat",
"behavior",
"border",
"borderBottom",
"borderBottomColor",
"borderBottomStyle",
"borderBottomWidth",
"borderCollapse",
"borderColor",
"borderLeft",
"borderLeftColor",
"borderLeftStyle",
"borderLeftWidth",
"borderRight",
"borderRightColor",
"borderRightStyle",
"borderRightWidth",
"borderSpacing",
"borderStyle",
"borderTop",
"borderTopColor",
"borderTopStyle",
"borderTopWidth",
"borderWidth",
"bottom",
"captionSide",
"clear",
"clip",
"color",
"content",
"counterIncrement",
"counterReset",
"cue",
"cueAfter",
"cueBefore",
"cursor",
"direction",
"display",
"elevation",
"emptyCells",
"filter",
"float",
"font",
"fontFamily",
"fontSize",
"fontSizeAdjust",
"fontStretch",
"fontStyle",
"fontVariant",
"fontWeight",
"heigh",
"imeMode",
"includeSource",
"layerBackgroundColor",
"layerBackgroundImage",
"layoutFlow",
"layoutGrid",
"layoutGridChar",
"layoutGridCharSpacing",
"layoutGridLine",
"layoutGridMode",
"layoutGridType",
"left",
"letterSpacing",
"lineBreak",
"lineHeight",
"listStyle",
"listStyleImage",
"listStylePosition",
"listStyleType",
"margin",
"marginBottom",
"marginLeft",
"marginRight",
"marginTop",
"markerOffset",
"marks",
"maxHeight",
"maxWidth",
"minHeight",
"minWidth",
"MozBinding",
"MozBorderRadius",
"MozBorderRadiusTopleft",
"MozBorderRadiusTopright",
"MozBorderRadiusBottomright",
"MozBorderRadiusBottomleft",
"MozBorderTopColors",
"MozBorderRightColors",
"MozBorderBottomColors",
"MozBorderLeftColors",
"MozOpacity",
"MozOutline",
"MozOutlineColor",
"MozOutlineStyle",
"MozOutlineWidth",
"MozUserFocus",
"MozUserInput",
"MozUserModify",
"MozUserSelect",
"orphans",
"outline",
"outlineColor",
"outlineStyle",
"outlineWidth",
"overflow",
"overflowX",
"overflowY",
"padding",
"paddingBottom",
"paddingLeft",
"paddingRight",
"paddingTop",
"page",
"pageBreakAfter",
"pageBreakBefore",
"pageBreakInside",
"pause",
"pauseAfter",
"pauseBefore",
"pitch",
"pitchRange",
"playDuring",
"position",
"quotesReplace",
"richness",
"right",
"rubyAlign",
"rubyOverhang",
"rubyPosition",
"SetLinkSource",
"size",
"speak",
"speakHeader",
"speakNumeral",
"speakPunctuation",
"speechRate",
"stress",
"scrollbarArrowColor",
"scrollbarBaseColor",
"scrollbarDarkShadowColor",
"scrollbarFaceColor",
"scrollbarHighlightColor",
"scrollbarShadowColor",
"scrollbar3DLightColor",
"scrollbarTrackColor",
"tableLayout",
"textAlign",
"textAlignLast",
"textDecoration",
"textIndent",
"textJustify",
"textOverflow",
"textShadow",
"textTransform",
"textAutospace",
"textKashidaSpace",
"textUnderlinePosition",
"top",
"unicodeBidi",
"UseLinkSource",
"verticalAlign",
"visibility",
"voiceFamily",
"volume",
"whiteSpace",
"widows",
"width",
"wordBreak",
"wordSpacing",
"wordWrap",
"writingMode",
"zIndex",
"zoom",
]

class CSSInput extends Component {
    constructor(props) {
        super(props);

        this.setGlobalState = this.setGlobalState.bind(this);
        this.addCSSField = this.addCSSField.bind(this);
    }

    setGlobalState(name, state) {
      var newState = {};
      for (var index in state) {
        if (index.indexOf('value_') > -1) {
          var i = index.split('_')[1]
          var name = state['name_' + i]
          newState[name] = state[index];
        }
      }

      var formState = {};
      formState[this.props.name] = newState;
      this.props.setFormState(formState)

    }

    addCSSField() {
      var value = JSON.parse(JSON.stringify(this.props.value));

      value[""] = "";

      var formState = {};
      formState[this.props.name] = value;
      this.props.setFormState(formState)
    }


    render() {

        var components = [];
        var componentProps = [];
        var defaults = {}
        var i = 0;
        for (var index in this.props.value) {
            console.log("In CSS INput Loop")
          components.push(<TextInput name={'name_' + i} layout={'col-6'} style={{width:'100%'}} suggestions={css_props} />)
          defaults['name_' + i] = index;

          components.push(<TextInput name={'value_' + i} layout={'col-6'} style={{width:'100%'}} />)
          defaults['value_' + i] = this.props.value[index];
          i += 1
        }

        var key = makeid(5);


        return (
              <div className={"form-group "}>
                {this.props.label}
                <br />
                <Button type={'primary'} text={'Add CSS Field'} onClick={this.addCSSField} />
                <br />
                <FormWithChildren layout={'form-inline'} defaults={defaults} autoSetGlobalState={true} setGlobalState={this.setGlobalState} globalStateName={'form'}>
                    {components}
                </FormWithChildren>
              </div>
        )


    }
}

export default CSSInput;
