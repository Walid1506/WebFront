const CDN = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises'
const FP = 'https://fitnessprogramer.com/wp-content/uploads/2021/02'

export const exerciseLibrary = [
  // ─── PEC ─────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Développé couché barre',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Barre',
    description: 'Mouvement de base lourd sur banc horizontal, prise moyenne.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Barbell-Bench-Press.gif`
  },
  {
    id: 2,
    name: 'Développé couché haltères',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Haltères',
    description: "Variante haltères pour plus d'amplitude et de stabilité.",
    mediaType: 'gif',
    mediaUrl: `${FP}/Dumbbell-Press.gif`
  },
  {
    id: 3,
    name: 'Développé incliné barre',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Barre',
    description: 'Accent sur le haut des pectoraux avec banc incliné.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Incline-Barbell-Bench-Press.gif`
  },
  {
    id: 4,
    name: 'Développé incliné haltères',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Haltères',
    description: 'Travail du haut des pectoraux avec plus de liberté articulaire.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Incline-Dumbbell-Press.gif`
  },
  {
    id: 5,
    name: 'Développé décliné barre',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Barre',
    description: 'Accent sur la portion basse, trajectoire légèrement oblique.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Decline_Barbell_Bench_Press/0.jpg`
  },
  {
    id: 6,
    name: 'Dips',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Poids du corps',
    description: 'Excellent exercice polyarticulaire pour pectoraux et triceps.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Dips_-_Chest_Version/0.jpg`
  },
  {
    id: 7,
    name: 'Pompes',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Poids du corps',
    description: 'Classique simple et efficace, adaptable à tous les niveaux.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Push-Up.gif`
  },
  {
    id: 8,
    name: 'Écarté haltères',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Haltères',
    description: "Étirement contrôlé et travail d'isolation des pectoraux.",
    mediaType: 'gif',
    mediaUrl: `${FP}/Dumbbell-Fly.gif`
  },
  {
    id: 9,
    name: 'Écarté poulie haute',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Câbles',
    description: 'Très bon exercice pour isoler les pectoraux en fin de séance.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Cable-Crossover.gif`
  },
  {
    id: 10,
    name: 'Crossover unilatéral poulie',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Câbles',
    description: 'Un côté à la fois pour corriger les asymétries.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Single-Arm_Cable_Crossover/0.jpg`
  },
  {
    id: 11,
    name: 'Développé à la machine assis',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Machine',
    description: 'Idéal pour isoler les pectoraux en réduisant la stabilisation.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Leverage_Chest_Press/0.jpg`
  },
  {
    id: 12,
    name: 'Pec deck',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Machine',
    description: "Mouvement d'isolation guidé pour bien contracter la poitrine.",
    mediaType: 'gif',
    mediaUrl: `${FP}/Pec-Deck-Fly.gif`
  },

  // ─── DOS ─────────────────────────────────────────────────────────────────
  {
    id: 13,
    name: 'Tractions pronation',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Poids du corps',
    description: 'Un classique pour développer largeur et force du dos.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Pull-up.gif`
  },
  {
    id: 14,
    name: 'Tractions supination',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Poids du corps',
    description: 'Variante qui recrute davantage les biceps.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Chin-Up/0.jpg`
  },
  {
    id: 15,
    name: 'Tirage vertical',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Poulie',
    description: 'Travail large du dos avec focus sur les dorsaux.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Lat-Pulldown.gif`
  },
  {
    id: 16,
    name: 'Tirage horizontal',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Poulie',
    description: "Bon exercice pour l'épaisseur du dos et la posture.",
    mediaType: 'gif',
    mediaUrl: `${FP}/Seated-Cable-Row.gif`
  },
  {
    id: 17,
    name: 'Rowing barre',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Barre',
    description: 'Épais du dos, gainage fort, tirage contrôlé.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Bent_Over_Barbell_Row/0.jpg`
  },
  {
    id: 18,
    name: 'Rowing haltère unilatéral',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Haltères',
    description: 'Très bon pour corriger les déséquilibres gauche/droite.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Dumbbell-Row.gif`
  },
  {
    id: 19,
    name: 'Rowing machine',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Machine',
    description: 'Mouvement guidé pour charger proprement le dos.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Seated_Cable_Rows/0.jpg`
  },
  {
    id: 20,
    name: 'Pullover poulie',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Câbles',
    description: "Bon exercice d'isolation pour sentir les dorsaux.",
    mediaType: 'image',
    mediaUrl: `${CDN}/Elevated_Cable_Rows/0.jpg`
  },
  {
    id: 21,
    name: 'Face pull',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Câbles',
    description: "Excellent pour l'arrière d'épaule et la santé des épaules.",
    mediaType: 'gif',
    mediaUrl: `${FP}/Face-Pull.gif`
  },
  {
    id: 22,
    name: 'Soulevé de terre',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Barre',
    description: 'Exercice global lourd pour chaîne postérieure et force générale.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Barbell-Deadlift.gif`
  },

  // ─── ÉPAULES ─────────────────────────────────────────────────────────────
  {
    id: 23,
    name: 'Développé militaire',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Barre',
    description: 'Exercice roi pour la poussée verticale et les épaules.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Barbell-Shoulder-Press.gif`
  },
  {
    id: 24,
    name: 'Développé haltères assis',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Haltères',
    description: 'Version plus libre et souvent plus confortable pour les épaules.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Dumbbell-Shoulder-Press.gif`
  },
  {
    id: 25,
    name: 'Arnold press',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Haltères',
    description: 'Travail complet avec rotation, bon ressenti musculaire.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Arnold-Press.gif`
  },
  {
    id: 26,
    name: 'Élévations latérales',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Haltères',
    description: "Isolation du deltoïde moyen pour gagner de la largeur d'épaule.",
    mediaType: 'gif',
    mediaUrl: `${FP}/Dumbbell-Lateral-Raise.gif`
  },
  {
    id: 27,
    name: 'Élévations frontales',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Haltères',
    description: 'Travail ciblé du deltoïde antérieur.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Dumbbell-Front-Raise.gif`
  },
  {
    id: 28,
    name: 'Oiseau haltères',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Haltères',
    description: "Excellent pour l'arrière d'épaule et l'équilibre postural.",
    mediaType: 'image',
    mediaUrl: `${CDN}/Dumbbell_Lying_One-Arm_Rear_Lateral_Raise/0.jpg`
  },
  {
    id: 29,
    name: 'Reverse pec deck',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Machine',
    description: "Arrière d'épaule guidé, très pratique pour isoler proprement.",
    mediaType: 'image',
    mediaUrl: `${CDN}/Reverse_Flyes/0.jpg`
  },

  // ─── BRAS ─────────────────────────────────────────────────────────────────
  {
    id: 30,
    name: 'Curl barre',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Barre',
    description: 'Base efficace pour le volume global des biceps.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Barbell-Curl.gif`
  },
  {
    id: 31,
    name: 'Curl haltères alterné',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Haltères',
    description: 'Classique simple pour biceps avec bonne amplitude.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Dumbbell-Curl.gif`
  },
  {
    id: 32,
    name: 'Curl incliné',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Haltères',
    description: 'Très bon étirement pour la longue portion du biceps.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Alternate_Incline_Dumbbell_Curl/0.jpg`
  },
  {
    id: 33,
    name: 'Curl marteau',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Haltères',
    description: "Travail du brachial et de l'avant-bras.",
    mediaType: 'gif',
    mediaUrl: `${FP}/Hammer-Curl.gif`
  },
  {
    id: 34,
    name: 'Curl pupitre',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Machine',
    description: 'Isolation stricte du biceps avec peu de triche possible.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Preacher_Curl/0.jpg`
  },
  {
    id: 35,
    name: 'Extension triceps poulie',
    muscle: 'Triceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Très bon mouvement pour congestion et isolation du triceps.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Triceps_Pushdown/0.jpg`
  },
  {
    id: 36,
    name: 'Barre front',
    muscle: 'Triceps',
    category: 'Bras',
    equipment: 'Barre EZ',
    description: 'Exercice lourd et efficace pour les triceps.',
    mediaType: 'image',
    mediaUrl: `${CDN}/EZ-Bar_Skullcrusher/0.jpg`
  },
  {
    id: 37,
    name: 'Extensions nuque haltère',
    muscle: 'Triceps',
    category: 'Bras',
    equipment: 'Haltères',
    description: 'Bon étirement du triceps au-dessus de la tête.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Rope_Overhead_Triceps_Extension/0.jpg`
  },
  {
    id: 38,
    name: 'Pompes serrées',
    muscle: 'Triceps',
    category: 'Bras',
    equipment: 'Poids du corps',
    description: 'Très bon exercice poids du corps pour les triceps.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Close-Grip_Push-Up_off_of_a_Dumbbell/0.jpg`
  },

  // ─── JAMBES ──────────────────────────────────────────────────────────────
  {
    id: 39,
    name: 'Squat',
    muscle: 'Jambes',
    category: 'Jambes',
    equipment: 'Barre',
    description: 'Exercice fondamental pour quadriceps, fessiers et gainage.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Barbell_Squat/0.jpg`
  },
  {
    id: 40,
    name: 'Front squat',
    muscle: 'Jambes',
    category: 'Jambes',
    equipment: 'Barre',
    description: 'Version plus dominante quadriceps avec buste plus droit.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Front_Barbell_Squat/0.jpg`
  },
  {
    id: 41,
    name: 'Hack squat',
    muscle: 'Jambes',
    category: 'Jambes',
    equipment: 'Machine',
    description: 'Machine très efficace pour charger les quadriceps.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Barbell_Hack_Squat/0.jpg`
  },
  {
    id: 42,
    name: 'Leg press',
    muscle: 'Jambes',
    category: 'Jambes',
    equipment: 'Machine',
    description: 'Permet de pousser lourd avec bon contrôle.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Leg_Press/0.jpg`
  },
  {
    id: 43,
    name: 'Leg extension',
    muscle: 'Quadriceps',
    category: 'Jambes',
    equipment: 'Machine',
    description: 'Isolation du quadriceps, parfait en fin de séance.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Leg_Extensions/0.jpg`
  },
  {
    id: 44,
    name: 'Leg curl assis',
    muscle: 'Ischios',
    category: 'Jambes',
    equipment: 'Machine',
    description: 'Travail ciblé des ischios avec amplitude contrôlée.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Seated_Leg_Curl/0.jpg`
  },
  {
    id: 45,
    name: 'Leg curl allongé',
    muscle: 'Ischios',
    category: 'Jambes',
    equipment: 'Machine',
    description: "Bonne variante pour l'isolation de l'arrière de cuisse.",
    mediaType: 'image',
    mediaUrl: `${CDN}/Lying_Leg_Curls/0.jpg`
  },
  {
    id: 46,
    name: 'Soulevé de terre roumain',
    muscle: 'Ischios',
    category: 'Jambes',
    equipment: 'Barre',
    description: 'Travail charnière hanche, ischios et fessiers.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Romanian_Deadlift/0.jpg`
  },
  {
    id: 47,
    name: 'Hip thrust',
    muscle: 'Fessiers',
    category: 'Jambes',
    equipment: 'Barre',
    description: 'Excellent pour développer la force et le volume des fessiers.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Barbell-Hip-Thrust.gif`
  },
  {
    id: 48,
    name: 'Fentes marchées',
    muscle: 'Jambes',
    category: 'Jambes',
    equipment: 'Haltères',
    description: 'Travail unilatéral, équilibre et coordination.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Dumbbell-Lunge.gif`
  },
  {
    id: 49,
    name: 'Fentes bulgares',
    muscle: 'Jambes',
    category: 'Jambes',
    equipment: 'Haltères',
    description: 'Exercice unilatéral très complet et très efficace.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Split_Squat_with_Dumbbells/0.jpg`
  },
  {
    id: 50,
    name: 'Step up',
    muscle: 'Jambes',
    category: 'Jambes',
    equipment: 'Haltères',
    description: 'Bon exercice fonctionnel pour quadriceps et fessiers.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Step-up_with_Knee_Raise/0.jpg`
  },
  {
    id: 51,
    name: 'Mollets debout',
    muscle: 'Mollets',
    category: 'Jambes',
    equipment: 'Machine',
    description: 'Version debout pour cibler efficacement les mollets.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Standing_Calf_Raises/0.jpg`
  },

  // ─── ABDOS ───────────────────────────────────────────────────────────────
  {
    id: 52,
    name: 'Crunch',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Poids du corps',
    description: 'Exercice simple pour cibler la sangle abdominale.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Crunches/0.jpg`
  },
  {
    id: 53,
    name: 'Crunch câble',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Câbles',
    description: 'Version lestée pour charger les abdos plus lourdement.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Crunch/0.jpg`
  },
  {
    id: 54,
    name: 'Relevés de jambes',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Poids du corps',
    description: 'Cible le bas de la sangle abdominale et le gainage.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Lying-Leg-Raise.gif`
  },
  {
    id: 55,
    name: 'Gainage',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Poids du corps',
    description: 'Renforcement global du tronc et de la stabilité.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Plank/0.jpg`
  },
  {
    id: 56,
    name: 'Gainage latéral',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Poids du corps',
    description: 'Excellent pour les obliques et la stabilité latérale.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Push_Up_to_Side_Plank/0.jpg`
  },
  {
    id: 57,
    name: 'Russian twist',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Poids du corps',
    description: 'Travail dynamique des obliques.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Russian-Twist.gif`
  },

  // ─── CARDIO ───────────────────────────────────────────────────────────────
  {
    id: 58,
    name: 'Course tapis',
    muscle: 'Cardio',
    category: 'Cardio',
    equipment: 'Tapis',
    description: "Idéal pour le cardio, l'endurance et le travail fractionné.",
    mediaType: 'image',
    mediaUrl: `${CDN}/Jogging_Treadmill/0.jpg`
  },
  {
    id: 59,
    name: 'Vélo',
    muscle: 'Cardio',
    category: 'Cardio',
    equipment: 'Bike',
    description: "Cardio régulier ou interval training selon l'intensité.",
    mediaType: 'image',
    mediaUrl: `${CDN}/Recumbent_Bike/0.jpg`
  },
  {
    id: 60,
    name: 'Rameur',
    muscle: 'Cardio',
    category: 'Cardio',
    equipment: 'Rameur',
    description: 'Travail complet haut + bas du corps avec gros coût énergétique.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Rowing_Stationary/0.jpg`
  },
  {
    id: 61,
    name: 'Elliptique',
    muscle: 'Cardio',
    category: 'Cardio',
    equipment: 'Machine',
    description: 'Cardio plus doux pour les articulations.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Elliptical_Trainer/0.jpg`
  },
  {
    id: 62,
    name: 'Corde à sauter',
    muscle: 'Cardio',
    category: 'Cardio',
    equipment: 'Corde',
    description: 'Excellent pour le cardio, la coordination et les mollets.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Rope_Jumping/0.jpg`
  },
  {
    id: 63,
    name: 'Burpees',
    muscle: 'Cardio',
    category: 'Cardio',
    equipment: 'Poids du corps',
    description: 'Exercice très intense pour le conditionnement global.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Mountain_Climbers/0.jpg`
  },

  // ─── MOBILITÉ ────────────────────────────────────────────────────────────
  {
    id: 64,
    name: 'Mobility épaules',
    muscle: 'Mobilité',
    category: 'Mobilite',
    equipment: 'Tapis',
    description: "Routine utile pour améliorer l'amplitude et prévenir les douleurs.",
    mediaType: 'image',
    mediaUrl: `${CDN}/Arm_Circles/0.jpg`
  },
  {
    id: 65,
    name: 'Mobility hanches',
    muscle: 'Mobilité',
    category: 'Mobilite',
    equipment: 'Tapis',
    description: "Travail d'ouverture de hanches et de mobilité fonctionnelle.",
    mediaType: 'image',
    mediaUrl: `${CDN}/Standing_Hip_Circles/0.jpg`
  },
  {
    id: 66,
    name: 'Étirements ischios',
    muscle: 'Mobilité',
    category: 'Mobilite',
    equipment: 'Tapis',
    description: "Améliore la souplesse de l'arrière de cuisse.",
    mediaType: 'image',
    mediaUrl: `${CDN}/Hamstring_Stretch/0.jpg`
  },
  {
    id: 67,
    name: 'Étirements dos',
    muscle: 'Mobilité',
    category: 'Mobilite',
    equipment: 'Tapis',
    description: 'Décompression et mobilité du rachis et du haut du dos.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cat_Stretch/0.jpg`
  },
  {
    id: 68,
    name: 'Mobility chevilles',
    muscle: 'Mobilité',
    category: 'Mobilite',
    equipment: 'Tapis',
    description: 'Très utile pour améliorer squat et mouvements jambes.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Ankle_Circles/0.jpg`
  },

  // ─── POULIE - PECTORAUX ───────────────────────────────────────────────────
  {
    id: 69,
    name: 'Écarté poulie basse',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Câbles',
    description: 'Cible le haut des pectoraux avec un angle ascendant. Excellent pour finir une séance pec.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Low-Cable-Crossover.gif`
  },
  {
    id: 70,
    name: 'Écarté poulie milieu',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Câbles',
    description: 'Fly horizontal avec câbles pour un travail uniforme du pec. Prise neutre, coudes légèrement fléchis.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Fly/0.jpg`
  },
  {
    id: 71,
    name: 'Développé poulie debout',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Câbles',
    description: 'Presse pectorale fonctionnelle debout avec câbles. Engage aussi le gainage.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Standing-Cable-Chest-Press.gif`
  },
  {
    id: 72,
    name: 'Crossover poulie basse prise pronation',
    muscle: 'Pectoraux',
    category: 'Pec',
    equipment: 'Câbles',
    description: 'Variation du crossover depuis la poulie basse pour isoler la contraction du pec.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Low_Cable_Crossover/0.jpg`
  },

  // ─── POULIE - DOS ─────────────────────────────────────────────────────────
  {
    id: 73,
    name: 'Tirage vertical prise serrée',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Câbles',
    description: 'Prise neutre serrée pour cibler les dorsaux et les biceps simultanément.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Close-Grip-Lat-Pulldown.gif`
  },
  {
    id: 74,
    name: 'Tirage bras tendus poulie',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Câbles',
    description: 'Isolation pure des dorsaux, bras tendus. Parfait pour sentir et activer les dorsaux.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Straight-Arm-Pulldown.gif`
  },
  {
    id: 75,
    name: 'Rowing unilatéral poulie',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Câbles',
    description: 'Tirage horizontal unilatéral pour corriger les déséquilibres et maximiser l\'amplitude.',
    mediaType: 'image',
    mediaUrl: `${CDN}/One_Arm_Cable_Row/0.jpg`
  },
  {
    id: 76,
    name: 'Tirage corde poulie haute',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Câbles',
    description: 'Tirage diagonal avec corde depuis la poulie haute. Très bon pour la partie basse des dorsaux.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Straight_Arm_Pulldown/0.jpg`
  },
  {
    id: 77,
    name: 'Tirage vertical large pronation',
    muscle: 'Dos',
    category: 'Dos',
    equipment: 'Câbles',
    description: 'Lat pulldown prise large et pronation, focus sur l\'ouverture du dos et la largeur.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Lat_Pulldown_-_Close_Grip/0.jpg`
  },

  // ─── POULIE - ÉPAULES ─────────────────────────────────────────────────────
  {
    id: 78,
    name: 'Élévations latérales poulie basse',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Câbles',
    description: 'Version câble pour des élévations latérales avec tension constante tout au long du mouvement.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Cable-Lateral-Raise.gif`
  },
  {
    id: 79,
    name: 'Élévations latérales unilatérales poulie',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Câbles',
    description: 'Unilatéral pour cibler chaque deltoïde indépendamment. Tension constante sur l\'arc complet.',
    mediaType: 'image',
    mediaUrl: `${CDN}/One-Arm_Cable_Lateral_Raise/0.jpg`
  },
  {
    id: 80,
    name: 'Élévations frontales poulie',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Câbles',
    description: 'Travail du deltoïde antérieur avec tension continue, plus efficace qu\'avec haltères.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Cable-Front-Raise.gif`
  },
  {
    id: 81,
    name: 'Oiseau poulie',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Câbles',
    description: 'Travaille le deltoïde postérieur avec tension constante. Excellent pour l\'arrière d\'épaule.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Rear_Delt_Fly/0.jpg`
  },
  {
    id: 82,
    name: 'Tirage menton câble',
    muscle: 'Épaules',
    category: 'Epaules',
    equipment: 'Câbles',
    description: 'Travaille le deltoïde moyen et les trapèzes. Prise serrée, tirer jusqu\'au menton.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Cable-Upright-Row.gif`
  },

  // ─── POULIE - BICEPS ──────────────────────────────────────────────────────
  {
    id: 83,
    name: 'Curl poulie basse',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Curl debout avec poulie basse pour une tension maximale sur les biceps en bas du mouvement.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Standing-Cable-Biceps-Curl.gif`
  },
  {
    id: 84,
    name: 'Curl marteau corde poulie',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Curl marteau avec corde à la poulie. Travaille le brachial et le brachioradial.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Rope_Hammer_Curl/0.jpg`
  },
  {
    id: 85,
    name: 'Curl poulie haute',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Curl depuis la poulie haute, bras tendu à l\'horizontale. Excellent pour la contraction des biceps.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Overhead-Cable-Curl.gif`
  },
  {
    id: 86,
    name: 'Curl unilatéral poulie basse',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Curl unilatéral pour corriger les asymétries et mieux contrôler la supination.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Standing_Curl/0.jpg`
  },
  {
    id: 87,
    name: 'Curl pupitre câble',
    muscle: 'Biceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Isolation stricte des biceps avec appui, impossible de tricher. Prise supination.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Preacher_Curl/0.jpg`
  },

  // ─── POULIE - TRICEPS ─────────────────────────────────────────────────────
  {
    id: 88,
    name: 'Extension corde poulie haute',
    muscle: 'Triceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Extension triceps avec corde. Les mains s\'écartent en bas pour maximaliser la contraction.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Rope-Pushdown.gif`
  },
  {
    id: 89,
    name: 'Extension barre droite poulie',
    muscle: 'Triceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Pushdown avec barre droite. Prise pronation pour accent sur le chef latéral.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Pushdown/0.jpg`
  },
  {
    id: 90,
    name: 'Extension barre V poulie',
    muscle: 'Triceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Variante avec barre en V pour un meilleur angle de poignet et plus de confort.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Triceps-Pushdown.gif`
  },
  {
    id: 91,
    name: 'Extension nuque corde poulie',
    muscle: 'Triceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Extension au-dessus de la tête avec corde. Très bon étirement du long chef du triceps.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Rope_Overhead_Triceps_Extension/0.jpg`
  },
  {
    id: 92,
    name: 'Kickback triceps poulie',
    muscle: 'Triceps',
    category: 'Bras',
    equipment: 'Câbles',
    description: 'Isolation du triceps avec une contraction maximale en extension complète du bras.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Triceps_Kickback/0.jpg`
  },

  // ─── POULIE - JAMBES & FESSIERS ───────────────────────────────────────────
  {
    id: 93,
    name: 'Hip abduction poulie',
    muscle: 'Fessiers',
    category: 'Jambes',
    equipment: 'Câbles',
    description: 'Écartement de la jambe en dehors pour cibler le fessier moyen et le TFL.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Hip_Abduction/0.jpg`
  },
  {
    id: 94,
    name: 'Hip adduction poulie',
    muscle: 'Adducteurs',
    category: 'Jambes',
    equipment: 'Câbles',
    description: 'Ramener la jambe vers l\'intérieur pour cibler les adducteurs. Debout ou allongé.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Hip_Adduction/0.jpg`
  },
  {
    id: 95,
    name: 'Kickback fessiers poulie',
    muscle: 'Fessiers',
    category: 'Jambes',
    equipment: 'Câbles',
    description: 'Extension de hanche vers l\'arrière avec câble. Excellent isolant des fessiers.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Cable-Glute-Kickback.gif`
  },
  {
    id: 96,
    name: 'Leg curl debout poulie',
    muscle: 'Ischios',
    category: 'Jambes',
    equipment: 'Câbles',
    description: 'Curl des ischios en position debout avec câble cheville. Bonne amplitude et isolation.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Standing_Cable_Leg_Curl/0.jpg`
  },
  {
    id: 97,
    name: 'Pull through câble',
    muscle: 'Fessiers',
    category: 'Jambes',
    equipment: 'Câbles',
    description: 'Charnière de hanche avec câble entre les jambes. Excellent pour ischios et fessiers.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Pull_Through/0.jpg`
  },
  {
    id: 98,
    name: 'Squat câble (Goblet)',
    muscle: 'Jambes',
    category: 'Jambes',
    equipment: 'Câbles',
    description: 'Squat avec résistance câble. Maintient la tension sur les quads tout au long du mouvement.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Cable-Squat.gif`
  },

  // ─── POULIE - ABDOS & CORE ────────────────────────────────────────────────
  {
    id: 99,
    name: 'Bûcheron poulie (Woodchop)',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Câbles',
    description: 'Rotation en diagonale haute vers basse. Travaille les obliques et le gainage rotatif.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Cable-Woodchop.gif`
  },
  {
    id: 100,
    name: 'Bûcheron bas vers haut poulie',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Câbles',
    description: 'Rotation de bas en haut pour cibler les obliques inférieurs et la chaine antérieure.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Cable_Woodchop/0.jpg`
  },
  {
    id: 101,
    name: 'Pallof press poulie',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Câbles',
    description: 'Anti-rotation avec câble. Exerce une pression horizontale pour renforcer le gainage.',
    mediaType: 'image',
    mediaUrl: `${CDN}/Pallof_Press/0.jpg`
  },
  {
    id: 102,
    name: 'Twist oblique câble',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Câbles',
    description: 'Rotation du tronc avec résistance câble. Cible les obliques avec tension constante.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Cable-Oblique-Crunch.gif`
  },
  {
    id: 103,
    name: 'Crunch poulie genou à terre',
    muscle: 'Abdominaux',
    category: 'Abdos',
    equipment: 'Câbles',
    description: 'Crunch câble à genoux depuis la poulie haute. Version chargée et efficace pour les abdos.',
    mediaType: 'gif',
    mediaUrl: `${FP}/Kneeling-Cable-Crunch.gif`
  }
]
