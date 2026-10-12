/**
 * Predefined verification question set for Ownership Claim requests
 * Phase 8 Implementation
 */

export const VERIFICATION_QUESTIONS = [
  {
    id: 'q1',
    question: 'Where did you last have this item?',
    placeholder: 'e.g. Left in an Uber ride from airport, or on table at coffee shop...',
  },
  {
    id: 'q2',
    question: 'Can you describe a unique identifying feature (scratch, mark, sticker, engraving)?',
    placeholder: 'e.g. Small scratch near charging port, blue cartoon sticker on back...',
  },
  {
    id: 'q3',
    question: 'What was attached to or inside the item?',
    placeholder: 'e.g. Metal ring keychain, specific student card inside wallet slot...',
  },
  {
    id: 'q4',
    question: 'What specific brand, model, color, or casing is on the item?',
    placeholder: 'e.g. Samsung Galaxy S24 in matte black armor case...',
  },
  {
    id: 'q5',
    question: 'Approximately when did you lose it (date or approximate time)?',
    placeholder: 'e.g. September 28 around 5:30 PM...',
  },
];

export default VERIFICATION_QUESTIONS;
