from __future__ import absolute_import
from .base import *

import importlib

import os

if os.name == 'nt':
    print ("Windows")
    globals().update(importlib.import_module('home.settings.development').__dict__)
else:
    print ('Linux?')
    globals().update(importlib.import_module('home.settings.production').__dict__)
