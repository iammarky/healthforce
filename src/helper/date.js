export default function reverseDateFormat(dateString) {
  const [month, day, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
}
