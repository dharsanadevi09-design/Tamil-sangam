import type { District, MembershipCategory, Pasarai, MemberApplication, DonationRecord, EventItem, CertificateItem, NewsItem } from '../types';

export const TN_DISTRICTS: District[] = [
  { id: 'DIST-01', name: 'Ariyalur', nameTamil: 'அரியலூர்', totalMembers: 420, totalTaluks: 4 },
  { id: 'DIST-02', name: 'Chengalpattu', nameTamil: 'செங்கல்பட்டு', totalMembers: 1250, totalTaluks: 8 },
  { id: 'DIST-03', name: 'Chennai', nameTamil: 'சென்னை', totalMembers: 4500, totalTaluks: 16 },
  { id: 'DIST-04', name: 'Coimbatore', nameTamil: 'கோயம்புத்தூர்', totalMembers: 3100, totalTaluks: 11 },
  { id: 'DIST-05', name: 'Cuddalore', nameTamil: 'கடலூர்', totalMembers: 980, totalTaluks: 10 },
  { id: 'DIST-06', name: 'Dharmapuri', nameTamil: 'தர்மபுரி', totalMembers: 650, totalTaluks: 7 },
  { id: 'DIST-07', name: 'Dindigul', nameTamil: 'திண்டுக்கல்', totalMembers: 1120, totalTaluks: 10 },
  { id: 'DIST-08', name: 'Erode', nameTamil: 'ஈரோடு', totalMembers: 1850, totalTaluks: 10 },
  { id: 'DIST-09', name: 'Kallakurichi', nameTamil: 'கள்ளக்குறிச்சி', totalMembers: 540, totalTaluks: 6 },
  { id: 'DIST-10', name: 'Kanchipuram', nameTamil: 'காஞ்சிபுரம்', totalMembers: 1420, totalTaluks: 5 },
  { id: 'DIST-11', name: 'Kanyakumari', nameTamil: 'கன்னியாகுமரி', totalMembers: 1680, totalTaluks: 6 },
  { id: 'DIST-12', name: 'Karur', nameTamil: 'கரூர்', totalMembers: 710, totalTaluks: 7 },
  { id: 'DIST-13', name: 'Krishnagiri', nameTamil: 'கிருஷ்ணகிரி', totalMembers: 890, totalTaluks: 8 },
  { id: 'DIST-14', name: 'Madurai', nameTamil: 'மதுரை', totalMembers: 3800, totalTaluks: 11 },
  { id: 'DIST-15', name: 'Mayiladuthurai', nameTamil: 'மயிலாடுதுறை', totalMembers: 620, totalTaluks: 4 },
  { id: 'DIST-16', name: 'Nagapattinam', nameTamil: 'நாகப்பட்டினம்', totalMembers: 730, totalTaluks: 4 },
  { id: 'DIST-17', name: 'Namakkal', nameTamil: 'நாமக்கல்', totalMembers: 920, totalTaluks: 8 },
  { id: 'DIST-18', name: 'Nilgiris', nameTamil: 'நீலகிரி', totalMembers: 480, totalTaluks: 6 },
  { id: 'DIST-19', name: 'Perambalur', nameTamil: 'பெரம்பலூர்', totalMembers: 380, totalTaluks: 4 },
  { id: 'DIST-20', name: 'Pudukkottai', nameTamil: 'புதுக்கோட்டை', totalMembers: 840, totalTaluks: 12 },
  { id: 'DIST-21', name: 'Ramanathapuram', nameTamil: 'ராமநாதபுரம்', totalMembers: 960, totalTaluks: 9 },
  { id: 'DIST-22', name: 'Ranipet', nameTamil: 'ராணிப்பேட்டை', totalMembers: 670, totalTaluks: 6 },
  { id: 'DIST-23', name: 'Salem', nameTamil: 'சேலம்', totalMembers: 2400, totalTaluks: 13 },
  { id: 'DIST-24', name: 'Sivaganga', nameTamil: 'சிவகங்கை', totalMembers: 1050, totalTaluks: 9 },
  { id: 'DIST-25', name: 'Tenkasi', nameTamil: 'தென்காசி', totalMembers: 890, totalTaluks: 8 },
  { id: 'DIST-26', name: 'Thanjavur', nameTamil: 'தஞ்சாவூர்', totalMembers: 2150, totalTaluks: 9 },
  { id: 'DIST-27', name: 'Theni', nameTamil: 'தேனி', totalMembers: 780, totalTaluks: 5 },
  { id: 'DIST-28', name: 'Thoothukudi', nameTamil: 'தூத்துக்குடி', totalMembers: 1450, totalTaluks: 10 },
  { id: 'DIST-29', name: 'Tiruchirappalli', nameTamil: 'திருச்சிராப்பள்ளி', totalMembers: 3200, totalTaluks: 11 },
  { id: 'DIST-30', name: 'Tirunelveli', nameTamil: 'திருநெல்வேலி', totalMembers: 2100, totalTaluks: 8 },
  { id: 'DIST-31', name: 'Tirupathur', nameTamil: 'திருப்பத்தூர்', totalMembers: 590, totalTaluks: 4 },
  { id: 'DIST-32', name: 'Tiruppur', nameTamil: 'திருப்பூர்', totalMembers: 1980, totalTaluks: 9 },
  { id: 'DIST-33', name: 'Tiruvallur', nameTamil: 'திருவள்ளூர்', totalMembers: 1650, totalTaluks: 9 },
  { id: 'DIST-34', name: 'Tiruvannamalai', nameTamil: 'திருவண்ணாமலை', totalMembers: 1100, totalTaluks: 12 },
  { id: 'DIST-35', name: 'Tiruvarur', nameTamil: 'திருவாரூர்', totalMembers: 830, totalTaluks: 8 },
  { id: 'DIST-36', name: 'Vellore', nameTamil: 'வேலூர்', totalMembers: 1380, totalTaluks: 6 },
  { id: 'DIST-37', name: 'Viluppuram', nameTamil: 'விழுப்புரம்', totalMembers: 1040, totalTaluks: 9 },
  { id: 'DIST-38', name: 'Virudhunagar', nameTamil: 'விருதுநகர்', totalMembers: 1290, totalTaluks: 10 },
];

export const MEMBERSHIP_CATEGORIES: MembershipCategory[] = [
  { id: 'CAT-GEN', name: 'General Member', nameTamil: 'பொது உறுப்பினர்', fee: 100, validityMonths: 12, description: 'Standard annual membership with access to all Sangam activities and newsletters.' },
  { id: 'CAT-LIFE', name: 'Life Member', nameTamil: 'ஆயுள் உறுப்பினர்', fee: 1000, validityMonths: 120, description: 'Lifetime membership with voting rights in general body and priority event access.' },
  { id: 'CAT-STU', name: 'Student Member', nameTamil: 'மாணவர் உறுப்பினர்', fee: 50, validityMonths: 12, description: 'Discounted membership for active school/college students.' },
  { id: 'CAT-YOUTH', name: 'Youth Member', nameTamil: 'இளைஞர் உறுப்பினர்', fee: 100, validityMonths: 12, description: 'For members aged 18 to 35 actively engaged in youth development.' },
  { id: 'CAT-WOMEN', name: 'Women Member', nameTamil: 'மகளிர் உறுப்பினர்', fee: 100, validityMonths: 12, description: 'Dedicated membership empowering women in culture and social causes.' },
  { id: 'CAT-SENIOR', name: 'Senior Member', nameTamil: 'மூத்த உறுப்பினர்', fee: 50, validityMonths: 12, description: 'For senior citizens (aged 60+) with special recognition.' },
  { id: 'CAT-PROF', name: 'Professional Member', nameTamil: 'தொழில்முறை உறுப்பினர்', fee: 500, validityMonths: 12, description: 'For doctors, engineers, lawyers, IT professionals, and executives.' },
  { id: 'CAT-INST', name: 'Institutional Member', nameTamil: 'நிறுவன உறுப்பினர்', fee: 5000, validityMonths: 12, description: 'For registered organisations, colleges, and literary societies.' },
];

export const PASARAI_WINGS: Pasarai[] = [
  {
    id: 'PAS-01',
    name: 'Youth Wing',
    nameTamil: 'இளைஞர் பாசறை',
    description: 'Empowering young minds through sports, leadership training, and social service across Tamil Nadu.',
    descriptionTamil: 'தமிழ்நாடு முழுவதும் விளையாட்டு, தலைமைத்துவ பயிற்சி மற்றும் சமூக சேவை மூலம் இளைஞர்களை ஊக்குவித்தல்.',
    officeBearers: [
      { title: 'State Secretary', name: 'K. Senthil Kumar', mobile: '+91 98765 43210' },
      { title: 'Joint Secretary', name: 'M. Arun Prasath', mobile: '+91 98765 43211' }
    ],
    memberCount: 8450,
    icon: 'Users',
    category: 'Youth & Leadership'
  },
  {
    id: 'PAS-02',
    name: 'Women Wing',
    nameTamil: 'மகளிர் பாசறை',
    description: 'Fostering women entrepreneurship, self-help initiatives, and cultural leadership.',
    descriptionTamil: 'பெண்கள் தொழில்முனைவு, சுயஉதவி குழுக்கள் மற்றும் கலாச்சார தலைமையினை வளர்த்தல்.',
    officeBearers: [
      { title: 'State President', name: 'Dr. S. Kanimozhi', mobile: '+91 98765 43212' },
      { title: 'Secretary', name: 'R. Meenakshi', mobile: '+91 98765 43213' }
    ],
    memberCount: 6820,
    icon: 'HeartHandshake',
    category: 'Women Empowerment'
  },
  {
    id: 'PAS-03',
    name: 'Student Wing',
    nameTamil: 'மாணவர் பாசறை',
    description: 'Supporting school and university students with scholarships, debates, and career guidance.',
    descriptionTamil: 'மாணவர்களுக்கு கல்வி உதவித்தொகை, விவாதம் மற்றும் வாழ்க்கை வழிகாட்டுதல் வழங்குதல்.',
    officeBearers: [
      { title: 'State Convenor', name: 'V. Karthik', mobile: '+91 98765 43214' }
    ],
    memberCount: 11200,
    icon: 'GraduationCap',
    category: 'Education'
  },
  {
    id: 'PAS-04',
    name: 'Art & Culture Wing',
    nameTamil: 'கலை & பண்பாட்டு பாசறை',
    description: 'Preserving traditional Tamil performing arts, folk music, Bharatanatyam, and drama.',
    descriptionTamil: 'பாரம்பரிய தமிழ் கலைகள், கிராமிய இசை, பரதநாட்டியம் மற்றும் நாடகங்களை பாதுகாத்தல்.',
    officeBearers: [
      { title: 'State Coordinator', name: 'Kalaichudarmani P. Thangaraj', mobile: '+91 98765 43215' }
    ],
    memberCount: 4500,
    icon: 'Palette',
    category: 'Culture'
  },
  {
    id: 'PAS-05',
    name: 'Literature Wing',
    nameTamil: 'இலக்கியப் பாசறை',
    description: 'Promoting Sangam literature, Thirukkural symposiums, poetry meets, and book publications.',
    descriptionTamil: 'சங்க இலக்கியம், திருக்குறள் கருத்தரங்குகள், கவிவரங்கம் மற்றும் புத்தக வெளியீடுகளை ஊக்குவித்தல்.',
    officeBearers: [
      { title: 'Chief Advisor', name: 'Prof. N. Muthusamy', mobile: '+91 98765 43216' }
    ],
    memberCount: 3900,
    icon: 'BookOpen',
    category: 'Literature'
  },
  {
    id: 'PAS-06',
    name: 'IT & Technology Wing',
    nameTamil: 'தகவல் தொழில்நுட்பப் பாசறை',
    description: 'Advancing Tamil computing, digital AI tools, open source Tamil software, and tech career mentorship.',
    descriptionTamil: 'தமிழ் கணிமை, டிஜிட்டல் AI கருவிகள், திறந்த மூல தமிழ் மென்பொருள் மற்றும் தொழில்நுட்ப வழிகாட்டுதல்.',
    officeBearers: [
      { title: 'State Lead', name: 'Er. Sundararajan R.', mobile: '+91 98765 43217' }
    ],
    memberCount: 5100,
    icon: 'Cpu',
    category: 'Technology'
  },
  {
    id: 'PAS-07',
    name: 'Legal Wing',
    nameTamil: 'சட்டப் பாசறை',
    description: 'Providing pro-bono legal counsel, human rights awareness, and legal aid workshops.',
    descriptionTamil: 'இலவச சட்ட ஆலோசனை, மனித உரிமைகள் விழிப்புணர்வு மற்றும் சட்ட உதவி பட்டறைகள்.',
    officeBearers: [
      { title: 'Legal Counsel', name: 'Adv. A. Baskaran', mobile: '+91 98765 43218' }
    ],
    memberCount: 1850,
    icon: 'Scale',
    category: 'Legal Aid'
  },
  {
    id: 'PAS-08',
    name: 'Medical & Healthcare Wing',
    nameTamil: 'மருத்துவப் பாசறை',
    description: 'Organizing medical camps, Siddha awareness, blood donation drives, and public health initiatives.',
    descriptionTamil: 'மருத்துவ முகாம்கள், சித்த மருத்துவ விழிப்புணர்வு, ரத்த தான முகாம்கள் மற்றும் பொது சுகாதார உதவிகள்.',
    officeBearers: [
      { title: 'Medical Director', name: 'Dr. C. Saravanan MD', mobile: '+91 98765 43219' }
    ],
    memberCount: 2300,
    icon: 'Stethoscope',
    category: 'Healthcare'
  },
  {
    id: 'PAS-09',
    name: 'Education Wing',
    nameTamil: 'கல்விப் பாசறை',
    description: 'Developing digital Tamil learning materials, teacher training, and rural library networks.',
    descriptionTamil: 'டிஜிட்டல் தமிழ் கற்றல் பொருட்கள், ஆசிரியர் பயிற்சி மற்றும் கிராமப்புற நூலக வலைப்பின்னல்.',
    officeBearers: [
      { title: 'Director of Education', name: 'Dr. G. Rajendran', mobile: '+91 98765 43220' }
    ],
    memberCount: 3400,
    icon: 'School',
    category: 'Education'
  },
  {
    id: 'PAS-10',
    name: 'Media & Communications Wing',
    nameTamil: 'ஊடகப் பாசறை',
    description: 'Managing Sangam press relations, monthly journals, podcasts, and digital broadcasting.',
    descriptionTamil: 'சங்க பத்திரிகை தொடர்புகள், மாத இதழ்கள், பாட்காஸ்ட் மற்றும் டிஜிட்டல் ஒளிபரப்பு நிர்வகித்தல்.',
    officeBearers: [
      { title: 'Chief Editor', name: 'S. Ramanathan', mobile: '+91 98765 43221' }
    ],
    memberCount: 1950,
    icon: 'Radio',
    category: 'Media'
  },
  {
    id: 'PAS-11',
    name: 'Traders & Commerce Wing',
    nameTamil: 'வணிகர் பாசறை',
    description: 'Supporting small businesses, MSMEs, Tamil trade networking, and commerce summits.',
    descriptionTamil: 'சிறுதொழில், MSME நிறுவனங்கள், தமிழ் வணிக வலைப்பின்னல் மற்றும் வர்த்தக மாநாடுகள்.',
    officeBearers: [
      { title: 'Commerce Secretary', name: 'T. Velnathan', mobile: '+91 98765 43222' }
    ],
    memberCount: 4200,
    icon: 'Building2',
    category: 'Commerce'
  },
  {
    id: 'PAS-12',
    name: 'Farmers & Agriculture Wing',
    nameTamil: 'உழவர் பாசறை',
    description: 'Promoting organic farming, water conservation, traditional seed preservation, and farmer welfare.',
    descriptionTamil: 'இயற்கை விவசாயம், நீர் பாதுகாப்பு, பாரம்பரிய விதைத் பாதுகாப்பு மற்றும் உழவர் நலன்.',
    officeBearers: [
      { title: 'Agronomist Coordinator', name: 'P. Nallasamy', mobile: '+91 98765 43223' }
    ],
    memberCount: 6100,
    icon: 'Wheat',
    category: 'Agriculture'
  },
  {
    id: 'PAS-13',
    name: 'Labor & Workers Wing',
    nameTamil: 'தொழிலாளர் பாசறை',
    description: 'Advocating for unorganized sector workers, safety standards, and social security benefits.',
    descriptionTamil: 'அமைப்பசாரா தொழிலாளர்களின் பாதுகாப்பு, சமூக பாதுகாப்பு பலன்கள் மற்றும் உரிமைகளுக்காக குரல் கொடுத்தல்.',
    officeBearers: [
      { title: 'Union Coordinator', name: 'M. Pandian', mobile: '+91 98765 43224' }
    ],
    memberCount: 5400,
    icon: 'HardHat',
    category: 'Welfare'
  },
  {
    id: 'PAS-14',
    name: 'Environment & Ecology Wing',
    nameTamil: 'சுற்றுச்சூழல் பாசறை',
    description: 'Tree plantation drives, lake restoration, plastic-free campaigns, and biodiversity protection.',
    descriptionTamil: 'மரக்கன்றுகள் நடுதல், ஏரிகள் சீரமைத்தல், நெகிழி இல்லா பிரச்சாரம் மற்றும் பல்லுயிர் பாதுகாப்பு.',
    officeBearers: [
      { title: 'Eco Lead', name: 'S. Nithya Green', mobile: '+91 98765 43225' }
    ],
    memberCount: 3100,
    icon: 'Leaf',
    category: 'Ecology'
  },
  {
    id: 'PAS-15',
    name: 'Sports & Athletics Wing',
    nameTamil: 'விளையாட்டுப் பாசறை',
    description: 'Promoting traditional Tamil sports (Silambam, Jallikattu, Kabaddi) and state athletics tournaments.',
    descriptionTamil: 'சிலம்பம், ஜல்லிக்கட்டு, கபடி போன்ற பாரம்பரிய தமிழ் விளையாட்டுகள் மற்றும் மாநில தடகளப் போட்டிகள்.',
    officeBearers: [
      { title: 'Sports Secretary', name: 'Silambam Master K. Durai', mobile: '+91 98765 43226' }
    ],
    memberCount: 4800,
    icon: 'Trophy',
    category: 'Sports'
  },
  {
    id: 'PAS-16',
    name: 'Social Welfare & Charity Wing',
    nameTamil: 'தொண்டு & நலப் பாசறை',
    description: 'Disaster relief efforts, orphan care support, old age home aid, and food distribution.',
    descriptionTamil: 'பேரிடர் நிவாரண உதவிகள், ஆதரவற்றோர் ஆசிரம உதவி மற்றும் அன்னதான திட்டங்கள்.',
    officeBearers: [
      { title: 'Charity Trustee', name: 'V. Alagappan', mobile: '+91 98765 43227' }
    ],
    memberCount: 7200,
    icon: 'Gift',
    category: 'Social Charity'
  },
  {
    id: 'PAS-17',
    name: 'NRI & Diaspora Wing',
    nameTamil: 'வெளிநாடு & புலம்பெயர்ந்தோர் பாசறை',
    description: 'Connecting global Tamil Sangams in Singapore, Malaysia, USA, UK, Sri Lanka, and Gulf countries.',
    descriptionTamil: 'சிங்கப்பூர், மலேசியா, அமெரிக்கா, இலங்கை மற்றும் வளைகுடா நாடுகளில் வாழும் தமிழ் சங்கங்களை இணைத்தல்.',
    officeBearers: [
      { title: 'Global Liaison', name: 'Dr. Vijay Chidambaram', mobile: '+1 408 555 0192' }
    ],
    memberCount: 3800,
    icon: 'Globe',
    category: 'International'
  },
  {
    id: 'PAS-18',
    name: 'Archeology & History Wing',
    nameTamil: 'தொல்பொருள் & வரலாற்றுப் பாசறை',
    description: 'Keeladi research awareness, ancient inscription preservation, and historical site tours.',
    descriptionTamil: 'கீழடி அகழ்வாராய்ச்சி விழிப்புணர்வு, கல்வெட்டுகள் பாதுகாப்பு மற்றும் வரலாற்று இடங்கள் பயணம்.',
    officeBearers: [
      { title: 'Archaeology Advisor', name: 'Dr. R. Nagasamy', mobile: '+91 98765 43229' }
    ],
    memberCount: 1600,
    icon: 'Landmark',
    category: 'History'
  },
  {
    id: 'PAS-19',
    name: 'Research & Publication Wing',
    nameTamil: 'ஆராய்ச்சிப் பாசறை',
    description: 'Funding academic research papers, publishing research journals, and manuscript digitalization.',
    descriptionTamil: 'ஆராய்ச்சிக் கட்டுரைகளுக்கு நிதியளித்தல், ஆய்வு இதழ்கள் வெளியிடுதல் மற்றும் சுவடி டிஜிட்டல் மயமாக்கல்.',
    officeBearers: [
      { title: 'Research Head', name: 'Dr. M. Sivam', mobile: '+91 98765 43230' }
    ],
    memberCount: 1250,
    icon: 'FileText',
    category: 'Research'
  },
  {
    id: 'PAS-20',
    name: 'Youth Skill Development Wing',
    nameTamil: 'இளைஞர் திறன் பாசறை',
    description: 'Vocational training, soft skills, public speaking in Tamil, and competitive exam coaching (TNPSC/UPSC).',
    descriptionTamil: 'தொழிற்பயிற்சி, ஆளுமை திறன், மேடைப்பேச்சு மற்றும் TNPSC/UPSC போட்டித்தேர்வு பயிற்சிகள்.',
    officeBearers: [
      { title: 'Skill Mentor', name: 'B. Elango IAS (Retd)', mobile: '+91 98765 43231' }
    ],
    memberCount: 5900,
    icon: 'Briefcase',
    category: 'Skill Development'
  },
  {
    id: 'PAS-21',
    name: 'Coastal & Fishermen Wing',
    nameTamil: 'நெய்தல் & கடலோரப் பாசறை',
    description: 'Protecting coastal community livelihoods, marine safety awareness, and fishermen welfare.',
    descriptionTamil: 'கடலோர மக்களின் வாழ்வாதாரம் பாதுகாப்பு, கடல்சார் பாதுகாப்பு விழிப்புணர்வு மற்றும் மீனவர் நலன்.',
    officeBearers: [
      { title: 'Coastal Lead', name: 'J. Crossman', mobile: '+91 98765 43232' }
    ],
    memberCount: 4100,
    icon: 'Anchor',
    category: 'Coastal'
  },
  {
    id: 'PAS-22',
    name: 'Tribal Welfare Wing',
    nameTamil: 'மலைவாழ் மக்கள் நலப் பாசறை',
    description: 'Preserving indigenous tribal arts, education support for Nilgiris & Javadi hills children.',
    descriptionTamil: 'பழங்குடியின மக்களின் கலைகள் பாதுகாப்பு மற்றும் மலைவாழ் குழந்தைகள் கல்வி உதவி.',
    officeBearers: [
      { title: 'Tribal Secretary', name: 'C. Bomman', mobile: '+91 98765 43233' }
    ],
    memberCount: 1400,
    icon: 'Trees',
    category: 'Tribal Welfare'
  },
  {
    id: 'PAS-23',
    name: 'Volunteers Wing',
    nameTamil: 'தன்னார்வலர் பாசறை',
    description: 'Rapid response volunteers force for community events, emergency relief, and civic duties.',
    descriptionTamil: 'சமூக நிகழ்ச்சிகள், அவசர நிவாரணப் பணிகள் மற்றும் குடிமைப் பணிகளுக்கான தன்னார்வலர் படை.',
    officeBearers: [
      { title: 'Volunteers Captain', name: 'R. Velu', mobile: '+91 98765 43234' }
    ],
    memberCount: 9600,
    icon: 'Sparkles',
    category: 'Volunteers'
  }
];

export const INITIAL_MEMBERS: MemberApplication[] = [
  {
    id: 'APP-1001',
    mobileVerified: true,
    fullName: 'Sundaram Ramachandran',
    nameTamil: 'சுந்தரம் இராமச்சந்திரன்',
    dob: '1985-06-15',
    gender: 'Male',
    guardianName: 'Ramachandran Iyer',
    occupation: 'Senior Software Engineer',
    education: 'M.Tech Computer Science',
    bloodGroup: 'O+',
    mobile: '9840123456',
    whatsapp: '9840123456',
    email: 'sundaram.r@gmail.com',
    doorNo: '42/1',
    street: 'Anna Salai',
    village: 'Mylapore',
    postOffice: 'Mylapore HO',
    taluk: 'Mylapore',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600004',
    country: 'India',
    aadhaarNumber: '7890-1234-5678',
    aadhaarDocUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    categoryId: 'CAT-LIFE',
    categoryName: 'Life Member',
    pasaraiId: 'PAS-06',
    pasaraiName: 'தகவல் தொழில்நுட்பப் பாசறை',
    paymentMethod: 'UPI / GPay',
    paymentAmount: 1000,
    paymentTransactionId: 'GPI9842109581',
    paymentDate: '2026-01-10',
    status: 'APPROVED',
    membershipNumber: 'TS-TN-2026-000001',
    joiningDate: '2026-01-10',
    validityDate: '2036-01-10',
    qrCodeData: 'TS-TN-2026-000001|Sundaram Ramachandran|Chennai|CAT-LIFE'
  },
  {
    id: 'APP-1002',
    mobileVerified: true,
    fullName: 'Kavitha Thangaraj',
    nameTamil: 'கவிதா தங்கராஜ்',
    dob: '1992-09-22',
    gender: 'Female',
    guardianName: 'Thangaraj M',
    occupation: 'Professor of Tamil Literature',
    education: 'Ph.D Tamil Literature',
    bloodGroup: 'A+',
    mobile: '9789012345',
    whatsapp: '9789012345',
    email: 'kavitha.tamil@maduraicollege.edu.in',
    doorNo: '18B',
    street: 'KK Nagar Main Road',
    village: 'KK Nagar',
    postOffice: 'KK Nagar',
    taluk: 'Madurai South',
    district: 'Madurai',
    state: 'Tamil Nadu',
    pincode: '625020',
    country: 'India',
    aadhaarNumber: '4567-8901-2345',
    aadhaarDocUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    categoryId: 'CAT-PROF',
    categoryName: 'Professional Member',
    pasaraiId: 'PAS-05',
    pasaraiName: 'இலக்கியப் பாசறை',
    paymentMethod: 'Net Banking',
    paymentAmount: 500,
    paymentTransactionId: 'HDFC294019284',
    paymentDate: '2026-02-01',
    status: 'APPROVED',
    membershipNumber: 'TS-TN-2026-000002',
    joiningDate: '2026-02-01',
    validityDate: '2027-02-01',
    qrCodeData: 'TS-TN-2026-000002|Kavitha Thangaraj|Madurai|CAT-PROF'
  },
  {
    id: 'APP-1003',
    mobileVerified: true,
    fullName: 'Anbarasan Murugan',
    nameTamil: 'அன்பரசன் முருகன்',
    dob: '1998-11-05',
    gender: 'Male',
    guardianName: 'Murugan P',
    occupation: 'Social Worker & Youth Leader',
    education: 'B.Sc Agriculture',
    bloodGroup: 'B+',
    mobile: '9629012345',
    whatsapp: '9629012345',
    email: 'anbu.m@gmail.com',
    doorNo: '105',
    street: 'Gandhi Road',
    village: 'RS Puram',
    postOffice: 'RS Puram',
    taluk: 'Coimbatore North',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641002',
    country: 'India',
    aadhaarNumber: '6789-0123-4567',
    aadhaarDocUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    categoryId: 'CAT-YOUTH',
    categoryName: 'Youth Member',
    pasaraiId: 'PAS-01',
    pasaraiName: 'இளைஞர் பாசறை',
    paymentMethod: 'UPI / PhonePe',
    paymentAmount: 100,
    paymentTransactionId: 'PPE849201948',
    paymentDate: '2026-03-15',
    status: 'PENDING',
    qrCodeData: 'APP-1003|Anbarasan Murugan|Coimbatore|PENDING'
  },
  {
    id: 'APP-1004',
    mobileVerified: true,
    fullName: 'Senthamizh Chelvan',
    nameTamil: 'செந்தமிழ் செல்வன்',
    dob: '2003-04-12',
    gender: 'Male',
    guardianName: 'Chelvan K',
    occupation: 'Student (Engineering)',
    education: 'B.E Electronics',
    bloodGroup: 'O-',
    mobile: '9566012345',
    whatsapp: '9566012345',
    email: 'senthamizh.student@gmail.com',
    doorNo: '12',
    street: 'College Road',
    village: 'Thillai Nagar',
    postOffice: 'Thillai Nagar HO',
    taluk: 'Tiruchirappalli',
    district: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    pincode: '620018',
    country: 'India',
    aadhaarNumber: '1234-5678-9012',
    aadhaarDocUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    categoryId: 'CAT-STU',
    categoryName: 'Student Member',
    pasaraiId: 'PAS-03',
    pasaraiName: 'மாணவர் பாசறை',
    paymentMethod: 'UPI / Paytm',
    paymentAmount: 50,
    paymentTransactionId: 'PYTM83910491',
    paymentDate: '2026-03-20',
    status: 'PENDING',
    qrCodeData: 'APP-1004|Senthamizh Chelvan|Trichy|PENDING'
  }
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'DON-2001',
    receiptNumber: 'TS-DON-2026-000001',
    donorName: 'Er. N. Sivakumar',
    mobile: '9841098765',
    whatsapp: '9841098765',
    email: 'sivakumar.n@gmail.com',
    address: 'Plot 4, Temple Avenue, Adyar, Chennai - 600020',
    amount: 25000,
    purpose: 'Tamil Cultural Festival & Thirukkural Conference',
    paymentMethod: 'Net Banking (ICICI)',
    transactionId: 'TXN98492019482',
    date: '2026-02-14'
  },
  {
    id: 'DON-2002',
    receiptNumber: 'TS-DON-2026-000002',
    donorName: 'Dr. Meena Periasamy',
    mobile: '9789098765',
    whatsapp: '9789098765',
    email: 'meena.periasamy@yahoo.com',
    address: '77, West Veli Street, Madurai - 625001',
    amount: 10000,
    purpose: 'Rural Student Scholarship & Library Development',
    paymentMethod: 'UPI / GPay',
    transactionId: 'GPI83920194821',
    date: '2026-03-01'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'EVT-3001',
    title: 'State Level Sangam Literature & Thirukkural Symposium 2026',
    titleTamil: 'மாநில அளவிலான சங்க இலக்கியம் & திருக்குறள் கருத்தரங்கம் 2026',
    date: '2026-10-15',
    time: '09:30 AM - 05:30 PM',
    venue: 'Kalaivanar Arangam, Wallajah Road, Triplicane, Chennai',
    district: 'Chennai',
    description: 'A grand day-long convention bringing together scholars, poets, students, and Tamil lovers with debates, research paper presentations, and book launches.',
    registrationFee: 100,
    maxParticipants: 500,
    registeredCount: 340,
    bannerUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    pasaraiId: 'PAS-05'
  },
  {
    id: 'EVT-3002',
    title: 'Tamil Nadu Youth Leadership & Silambam Cultural Meet',
    titleTamil: 'தமிழ்நாடு இளைஞர் தலைமைத்துவம் & சிலம்பக் கலை விழா',
    date: '2026-11-05',
    time: '10:00 AM - 04:00 PM',
    venue: 'Tamukkam Grounds, Madurai',
    district: 'Madurai',
    description: 'Youth skills exposition, Silambam traditional martial arts tournament, and career guidance sessions for students.',
    registrationFee: 50,
    maxParticipants: 1000,
    registeredCount: 620,
    bannerUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    pasaraiId: 'PAS-01'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'NEWS-4001',
    title: 'Tamil Sangam Launches Digital Membership ID Card Portal with Instant QR Verification',
    titleTamil: 'தமிழ் சங்கம் டிஜிட்டல் உறுப்பினர் அடையாள அட்டை மற்றும் QR சரிபார்ப்பு தளம் துவக்கம்',
    category: 'News',
    date: '2026-09-20',
    summary: 'Members across all 38 districts can now complete mobile OTP verification, register online, get Admin approval, and download their official Digital ID card with instant QR code verification.',
    content: 'Tamil Sangam Tamil Nadu has officially launched its state-of-the-art Digital Portal to streamline online membership, 23 Pasarai wing organization, online donations, and automated PDF receipt dispatch via WhatsApp and Email.'
  },
  {
    id: 'NEWS-4002',
    title: 'Annual Tamil Sangam International Cultural Convention Announced for November 2026',
    titleTamil: 'நவம்பர் 2026-இல் சர்வதேச தமிழ் சங்க கலாச்சார மாநாடு அறிவிப்பு',
    category: 'Press Release',
    date: '2026-09-15',
    summary: 'Representatives from diaspora Tamil Sangams in Singapore, Malaysia, USA, UK, and Sri Lanka will gather in Madurai for a 3-day cultural celebration.',
    content: 'The NRI & Diaspora Wing (PAS-17) along with the Art & Culture Wing (PAS-04) will host over 50 international delegations.'
  }
];

export const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'CERT-5001',
    certificateNumber: 'TS-CERT-2026-00042',
    memberId: 'APP-1001',
    memberName: 'Sundaram Ramachandran',
    title: 'Certificate of Appreciation for Digital Innovation',
    type: 'APPRECIATION',
    issueDate: '2026-02-15',
    issuedBy: 'State Executive Committee, Tamil Sangam',
    description: 'Awarded in recognition of outstanding voluntary services rendered to the IT & Technology Pasarai wing.',
    qrCode: 'TS-CERT-2026-00042|Sundaram Ramachandran|APPRECIATION'
  }
];
