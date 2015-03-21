
function byTime(a, b) {
  var dateA = new Date(a.time);
  var dateB = new Date(b.time);

  // this may seem backwards but remember we want the newest (highest)
  // value.
  if (dateA < dateB) return 1;
  if (dateA > dateB) return -1;
  return 0;
}
exports.byTime = byTime;
