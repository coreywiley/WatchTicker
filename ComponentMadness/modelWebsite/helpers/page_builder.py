def componentTree(components, parent):
    component_list = []

    for component in components:
        if component['parent'] == parent:
            children = componentTree(components, component['key'])
            component['children'] = children
            component_list.append(component)

    return component_list

def componentPrint(component_tree, depth = 0):
    components = []
    for item in component_tree:
        props = ''

        for key in item['props']:
            if type(item['props'][key]) == str:
                props += '%s={resolveVariables(resolveVariables({"text":"%s"}, this), window.cmState.getGlobalState(this))["text"]} ' % (key, item['props'][key].replace('True','true'))
            else:
                props += '%s={resolveVariables(resolveVariables({"text":%s}, this), window.cmState.getGlobalState(this))["text"]} ' % (key, str(item['props'][key]).replace('True','true'))

        components.append("%s<%s %s>" % ("\t" * depth, item['type'], props))
        components.extend(componentPrint(item['children'], depth + 1))
        components.append("</%s>" % item['type'])

    return components