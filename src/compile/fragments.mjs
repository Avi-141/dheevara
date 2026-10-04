// The shared prompt vocabulary, from design/style-bible.md section 9 (fragments), section 2 (stone
// per epic), section 6 (witness vantages) and section 8 (the never-list). Model-specific syntax lives
// in src/compile/index.mjs; this file is the words.

export const STONE = { mbh: 'dark basalt, slightly polished where hands have touched', ram: 'warm grey granite with lichen in the recesses' };

export const STYLE = {
  base: (stone) => `living temple relief carved in ${stone}, figures in classical Indian sculptural proportions, shallow relief depth, fine stone grain`,
  light: (side) => `single oil-lamp key light from ${side}, warm 2400K, deep falloff to black, raking angle, no rim light`,
  motion: (move) => `slow deliberate motion, weighty gestures, no facial acting, camera ${move} over the whole shot`,
  palette: 'monochrome stone, warm lamp light, no saturated colour except gold on the one object the shot is about',
};

export const WITNESS = {
  sanjaya: 'seen from far above and at a distance, as if by divine sight, never closer than medium-wide on any person',
  charioteer: 'seen from the chariot platform at eye level beside the warrior, looking where he looks, never at his face',
  vanara: 'seen from low on the mountain looking up and out, wide sky, the action seen from below',
};

export const FRAMING = {
  extreme_wide: 'extreme wide shot', wide: 'wide shot', medium_wide: 'medium-wide shot', medium: 'medium shot',
  medium_close: 'medium close shot', close: 'close shot', insert: 'macro insert on carved detail',
};
export const HEIGHT = { ground: 'from ground level', low: 'from a low angle', eye: 'at eye level', high: 'from high above', overhead: 'from directly overhead' };
export const MOVE = {
  static: 'locked off', push_in: 'pushing in slowly', pull_out: 'pulling back slowly', pan: 'panning slowly',
  tilt: 'tilting slowly', track: 'tracking slowly', crane: 'craning slowly', orbit: 'orbiting slowly',
};

/** Style bible section 9: the shared negative. */
export const NEGATIVE_BASE = [
  'close-up of a face', 'deity face', 'lip movement', 'text', 'logo', 'watermark', 'helmet with visor', 'plate armour',
  'chain mail', 'stirrups', 'saddle', 'firearm', 'modern object', 'table', 'chair', 'glass', 'lens flare', 'god rays',
  'bloom', 'photorealistic skin', 'cartoon', 'anime',
];

/** Contract `forbidden` tokens as negative phrases. A token without an entry here fails compilation. */
export const FORBIDDEN_PHRASES = {
  deity_face_closeup: 'close-up of a deity\'s face',
  pov_inside_deity: 'point of view of a deity',
  face_closeup: 'close-up of a face',
  lip_movement: 'lip movement',
  deity_on_field: 'any deity on the battlefield',
  modern_objects: 'modern object',
  visor_helmet: 'helmet with visor',
  plate_armour: 'plate armour',
  chain_mail: 'chain mail',
  stirrups: 'stirrups',
  firearms: 'firearm',
  text_in_frame: 'text',
  photoreal_skin: 'photorealistic skin',
  lens_flare: 'lens flare',
  counted_rings: 'a counted number of rings',
  wound_on_screen: 'wound',
  killing_blow: 'killing blow',
  body_on_screen: 'dead body',
};
