// Seed Zelya -- donnees fictives, aucun lien avec des personnes reelles
import { PrismaClient, Gender, ProfileStatus, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Photos portraits -- randomuser.me (service dedie aux maquettes UI, libre de droits)
// FEMALE / COUPLE / TRANS / OTHER -> women portraits (1-99)
// MALE -> men portraits (1-99)
function avatar(gender: Gender, portrait: number): string {
  const type = gender === Gender.MALE ? 'men' : 'women'
  return `https://randomuser.me/api/portraits/${type}/${portrait}.jpg`
}

// Photos galerie -- picsum.photos (photographies libre de droits)
function photo(alias: string, idx: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(alias)}-${idx}/300/400`
}

const ALL_TAGS = [
  'Disponible ce soir',
  'Disponible ce week-end',
  'Verifie',
  'Nouveau profil',
  'Top profil',
  'Tres reactif(ve)',
  'Parle anglais',
  'Deplacement possible',
  'Recoit a domicile',
  'Premium exclusif',
]

interface ProfileData {
  alias: string; city: string; dept: string; region: string
  gender: Gender; age: number; online: boolean; verified: boolean; premium: boolean
  rating: number; reviews: number; portrait: number; bio: string; tags: string[]
}

// Portrait assignment:
// FEMALE  : women/1..55
// MALE    : men/1..20
// TRANS   : women/56..65
// COUPLE  : women/66..75
// OTHER   : women/76..80

const PROFILES: ProfileData[] = [
  // ============================================================
  // FEMMES (55 profils) -- women portraits 1..55
  // ============================================================
  { alias:'Lea_Paris',       city:'Paris',             dept:'Paris (75)',                  region:'Ile-de-France',                 gender:Gender.FEMALE, age:26, online:true,  verified:true,  premium:true,  rating:4.8, reviews:127, portrait:1,  bio:'Jeune femme parisienne raffinee et discrete. Disponible pour dîners, voyages et moments d exception. Discretion garantie.',          tags:['Verifie','Top profil','Tres reactif(ve)','Recoit a domicile'] },
  { alias:'Sofia_Lyon',      city:'Lyon',              dept:'Rhone (69)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.FEMALE, age:31, online:false, verified:true,  premium:false, rating:4.5, reviews:89,  portrait:2,  bio:'Lyonnaise authentique et passionnee. Rencontres de qualite dans la discretion totale. Disponible soir et week-end.',               tags:['Disponible ce week-end','Verifie'] },
  { alias:'Alex_Bordeaux',   city:'Bordeaux',          dept:'Gironde (33)',                 region:'Nouvelle-Aquitaine',            gender:Gender.FEMALE, age:28, online:true,  verified:true,  premium:true,  rating:4.9, reviews:203, portrait:3,  bio:'Escorte independante bordelaise, elegante et cultivee. Je recois dans un cadre luxueux ou me deplace. Voyages acceptes.',         tags:['Verifie','Top profil','Parle anglais','Deplacement possible'] },
  { alias:'Emma_Toulouse',   city:'Toulouse',          dept:'Haute-Garonne (31)',           region:'Occitanie',                     gender:Gender.FEMALE, age:23, online:false, verified:true,  premium:false, rating:4.6, reviews:67,  portrait:4,  bio:'Etudiante toulousaine, spontanee et curieuse. Je propose des instants de complicite et de legerete sans prise de tete.',         tags:['Nouveau profil','Recoit a domicile'] },
  { alias:'Camille_Nantes',  city:'Nantes',            dept:'Loire-Atlantique (44)',        region:'Pays de la Loire',              gender:Gender.FEMALE, age:27, online:false, verified:false, premium:false, rating:4.0, reviews:22,  portrait:5,  bio:'Nantaise douce et bienveillante. Moments de detente et de plaisir en toute complicite sur Nantes et region.',                   tags:[] },
  { alias:'Ines_Montpellier',city:'Montpellier',       dept:'Herault (34)',                 region:'Occitanie',                     gender:Gender.FEMALE, age:25, online:true,  verified:true,  premium:false, rating:4.4, reviews:53,  portrait:6,  bio:'Danseuse contemporaine et creatrice de contenu. La Mediterranee comme ecrin pour des moments inoubliables et sensuels.',         tags:['Disponible ce soir','Verifie'] },
  { alias:'Jade_Rennes',     city:'Rennes',            dept:'Ille-et-Vilaine (35)',         region:'Bretagne',                      gender:Gender.FEMALE, age:24, online:true,  verified:false, premium:false, rating:3.9, reviews:18,  portrait:7,  bio:'Bretonne libre et independante. Je cherche des rencontres sinceres et spontanees sans faux-semblants ni obligations.',            tags:['Nouveau profil','Disponible ce soir'] },
  { alias:'Chloe_Toulon',    city:'Toulon',            dept:'Var (83)',                     region:'Provence-Alpes-Cote d Azur',    gender:Gender.FEMALE, age:33, online:true,  verified:true,  premium:false, rating:4.3, reviews:47,  portrait:8,  bio:'Kinesitherapeute sportive et dynamique. Disponible le week-end pour rencontres de qualite sur Toulon et le Var.',               tags:['Verifie','Disponible ce week-end'] },
  { alias:'Lena_Angers',     city:'Angers',            dept:'Maine-et-Loire (49)',          region:'Pays de la Loire',              gender:Gender.FEMALE, age:22, online:true,  verified:false, premium:false, rating:4.0, reviews:12,  portrait:9,  bio:'Etudiante en histoire de l art. Je propose des moments d evasion culturelle et de tendresse au coeur d Angers.',               tags:['Nouveau profil','Disponible ce soir'] },
  { alias:'Alix_Rouen',      city:'Rouen',             dept:'Seine-Maritime (76)',          region:'Normandie',                     gender:Gender.FEMALE, age:35, online:false, verified:true,  premium:true,  rating:4.7, reviews:112, portrait:10, bio:'Professionnelle normande elegante et cultivee. Contenu exclusif et rencontres discretes haut de gamme. Discretion absolue.',     tags:['Verifie','Top profil','Parle anglais','Premium exclusif'] },
  { alias:'Lila_Montpellier',city:'Montpellier',       dept:'Herault (34)',                 region:'Occitanie',                     gender:Gender.FEMALE, age:29, online:true,  verified:true,  premium:true,  rating:4.8, reviews:178, portrait:11, bio:'Creatrice de contenu lifestyle et bien-etre. Abonnez-vous pour acceder a mes photos et videos exclusives en avant-premiere.',     tags:['Verifie','Top profil','Tres reactif(ve)','Premium exclusif'] },
  { alias:'Nora_Tours',      city:'Tours',             dept:'Indre-et-Loire (37)',          region:'Centre-Val de Loire',           gender:Gender.FEMALE, age:26, online:true,  verified:false, premium:false, rating:4.0, reviews:19,  portrait:12, bio:'Oenologue en formation, je vous invite a decouvrir la douceur du Val de Loire dans toute sa splendeur et sa sensualite.',       tags:['Disponible ce soir'] },
  { alias:'Zara_Perpignan',  city:'Perpignan',         dept:'Pyrenees-Orientales (66)',     region:'Occitanie',                     gender:Gender.FEMALE, age:30, online:true,  verified:true,  premium:true,  rating:4.6, reviews:88,  portrait:13, bio:'DJ et artiste, entre Mediterranee et Pyrenees. Je propose une experience unique ou l art et le plaisir se rejoignent.',          tags:['Verifie','Top profil','Parle anglais'] },
  { alias:'Maya_Clermont',   city:'Clermont-Ferrand',  dept:'Puy-de-Dome (63)',             region:'Auvergne-Rhone-Alpes',          gender:Gender.FEMALE, age:32, online:true,  verified:true,  premium:false, rating:4.4, reviews:61,  portrait:14, bio:'Geologue et grande voyageuse. Entre deux expeditions, je propose des rencontres authentiques au coeur de l Auvergne.',          tags:['Verifie','Disponible ce soir'] },
  { alias:'Eva_Strasbourg',  city:'Strasbourg',        dept:'Bas-Rhin (67)',                region:'Grand Est',                     gender:Gender.FEMALE, age:27, online:true,  verified:true,  premium:false, rating:4.5, reviews:74,  portrait:15, bio:'Alsacienne solaire, bilingue francais-allemand. Disponible pour rencontres a Strasbourg ou deplacements en Europe.',           tags:['Verifie','Parle anglais','Deplacement possible'] },
  { alias:'Lucie_Nice',      city:'Nice',              dept:'Alpes-Maritimes (06)',         region:'Provence-Alpes-Cote d Azur',    gender:Gender.FEMALE, age:29, online:false, verified:true,  premium:true,  rating:4.7, reviews:143, portrait:16, bio:'Mannequin et hotesse nicoise. Soirees galas, voyages sur yachts et rencontres d exception. Je me deplace dans toute l Europe.', tags:['Verifie','Top profil','Premium exclusif','Deplacement possible'] },
  { alias:'Clara_Paris',     city:'Paris',             dept:'Paris (75)',                   region:'Ile-de-France',                 gender:Gender.FEMALE, age:24, online:true,  verified:false, premium:false, rating:4.1, reviews:29,  portrait:17, bio:'Comedienne parisienne, je sais m adapter a toutes les situations. Spontanee et petillante, je cherche des aventures sympas.',  tags:['Disponible ce soir'] },
  { alias:'Manon_Marseille', city:'Marseille',         dept:'Bouches-du-Rhone (13)',        region:'Provence-Alpes-Cote d Azur',    gender:Gender.FEMALE, age:28, online:true,  verified:true,  premium:false, rating:4.3, reviews:58,  portrait:18, bio:'Marseillaise passionnee, entre mer et calanques. Rencontres sinceres et moments de partage dans la plus grande discretion.',     tags:['Verifie','Disponible ce soir'] },
  { alias:'Julie_Lille',     city:'Lille',             dept:'Nord (59)',                    region:'Hauts-de-France',               gender:Gender.FEMALE, age:25, online:true,  verified:false, premium:false, rating:4.0, reviews:21,  portrait:19, bio:'Lilloise chaleureuse et accueillante. Moments de detente et de complicite en toute discretion dans le Nord.',                    tags:['Disponible ce soir'] },
  { alias:'Elisa_Grenoble',  city:'Grenoble',          dept:'Isere (38)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.FEMALE, age:30, online:false, verified:true,  premium:true,  rating:4.8, reviews:167, portrait:20, bio:'Ingenieure et sportive de montagne. Entre ski et randonnee, je trouve du temps pour des rencontres de grande qualite.',          tags:['Verifie','Top profil','Premium exclusif'] },
  { alias:'Nina_Brest',      city:'Brest',             dept:'Finistere (29)',               region:'Bretagne',                      gender:Gender.FEMALE, age:26, online:true,  verified:false, premium:false, rating:3.8, reviews:14,  portrait:21, bio:'Brestoise libre comme l ocean. Je propose des rencontres sans chichi dans une ambiance decontractee et bienveillante.',        tags:['Nouveau profil'] },
  { alias:'Sara_Metz',       city:'Metz',              dept:'Moselle (57)',                 region:'Grand Est',                     gender:Gender.FEMALE, age:29, online:false, verified:true,  premium:false, rating:4.2, reviews:36,  portrait:22, bio:'Professeure de yoga a Metz. Zen, douce et attentionnee, je saurai vous offrir une parenthese de serenite et de volupte.',      tags:['Verifie','Disponible ce week-end'] },
  { alias:'Ambre_Caen',      city:'Caen',              dept:'Calvados (14)',                region:'Normandie',                     gender:Gender.FEMALE, age:24, online:true,  verified:true,  premium:false, rating:4.3, reviews:42,  portrait:23, bio:'Etudiante en droit, rigoureuse et passionnee. Je cherche des moments de legerete loin des livres et des amphitheatres.',       tags:['Verifie','Disponible ce soir'] },
  { alias:'Celia_Dijon',     city:'Dijon',             dept:'Cote-d Or (21)',               region:'Bourgogne-Franche-Comte',       gender:Gender.FEMALE, age:31, online:true,  verified:false, premium:false, rating:3.9, reviews:16,  portrait:24, bio:'Sommeliere bourguignonne. Entre deux degustations, je propose des rendez-vous chaleureux et complices.',                       tags:['Disponible ce soir'] },
  { alias:'Lisa_Reims',      city:'Reims',             dept:'Marne (51)',                   region:'Grand Est',                     gender:Gender.FEMALE, age:27, online:true,  verified:true,  premium:true,  rating:4.6, reviews:95,  portrait:25, bio:'Hotesse evenementielle champenoise. Elegante et raffinee, disponible pour soirees galas et deplacements professionnels.',       tags:['Verifie','Top profil','Deplacement possible','Parle anglais'] },
  { alias:'Alicia_Nimes',    city:'Nimes',             dept:'Gard (30)',                    region:'Occitanie',                     gender:Gender.FEMALE, age:25, online:true,  verified:false, premium:false, rating:4.0, reviews:23,  portrait:26, bio:'Nimoise passionnee d art et de culture. Je cherche des hommes de gout pour des moments aussi beaux qu un tramonto.',            tags:['Disponible ce soir'] },
  { alias:'Diane_Pau',       city:'Pau',               dept:'Pyrenees-Atlantiques (64)',    region:'Nouvelle-Aquitaine',            gender:Gender.FEMALE, age:28, online:false, verified:true,  premium:false, rating:4.2, reviews:31,  portrait:27, bio:'Basque elegante et sportive. Randonnes en Pyrenees le jour, rencontres raffinées le soir dans les meilleures adresses.',        tags:['Verifie','Disponible ce week-end'] },
  { alias:'Mia_Toulon',      city:'Toulon',            dept:'Var (83)',                     region:'Provence-Alpes-Cote d Azur',    gender:Gender.FEMALE, age:32, online:true,  verified:true,  premium:true,  rating:4.7, reviews:108, portrait:28, bio:'Creatrice de contenu haut de gamme. Photos et videos exclusives, lives prives, et rencontres pour personnes selectionnees.',   tags:['Verifie','Top profil','Premium exclusif','Recoit a domicile'] },
  { alias:'Tina_Paris',      city:'Paris',             dept:'Paris (75)',                   region:'Ile-de-France',                 gender:Gender.FEMALE, age:26, online:true,  verified:true,  premium:false, rating:4.4, reviews:57,  portrait:29, bio:'Photographe et blogueuse parisienne. Je vous propose un univers visuel sensuel et elegant, loin des conventions.',              tags:['Verifie','Disponible ce soir'] },
  { alias:'Ana_Lyon',        city:'Lyon',              dept:'Rhone (69)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.FEMALE, age:29, online:false, verified:false, premium:false, rating:3.8, reviews:11,  portrait:30, bio:'Cuisiniere lyonnaise et amoureuse des belles choses. Je cherche des rencontres authentiques et sans pretention.',              tags:[] },
  { alias:'Lena_Bordeaux',   city:'Bordeaux',          dept:'Gironde (33)',                 region:'Nouvelle-Aquitaine',            gender:Gender.FEMALE, age:27, online:true,  verified:true,  premium:false, rating:4.5, reviews:79,  portrait:31, bio:'Vigneronne passionnee et globe-trotteuse. Moments de douceur bordelais garantis dans un cadre elegant et soigne.',             tags:['Verifie','Disponible ce soir','Parle anglais'] },
  { alias:'Iris_Strasbourg', city:'Strasbourg',        dept:'Bas-Rhin (67)',                region:'Grand Est',                     gender:Gender.FEMALE, age:24, online:true,  verified:false, premium:false, rating:4.0, reviews:17,  portrait:32, bio:'Architecte en herbe a Strasbourg. Je cherche des hommes curieux et cultives pour des sorties et des nuits memorables.',         tags:['Nouveau profil','Disponible ce soir'] },
  { alias:'Rose_Rennes',     city:'Rennes',            dept:'Ille-et-Vilaine (35)',         region:'Bretagne',                      gender:Gender.FEMALE, age:28, online:true,  verified:true,  premium:true,  rating:4.6, reviews:82,  portrait:33, bio:'Juriste bretonne, elegante et discrete. Je propose des rencontres haut de gamme pour hommes exigeants et respectueux.',        tags:['Verifie','Top profil','Premium exclusif'] },
  { alias:'Chiara_Nice',     city:'Nice',              dept:'Alpes-Maritimes (06)',         region:'Provence-Alpes-Cote d Azur',    gender:Gender.FEMALE, age:31, online:false, verified:true,  premium:false, rating:4.4, reviews:65,  portrait:34, bio:'Italienne expatriee sur la Cote d Azur. Passionnee de mode et d art, je propose des moments uniques et raffines en anglais.',  tags:['Verifie','Parle anglais','Disponible ce week-end'] },
  { alias:'Cloe_Toulouse',   city:'Toulouse',          dept:'Haute-Garonne (31)',           region:'Occitanie',                     gender:Gender.FEMALE, age:26, online:true,  verified:false, premium:false, rating:4.1, reviews:28,  portrait:35, bio:'Ingenieure aeronautique et passionnee d aviation. Disponible le soir pour des rencontres sympas a Toulouse.',                tags:['Disponible ce soir'] },
  { alias:'Noemie_Montpellier',city:'Montpellier',     dept:'Herault (34)',                 region:'Occitanie',                     gender:Gender.FEMALE, age:23, online:true,  verified:true,  premium:false, rating:4.3, reviews:44,  portrait:36, bio:'Jeune etudiante en medecine, douce et attentionnee. Je cherche des moments de detente entre deux examens difficiles.',         tags:['Verifie','Disponible ce soir'] },
  { alias:'Victoria_Paris',  city:'Paris',             dept:'Paris (75)',                   region:'Ile-de-France',                 gender:Gender.FEMALE, age:30, online:false, verified:true,  premium:true,  rating:4.9, reviews:231, portrait:37, bio:'Escort VIP parisienne. Prestations haut de gamme, discretion absolue. Je recois dans un appartement de grand standing.',       tags:['Verifie','Top profil','Premium exclusif','Recoit a domicile'] },
  { alias:'Madeleine_Marseille',city:'Marseille',      dept:'Bouches-du-Rhone (13)',        region:'Provence-Alpes-Cote d Azur',    gender:Gender.FEMALE, age:35, online:true,  verified:true,  premium:false, rating:4.3, reviews:52,  portrait:38, bio:'Cheffe cuisiniere marseillaise etoilee. Entre mer et marche, je vous propose une experience sensorielle unique et intimate.',    tags:['Verifie','Disponible ce soir'] },
  { alias:'Amandine_Bordeaux',city:'Bordeaux',         dept:'Gironde (33)',                 region:'Nouvelle-Aquitaine',            gender:Gender.FEMALE, age:27, online:true,  verified:false, premium:false, rating:4.0, reviews:19,  portrait:39, bio:'Graphiste creative et passionnee d art. Je cherche des rencontres stimulantes intellectuellement et sensuellement.',           tags:['Disponible ce soir'] },
  { alias:'Sonia_Nantes',    city:'Nantes',            dept:'Loire-Atlantique (44)',        region:'Pays de la Loire',              gender:Gender.FEMALE, age:32, online:false, verified:true,  premium:true,  rating:4.7, reviews:118, portrait:40, bio:'Directrice artistique nantaise. Contenu premium et rencontres exclusives pour connaisseurs et amateurs de belles choses.',     tags:['Verifie','Top profil','Premium exclusif'] },
  { alias:'Justine_Lyon',    city:'Lyon',              dept:'Rhone (69)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.FEMALE, age:25, online:true,  verified:false, premium:false, rating:4.1, reviews:33,  portrait:41, bio:'Etudiante en commerce lyonnaise, dynamique et petillante. Disponible pour rencontres en centre-ville de Lyon.',               tags:['Disponible ce soir'] },
  { alias:'Alice_Caen',      city:'Caen',              dept:'Calvados (14)',                region:'Normandie',                     gender:Gender.FEMALE, age:28, online:true,  verified:true,  premium:false, rating:4.4, reviews:47,  portrait:42, bio:'Restauratrice d oeuvres d art et passionnee d histoire. Rencontres culturelles et memorables en Normandie.',                 tags:['Verifie','Disponible ce soir'] },
  { alias:'Pauline_Reims',   city:'Reims',             dept:'Marne (51)',                   region:'Grand Est',                     gender:Gender.FEMALE, age:26, online:false, verified:false, premium:false, rating:3.9, reviews:15,  portrait:43, bio:'Champenoise discrete et reservee. Je propose des rencontres sinceres et sans faux-semblants dans la plus grande intimite.',    tags:[] },
  { alias:'Maeva_Perpignan', city:'Perpignan',         dept:'Pyrenees-Orientales (66)',     region:'Occitanie',                     gender:Gender.FEMALE, age:24, online:true,  verified:true,  premium:false, rating:4.2, reviews:38,  portrait:44, bio:'Catalane solaire et passionnee. La Mediterranee comme terrain de jeu pour des rencontres ensoleillees et authentiques.',      tags:['Verifie','Disponible ce soir'] },
  { alias:'Carine_Tours',    city:'Tours',             dept:'Indre-et-Loire (37)',          region:'Centre-Val de Loire',           gender:Gender.FEMALE, age:33, online:true,  verified:true,  premium:true,  rating:4.7, reviews:99,  portrait:45, bio:'Medecin et femme de passion. Rencontres haut de gamme pour hommes respectueux et genereux. Deplacement possible.',           tags:['Verifie','Top profil','Premium exclusif','Deplacement possible'] },
  { alias:'Estelle_Grenoble',city:'Grenoble',          dept:'Isere (38)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.FEMALE, age:29, online:false, verified:false, premium:false, rating:4.0, reviews:24,  portrait:46, bio:'Chercheuse en physique et grande sportive. Entre deux conferences, je cherche des aventures humaines aussi intenses.',         tags:['Disponible ce week-end'] },
  { alias:'Sabrina_Metz',    city:'Metz',              dept:'Moselle (57)',                 region:'Grand Est',                     gender:Gender.FEMALE, age:27, online:true,  verified:true,  premium:false, rating:4.3, reviews:41,  portrait:47, bio:'Coach sportive et nutritionniste certifiee. Je saurai vous motiver autrement qu a la salle de sport.',                       tags:['Verifie','Disponible ce soir'] },
  { alias:'Priscilla_Toulon',city:'Toulon',            dept:'Var (83)',                     region:'Provence-Alpes-Cote d Azur',    gender:Gender.FEMALE, age:31, online:true,  verified:false, premium:false, rating:4.1, reviews:27,  portrait:48, bio:'Marine marchande de passage a Toulon. Rencontres libres et sans contraintes avec une femme qui a beaucoup vecu.',             tags:['Disponible ce soir','Deplacement possible'] },
  { alias:'Oceane_Paris',    city:'Paris',             dept:'Paris (75)',                   region:'Ile-de-France',                 gender:Gender.FEMALE, age:23, online:true,  verified:true,  premium:true,  rating:4.8, reviews:154, portrait:49, bio:'Top modele et influenceuse parisienne. Contenu exclusif, lives prives et rencontres triees sur le volet. 100% verifiee.',     tags:['Verifie','Top profil','Premium exclusif','Tres reactif(ve)'] },
  { alias:'Floriane_Nice',   city:'Nice',              dept:'Alpes-Maritimes (06)',         region:'Provence-Alpes-Cote d Azur',    gender:Gender.FEMALE, age:28, online:false, verified:false, premium:false, rating:3.9, reviews:13,  portrait:50, bio:'Fleuriste nicoise, entre parfums et couleurs. Je cherche des hommes doux et attentionnes pour moments complices.',            tags:[] },
  { alias:'Charline_Strasbourg',city:'Strasbourg',     dept:'Bas-Rhin (67)',                region:'Grand Est',                     gender:Gender.FEMALE, age:26, online:true,  verified:true,  premium:false, rating:4.3, reviews:49,  portrait:51, bio:'Traductrice alsacienne trilingue (FR/DE/EN). Rencontres de qualite pour expatries et voyageurs de passage a Strasbourg.',    tags:['Verifie','Parle anglais','Disponible ce soir'] },
  { alias:'Morgane_Brest',   city:'Brest',             dept:'Finistere (29)',               region:'Bretagne',                      gender:Gender.FEMALE, age:30, online:true,  verified:false, premium:false, rating:4.0, reviews:21,  portrait:52, bio:'Oceanographe bretonne. Entre deux plongees, moments de chaleur humaine dans une ville ventee et authentique.',               tags:['Disponible ce soir'] },
  { alias:'Sandrine_Dijon',  city:'Dijon',             dept:'Cote-d Or (21)',               region:'Bourgogne-Franche-Comte',       gender:Gender.FEMALE, age:35, online:false, verified:true,  premium:true,  rating:4.6, reviews:91,  portrait:53, bio:'Negociante en vins et passionnee de gastronomie. Experiences sensuelles aussi raffinees qu un Grand Cru de Bourgogne.',      tags:['Verifie','Top profil','Premium exclusif'] },
  { alias:'Vera_Lille',      city:'Lille',             dept:'Nord (59)',                    region:'Hauts-de-France',               gender:Gender.FEMALE, age:27, online:true,  verified:false, premium:false, rating:4.1, reviews:26,  portrait:54, bio:'Chtie authentique et chaleureuse. Rencontres simples et sinceres entre ch ti et beffroi, loin des complications.',             tags:['Disponible ce soir'] },
  { alias:'Anais_Lyon',      city:'Lyon',              dept:'Rhone (69)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.FEMALE, age:24, online:true,  verified:true,  premium:false, rating:4.4, reviews:55,  portrait:55, bio:'Actrice et mannequin lyonnaise. Charme naturel et spontaneite pour des rencontres qui sortent vraiment de l ordinaire.',     tags:['Verifie','Disponible ce soir','Parle anglais'] },

  // ============================================================
  // HOMMES (20 profils) -- men portraits 1..20
  // ============================================================
  { alias:'Marco_Marseille', city:'Marseille',         dept:'Bouches-du-Rhone (13)',        region:'Provence-Alpes-Cote d Azur',    gender:Gender.MALE,   age:34, online:true,  verified:false, premium:false, rating:4.2, reviews:45,  portrait:1,  bio:'Plongeur professionnel et chef mediterraneen. Rencontres authentiques entre mer et cuisine, discretion garantie.',         tags:['Disponible ce soir'] },
  { alias:'Jules_Nice',      city:'Nice',              dept:'Alpes-Maritimes (06)',         region:'Provence-Alpes-Cote d Azur',    gender:Gender.MALE,   age:29, online:true,  verified:true,  premium:false, rating:4.3, reviews:38,  portrait:2,  bio:'Entrepreneur nicois, surfeur et globe-trotter. Je cherche des partenaires de vie et d aventure sur la Cote d Azur.',      tags:['Verifie','Disponible ce soir'] },
  { alias:'Tom_Lille',       city:'Lille',             dept:'Nord (59)',                    region:'Hauts-de-France',               gender:Gender.MALE,   age:30, online:false, verified:true,  premium:false, rating:4.1, reviews:31,  portrait:3,  bio:'Architecte lillois, passionne d urbanisme et de design. Disponible le week-end pour sorties et rencontres de qualite.',   tags:['Disponible ce week-end','Verifie'] },
  { alias:'Mathis_Dijon',    city:'Dijon',             dept:'Cote-d Or (21)',               region:'Bourgogne-Franche-Comte',       gender:Gender.MALE,   age:36, online:false, verified:false, premium:false, rating:3.8, reviews:15,  portrait:4,  bio:'Sommelier bourguignon. Degustations privees et moments de convivialite autour du meilleur vin de Bourgogne.',             tags:[] },
  { alias:'Sam_Reims',       city:'Reims',             dept:'Marne (51)',                   region:'Grand Est',                     gender:Gender.MALE,   age:27, online:true,  verified:true,  premium:false, rating:4.2, reviews:29,  portrait:5,  bio:'Chef cuisinier remois. Entre champagne et cuisine fusion, des soirees gastronomiques et sensuelles memorables.',           tags:['Verifie','Disponible ce soir'] },
  { alias:'Mael_Brest',      city:'Brest',             dept:'Finistere (29)',               region:'Bretagne',                      gender:Gender.MALE,   age:31, online:false, verified:false, premium:false, rating:3.7, reviews:11,  portrait:6,  bio:'Marin et photographe sous-marin. L Atlantique comme bureau, des rencontres au parfum d iode et de liberte.',              tags:[] },
  { alias:'Victor_Metz',     city:'Metz',              dept:'Moselle (57)',                 region:'Grand Est',                     gender:Gender.MALE,   age:33, online:false, verified:true,  premium:false, rating:4.1, reviews:26,  portrait:7,  bio:'Ingenieur et amateur de jeux de strategie. Rencontres intellectuellement stimulantes en Lorraine pour femmes curieuses.', tags:['Verifie'] },
  { alias:'Theo_Caen',       city:'Caen',              dept:'Calvados (14)',                region:'Normandie',                     gender:Gender.MALE,   age:28, online:false, verified:true,  premium:false, rating:4.3, reviews:34,  portrait:8,  bio:'Historien normand, passionne de memoire. Je cherche des rencontres profondes et significatives avec des femmes cultivees.',tags:['Verifie','Disponible ce week-end'] },
  { alias:'Leo_Pau',         city:'Pau',               dept:'Pyrenees-Atlantiques (64)',    region:'Nouvelle-Aquitaine',            gender:Gender.MALE,   age:25, online:false, verified:false, premium:false, rating:3.9, reviews:8,   portrait:9,  bio:'Guide de montagne et photographe de nature. Les Pyrenees comme terrain de jeu et de liberte absolue.',                  tags:['Nouveau profil'] },
  { alias:'Paul_Paris',      city:'Paris',             dept:'Paris (75)',                   region:'Ile-de-France',                 gender:Gender.MALE,   age:32, online:true,  verified:true,  premium:true,  rating:4.6, reviews:87,  portrait:10, bio:'Consultant financier parisien. Discret, elegant et genereux pour des rencontres d exception avec des femmes distinguees.',tags:['Verifie','Top profil','Deplacement possible','Parle anglais'] },
  { alias:'Luc_Lyon',        city:'Lyon',              dept:'Rhone (69)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.MALE,   age:28, online:true,  verified:false, premium:false, rating:4.0, reviews:22,  portrait:11, bio:'Musicien lyonnais. Je cherche des femmes libres et inspirantes pour des rencontres musicales et profondement humaines.',  tags:['Disponible ce soir'] },
  { alias:'Gabriel_Bordeaux',city:'Bordeaux',          dept:'Gironde (33)',                 region:'Nouvelle-Aquitaine',            gender:Gender.MALE,   age:31, online:true,  verified:true,  premium:false, rating:4.2, reviews:37,  portrait:12, bio:'Vigneron independant en Gironde. Je vous accueille dans mon domaine pour des experiences authentiques et charnelles.',    tags:['Verifie','Disponible ce soir'] },
  { alias:'Nathan_Toulouse', city:'Toulouse',          dept:'Haute-Garonne (31)',           region:'Occitanie',                     gender:Gender.MALE,   age:26, online:true,  verified:false, premium:false, rating:3.9, reviews:14,  portrait:13, bio:'Doctorant en astrophysique. La tete dans les etoiles, les pieds a Toulouse pour des rencontres qui illuminent la nuit.',  tags:['Disponible ce soir'] },
  { alias:'Maxime_Nantes',   city:'Nantes',            dept:'Loire-Atlantique (44)',        region:'Pays de la Loire',              gender:Gender.MALE,   age:29, online:false, verified:true,  premium:false, rating:4.3, reviews:41,  portrait:14, bio:'Designer industriel nantais. Creatif et attentif, je cherche des muses pour des aventures hors du commun en Pays de Loire.',tags:['Verifie','Disponible ce week-end'] },
  { alias:'Bastien_Strasbourg',city:'Strasbourg',      dept:'Bas-Rhin (67)',                region:'Grand Est',                     gender:Gender.MALE,   age:27, online:true,  verified:false, premium:false, rating:4.0, reviews:18,  portrait:15, bio:'Journaliste alsacien. Curieux de tout et de tous, je cherche des femmes avec de belles histoires a raconter.',           tags:['Disponible ce soir'] },
  { alias:'Antoine_Grenoble',city:'Grenoble',          dept:'Isere (38)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.MALE,   age:33, online:true,  verified:true,  premium:true,  rating:4.5, reviews:63,  portrait:16, bio:'Chirurgien et alpiniste confirme. Entre bloc operatoire et cimes enneigees, je cherche des rencontres a la hauteur.',     tags:['Verifie','Top profil','Deplacement possible'] },
  { alias:'Nicolas_Toulon',  city:'Toulon',            dept:'Var (83)',                     region:'Provence-Alpes-Cote d Azur',    gender:Gender.MALE,   age:35, online:false, verified:false, premium:false, rating:3.8, reviews:12,  portrait:17, bio:'Officier de marine et plaisancier confirme. Je cherche des rencontres libres sur Toulon et le Var, sans tabous.',       tags:[] },
  { alias:'Florian_Rennes',  city:'Rennes',            dept:'Ille-et-Vilaine (35)',         region:'Bretagne',                      gender:Gender.MALE,   age:28, online:true,  verified:false, premium:false, rating:4.1, reviews:25,  portrait:18, bio:'Developpeur web breton. Passionne de tech et de nature, je cherche des aventures digitales et bien reelles.',            tags:['Disponible ce soir'] },
  { alias:'Edouard_Montpellier',city:'Montpellier',    dept:'Herault (34)',                 region:'Occitanie',                     gender:Gender.MALE,   age:30, online:true,  verified:true,  premium:false, rating:4.3, reviews:39,  portrait:19, bio:'Oenologue et restaurateur montpellierain. La gastronomie comme vecteur de sensualite et de plaisir partage.',            tags:['Verifie','Disponible ce soir'] },
  { alias:'Thomas_Paris',    city:'Paris',             dept:'Paris (75)',                   region:'Ile-de-France',                 gender:Gender.MALE,   age:27, online:true,  verified:false, premium:false, rating:4.0, reviews:20,  portrait:20, bio:'Styliste parisien et amateur d art contemporain. Je cherche des femmes au style affirme pour des sorties culturelles.',  tags:['Disponible ce soir'] },

  // ============================================================
  // COUPLES (10 profils) -- women portraits 66..75
  // ============================================================
  { alias:'Morgan_Grenoble', city:'Grenoble',          dept:'Isere (38)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.COUPLE, age:29, online:false, verified:true,  premium:true,  rating:4.6, reviews:94,  portrait:66, bio:'Couple libertin de Grenoble. Nous cherchons d autres couples ou femmes seules pour des echanges conviviaux et respectueux.',tags:['Verifie','Top profil','Disponible ce week-end'] },
  { alias:'Crystal_et_Max',  city:'Paris',             dept:'Paris (75)',                   region:'Ile-de-France',                 gender:Gender.COUPLE, age:28, online:true,  verified:true,  premium:true,  rating:4.8, reviews:142, portrait:67, bio:'Couple parisien ouvert et bienveillant. Crystal (28) et Max (31). Nous aimons les rencontres authentiques et la discretion.', tags:['Verifie','Top profil','Premium exclusif','Tres reactif(ve)'] },
  { alias:'Duo_Lyon',        city:'Lyon',              dept:'Rhone (69)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.COUPLE, age:30, online:true,  verified:true,  premium:false, rating:4.4, reviews:67,  portrait:68, bio:'Couple lyonnais epicurien. Nous partageons notre passion pour la gastronomie, les voyages et la liberte sans limites.',    tags:['Verifie','Disponible ce soir'] },
  { alias:'Lola_et_Nico',    city:'Bordeaux',          dept:'Gironde (33)',                 region:'Nouvelle-Aquitaine',            gender:Gender.COUPLE, age:29, online:true,  verified:false, premium:false, rating:4.1, reviews:33,  portrait:69, bio:'Couple bordelais debutant dans le lifestyle. Nous cherchons des rencontres bienveillantes pour decouvrir ensemble.',      tags:['Nouveau profil','Disponible ce soir'] },
  { alias:'Amour_Libre_Nice',city:'Nice',              dept:'Alpes-Maritimes (06)',         region:'Provence-Alpes-Cote d Azur',    gender:Gender.COUPLE, age:27, online:true,  verified:true,  premium:true,  rating:4.7, reviews:98,  portrait:70, bio:'Couple naturiste nicois. Nous vivons librement sur la Cote d Azur et cherchons des esprits ouverts et complices.',        tags:['Verifie','Top profil','Parle anglais','Premium exclusif'] },
  { alias:'Duo_Sucre',       city:'Toulouse',          dept:'Haute-Garonne (31)',           region:'Occitanie',                     gender:Gender.COUPLE, age:31, online:false, verified:false, premium:false, rating:3.9, reviews:16,  portrait:71, bio:'Couple toulousain curieux et bienveillant. Premiers pas dans le monde libertin avec humour et une grande legerete.',       tags:[] },
  { alias:'Libertins_Montpellier',city:'Montpellier',  dept:'Herault (34)',                 region:'Occitanie',                     gender:Gender.COUPLE, age:26, online:true,  verified:true,  premium:false, rating:4.3, reviews:52,  portrait:72, bio:'Couple libertin experimente a Montpellier. Nous accueillons dans un cadre intimiste et soigne en toute discretion.',       tags:['Verifie','Recoit a domicile'] },
  { alias:'Couple_Nantes',   city:'Nantes',            dept:'Loire-Atlantique (44)',        region:'Pays de la Loire',              gender:Gender.COUPLE, age:32, online:false, verified:true,  premium:true,  rating:4.6, reviews:78,  portrait:73, bio:'Couple nantais epanoui en relation ouverte. Nous cherchons des echanges de qualite, toujours respectueux et bienveillants.',tags:['Verifie','Top profil','Disponible ce week-end'] },
  { alias:'Eric_et_Sandra',  city:'Strasbourg',        dept:'Bas-Rhin (67)',                region:'Grand Est',                     gender:Gender.COUPLE, age:28, online:true,  verified:false, premium:false, rating:4.0, reviews:24,  portrait:74, bio:'Couple alsacien de 28 et 30 ans. Nous aimons les rencontres sans tabous dans une ambiance detendue et respectueuse.',      tags:['Disponible ce soir'] },
  { alias:'Duo_Marseille',   city:'Marseille',         dept:'Bouches-du-Rhone (13)',        region:'Provence-Alpes-Cote d Azur',    gender:Gender.COUPLE, age:33, online:true,  verified:true,  premium:false, rating:4.2, reviews:44,  portrait:75, bio:'Couple marseillais solaire. La vie est trop courte pour les conventions. Envoyez-nous un message, nous adorons echanger.',  tags:['Verifie','Disponible ce soir'] },

  // ============================================================
  // TRANS (10 profils) -- women portraits 56..65
  // ============================================================
  { alias:'Riley_Strasbourg',city:'Strasbourg',        dept:'Bas-Rhin (67)',                region:'Grand Est',                     gender:Gender.TRANS,  age:32, online:true,  verified:true,  premium:true,  rating:4.7, reviews:156, portrait:56, bio:'Femme trans operee, artiste et militante. Contenu exclusif et rencontres bienveillantes. Active et passive disponible.',     tags:['Verifie','Top profil','Parle anglais','Premium exclusif'] },
  { alias:'Taylor_Paris',    city:'Paris',             dept:'Paris (75)',                   region:'Ile-de-France',                 gender:Gender.TRANS,  age:27, online:true,  verified:true,  premium:false, rating:4.5, reviews:93,  portrait:57, bio:'Femme trans parisienne, elegante et raffinee. Je recois en appartement prive, discretion absolue garantie pour chaque visite.',tags:['Verifie','Recoit a domicile','Tres reactif(ve)'] },
  { alias:'Jordan_Lyon',     city:'Lyon',              dept:'Rhone (69)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.TRANS,  age:30, online:false, verified:true,  premium:true,  rating:4.6, reviews:128, portrait:58, bio:'Trans lyonnaise, active et passive. Je propose des moments inoubliables pour inities et curieux en toute discreite.',         tags:['Verifie','Top profil','Premium exclusif'] },
  { alias:'Alex_Nice',       city:'Nice',              dept:'Alpes-Maritimes (06)',         region:'Provence-Alpes-Cote d Azur',    gender:Gender.TRANS,  age:28, online:true,  verified:false, premium:false, rating:4.1, reviews:37,  portrait:59, bio:'Trans nicoise, naturelle et spontanee. La Cote d Azur comme decor pour des rencontres authentiques et sans jugement.',      tags:['Disponible ce soir'] },
  { alias:'Sam_Bordeaux',    city:'Bordeaux',          dept:'Gironde (33)',                 region:'Nouvelle-Aquitaine',            gender:Gender.TRANS,  age:25, online:true,  verified:true,  premium:false, rating:4.3, reviews:61,  portrait:60, bio:'Jeune femme trans bordelaise. Creatrice de contenu adulte et disponible pour rencontres choisies en region bordelaise.',    tags:['Verifie','Disponible ce soir','Nouveau profil'] },
  { alias:'Charlie_Toulouse',city:'Toulouse',          dept:'Haute-Garonne (31)',           region:'Occitanie',                     gender:Gender.TRANS,  age:31, online:false, verified:false, premium:false, rating:3.9, reviews:19,  portrait:61, bio:'Trans toulousaine, libre et sans jugement. Je cherche des personnes ouvertes d esprit pour des moments vrais et intenses.',  tags:['Disponible ce week-end'] },
  { alias:'Robin_Nantes',    city:'Nantes',            dept:'Loire-Atlantique (44)',        region:'Pays de la Loire',              gender:Gender.TRANS,  age:29, online:true,  verified:true,  premium:true,  rating:4.8, reviews:187, portrait:62, bio:'Top Trans Nantes. Active et passive, disponible 7j/7 en appartement prive haut standing. Sur rdv uniquement.',              tags:['Verifie','Top profil','Premium exclusif','Recoit a domicile'] },
  { alias:'Mika_Grenoble',   city:'Grenoble',          dept:'Isere (38)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.TRANS,  age:26, online:true,  verified:false, premium:false, rating:4.2, reviews:44,  portrait:63, bio:'Trans grenobloise, douce et feminine. Moments tendres et passionnes entre Alpes et Isere, discrecion assuree.',             tags:['Disponible ce soir'] },
  { alias:'Blake_Marseille', city:'Marseille',         dept:'Bouches-du-Rhone (13)',        region:'Provence-Alpes-Cote d Azur',    gender:Gender.TRANS,  age:33, online:false, verified:true,  premium:false, rating:4.4, reviews:72,  portrait:64, bio:'Trans marseillaise experimentee. Je recois dans un appartement propre et discret, proche du Vieux Port.',                  tags:['Verifie','Recoit a domicile'] },
  { alias:'Ash_Rennes',      city:'Rennes',            dept:'Ille-et-Vilaine (35)',         region:'Bretagne',                      gender:Gender.TRANS,  age:28, online:true,  verified:true,  premium:true,  rating:4.7, reviews:134, portrait:65, bio:'Trans bretonne, artiste et passionnee. Contenu premium exclusif et rencontres sur rdv a Rennes. Tres reactive.',            tags:['Verifie','Top profil','Premium exclusif','Tres reactif(ve)'] },

  // ============================================================
  // AUTRE GENRE (5 profils) -- women portraits 76..80
  // ============================================================
  { alias:'Sasha_Paris',     city:'Paris',             dept:'Paris (75)',                   region:'Ile-de-France',                 gender:Gender.OTHER,  age:27, online:true,  verified:true,  premium:false, rating:4.4, reviews:56,  portrait:76, bio:'Non-binaire parisien·ne, artiste et activiste. Je cherche des rencontres libres de toute etiquette et remplies de sens.',   tags:['Verifie','Disponible ce soir','Parle anglais'] },
  { alias:'Eden_Lyon',       city:'Lyon',              dept:'Rhone (69)',                   region:'Auvergne-Rhone-Alpes',          gender:Gender.OTHER,  age:29, online:true,  verified:false, premium:false, rating:4.0, reviews:21,  portrait:77, bio:'Genre fluide lyonnais·e. Je vis et aime sans frontieres ni cases. Rencontres ouvertes, bienveillantes et sans jugement.',   tags:['Disponible ce soir'] },
  { alias:'River_Bordeaux',  city:'Bordeaux',          dept:'Gironde (33)',                 region:'Nouvelle-Aquitaine',            gender:Gender.OTHER,  age:31, online:false, verified:true,  premium:true,  rating:4.6, reviews:83,  portrait:78, bio:'Queer bordelais·e, libre et epanoui·e. Createur·ice de contenu inclusif pour une communaute bienveillante et diverse.',      tags:['Verifie','Top profil','Premium exclusif'] },
  { alias:'Jazz_Nantes',     city:'Nantes',            dept:'Loire-Atlantique (44)',        region:'Pays de la Loire',              gender:Gender.OTHER,  age:25, online:true,  verified:false, premium:false, rating:4.1, reviews:28,  portrait:79, bio:'Musicien·ne non-binaire de Nantes. La musique comme langage universel, les rencontres comme source d inspiration infinie.',  tags:['Disponible ce soir'] },
  { alias:'Sky_Toulouse',    city:'Toulouse',          dept:'Haute-Garonne (31)',           region:'Occitanie',                     gender:Gender.OTHER,  age:28, online:true,  verified:true,  premium:false, rating:4.3, reviews:47,  portrait:80, bio:'Personnage inclassable a Toulouse. Je vis sans cases et sans jugements. Des rencontres uniques, garanties hors du commun.', tags:['Verifie','Disponible ce soir'] },
]

async function main() {
  console.log('Demarrage du seed -- 100 profils...')

  await prisma.review.deleteMany()
  await prisma.report.deleteMany()
  await prisma.media.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.session.deleteMany()
  await prisma.consent.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()
  console.log('Tables nettoyees')

  // Tags
  const tagMap = new Map<string, string>()
  for (const name of ALL_TAGS) {
    const tag = await prisma.tag.create({ data: { name } })
    tagMap.set(name, tag.id)
  }
  console.log(`${ALL_TAGS.length} tags crees`)

  // Compte admin
  const adminHash = await bcrypt.hash('Admin1234!', 12)
  await prisma.user.create({
    data: { email: 'admin@zelya.demo', pseudo: 'AdminZelya', passwordHash: adminHash, role: Role.ADMIN, isActive: true, emailVerified: true },
  })
  console.log('Compte admin cree (admin@zelya.demo / Admin1234!)')

  // Compte visiteur demo
  const demoHash = await bcrypt.hash('Demo1234!', 12)
  const demoUser = await prisma.user.create({
    data: { email: 'demo@zelya.demo', pseudo: 'DemoVisiteur', passwordHash: demoHash, role: Role.USER, isActive: true, emailVerified: true },
  })
  await prisma.consent.createMany({
    data: [
      { userId: demoUser.id, type: 'TERMS', accepted: true, version: '1.0' },
      { userId: demoUser.id, type: 'PRIVACY', accepted: true, version: '1.0' },
    ],
  })
  console.log('Compte visiteur cree (demo@zelya.demo / Demo1234!)')

  const passwordHash = await bcrypt.hash('Demo1234!', 12)

  for (let i = 0; i < PROFILES.length; i++) {
    const p = PROFILES[i]
    const email = `${p.alias.toLowerCase().replace('_', '.')}@zelya.demo`

    const user = await prisma.user.create({
      data: {
        email,
        pseudo: p.alias,
        passwordHash,
        role: Role.CREATOR,
        isActive: true,
        emailVerified: true,
        isAgeVerified: true,
        dateOfBirth: new Date(1990 + (i % 10), i % 12, (i % 28) + 1),
      },
    })

    const tagIds = p.tags.filter((t) => tagMap.has(t)).map((t) => ({ id: tagMap.get(t)! }))

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        alias: p.alias,
        bio: p.bio,
        gender: p.gender,
        age: p.age,
        city: p.city,
        department: p.dept,
        region: p.region,
        isOnline: p.online,
        lastSeenAt: p.online ? new Date() : new Date(Date.now() - Math.random() * 48 * 3600000),
        status: ProfileStatus.ACTIVE,
        isVerified: p.verified,
        isPremium: p.premium,
        avatarKey: avatar(p.gender, p.portrait),
        rating: p.rating,
        reviewCount: p.reviews,
        tags: { connect: tagIds },
      },
    })

    const photoCount = 3 + (i % 3)
    for (let j = 0; j < photoCount; j++) {
      await prisma.media.create({
        data: {
          profileId: profile.id,
          type: 'PHOTO',
          storageKey: photo(p.alias, j + 1),
          visibility: 'PUBLIC',
          isApproved: true,
          approvedAt: new Date(),
          hasConsent: true,
        },
      })
    }

    await prisma.consent.createMany({
      data: [
        { userId: user.id, type: 'TERMS', accepted: true, version: '1.0' },
        { userId: user.id, type: 'PRIVACY', accepted: true, version: '1.0' },
      ],
    })
  }

  console.log(`${PROFILES.length} profils crees avec photos portrait + galerie`)

  // Avis fictifs (1 par profil)
  const profiles = await prisma.profile.findMany({ include: { user: true } })
  const comments = [
    'Profil tres soigne, experience agreable.',
    'Tres reactif(ve) et sympathique, je recommande.',
    'Excellent profil, a refaire sans hesiter.',
    'Super echange, personne vraiment agreable.',
    'Profil authentique et bienveillant.',
    'Moment memorable, merci beaucoup.',
    'Personne vraiment agreable et professionnelle.',
    'Exactement comme decrit, parfait.',
    'Une experience hors du commun.',
    'Tres bonne impression, je recommande.',
  ]

  let reviewCount = 0
  for (let i = 0; i < profiles.length; i++) {
    const target = profiles[i]
    const authorProfile = profiles[(i + 3) % profiles.length]
    if (target.userId === authorProfile.userId) continue
    await prisma.review.create({
      data: {
        profileId: target.id,
        authorId: authorProfile.userId,
        rating: 4 + (i % 2),
        comment: comments[i % comments.length],
        isVisible: true,
      },
    })
    reviewCount++
  }

  console.log(`${reviewCount} avis crees`)
  console.log('Seed termine avec succes !')
  console.log('  Visiteur : demo@zelya.demo / Demo1234!')
  console.log('  Admin    : admin@zelya.demo / Admin1234!')
  console.log(`  Createurs: <alias.lower>@zelya.demo / Demo1234! (ex: lea.paris@zelya.demo)`)
}

main()
  .catch((e) => { console.error('Erreur seed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
