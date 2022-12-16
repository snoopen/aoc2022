# 🎄 Advent of Code 2022 - day 15 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/15)

## Notes

### Part 2

The only possible position must exist at the perimeter + 1 of the sensors.
Since the only possible position must only be 1 unit in size, at least three sensors perimeters must intersect. By finding all intersections, then filtering out any that fall within another sensor perimeter and those outside the search space, we should find the only possible position of the beacon.

Note: This doesn't account for positions that might occur at the boundaries where only one sensor clips 1 unit from the boundary corner.
