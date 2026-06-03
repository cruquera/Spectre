export type InstitutionType = 'BANK' | 'BROKER';

export type Institution = {
  id: string;
  name: string;
  type: InstitutionType;
};
