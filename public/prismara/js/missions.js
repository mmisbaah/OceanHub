
// ============================================================
// MISSION DATA
// ============================================================
const SHAPES = {
    circle:   { name: 'Circle',   symbol: '●', color: '#FF7675', icon: 'fa-circle' },
    square:   { name: 'Square',   symbol: '■', color: '#0984E3', icon: 'fa-square' },
    triangle: { name: 'Triangle', symbol: '▲', color: '#00B894', icon: 'fa-play' },
    diamond:  { name: 'Diamond',  symbol: '◆', color: '#FDCB6E', icon: 'fa-diamond' }
};

const MISSIONS = {
    pathways: {
        name: 'Pathways of Prismara',
        color: 'teal',
        icon: 'fa-route',
        intro: 'Cross the rainbow river by completing crystal stepping-stone patterns!',
        missions: [
            { id: 'p1', title: 'First Crossing', difficulty: 1, type: 'sequence',
              basePattern: ['circle','square'], preFilled: 4,
              hint: 'The path alternates: Circle, Square, Circle, Square. What comes next?',
              rule: 'AB alternating pattern' },
            { id: 'p2', title: 'Twin Light Stones', difficulty: 2, type: 'sequence',
              basePattern: ['circle','circle','square'], preFilled: 5,
              hint: 'The pattern repeats in groups of 3: Circle, Circle, Square. Count where the 6th stone falls.',
              rule: 'AAB repeating group' },
            { id: 'p3', title: 'Triangle Crossing', difficulty: 3, type: 'sequence',
              basePattern: ['circle','square','triangle'], preFilled: 5,
              hint: 'Three shapes take turns: Circle, Square, Triangle. The 6th stone is the 3rd shape again.',
              rule: 'ABC repeating cycle' }
        ]
    },
    gardens: {
        name: 'Crystal Gardens',
        color: 'indigo',
        icon: 'fa-leaf',
        intro: 'Arrange geometric crystal plants to restore the garden row!',
        missions: [
            { id: 'g1', title: 'Flower Trio', difficulty: 1, type: 'sequence',
              basePattern: ['triangle','triangle','diamond'], preFilled: 5,
              hint: 'Each group is: Triangle, Triangle, Diamond. What completes the second group?',
              rule: 'AAB repeating group' },
            { id: 'g2', title: 'Twin Blooms', difficulty: 2, type: 'sequence',
              basePattern: ['triangle','square','square','circle'], preFilled: 6,
              hint: 'Four-plant group: Triangle, Square, Square, Circle. Position 7 starts a new group.',
              rule: 'ABBC cycle' },
            { id: 'g3', title: 'Grand Arboretum', difficulty: 3, type: 'sequence',
              basePattern: ['diamond','circle','square','triangle'], preFilled: 7,
              hint: 'All four shapes in order, then repeat. Position 8 wraps back to Diamond... no wait, position 8 is the 4th item of group 2.',
              rule: 'ABCD cycle' }
        ]
    },
    bridge: {
        name: 'Bridgeworks',
        color: 'purple',
        icon: 'fa-bridge',
        intro: 'Master shape cycles that combine with alternating outline rules!',
        missions: [
            { id: 'b1', title: 'Dual Bridge', difficulty: 2, type: 'bridge',
              shapeCycle: ['triangle','square','circle'],
              strokeCycle: ['solid','dashed'],
              targetIndex: 3,
              hint: 'Shape repeats every 3 (Triangle→Square→Circle), outlines every 2 (Solid→Dashed).',
              rule: 'Shape period 3 + Outline period 2' },
            { id: 'b2', title: 'Mirror Bridge', difficulty: 2, type: 'bridge',
              shapeCycle: ['circle','diamond'],
              strokeCycle: ['solid','solid','dashed'],
              targetIndex: 4,
              hint: 'Shape repeats every 2, outlines every 3 (Solid, Solid, Dashed).',
              rule: 'Shape period 2 + Outline period 3' },
            { id: 'b3', title: 'Grand Spiral', difficulty: 3, type: 'bridge',
              shapeCycle: ['triangle','square','circle','diamond'],
              strokeCycle: ['solid','dashed','dotted'],
              targetIndex: 5,
              hint: 'Shape period 4 (Triangle→Square→Circle→Diamond), outline period 3 (Solid→Dashed→Dotted).',
              rule: 'Shape period 4 + Outline period 3' }
        ]
    },
    signal: {
        name: 'Lantern Signal Lab',
        color: 'amber',
        icon: 'fa-wave-square',
        intro: 'Investigate periodic waveforms and find when signals flash together!',
        missions: [
            { id: 's1', title: 'Pulse Synchronization', difficulty: 2, type: 'signal',
              signals: [{name:'A', period:3, color:'#FDCB6E'}, {name:'B', period:4, color:'#00CEC9'}],
              maxBeats: 16,
              hint: 'Signal A pulses at 3, 6, 9, 12. Signal B at 4, 8, 12. Find the first shared beat.',
              rule: 'Two-signal LCM' },
            { id: 's2', title: 'Split Beam', difficulty: 2, type: 'signal',
              signals: [{name:'A', period:2, color:'#A29BFE'}, {name:'B', period:5, color:'#FF7675'}],
              maxBeats: 12,
              hint: 'Signal A pulses at even beats; Signal B every 5th. Find the first common beat.',
              rule: 'LCM(2, 5)' },
            { id: 's3', title: 'Triple Harmony', difficulty: 3, type: 'signal',
              signals: [{name:'A', period:3, color:'#FDCB6E'}, {name:'B', period:4, color:'#00CEC9'}, {name:'C', period:6, color:'#FF7675'}],
              maxBeats: 16,
              hint: 'Three signals! Find the smallest beat that is a multiple of 3, 4, AND 6.',
              rule: 'LCM(3, 4, 6)' }
        ]
    }
};

const LIGHTHOUSE_CHANNELS = [
    { id: 'L1', name: 'Pattern Path', icon: 'fa-route', color: 'teal', type: 'sequence',
      basePattern: ['triangle','circle','square','circle'], preFilled: 5,
      hint: 'A four-shape repeating path: Triangle, Circle, Square, Circle. Position 6 = ?',
      rule: 'ABCD cycle' },
    { id: 'L2', name: 'Crystal Array', icon: 'fa-leaf', color: 'indigo', type: 'sequence',
      basePattern: ['diamond','diamond','circle'], preFilled: 7,
      hint: 'Groups of three: Diamond, Diamond, Circle. Position 8 starts a fresh group.',
      rule: 'AAB repeating group' },
    { id: 'L3', name: 'Dual Light Bridge', icon: 'fa-bridge', color: 'purple', type: 'bridge',
      shapeCycle: ['triangle','square','circle','diamond'],
      strokeCycle: ['solid','dashed','solid'],
      targetIndex: 6,
      hint: 'Shape period 4, outline period 3. Position 7 = ?',
      rule: 'Shape period 4 + Outline period 3' },
    { id: 'L4', name: 'Beacon Sync', icon: 'fa-wave-square', color: 'amber', type: 'signal',
      signals: [{name:'A', period:3, color:'#FDCB6E'}, {name:'B', period:5, color:'#00CEC9'}],
      maxBeats: 18,
      hint: 'Signal A: 3,6,9,12,15. Signal B: 5,10,15. First shared beat?',
      rule: 'LCM(3, 5)' }
];

const ACHIEVEMENTS = {
    first: { name: 'First Spark', desc: 'Complete your first mission', icon: 'fa-sparkles' },
    pathways: { name: 'Path Finder', desc: 'Complete all Pathways missions', icon: 'fa-route' },
    gardens: { name: 'Garden Keeper', desc: 'Complete all Crystal Garden missions', icon: 'fa-leaf' },
    bridge: { name: 'Bridge Builder', desc: 'Complete all Bridgeworks missions', icon: 'fa-bridge' },
    signal: { name: 'Signal Sage', desc: 'Complete all Signal Lab missions', icon: 'fa-wave-square' },
    restore: { name: 'Lightbringer', desc: 'Restore the Great Lighthouse', icon: 'fa-tower-observation' }
};

// ============================================================
// GAME ENGINE
// ============================================================
