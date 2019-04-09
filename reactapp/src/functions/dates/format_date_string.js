import format_date from './format_date.js';

function format_date_string(date_string, date_format) {
  var date = new Date(Date.parse(date_string));
  console.log("Data", date)
  return format_date(date, date_format)
}

export default format_date_string;
