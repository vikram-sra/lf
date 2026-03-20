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
                { name: 'Jaggery (Gur) & Sesame', benefit: 'Iron boost & cramp relief', detail: 'Crush sesame with warm jaggery for Til-Gur laddu. Iron replenishes blood loss; sesame provides calcium for cramps.', link: 'https://www.vegrecipesofindia.com/til-gul-ladoo-recipe/' },
                { name: 'Turmeric Milk (Haldi Doodh)', benefit: 'Anti-inflammatory & comfort', detail: 'Warm milk with ½ tsp turmeric, pinch of black pepper, and honey. Curcumin reduces prostaglandins that cause cramps.', link: 'https://www.vegrecipesofindia.com/golden-milk-recipe/' },
                { name: 'Khichdi with Ghee', benefit: 'Easy digestion & grounding', detail: 'Simple moong dal-rice khichdi with ghee and jeera tempering. Mono-diet concept from Ayurveda for digestive rest.', link: 'https://www.vegrecipesofindia.com/moong-dal-khichdi/' },
                { name: 'Soaked Almonds', benefit: 'Essential minerals', detail: 'Soak 8-10 almonds overnight, peel and eat on empty stomach. Rich in Vitamin E and magnesium for hormonal support.' },
                { name: 'Ginger & Ajwain Tea', benefit: 'Reduces bloating & pain', detail: 'Boil crushed ginger + ½ tsp ajwain seeds in water for 5 mins. Anti-spasmodic properties ease uterine contractions.' },
                { name: 'Spinach Saag', benefit: 'Folate & iron replenishment', detail: 'Lightly sautéed palak with garlic and ghee. Folate supports cell turnover; non-heme iron best absorbed with Vitamin C.' },
                { name: 'Beetroot Soup', benefit: 'Blood building & B-vitamins', detail: 'Roasted beetroot blended with cumin and rock salt. Betaine supports liver detoxification during menstruation.' },
                { name: 'Dates (Khajoor)', benefit: 'Natural iron & energy', detail: '3-4 dates with warm milk. Rich in iron, potassium, and natural sugars for gentle energy without spikes.' }
            ],
            avoid: ['Cold salads & raw foods', 'Carbonated drinks', 'Excessive spicy pickles', 'Caffeine (increases cramps)', 'Fried & heavy foods'],
            highlight: 'Drink warm water infused with cumin (Jeera) throughout the day to ease internal wind (Vata) and support digestion.'
        },

        asanas: {
            title: 'Restorative Yoga',
            intro: 'Focus on gentle movements and avoid intense inversions. Your body needs restoration, not performance.',
            practices: [
                { name: 'Butterfly Pose (Baddha Konasana)', desc: 'Gently opens the hips and relieves pelvic tension. Sit tall, soles together, let knees fall naturally.', duration: '5 mins', link: 'https://www.yogajournal.com/poses/bound-angle-pose/' },
                { name: 'Child\'s Pose (Balasana)', desc: 'Relaxes the spine, calms the nervous system. Forehead to floor, arms extended or alongside body.', duration: '5 mins', link: 'https://www.yogajournal.com/poses/child-s-pose/' },
                { name: 'Supported Reclining (Supta Baddha Konasana)', desc: 'Lie back with bolster under spine, soles together. Opens chest and abdomen without strain.', duration: '5 mins', link: 'https://www.yogajournal.com/poses/reclining-bound-angle-pose/' },
                { name: 'Legs Up the Wall (Viparita Karani)', desc: 'Gentle inversion to reduce bloating and calm the mind. Not a full inversion—safe for menstruation.', duration: '10 mins', link: 'https://www.yogajournal.com/poses/legs-up-the-wall-pose/' },
                { name: 'Deep Belly Breathing (Diaphragmatic)', desc: 'Hand on belly, inhale deeply for 4 counts, exhale for 6. Activates parasympathetic nervous system.', duration: '10 mins', link: 'https://www.healthline.com/health/diaphragmatic-breathing' },
                { name: 'Yoga Nidra (Deep Rest)', desc: 'Guided body-scan meditation lying down. Reduces cortisol and promotes deep cellular repair.', duration: '20 mins', link: 'https://www.yogajournal.com/meditation/yoga-nidra/' }
            ],
            avoid: ['Headstands & inversions', 'Intense cardio (HIIT)', 'Heavy weight lifting', 'Hot yoga', 'Core-intensive exercises'],
            highlight: 'Focus on deep exhales to release physical tension. The exhale is your body\'s natural relaxation signal.'
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
            intro: 'Incorporate light, fresh, and fermented foods to support rising estrogen and metabolic activation.',
            foods: [
                { name: 'Sprouted Moong Dal', benefit: 'High protein & easy enzymes', detail: 'Soak moong overnight, drain, and let sprout for 8-12 hours. Sprouting increases bioavailability of nutrients by 300%.', link: 'https://www.vegrecipesofindia.com/moong-sprouts-salad/' },
                { name: 'Fresh Coconut Water', benefit: 'Electrolytes & hydration', detail: 'Natural isotonic drink. Contains potassium, magnesium, and lauric acid for immune support.' },
                { name: 'Citrus (Amla/Oranges)', benefit: 'Vitamin C for collagen', detail: 'Amla has 20x more Vitamin C than oranges. Supports estrogen metabolism and iron absorption. Try fresh amla juice.' },
                { name: 'Fermented Idli/Dosa', benefit: 'Probiotics for gut-hormone axis', detail: 'Fermented rice-lentil batter creates natural probiotics. The gut microbiome metabolizes estrogen—healthy gut = balanced hormones.', link: 'https://www.vegrecipesofindia.com/idli-recipe/' },
                { name: 'Pumpkin & Flax Seeds', benefit: 'Zinc for follicle health', detail: '1 tbsp each daily. Seed cycling: pumpkin + flax in follicular phase supports estrogen balance via lignans.' },
                { name: 'Green Tea / Kahwa', benefit: 'Metabolic support & antioxidants', detail: 'Kashmiri Kahwa with cinnamon, cardamom, saffron, and almonds. EGCG supports liver detox of old estrogen.', link: 'https://www.vegrecipesofindia.com/kahwa-tea-recipe/' },
                { name: 'Ragi / Nachni Porridge', benefit: 'Calcium & amino acids', detail: 'Finger millet is highest plant-source of calcium. Cook as porridge with dates and cardamom for breakfast.' },
                { name: 'Mixed Vegetable Poha', benefit: 'Iron from flattened rice', detail: 'Light, easily digestible breakfast. Add peanuts and curry leaves for extra iron and B-vitamins.', link: 'https://www.vegrecipesofindia.com/poha-recipe/' }
            ],
            avoid: ['Heavy oily parathas', 'Excessive sweets', 'Processed & packaged foods', 'Deep-fried snacks'],
            highlight: 'Your metabolism is waking up—this is the best time to introduce more raw vegetables, fresh juices, and vibrant salads into your diet.'
        },

        asanas: {
            title: 'Energizing Yoga',
            intro: 'Build heat and flexibility as your energy increases. Your body is ready for challenge and growth.',
            practices: [
                { name: 'Sun Salutations (Surya Namaskar)', desc: 'Complete 12-round flow that engages every major muscle group. Builds cardiovascular endurance and flexibility.', duration: '12 rounds', link: 'https://www.yogajournal.com/poses/sun-salutation/' },
                { name: 'Tree Pose (Vrksasana)', desc: 'Single-leg balance that improves proprioception and mental focus. Root through standing foot, extend crown upward.', duration: '2 mins each side', link: 'https://www.yogajournal.com/poses/tree-pose/' },
                { name: 'Triangle Pose (Trikonasana)', desc: 'Deep lateral stretch that strengthens legs, opens hips, and stimulates abdominal organs.', duration: '3 mins', link: 'https://www.yogajournal.com/poses/extended-triangle-pose/' },
                { name: 'Kapalbhati (Power Breathing)', desc: 'Rapid abdominal exhales, passive inhales. 60 breaths/minute for 3 rounds. Energizes and detoxifies.', duration: '5 mins', link: 'https://www.artofliving.org/in-en/yoga/breathing-techniques/kapalbhati' },
                { name: 'Bow Pose (Dhanurasana)', desc: 'Lying on stomach, grab ankles and lift. Stimulates reproductive organs and builds core strength.', duration: '2 mins', link: 'https://www.yogajournal.com/poses/bow-pose/' },
                { name: 'Chair Pose (Utkatasana)', desc: 'Squat with arms overhead. Builds heat in thighs and glutes—your largest muscle groups.', duration: '1 min × 3 sets', link: 'https://www.yogajournal.com/poses/chair-pose/' }
            ],
            avoid: ['No restrictions—stay active and energized!'],
            highlight: 'Set a clear intention (sankalpa) at the start of each practice. Your rising energy makes this phase ideal for building new physical habits.'
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
            intro: 'Focus on fiber-rich and cooling foods to help the liver process hormone peaks. Support detox pathways.',
            foods: [
                { name: 'Bitter Gourd (Karela)', benefit: 'Liver detoxification', detail: 'Stir-fry thin slices with onion and spices. Charantin compound supports glucose metabolism and liver function.', link: 'https://www.vegrecipesofindia.com/karela-sabzi-recipe/' },
                { name: 'Millets (Jowar/Bajra/Ragi)', benefit: 'Sustained energy & fiber', detail: 'Gluten-free ancient grains with low glycemic index. Bajra roti or jowar bhakri with seasonal vegetables.' },
                { name: 'Pomegranate (Anar)', benefit: 'Blood purification & antioxidants', detail: 'Punicalagins are more potent than green tea. Anti-inflammatory action supports ovulatory inflammation.' },
                { name: 'Fennel Seeds (Saunf)', benefit: 'Digestion & natural cooling', detail: 'Chew after meals or brew as tea. Contains anethole that reduces bloating and supports estrogen metabolism.' },
                { name: 'Roasted Chana (Chickpeas)', benefit: 'High fiber & plant protein', detail: 'Dry-roasted with chaat masala. Fiber binds to excess estrogen in the gut for elimination.' },
                { name: 'Buttermilk (Chaas / Lassi)', benefit: 'Cooling pitta & probiotics', detail: 'Churned curd with cumin and mint. Probiotics support the estrobolome—gut bacteria that process estrogen.', link: 'https://www.vegrecipesofindia.com/chaas-recipe/' },
                { name: 'Cucumber Raita', benefit: 'Hydration & cooling', detail: 'Grated cucumber in fresh curd with roasted cumin. Cooling during peak metabolic heat.' },
                { name: 'Watermelon / Muskmelon', benefit: 'Hydration & lycopene', detail: 'Peak hydration fruits. Watermelon contains citrulline for blood flow; muskmelon provides folic acid.' }
            ],
            avoid: ['Very spicy masalas', 'Alcohol (impairs liver detox)', 'Red meat', 'Excessive dairy', 'Processed sugar'],
            highlight: 'Your metabolism is at its highest—fuel your body with complex carbohydrates and cruciferous vegetables (broccoli, cauliflower) that support estrogen clearance.'
        },

        asanas: {
            title: 'Power Yoga',
            intro: 'Focus on strength, heart-opening, and community practice. Your body can handle maximum intensity now.',
            practices: [
                { name: 'Camel Pose (Ustrasana)', desc: 'Deep heart and chest opener that stimulates thyroid and opens emotional center. Kneel back, reach for heels.', duration: '3 mins', link: 'https://www.yogajournal.com/poses/camel-pose/' },
                { name: 'Warrior II (Virabhadrasana II)', desc: 'Wide stance, arms open—builds fierce confidence, hip opening, and mental steadiness.', duration: '4 mins', link: 'https://www.yogajournal.com/poses/warrior-ii-pose/' },
                { name: 'Bhastrika (Bellows Breathing)', desc: 'Forceful inhales AND exhales through nose. Deeply energizing and heat-building. 30 breaths × 3 rounds.', duration: '5 mins', link: 'https://www.artofliving.org/in-en/yoga/breathing-techniques/bhastrika-pranayama' },
                { name: 'Wheel Pose (Urdhva Dhanurasana)', desc: 'Full backbend—peak energy pose. Opens entire front body, stimulates adrenals and thyroid.', duration: '2 mins', link: 'https://www.yogajournal.com/poses/upward-bow-or-wheel-pose/' },
                { name: 'Crow Pose (Bakasana)', desc: 'Arm balance that builds core strength and focus. Start with knees on triceps, shift weight forward.', duration: 'Hold × 5', link: 'https://www.yogajournal.com/poses/crane-crow-pose/' },
                { name: 'Dance / Free Flow', desc: 'Expressive, intuitive movement to music. Celebrate your body\'s peak capability. No rules.', duration: '15 mins' }
            ],
            avoid: [],
            highlight: 'This is your maximum output window—use it for your most challenging workouts, group classes, and social sports. Channel your radiance!'
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
            intro: 'Focus on B-vitamins, magnesium, and serotonin-boosting foods to stabilize mood as hormones drop.',
            foods: [
                { name: 'Sweet Potato (Shakarkandi)', benefit: 'Complex carb mood stabilization', detail: 'Roasted with ghee and chaat masala. Complex carbs boost serotonin—your natural anti-depressant. Vitamin A supports progesterone.', link: 'https://www.vegrecipesofindia.com/sweet-potato-chaat/' },
                { name: 'Bananas', benefit: 'B6 & potassium for bloating', detail: 'B6 is critical for progesterone production. Potassium counteracts sodium-related water retention.' },
                { name: 'Walnuts (Akhrot)', benefit: 'Omega-3 for mood support', detail: '7-8 walnuts daily. ALA omega-3 fatty acids reduce inflammatory prostaglandins that worsen PMS symptoms.' },
                { name: 'Saffron (Kesar) Tea', benefit: 'Elevates mood & reduces PMS', detail: 'Steep 4-5 strands in warm milk. Research shows 30mg saffron/day is as effective as fluoxetine for mild depression.', link: 'https://www.vegrecipesofindia.com/kesar-milk-recipe/' },
                { name: 'Pumpkin Seeds (Sunflower too)', benefit: 'Magnesium calms anxiety', detail: 'Seed cycling phase 2: sunflower + sesame seeds in luteal phase. Magnesium is the "relaxation mineral"—most women are deficient.' },
                { name: 'Brown Rice / Red Rice', benefit: 'Fiber to clear estrogen', detail: 'Complex carbs stabilize blood sugar. Fiber binds used estrogen in the colon for elimination.' },
                { name: 'Dark Chocolate (70%+)', benefit: 'Magnesium & endorphins', detail: '2 squares daily. Theobromine provides gentle stimulation; magnesium and tryptophan support serotonin production.' },
                { name: 'Chamomile + Tulsi Tea', benefit: 'Calming & sleep support', detail: 'Evening ritual tea. Apigenin in chamomile binds GABA receptors; tulsi is an adaptogen that modulates cortisol.', link: 'https://www.vegrecipesofindia.com/tulsi-tea-recipe/' }
            ],
            avoid: ['Excess salt (worsens bloating)', 'Refined sugar (blood sugar spikes)', 'Caffeine (increases anxiety)', 'Alcohol (disrupts progesterone)', 'Processed, packaged snacks'],
            highlight: 'Eat smaller, frequent meals (5-6/day) to keep blood sugar steady. Blood sugar crashes worsen PMS mood swings dramatically.'
        },

        asanas: {
            title: 'Grounding Yoga',
            intro: 'Turn your awareness inward. Focus on stability, flexibility, and nervous system regulation.',
            practices: [
                { name: 'Forward Fold (Uttanasana)', desc: 'Standing or seated—calms the mind, stretches hamstrings, and activates parasympathetic response.', duration: '5 mins', link: 'https://www.yogajournal.com/poses/standing-forward-bend/' },
                { name: 'Bridge Pose (Setu Bandha)', desc: 'Mild inversion that stretches chest and spine. Stimulates thyroid gently; reduces anxiety.', duration: '4 mins', link: 'https://www.yogajournal.com/poses/bridge-pose/' },
                { name: 'Legs Up Wall (Viparita Karani)', desc: 'Reduces leg and ankle swelling from progesterone-related water retention. Deeply calming.', duration: '10 mins', link: 'https://www.yogajournal.com/poses/legs-up-the-wall-pose/' },
                { name: 'Alternate Nostril Breathing (Nadi Shodhana)', desc: 'Balance left (ida/lunar) and right (pingala/solar) channels. Regulates autonomic nervous system.', duration: '5 mins', link: 'https://www.artofliving.org/in-en/yoga/breathing-techniques/nadi-shodhan-pranayama' },
                { name: 'Pigeon Pose (Eka Pada Rajakapotasana)', desc: 'Deep hip opener that releases stored emotional tension. Hold each side, breathe into tightness.', duration: '3 mins each', link: 'https://www.yogajournal.com/poses/one-legged-king-pigeon-pose/' },
                { name: 'Trataka (Candle Gazing Meditation)', desc: 'Steady gaze at candle flame, then close eyes and hold the afterimage. Develops concentration and calms racing mind.', duration: '5 mins', link: 'https://www.artofliving.org/in-en/yoga/meditation/trataka-meditation' }
            ],
            avoid: ['Intense power yoga close to period', 'Competitive or ego-driven workouts', 'Excessive HIIT'],
            highlight: 'Declutter your thoughts as you prepare for your period. Journaling + gentle movement is the most powerful PMS antidote.'
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
