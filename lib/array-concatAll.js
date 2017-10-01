Array.prototype.concatAll = function() {
  var results = []

  this.forEach(function(subArray) {
    subArray.forEach(function(item) {
      results.push(item)
    })
  })

  return results
}
