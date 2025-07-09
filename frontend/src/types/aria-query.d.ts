// Definiciones de tipos para aria-query
declare module 'aria-query' {
  export interface ARIABaseConcept {
    module?: string;
    concept?: {
      name: string;
      attributes?: Record<string, string | number | boolean>;
    };
  }

  export interface ARIARelatedConcept {
    module?: string;
    concept?: {
      name: string;
      attributes?: Record<string, string | number | boolean>;
    };
  }

  export interface ARIAAbstractRole {
    abstract: boolean;
    accessibleNameRequired: boolean;
    baseConcepts: Array<ARIABaseConcept>;
    childrenPresentational: boolean;
    nameFrom: Array<string>;
    prohibitedProps: Array<string>;
    props: {
      [key: string]: string | number | boolean;
    };
    relatedConcepts: Array<ARIARelatedConcept>;
    requireContextRole: Array<string>;
    requiredContextRole: Array<string>;
    requiredOwnedElements: Array<Array<string>>;
    requiredProps: {
      [key: string]: string | number | boolean;
    };
    superClass: Array<Array<string>>;
  }

  export interface ARIARole extends ARIAAbstractRole {
    abstract: false;
  }

  export interface ARIAProperty {
    type: string;
    values?: Array<string | number | boolean>;
    allowUndefined?: boolean;
  }

  export const roles: Map<string, ARIARole | ARIAAbstractRole>;
  export const elementRoles: Map<string, Set<string>>;
  export const roleElements: Map<string, Set<string>>;
  export const dom: Map<string, ARIAProperty>;
  export const aria: Map<string, ARIAProperty>;
}
