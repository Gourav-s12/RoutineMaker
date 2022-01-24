const solve = require('timetabling-solver').minCollisions

const slots = ["[1,0]", "[2,0]"]
const bookables = ['Tennis', 'Climbing2' , 'Climbing1', 'Climbing3']
const constraints = [ //list of non overlapping constraints
  (timetable) => timetable["[1,0]"].length > 2 ? ['Climbing2'] : []
  //Climbing can't be at 8:00
]

solve({ slots, bookables, constraints }, {}, (table, fitness) => console.log(table, fitness))
