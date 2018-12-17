from io import BytesIO
from django.http import HttpResponse
from django.template.loader import get_template
import xhtml2pdf.pisa as pisa
import io

class Render:

    @staticmethod
    def render(path: str, params: dict):
        template = get_template(path)
        html = str(template.render(params))
        result = io.BytesIO()
        pdf = pisa.pisaDocument(io.BytesIO(html), dest=result)
        if not pdf.err:
            return HttpResponse(result.getvalue(), content_type='application/pdf')
        else:
            return HttpResponse("Error Rendering PDF", status=400)