from django.http import HttpResponseRedirect

# Create your views here.
def my_login_required(function):
    def wrapper(request, *args, **kw):
        if not (request.user and request.user.is_authenticated):
            return HttpResponseRedirect('/users/logIn/')
        else:
            return function(request, *args, **kw)
    return wrapper

def staff_required(function):
    def wrapper(request, *args, **kw):
        if not (request.user and request.user.is_authenticated and request.user.is_superuser):
            return HttpResponseRedirect('/users/logIn/')
        else:
            return function(request, *args, **kw)
    return wrapper


from rest_framework import permissions

class IsPostOrIsAuthenticated(permissions.BasePermission):

    def has_permission(self, request, view):
        # allow all POST requests
        if request.method == 'POST' or request.method == "OPTIONS":
            return True

        # Otherwise, only allow authenticated requests
        return request.user and request.user.is_authenticated()
