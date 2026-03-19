/**
 * Lady Friend - Content Data Engine (Indian Context)
 * Phase-based recommendations for nourishment, movement, and symptom predictions
 */

const PHASE_DATA = {
    menstrual: {
        name: 'Menstrual Phase',
        subtitle: 'Rest & Release',
        days: [1, 2, 3, 4, 5],
        color: '#E8837C',
        colorDark: '#d46b64',
        gradient: 'menstrual-gradient',
        hormones: { estrogen: 'low', progesterone: 'low' },
        energy: 'low',
        auraReadings: [
            "Focus on release and comfortable stillness.",
            "Listen to your body's need for rest.",
            "Stay grounded and prioritize your comfort."
        ],
        rituals: {
            intro: "The Menstrual Phase is a time of winter—a sacred inward journey for restoration.",
            practices: [
                { name: "Salt Soak", desc: "Warm bath with Epsom salts to relax muscles and ground your energy.", icon: "🛀" },
                { name: "Sacred Silence", desc: "Spend 20 minutes in absolute silence to listen to your inner whisper.", icon: "🤫" },
                { name: "Reflect", desc: "Note down anything you want to prioritize or release this cycle.", icon: "📓" }
            ]
        },

        nourishment: {
            title: 'Nourishment for Restoration',
            intro: 'Focus on "Vata-pacifying" foods. Warming, grounding, and iron-rich ingredients are essential.',
            foods: [
                { name: 'Jaggery (Gur) & Sesame', benefit: 'Iron boost & cramp relief' },
                { name: 'Turmeric Milk (Haldi Doodh)', benefit: 'Anti-inflammatory & comfort' },
                { name: 'Khichdi with Ghee', benefit: 'Easy digestion & grounding' },
                { name: 'Soaked Almonds', benefit: 'Essential minerals' },
                { name: 'Ginger & Ajwain Tea', benefit: 'Reduces bloating & pain' },
                { name: 'Spinach Saag', benefit: 'Folate & iron replenishment' }
            ],
            avoid: ['Cold salads', 'Carbonated drinks', 'Excessive spicy pickels'],
            highlight: 'Drink warm water infused with cumin (Jeera) to ease internal wind (Vata).'
        },

        asanas: {
            title: 'Restorative Yoga',
            intro: 'Focus on gentle movements and avoid intense inversions.',
            practices: [
                { name: 'Butterfly Pose', desc: 'Gently opens the hips', duration: '5 mins' },
                { name: 'Child’s Pose', desc: 'Relaxes the spine and mind', duration: '5 mins' },
                { name: 'Supported Reclining Pose', desc: 'Stretches the core gently', duration: '3 mins' },
                { name: 'Deep Breathing', desc: 'Calming breath-work', duration: '10 mins' },
                { name: 'Deep Rest', desc: 'Total body relaxation', duration: '20 mins' }
            ],
            avoid: ['Headstands', 'Intense Cardio', 'Heavy Lifting'],
            highlight: 'Focus on deep exhales to release physical tension.'
        },

        symptoms: [
            { icon: '🌙', name: 'Inward focus' },
            { icon: '🩸', name: 'Heaviness' },
            { icon: '😣', name: 'Lower back ache' },
            { icon: '😴', name: 'Deep fatigue' }
        ]
    },

    follicular: {
        name: 'Follicular Phase',
        subtitle: 'Rise & Renew',
        days: [6, 7, 8, 9, 10, 11, 12, 13],
        color: '#7CD4A8',
        colorDark: '#5ab88a',
        gradient: 'follicular-gradient',
        hormones: { estrogen: 'rising', progesterone: 'low' },
        energy: 'increasing',
        auraReadings: [
            "Energy is returning. Plan your upcoming goals.",
            "Focus on fresh starts and new projects.",
            "You may feel more creative and outgoing today."
        ],
        rituals: {
            intro: "The Follicular Phase is your internal spring—a time of renewal and planting seeds.",
            practices: [
                { name: "New Beginnings", desc: "Start one small habit or project that excites your spirit.", icon: "🌱" },
                { name: "Sun Gazing", desc: "Spend a few minutes watching the sunrise to align with the light.", icon: "🌅" },
                { name: "Nature Walk", desc: "Fresh air to boost your rising energy and creative flow.", icon: "🚶‍♀️" }
            ]
        },

        nourishment: {
            title: 'Nourishment for Growth',
            intro: 'Incorporate light, fresh, and fermented foods to support rising estrogen.',
            foods: [
                { name: 'Sprouted Moong Dal', benefit: 'High protein & easy enzymes' },
                { name: 'Fresh Coconut Water', benefit: 'Electrolytes & hydration' },
                { name: 'Citrus (Amla/Oranges)', benefit: 'Vitamin C for collagen' },
                { name: 'Fermented Idli/Dosa', benefit: 'Probiotics for gut-hormone axis' },
                { name: 'Pumpkin & Flax Seeds', benefit: 'Zinc for follicle health' },
                { name: 'Green Tea (Kahwa)', benefit: 'Metabolic support' }
            ],
            avoid: ['Heavy oily Parathas', 'Excessive sweets'],
            highlight: 'A great time to introduce more raw vegetables and vibrant salads.'
        },

        asanas: {
            title: 'Energizing Yoga',
            intro: 'Build heat and flexibility as your energy increases.',
            practices: [
                { name: 'Sun Salutations', desc: 'Dynamic flow to build heat', duration: '12 rounds' },
                { name: 'Tree Pose', desc: 'Improves focus and balance', duration: '2 mins each side' },
                { name: 'Triangle Pose', desc: 'Strengthens legs and core', duration: '3 mins' },
                { name: 'Power Breathing', desc: 'Energizing breath-work', duration: '5 mins' },
                { name: 'Bow Pose', desc: 'Stimulates core and energy', duration: '2 mins' }
            ],
            avoid: ['None - stay active and energized'],
            highlight: 'Set a clear intention for what you want to achieve.'
        },

        symptoms: [
            { icon: '✨', name: 'New ideas' },
            { icon: '🧠', name: 'Sharp mind' },
            { icon: '🌱', name: 'High motivation' },
            { icon: '💪', name: 'Physical strength' }
        ]
    },

    ovulatory: {
        name: 'Ovulatory Phase',
        subtitle: 'Radiate & Connect',
        days: [14, 15, 16],
        color: '#FFD166',
        colorDark: '#e8b530',
        gradient: 'ovulatory-gradient',
        hormones: { estrogen: 'peak', progesterone: 'rising' },
        energy: 'peak',
        auraReadings: [
            "You are at your peak energy level. Enjoy social time.",
            "Confidence is high. A great time for communication.",
            "Feel your most vibrant and active today."
        ],
        rituals: {
            intro: "The Ovulatory Phase is your internal summer—a time of maximum radiance and connection.",
            practices: [
                { name: "Socialize", desc: "Connect with friends or collaborate on something meaningful.", icon: "🤝" },
                { name: "Mirror Work", desc: "Look into your eyes and affirm your inner and outer beauty.", icon: "🪞" },
                { name: "Dance Ritual", desc: "Move your body freely to celebrate your peak vitality.", icon: "💃" }
            ]
        },

        nourishment: {
            title: 'Nourishment for Radiance',
            intro: 'Focus on fiber-rich and cooling foods to help the liver process hormone peaks.',
            foods: [
                { name: 'Bitter Gourd (Karela)', benefit: 'Liver detoxification' },
                { name: 'Quinoa or Millets (Jowar/Bajra)', benefit: 'Sustained power' },
                { name: 'Pomegranate (Anar)', benefit: 'Blood purification & antioxidants' },
                { name: 'Fennel (Saunf) Seeds', benefit: 'Digestion & cooling' },
                { name: 'Roasted Chana', benefit: 'High fiber & protein' },
                { name: 'Buttermilk (Chaas)', benefit: 'Cooling Pitta energy' }
            ],
            avoid: ['Very spicy masalas', 'Alcohol', 'Red meat'],
            highlight: 'Your metabolism is high; fuel your body with complex carbohydrates.'
        },

        asanas: {
            title: 'Power Yoga',
            intro: 'Focus on strength and heart-opening movements.',
            practices: [
                { name: 'Camel Pose', desc: 'Deep heart and chest opener', duration: '3 mins' },
                { name: 'Warrior II', desc: 'Builds confidence and stability', duration: '4 mins' },
                { name: 'Active Breathing', desc: 'Builds internal heat', duration: '5 mins' },
                { name: 'Wheel Pose', desc: 'High energy backbend', duration: '2 mins' },
                { name: 'Creative Flow', desc: 'Expressive movement', duration: '15 mins' }
            ],
            avoid: [],
            highlight: 'Use this peak energy for your most challenging workouts.'
        },

        symptoms: [
            { icon: '🔥', name: 'Peak libido' },
            { icon: '🗣️', name: 'Eloquent speech' },
            { icon: '🌟', name: 'Charisma' },
            { icon: '💦', name: 'Fertile fluid' }
        ]
    },

    luteal: {
        name: 'Luteal Phase',
        subtitle: 'Reflect & Ground',
        days: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        color: '#B8A9D4',
        colorDark: '#9688b8',
        gradient: 'luteal-gradient',
        hormones: { estrogen: 'declining', progesterone: 'peak' },
        energy: 'declining',
        auraReadings: [
            "Energy is turning inward. Focus on self-care.",
            "Reflection brings clarity. Take some quiet time.",
            "Conserve your energy as your cycle nears completion."
        ],
        rituals: {
            intro: "The Luteal Phase is your internal autumn—a time for focus, boundaries, and clearing.",
            practices: [
                { name: "Digital Detox", desc: "Turn off screens 2 hours before bed to calm your mind.", icon: "📵" },
                { name: "Clear Space", desc: "Tidy your physical environment to feel more mentally clear.", icon: "🧹" },
                { name: "Sage Blessing", desc: "Cleanse your space with incense or sage for clarity.", icon: "🌬️" }
            ]
        },

        nourishment: {
            title: 'Nourishment for Balance',
            intro: 'Focus on B-vitamins and magnesium to stabilize mood as hormones drop.',
            foods: [
                { name: 'Sweet Potato (Shakarkandi)', benefit: 'Complex sugar stabilization' },
                { name: 'Bananas', benefit: 'B6 & Potassium for bloating' },
                { name: 'Walnuts', benefit: 'Omega-3 for mood support' },
                { name: 'Saffron (Kesar) Tea', benefit: 'Elevates mood & reduces PMS' },
                { name: 'Magnesium-rich Pumpkin Seeds', benefit: 'Calms anxiety' },
                { name: 'Brown Rice', benefit: 'Fiber to clear estrogen' }
            ],
            avoid: ['Excess salt (bloating)', 'Refined sugar', 'Caffeine'],
            highlight: 'Eat smaller, frequent meals to keep blood sugar steady.'
        },

        asanas: {
            title: 'Grounding Yoga',
            intro: 'Turn your awareness inward. Focus on stability.',
            practices: [
                { name: 'Forward Fold', desc: 'Calms the mind and nervous system', duration: '5 mins' },
                { name: 'Bridge Pose', desc: 'Mild inversion for relaxation', duration: '4 mins' },
                { name: 'Legs Up Wall', desc: 'Reduces swelling and restores energy', duration: '10 mins' },
                { name: 'Calming Breath', desc: 'Soothes the nerves', duration: '5 mins' },
                { name: 'Focus Meditation', desc: 'Clear the mental clutter', duration: '5 mins' }
            ],
            avoid: ['Intense power yoga right before period'],
            highlight: 'Declutter your thoughts and prepare for your period.'
        },

        symptoms: [
            { icon: '💭', name: 'Vivid dreams' },
            { icon: '🎈', name: 'Water retention' },
            { icon: '🍪', name: 'Sweet cravings' },
            { icon: '🌙', name: 'Quiet reflection' }
        ]
    }
};

// Month names
const MONTHS = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

// Mood choices
// NOTE: MOOD_OPTIONS is defined in modals.js to avoid duplication

// Get phase from cycle day
function getPhaseFromDay(day, cycleLength = 28) {
    const periodLength = 5;
    const ovulationDay = Math.round(cycleLength - 14);
    const follicularEnd = ovulationDay - 1;
    const ovulatoryEnd = ovulationDay + 2;

    if (day <= periodLength) return 'menstrual';
    if (day <= follicularEnd) return 'follicular';
    if (day <= ovulatoryEnd) return 'ovulatory';
    return 'luteal';
}

function getPhaseData(phase) {
    return PHASE_DATA[phase] || PHASE_DATA.follicular;
}
