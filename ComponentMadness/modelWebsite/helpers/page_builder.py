import re

def componentTree(components, parent):
    component_list = []

    for component in components:
        if ('parent' in component and component['parent'] == parent) or ('parent' not in component and parent == "") or ('parent' in component and parent == "" and component['parent'] == None):
            children = componentTree(components, component['key'])
            component['children'] = children
            component_list.append(component)

    return component_list

def componentPrint(component_tree, depth = 0):
    print ("Print In The Wrong Place")
    components = []

    search = re.compile('{[^}:]*}')

    for item in component_tree:
        props = ''

        for key in item['props']:
            resolve_props = False
            resolve_global = False
            resolving_props = search.findall(str(item['props'][key]))
            for prop in resolving_props:
                if 'props.' in prop:
                    resolve_props = True
                else:
                    resolve_global = True


            if type(item['props'][key]) == str:
                if resolve_props and resolve_global:
                    props += '%s={resolveVariables(resolveVariables({"text":"%s"}, this), window.cmState.getGlobalState(this))["text"]} ' % (
                        key, item['props'][key].replace('True','true'))
                elif resolve_props:
                    props += '%s={resolveVariables({"text":"%s"}, this)["text"]} ' % (
                        key, item['props'][key].replace('True', 'true'))
                elif resolve_global:
                    props += '%s={resolveVariables({"text":"%s"}, window.cmState.getGlobalState(this))["text"]} ' % (
                        key, item['props'][key].replace('True', 'true'))
                else:
                    props += '%s={"%s"} ' % (
                        key, item['props'][key].replace('True', 'true'))
            else:
                if resolve_props and resolve_global:
                    props += '%s={resolveVariables(resolveVariables({"text":%s}, this), window.cmState.getGlobalState(this))["text"]} ' % (
                        key, str(item['props'][key]).replace('True', 'true'))
                elif resolve_props:
                    props += '%s={resolveVariables({"text":%s}, this)["text"]} ' % (
                        key, str(item['props'][key]).replace('True', 'true'))
                elif resolve_global:
                    props += '%s={resolveVariables({"text":%s}, window.cmState.getGlobalState(this))["text"]} ' % (
                        key, str(item['props'][key]).replace('True', 'true'))
                else:
                    props += '%s={%s} ' % (
                        key, str(item['props'][key]).replace('True', 'true'))


        components.append("%s<%s %s>" % ("\t" * depth, item['type'], props))
        components.extend(componentPrint(item['children'], depth + 1))
        components.append("</%s>" % item['type'])

    return components

def componentPrintPage(component_tree, depth = 0):
    print ("Component Print Page")
    components = []

    search = re.compile('{[^}:]*}')

    for item in component_tree:
        props = ''

        for key in item['props']:
            resolve_global = False
            resolving_props = search.findall(str(item['props'][key]))

            for prop in resolving_props:
                if 'props.' in prop:
                    pass
                elif '.' in prop:
                    resolve_global = True
                    print ("\n\n", prop, "\n\n")


            if type(item['props'][key]) == str:
                if resolve_global:
                    props += '%s={resolveVariables({"text":"%s"}, window.cmState.getGlobalState(this))["text"]} ' % (
                        key, str(item['props'][key]).replace('True', 'true'))
                else:
                    props += '%s={"%s"} ' % (
                        key, item['props'][key].replace('True', 'true'))
            else:
                if resolve_global:
                    props += '%s={resolveVariables({"text":%s}, window.cmState.getGlobalState(this))["text"]} ' % (
                        key, str(item['props'][key]).replace('True', 'true'))
                else:
                    props += '%s={%s} ' % (
                        key, str(item['props'][key]).replace('True', 'true'))


        components.append("%s<%s %s>" % ("\t" * depth, item['type'], props))
        components.extend(componentPrintPage(item['children'], depth + 1))
        components.append("</%s>" % item['type'])

    return components


def pluralize(config_name):

    if config_name[-1] in ['s','x','z','o'] or config_name[-2:] in ['sh','ch','is']:
        related_name = config_name + 'es'

    elif config_name[-1] == 'y':
        if config_name[-2] in ['a','e','i','o','u']:
            related_name = config_name + 's'
        else:
            related_name = config_name[:-1] + 'ies'

    elif config_name[-2:] == 'us':
        related_name = config_name[:-2] + 'i'

    elif config_name[-2:] == 'on':
        related_name = config_name[:-2] + 'a'

    else:
        related_name = config_name + 's'

    return related_name
