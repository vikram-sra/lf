/**
 * LotusCycle Aura - Content Data Engine (Indian Context)
 * Phase-based recommendations for nourishment, movement, and symptom predictions
 */

const PHASE_DATA = {
    menstrual: {
        name: 'Menstrual Phase',
        subtitle: 'Rest & Release (Apana)',
        days: [1, 2, 3, 4, 5],
        color: '#7A1E2D',
        colorDark: '#8a2a2a',
        gradient: 'menstrual-gradient',
        hormones: { estrogen: 'low', progesterone: 'low' },
        energy: 'low',
        auraReadings: [
            "Your body is a temple of release. Let the river carry away the old.",
            "In stillness, the deepest wisdom is heard. Honor the silence of your soul.",
            "Apana Vayu flows downward, grounding you to the earth's ancient heart."
        ],
        rituals: [
            { name: "Salt Soak", desc: "Bathe with Epsom salts and rose petals to ground your energy." },
            { name: "Journaling", desc: "Write 3 things you are releasing this cycle." }
        ],

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
            title: 'Restorative Yoga (Sadhana)',
            intro: 'Honor the downward flow of energy (Apana Vayu). Avoid inversions.',
            practices: [
                { name: 'Baddha Konasana', desc: 'Butterfly pose - opens pelvic region', duration: '5 mins' },
                { name: 'Balasana', desc: 'Child’s pose - grounds the mind', duration: '5 mins' },
                { name: 'Supta Virasana (Supported)', desc: 'Stretches the abdomen gently', duration: '3 mins' },
                { name: 'Nadi Shodhana', desc: 'Alternate nostril breathing for balance', duration: '10 mins' },
                { name: 'Yoga Nidra', desc: 'Deep psychic sleep for restoration', duration: '20 mins' }
            ],
            avoid: ['Sirsasana (Headstand)', 'Sarvangasana (Shoulderstand)', 'Intense Surya Namaskar'],
            highlight: 'Focus on breath. Let each exhale release physical tension.'
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
        subtitle: 'Rise & Renew (Kapha to Pitta)',
        days: [6, 7, 8, 9, 10, 11, 12, 13],
        color: '#7FB3A6',
        colorDark: '#c48484',
        gradient: 'follicular-gradient',
        hormones: { estrogen: 'rising', progesterone: 'low' },
        energy: 'increasing',
        auraReadings: [
            "The seeds are planted. Can you feel the awakening of your inner garden?",
            "Energy rises like the morning sun. Focus your intention with grace.",
            "A time for creation. The petals of your potential are beginning to stir."
        ],
        rituals: [
            { name: "Intention Setting", desc: "Light a green candle and visualize your seeds of growth." },
            { name: "Morning Dew Walk", desc: "Walk barefoot on grass to connect with rising Kapha energy." }
        ],

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
            title: 'Energizing Flow',
            intro: 'Build heat and flexibility as your energy ascends.',
            practices: [
                { name: 'Surya Namaskar', desc: 'Sun Salutations to build heat', duration: '12 rounds' },
                { name: 'Vrikshasana', desc: 'Tree pose for focus and balance', duration: '2 mins each side' },
                { name: 'Trikonasana', desc: 'Triangle pose for lateral strength', duration: '3 mins' },
                { name: 'Kapalbhati', desc: 'Skull shining breath for vitality', duration: '5 mins' },
                { name: 'Dhanurasana', desc: 'Bow pose to stimulate ovaries', duration: '2 mins' }
            ],
            avoid: ['None - push your boundaries gently'],
            highlight: 'Set a new Sankalpa (intention) for this cycle.'
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
        subtitle: 'Radiate & Connect (Pitta Peak)',
        days: [14, 15, 16],
        color: '#F2C94C',
        colorDark: '#c48424',
        gradient: 'ovulatory-gradient',
        hormones: { estrogen: 'peak', progesterone: 'rising' },
        energy: 'peak',
        auraReadings: [
            "You are at your peak radiance. Shine brightly, for the world sees your light.",
            "Magnetic attraction is your nature. Speak your truth with confidence.",
            "The lotus is fully bloomed. Celebrate the abundance of your being."
        ],
        rituals: [
            { name: "Mirror Work", desc: "Look into your eyes and affirm your divine charisma." },
            { name: "Flower Offering", desc: "Place fresh yellow flowers on your altar to honor your fire." }
        ],

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
            title: 'Peak Radiance Yoga',
            intro: 'Connect with your heart and core power.',
            practices: [
                { name: 'Ustrasana', desc: 'Camel pose - opens the heart', duration: '3 mins' },
                { name: 'Virabhadrasana II', desc: 'Warrior II for confidence', duration: '4 mins' },
                { name: 'Surya Bhedana', desc: 'Right-nostril breathing for fire', duration: '5 mins' },
                { name: 'Chakrasana', desc: 'Wheel pose (if advanced) for peak energy', duration: '2 mins' },
                { name: 'Dance (Bharatanatyam/Free)', desc: 'Expressive movement', duration: '15 mins' }
            ],
            avoid: [],
            highlight: 'Radiate your energy outward. This is your most social time.'
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
        subtitle: 'Reflect & Ground (Transition to Vata)',
        days: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        color: '#6B5B95',
        colorDark: '#2a5a8e',
        gradient: 'luteal-gradient',
        hormones: { estrogen: 'declining', progesterone: 'peak' },
        energy: 'declining',
        auraReadings: [
            "The tide turns inward. Nurture the depths of your inner sanctuary.",
            "Reflection is the key to clarity. Look back with love, move forward with peace.",
            "The harvest is near. Conserve your energy for the coming quiet."
        ],
        rituals: [
            { name: "Tea Meditation", desc: "Sip saffron tea in complete silence, observing your thoughts." },
            { name: "Space Clearing", desc: "Burn sandalwood to purify your environment for the winter." }
        ],

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
            title: 'Grounding & Introspection',
            intro: 'Turn your awareness inward. Focus on stability and grounding.',
            practices: [
                { name: 'Paschimottanasana', desc: 'Forward fold - calms the mind', duration: '5 mins' },
                { name: 'Setu Bandhasana', desc: 'Bridge pose - supports thyroid', duration: '4 mins' },
                { name: 'Viparita Karani', desc: 'Legs up the wall - reduces swelling', duration: '10 mins' },
                { name: 'Bhramari Pranayama', desc: 'Bee breath to soothe the nerves', duration: '5 mins' },
                { name: 'Candle Gazing (Trataka)', desc: 'Focus & meditation', duration: '5 mins' }
            ],
            avoid: ['Intense inversions right before period'],
            highlight: 'Declutter your space and your mind. Prepare for your "winter".'
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
