import pdfkit
config = pdfkit.configuration(wkhtmltopdf='C:\Program Files\wkhtmltopdf\\bin\wkhtmltopdf.exe')
pdfkit.from_url('http://localhost:8000/pdf/5c0dfb82d079623e3b028a33/', 'out.pdf', configuration=config)