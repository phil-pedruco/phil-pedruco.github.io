A simple div-based data grid, which could be enhanced by adding similar functionlity to [SlickGrid](https://github.com/mleibman/SlickGrid/wiki), such as virtual rendering.

## Basic usage

```javascript
var grid = d3.divgrid();

d3.csv('cars.csv', function(data) {
  d3.select('#grid')
    .datum(data)
    .call(grid)
});
```

## Changing data or columns

Currently the only functionality that is supported is updating the grid's data and columns. For instance, to update the grid to only show three specified columns:

```javascript
grid.columns(["year", "cylinders", "power (hp)"]);
d3.select("#grid").call(grid);
```

The grid uses d3 to enter, exit, and update data.