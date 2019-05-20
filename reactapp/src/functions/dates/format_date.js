function format_date(date, date_format) {
  var date_dict = {};
  var temp_date = date.getDate();
  if (temp_date < 10) {
    temp_date = '0' + temp_date;
  }
  date_dict['dd'] = temp_date;

  var temp_month = date.getMonth() + 1;
  if (temp_month < 10) {
    temp_month = '0' + temp_month;
  }
  date_dict['mm'] = temp_month;

  date_dict['yyyy'] = date.getFullYear().toString();
  date_dict['yy'] = date.getFullYear().toString().substring(2, 4);

  date_dict['HH'] = date.getHours();
  date_dict['MM'] = date.getMinutes();
  date_dict['SSS'] = date.getMilliseconds();
  date_dict['SS'] = date.getSeconds();
  


  var keys = ['dd','mm','yyyy','yy','HH','MM','SSS','SS', 'P']
  for (var index in keys) {
    var key = keys[index];
    console.log("Replace", date_format,key, date_dict[key])
    date_format = date_format.replace(key, date_dict[key])
  }

  return date_format

}


export default format_date;
