// Stardusts Hackpad parametric case sketch.
// Dimensions are a starting point for KiCad-fit validation.

$fn = 42;

case_width = 96;
case_height = 84;
case_depth = 12;
wall = 2.4;
corner = 4;
switch_pitch = 19;
switch_cutout = 14.1;

module rounded_box(width, height, depth, radius) {
  hull() {
    for (x = [radius, width - radius]) {
      for (y = [radius, height - radius]) {
        translate([x, y, 0]) cylinder(h = depth, r = radius);
      }
    }
  }
}

module switch_grid() {
  for (row = [0:2]) {
    for (col = [0:3]) {
      translate([17 + col * switch_pitch, 18 + row * switch_pitch, -1])
        cube([switch_cutout, switch_cutout, case_depth + 2], center = true);
    }
  }
}

module encoder_cutout() {
  translate([75, 14, -1]) cylinder(h = case_depth + 2, r = 3.8);
}

difference() {
  rounded_box(case_width, case_height, case_depth, corner);
  translate([wall, wall, wall])
    rounded_box(case_width - wall * 2, case_height - wall * 2, case_depth, corner - 1);
  switch_grid();
  encoder_cutout();
}
