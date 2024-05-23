import { outputSchema } from '../schemas';
import { Annotation } from '../types/input';
import { ConvertedAnnotation, ConvertedEntity, Output } from '../types/output';

const sortValuesAscending = (valueA: string | number, valueB: string | number): number => {
  if (valueA > valueB) {
    return 1;
  } else {
    return -1;
  }
};

export const sortEntities = (entityA: ConvertedEntity, entityB: ConvertedEntity): number =>
  sortValuesAscending(entityA.name.toLowerCase(), entityB.name.toLowerCase());

export const sortAnnotations = (annotationA: ConvertedAnnotation, annotationB: ConvertedAnnotation): number =>
  sortValuesAscending(annotationA.index, annotationB.index);

export const filterAnnotations = (annotation: Annotation): boolean => !annotation.refs.length;

export const isOutputValid = (output: Output): boolean => outputSchema.isValidSync(output);
