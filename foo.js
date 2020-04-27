
// while (1) continue log_b

log_a: while (0) { }
console.log('A')
// while (1) continue end


log_b: while (0) { }
console.log('B')
while (1) { continue log_a }

end: while (0) { }
