prop_list = [
'accelerator',
'azimuth',
'background',
'background-attachment',
'background-color',
'background-image',
'background-position',
'background-position-x',
'background-position-y',
'background-repeat',
'behavior',
'border',
'border-bottom',
'border-bottom-color',
'border-bottom-style',
'border-bottom-width',
'border-collapse',
'border-color',
'border-left',
'border-left-color',
'border-left-style',
'border-left-width',
'border-right',
'border-right-color',
'border-right-style',
'border-right-width',
'border-spacing',
'border-style',
'border-top',
'border-top-color',
'border-top-style',
'border-top-width',
'border-width',
'bottom',
'caption-side',
'clear',
'clip',
'color',
'content',
'counter-increment',
'counter-reset',
'cue',
'cue-after',
'cue-before',
'cursor',
'direction',
'display',
'elevation',
'empty-cells',
'filter',
'float',
'font',
'font-family',
'font-size',
'font-size-adjust',
'font-stretch',
'font-style',
'font-variant',
'font-weight',
'heigh',
'ime-mode',
'include-source',
'layer-background-color',
'layer-background-image',
'layout-flow',
'layout-grid',
'layout-grid-char',
'layout-grid-char-spacing',
'layout-grid-line',
'layout-grid-mode',
'layout-grid-type',
'left',
'letter-spacing',
'line-break',
'line-height',
'list-style',
'list-style-image',
'list-style-position',
'list-style-type',
'margin',
'margin-bottom',
'margin-left',
'margin-right',
'margin-top',
'marker-offset',
'marks',
'max-height',
'max-width',
'min-height',
'min-width',
'-moz-binding',
'-moz-border-radius',
'-moz-border-radius-topleft',
'-moz-border-radius-topright',
'-moz-border-radius-bottomright',
'-moz-border-radius-bottomleft',
'-moz-border-top-colors',
'-moz-border-right-colors',
'-moz-border-bottom-colors',
'-moz-border-left-colors',
'-moz-opacity',
'-moz-outline',
'-moz-outline-color',
'-moz-outline-style',
'-moz-outline-width',
'-moz-user-focus',
'-moz-user-input',
'-moz-user-modify',
'-moz-user-select',
'orphans',
'outline',
'outline-color',
'outline-style',
'outline-width',
'overflow',
'overflow-X',
'overflow-Y',
'padding',
'padding-bottom',
'padding-left',
'padding-right',
'padding-top',
'page',
'page-break-after',
'page-break-before',
'page-break-inside',
'pause',
'pause-after',
'pause-before',
'pitch',
'pitch-range',
'play-during',
'position',
'quotes-replace',
'richness',
'right',
'ruby-align',
'ruby-overhang',
'ruby-position',
'-set-link-source',
'size',
'speak',
'speak-header',
'speak-numeral',
'speak-punctuation',
'speech-rate',
'stress',
'scrollbar-arrow-color',
'scrollbar-base-color',
'scrollbar-dark-shadow-color',
'scrollbar-face-color',
'scrollbar-highlight-color',
'scrollbar-shadow-color',
'scrollbar-3d-light-color',
'scrollbar-track-color',
'table-layout',
'text-align',
'text-align-last',
'text-decoration',
'text-indent',
'text-justify',
'text-overflow',
'text-shadow',
'text-transform',
'text-autospace',
'text-kashida-space',
'text-underline-position',
'top',
'unicode-bidi',
'-use-link-source',
'vertical-align',
'visibility',
'voice-family',
'volume',
'white-space',
'widows',
'width',
'word-break',
'word-spacing',
'word-wrap',
'writing-mode',
'z-index',
'zoom',
]

for prop in prop_list:
    prop_split = prop.split('-')

    react_prop = '"'
    for i in range(len(prop_split)):
        if i == 0:
            react_prop += prop_split[i]
        else:
            react_prop += prop_split[i].title()
    react_prop += '", '
    print (react_prop)

'''
Scheduler

emails = [
    'dkendall@bold.legal',
    'natty.zola@techstars.com',
    'zach.nies@techstars.com',
    'me@paulnfoley.com',
    'amherman@gmail.com',
    'getchellkate@gmail.com',
    'sam@pana.com',
    'devon@pana.com',
    'christine.lai.21@gmail.com',
]

html = "<p>Hi!</p><p>My friend and I were thinking of making an app to solve the 'communication clusterfuck' of scheduling 3+ people. But him and I weren't sure that was a big problem for people. So, I wanted to reach out and just see if that is something you do a lot in your job. And if so, if you had the same problem as me in just trying to wrangle everyone's schedules and then post back to them a time hoping that they would still be available. Or maybe you have a better way! Either way, I'd love to hear if you are organizing a couple people at once or maybe I can help. Let me know!</p><p>Jeremy</p>"

'''

'''
Insights Web Analytics
emails = [
    'support@spiritual-wear.com',
    'sales@christiancove.com',
    'info@9holer.com﻿',
    'Info@DetoxificationWorks.com',
    'Office@dimejewelry.com',
    'markseveniscompletion@protonmail.com',
    'Sales@TheCandleStation.net',
    'parker.music.center@gmail.com',
    'sales@shade8.com',
]
html = "<p>Hi,</p><p>I got this idea for simplifying e-commerce analytics data after helping out a friend with theirs. It was kind of mind blowing. The shop was about selling emoji leggings and we kind of guessed that the market was more millenial girls, but it turned out all the buyers were a lot older.</p><p>Probably grandparents buying for their grand daughters.</p><p>So, here I am, wondering if I could help out some more e-commerce people. Here are a couple of the reports I produced that helped us figure that out.</p><img src='http://miyakiperformance.com/wp-content/uploads/2018/12/01.-APP-Analytics-pic-1-of-2.png' /><img src='http://miyakiperformance.com/wp-content/uploads/2018/12/01.-APP-Analytics-pic-2-of-2.png' /><p>I was hoping you might be willing to help me out and give me a couple minutes of your time for some feedback. If you are interested, I can send some more info.</p><p>What do you think?</p><p>Jeremy</p>"
'''

'''
emails = [
    'info@soneffs.com',
    'service@importmechanics.com',
    'theairplanerestaurant@gmail.com',
    'info@newmoonbakery.com',
    'ian@rollinsvilleauto.com',
    'info@framormotorsbanchory.co.uk',
    'info@morayfirthmotors.com',
    'craighighlandfm@yahoo.co.uk',
    'info@ekarfarm.org',
    'dave@petroccofarms.com',
]

html = "<p>Hi</p><p>I'm looking to build a portfolio for a little website design company I am starting. I would love to get started by doing some free redesign work for some smaller companies. If you have any interest, I would love to hear back and see if I can help.</p>"

'''
