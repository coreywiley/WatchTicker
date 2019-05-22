function format_number(number, decimals = 2) {
  return number.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export default format_number;
